import { Elements } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import { useMemo } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import { selectSelectedPlan } from '@/features/payment/paymentSlice'
import { useStripeInstance } from '@/features/payment/stripe'
import { t } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { Notice } from '@/shared/ui/Notice'
import { PaymentForm } from './PaymentForm'
import { stripeAppearance } from './stripeAppearance'

interface PaymentSectionProps {
  pollingExhausted: boolean
  onCheckAgain: () => void
}

/**
 * Loads Stripe.js and mounts the Payment Element in "deferred intent" mode:
 * the form is shown with just amount + currency, and the PaymentIntent is created
 * only when the user presses Pay. Changing the plan simply updates the amount.
 */
export function PaymentSection(props: PaymentSectionProps) {
  const plan = useAppSelector(selectSelectedPlan)
  const { state, retry } = useStripeInstance()

  const options = useMemo<StripeElementsOptions | undefined>(
    () =>
      plan
        ? {
            mode: 'payment',
            amount: plan.amount,
            currency: plan.currency,
            appearance: stripeAppearance,
          }
        : undefined,
    [plan],
  )

  if (!plan) return null

  if (state.status === 'failed') {
    return (
      <Notice
        tone="error"
        action={
          <Button variant="secondary" onClick={retry}>
            {t.common.retry}
          </Button>
        }
      >
        {t.checkout.paymentFormError} {state.message}
      </Notice>
    )
  }

  if (state.status === 'loading') {
    return (
      <Notice tone="info" loading>
        {t.common.loading}
      </Notice>
    )
  }

  return (
    <Elements stripe={state.stripe} options={options}>
      <PaymentForm plan={plan} {...props} />
    </Elements>
  )
}
