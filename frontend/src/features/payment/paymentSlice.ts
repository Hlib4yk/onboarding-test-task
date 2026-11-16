import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Stripe, StripeElements } from '@stripe/stripe-js'
import { createAppAsyncThunk } from '@/app/store/hooks'
import type { RootState } from '@/app/store/store'
import { loadPlans, selectPlans } from '@/features/plans/plansSlice'
import { selectPhoneE164, selectValidEmail } from '@/features/profile/selectors'
import { analytics } from '@/shared/analytics/analytics'
import { getErrorMessage } from '@/shared/api/http'
import { t } from '@/shared/i18n'
import { sessionReset } from '@/shared/store/sessionReset'
import { createPayment, getPayment, type BackendPayment } from './api'

/**
 * UI-level payment state machine:
 *
 *   idle ──pay──▶ submitting ──▶ verifying ──GET /payments/:id──▶ succeeded
 *    ▲                              │   ▲                      ├─▶ processing ──poll──┐
 *    │                              │   └──────────────────────┼──────────────────────┘
 *    └──────────── retry ◀──────────┴──────── failed ◀─────────┘
 *
 * `unverified` = we couldn't reach the backend to check the result (offer "Check status").
 * Only the backend response can move us to `succeeded` or `failed`.
 */
export const PAYMENT_STATUSES = [
  'idle',
  'submitting',
  'verifying',
  'processing',
  'succeeded',
  'failed',
  'unverified',
] as const

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export interface PaymentAttempt {
  /** Sent as Idempotency-Key, so repeating POST /payments returns the same PaymentIntent. */
  idempotencyKey: string
  /** planId+email+phone this key was created for. Different data => new key. */
  fingerprint: string
}

export interface PaymentState {
  selectedPlanId: string | null
  paymentId: string | null
  attempt: PaymentAttempt | null
  status: PaymentStatus
  error: string | null
  /** Runtime-only guard against parallel status checks. Never persisted. */
  verifyInFlight: boolean
}

export const initialPaymentState: PaymentState = {
  selectedPlanId: null,
  paymentId: null,
  attempt: null,
  status: 'idle',
  error: null,
  verifyInFlight: false,
}

const BUSY_STATUSES: readonly PaymentStatus[] = ['submitting', 'verifying', 'processing']

export const isPaymentBusy = (status: PaymentStatus) => BUSY_STATUSES.includes(status)
const canSubmit = (status: PaymentStatus) => status === 'idle' || status === 'failed'

// ---------------------------------------------------------------- thunks

interface SubmitPaymentArgs {
  stripe: Stripe
  elements: StripeElements
  returnUrl: string
}

/** 'invalid_details' = the form itself is incomplete; Stripe shows the error inline. */
type SubmitOutcome = 'confirmed' | 'invalid_details'
const outcome = (value: SubmitOutcome) => value

/**
 * Pay button handler:
 * 1. validate the Payment Element;
 * 2. create (or re-use, thanks to the idempotency key) the PaymentIntent on our backend;
 * 3. confirm it with Stripe.js — this shows the 3DS modal or redirects to the bank.
 * The result of confirmPayment is NOT trusted: afterwards we always ask the backend.
 */
export const submitPayment = createAppAsyncThunk(
  'payment/submit',
  async (
    { stripe, elements, returnUrl }: SubmitPaymentArgs,
    { getState, dispatch, rejectWithValue },
  ) => {
    const { error: formError } = await elements.submit()
    if (formError) return outcome('invalid_details')

    const state = getState()
    const planId = state.payment.selectedPlanId
    const phone = selectPhoneE164(state)
    const email = selectValidEmail(state)
    if (!planId || !phone || !email) return rejectWithValue(t.payment.missingData)

    const body = { planId, email, phone }
    dispatch(attemptPrepared(JSON.stringify(body)))
    const idempotencyKey = getState().payment.attempt?.idempotencyKey
    if (!idempotencyKey) return rejectWithValue(t.errors.unexpected)

    analytics.track({ name: 'payment_submitted', planId })

    let clientSecret: string
    try {
      const payment = await createPayment(body, idempotencyKey)
      clientSecret = payment.clientSecret
      // Saved (and persisted) BEFORE confirming: after a redirect we come back knowing the id.
      dispatch(paymentCreated(payment.id))
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }

    // For redirect methods the browser leaves the page here and nothing below runs.
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    })

    if (error?.type === 'validation_error') return outcome('invalid_details')
    return outcome('confirmed')
  },
  {
    // Double-click protection: a second dispatch while busy is silently dropped.
    condition: (_, { getState }) => canSubmit(getState().payment.status),
  },
)

/** Asks the backend for the real payment status (GET /payments/:id). */
export const verifyPayment = createAppAsyncThunk(
  'payment/verify',
  async (_, { getState, rejectWithValue }) => {
    const { paymentId, selectedPlanId } = getState().payment
    if (!paymentId) return rejectWithValue(t.errors.unexpected)

    let payment: BackendPayment
    try {
      payment = await getPayment(paymentId)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }

    if (payment.status === 'succeeded') {
      analytics.track({
        name: 'payment_succeeded',
        paymentId,
        planId: payment.planId ?? selectedPlanId,
      })
    } else if (payment.errorMessage || payment.status === 'canceled') {
      analytics.track({
        name: 'payment_failed',
        paymentId,
        reason: payment.errorMessage ?? payment.status,
      })
    }
    return payment
  },
  {
    condition: (_, { getState }) => !getState().payment.verifyInFlight,
  },
)

// ---------------------------------------------------------------- slice

/** Maps a Stripe PaymentIntent status to our UI status. */
function applyBackendPayment(state: PaymentState, payment: BackendPayment) {
  state.error = null
  switch (payment.status) {
    case 'succeeded':
      state.status = 'succeeded'
      break
    case 'processing':
    case 'requires_capture':
      state.status = 'processing'
      break
    case 'requires_payment_method':
      // With an error: card declined / 3DS failed. Without: nothing was attempted yet.
      state.status = payment.errorMessage ? 'failed' : 'idle'
      state.error = payment.errorMessage
      break
    case 'requires_action':
    case 'requires_confirmation':
      // The user left the 3DS / bank page without finishing.
      state.status = 'failed'
      state.error = t.payment.notCompleted
      break
    case 'canceled':
      state.status = 'failed'
      state.error = t.payment.canceled
      // A canceled PaymentIntent can't be reused: forget the key so the next try creates a new one.
      state.attempt = null
      break
  }
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState: initialPaymentState,
  reducers: {
    planSelected(state, action: PayloadAction<string>) {
      if (isPaymentBusy(state.status) || state.status === 'succeeded') return
      state.selectedPlanId = action.payload
      state.status = 'idle'
      state.error = null
    },
    attemptPrepared: {
      // Random key is generated in `prepare`, so the reducer itself stays pure.
      prepare: (fingerprint: string) => ({
        payload: { fingerprint, idempotencyKey: crypto.randomUUID() },
      }),
      reducer(state, action: PayloadAction<PaymentAttempt>) {
        if (state.attempt?.fingerprint === action.payload.fingerprint) return
        state.attempt = action.payload
      },
    },
    paymentCreated(state, action: PayloadAction<string>) {
      state.paymentId = action.payload
    },
    /** "Check status" button. */
    verificationRequested(state) {
      if (state.paymentId) state.status = 'verifying'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPayment.pending, (state) => {
        state.status = 'submitting'
        state.error = null
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.status = action.payload === 'confirmed' ? 'verifying' : 'idle'
      })
      .addCase(submitPayment.rejected, (state, action) => {
        if (action.payload) {
          state.status = 'failed'
          state.error = action.payload
        } else {
          // Unexpected exception (e.g. inside Stripe.js): let the backend tell us what happened.
          state.status = state.paymentId ? 'verifying' : 'failed'
          state.error = state.paymentId ? null : t.errors.unexpected
        }
      })
      .addCase(verifyPayment.pending, (state) => {
        state.verifyInFlight = true
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verifyInFlight = false
        applyBackendPayment(state, action.payload)
      })
      .addCase(verifyPayment.rejected, (state) => {
        state.verifyInFlight = false
        state.status = 'unverified'
      })
      .addCase(loadPlans.fulfilled, (state, action) => {
        // Pre-select the "popular" plan unless the user already picked a valid one.
        const plans = action.payload
        if (plans.some((plan) => plan.id === state.selectedPlanId)) return
        state.selectedPlanId = (plans.find((plan) => plan.popular) ?? plans[0])?.id ?? null
      })
      .addCase(sessionReset, () => initialPaymentState)
  },
})

const { attemptPrepared, paymentCreated } = paymentSlice.actions
export const { planSelected, verificationRequested } = paymentSlice.actions
export const paymentReducer = paymentSlice.reducer

/**
 * Normalises a payment state restored from storage. If the page was reloaded (or we came
 * back from a redirect) in the middle of a payment, we don't know the outcome — re-check it.
 */
export function rehydratePaymentState(saved: Omit<PaymentState, 'verifyInFlight'>): PaymentState {
  const interrupted = isPaymentBusy(saved.status) || saved.status === 'unverified'
  let status = saved.status
  if (interrupted) status = saved.paymentId ? 'verifying' : 'idle'
  return { ...saved, status, verifyInFlight: false }
}

// ---------------------------------------------------------------- selectors

export const selectPaymentStatus = (state: RootState) => state.payment.status
export const selectPaymentError = (state: RootState) => state.payment.error
export const selectSelectedPlanId = (state: RootState) => state.payment.selectedPlanId
export const selectIsPaid = (state: RootState) => state.payment.status === 'succeeded'

export const selectSelectedPlan = createSelector(
  [selectPlans, selectSelectedPlanId],
  (plans, id) => plans.find((plan) => plan.id === id) ?? null,
)
