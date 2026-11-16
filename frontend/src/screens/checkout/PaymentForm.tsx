import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState, type SubmitEvent } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { isPaymentBusy, selectPaymentStatus, submitPayment } from '@/features/payment/paymentSlice'
import { buildReturnUrl } from '@/features/payment/returnUrl'
import type { Plan } from '@/features/plans/api'
import { t } from '@/shared/i18n'
import { formatMoney } from '@/shared/lib/formatMoney'
import { Button } from '@/shared/ui/Button'
import { ScreenFooter } from '@/shared/ui/ScreenLayout'
import { SectionTitle } from '@/shared/ui/Typography'
import { PaymentStatusNotice } from './PaymentStatusNotice'

interface PaymentFormProps {
  plan: Plan
  pollingExhausted: boolean
  onCheckAgain: () => void
}

/**
 * Stripe Payment Element renders every payment method enabled in the Stripe Dashboard
 * (card with 3DS, iDEAL, Bancontact, …). `confirmPayment` handles all of them the same way:
 * a 3DS modal, a redirect, or an instant result. That's why adding a method needs no code here.
 */
export function PaymentForm({ plan, pollingExhausted, onCheckAgain }: PaymentFormProps) {
  const dispatch = useAppDispatch()
  const stripe = useStripe()
  const elements = useElements()
  const status = useAppSelector(selectPaymentStatus)
  const [elementReady, setElementReady] = useState(false)

  const busy = isPaymentBusy(status)

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements) return
    void dispatch(submitPayment({ stripe, elements, returnUrl: buildReturnUrl() }))
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <SectionTitle>{t.checkout.paymentTitle}</SectionTitle>
      <PaymentElement
        options={{ layout: 'tabs', readOnly: busy }}
        onReady={() => {
          setElementReady(true)
        }}
      />
      <PaymentStatusNotice pollingExhausted={pollingExhausted} onCheckAgain={onCheckAgain} />
      <ScreenFooter>
        <Button
          type="submit"
          loading={busy}
          disabled={!elementReady || status === 'unverified' || status === 'succeeded'}
        >
          {t.checkout.pay(formatMoney(plan.amount, plan.currency))}
        </Button>
      </ScreenFooter>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
`
