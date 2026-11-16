import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectPaymentStatus } from '@/features/payment/paymentSlice'
import { stripStripeReturnParams } from '@/features/payment/returnUrl'
import { usePaymentStatusSync } from '@/features/payment/usePaymentStatusSync'
import { loadPlans } from '@/features/plans/plansSlice'
import { useFlowNavigation } from '@/flow/useFlowNavigation'
import { t } from '@/shared/i18n'
import { Subtitle, Title } from '@/shared/ui/Typography'
import { PaymentSection } from './PaymentSection'
import { PlanPicker } from './PlanPicker'

export default function CheckoutScreen() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const status = useAppSelector(selectPaymentStatus)
  const { goNext } = useFlowNavigation()
  const { pollingExhausted, checkAgain } = usePaymentStatusSync()

  useEffect(() => {
    void dispatch(loadPlans())
  }, [dispatch])

  // Back from a redirect / 3DS: drop Stripe's ?payment_intent=… params. The outcome is
  // taken from the backend (see usePaymentStatusSync), never from these params.
  useEffect(() => {
    const cleanedSearch = stripStripeReturnParams(location.search)
    if (cleanedSearch !== null) {
      void navigate({ pathname: location.pathname, search: cleanedSearch }, { replace: true })
    }
  }, [location.pathname, location.search, navigate])

  // Payment confirmed by the backend -> move on to whatever the flow says is next.
  useEffect(() => {
    if (status === 'succeeded') goNext()
  }, [status, goNext])

  return (
    <Page>
      <div>
        <Title>{t.checkout.title}</Title>
        <Subtitle>{t.checkout.subtitle}</Subtitle>
      </div>
      <PlanPicker />
      <PaymentSection pollingExhausted={pollingExhausted} onCheckAgain={checkAgain} />
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(6)};
`
