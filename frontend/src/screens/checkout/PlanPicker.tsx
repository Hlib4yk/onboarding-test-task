import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  isPaymentBusy,
  planSelected,
  selectPaymentStatus,
  selectSelectedPlanId,
} from '@/features/payment/paymentSlice'
import {
  loadPlans,
  selectPlans,
  selectPlansError,
  selectPlansStatus,
} from '@/features/plans/plansSlice'
import { analytics } from '@/shared/analytics/analytics'
import { t } from '@/shared/i18n'
import { formatMoney } from '@/shared/lib/formatMoney'
import { Button } from '@/shared/ui/Button'
import { Notice } from '@/shared/ui/Notice'
import { OptionCard } from '@/shared/ui/OptionCard'
import { OptionList } from '@/shared/ui/OptionList'

export function PlanPicker() {
  const dispatch = useAppDispatch()
  const plans = useAppSelector(selectPlans)
  const status = useAppSelector(selectPlansStatus)
  const error = useAppSelector(selectPlansError)
  const selectedId = useAppSelector(selectSelectedPlanId)
  const paymentStatus = useAppSelector(selectPaymentStatus)

  // Plan can't change while a payment is in progress or done.
  const locked = isPaymentBusy(paymentStatus) || paymentStatus === 'succeeded'

  if (status === 'failed') {
    return (
      <Notice
        tone="error"
        action={
          <Button variant="secondary" onClick={() => void dispatch(loadPlans())}>
            {t.common.retry}
          </Button>
        }
      >
        {t.checkout.plansError} {error}
      </Notice>
    )
  }

  if (status !== 'succeeded') {
    return (
      <Notice tone="info" loading>
        {t.common.loading}
      </Notice>
    )
  }

  return (
    <OptionList role="radiogroup" aria-label={t.checkout.plansLabel}>
      {plans.map((plan) => (
        <OptionCard
          key={plan.id}
          kind="radio"
          title={plan.name}
          aside={<Price>{formatMoney(plan.amount, plan.currency)}</Price>}
          badge={plan.popular ? t.checkout.popular : undefined}
          selected={plan.id === selectedId}
          disabled={locked}
          onSelect={() => {
            dispatch(planSelected(plan.id))
            analytics.track({ name: 'plan_selected', planId: plan.id })
          }}
        />
      ))}
    </OptionList>
  )
}

const Price = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.bold};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-variant-numeric: tabular-nums;
`
