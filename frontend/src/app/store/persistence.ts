import { createSelector } from '@reduxjs/toolkit'
import { isSupportedCountry, type CountryCode } from 'libphonenumber-js'
import { z } from 'zod/mini'
import { PAYMENT_STATUSES, rehydratePaymentState } from '@/features/payment/paymentSlice'
import { flowSchema } from '@/flow/api'
import { rehydrateFlowState } from '@/flow/flowSlice'
import type { RootState } from './store'

/**
 * Saves the session to localStorage so it survives a reload and a full-page
 * redirect to a payment provider (which unloads the app).
 *
 * localStorage, not sessionStorage: some bank apps/redirects come back in a new tab.
 * Bump the version when the shape changes — old data is then simply discarded.
 */
const STORAGE_KEY = 'onboarding:state'
const VERSION = 1

const persistedStateSchema = z.object({
  version: z.literal(VERSION),
  flow: z.nullable(flowSchema),
  profile: z.object({
    phoneCountry: z.custom<CountryCode>(
      (value) => typeof value === 'string' && isSupportedCountry(value),
    ),
    phoneNational: z.string(),
    email: z.string(),
  }),
  quiz: z.object({
    answers: z.record(z.string(), z.array(z.string())),
  }),
  payment: z.object({
    selectedPlanId: z.nullable(z.string()),
    paymentId: z.nullable(z.string()),
    attempt: z.nullable(z.object({ idempotencyKey: z.string(), fingerprint: z.string() })),
    status: z.enum(PAYMENT_STATUSES),
    error: z.nullable(z.string()),
  }),
})

type PersistedState = z.infer<typeof persistedStateSchema>

/** What we save. Plans and loading flags are left out on purpose. Memoised by slice refs. */
const selectPersistedState = createSelector(
  [
    (state: RootState) => state.flow.data,
    (state: RootState) => state.profile,
    (state: RootState) => state.quiz,
    (state: RootState) => state.payment,
  ],
  (flow, profile, quiz, payment): PersistedState => ({
    version: VERSION,
    flow,
    profile,
    quiz,
    payment: {
      selectedPlanId: payment.selectedPlanId,
      paymentId: payment.paymentId,
      attempt: payment.attempt,
      status: payment.status,
      error: payment.error,
    },
  }),
)

/** Reads and VALIDATES saved state. Anything unexpected -> start fresh instead of crashing. */
export function loadPersistedState(): Partial<RootState> | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined

    const parsed = persistedStateSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      localStorage.removeItem(STORAGE_KEY)
      return undefined
    }

    const { flow, profile, quiz, payment } = parsed.data
    return {
      flow: rehydrateFlowState(flow),
      profile,
      quiz,
      payment: rehydratePaymentState(payment),
    }
  } catch {
    return undefined
  }
}

interface PersistableStore {
  getState: () => RootState
  subscribe: (listener: () => void) => unknown
}

/** Writes to localStorage after every change of the persisted slices. */
export function persistStore(store: PersistableStore): void {
  let lastSaved: PersistedState | undefined

  store.subscribe(() => {
    const next = selectPersistedState(store.getState())
    if (next === lastSaved) return
    lastSaved = next
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage full or disabled (private mode): the app keeps working, just without persistence.
    }
  })
}
