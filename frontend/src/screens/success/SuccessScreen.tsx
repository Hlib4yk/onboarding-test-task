import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectSelectedPlan } from '@/features/payment/paymentSlice'
import { loadPlans } from '@/features/plans/plansSlice'
import { selectValidEmail } from '@/features/profile/selectors'
import { t } from '@/shared/i18n'
import { sessionReset } from '@/shared/store/sessionReset'
import { Button } from '@/shared/ui/Button'
import { ScreenFooter } from '@/shared/ui/ScreenLayout'
import { Subtitle, Title } from '@/shared/ui/Typography'

export default function SuccessScreen() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { search } = useLocation()
  const plan = useAppSelector(selectSelectedPlan)
  const email = useAppSelector(selectValidEmail)

  // Plans aren't persisted; after a reload on this screen fetch them again for the plan name.
  useEffect(() => {
    void dispatch(loadPlans())
  }, [dispatch])

  const startOver = () => {
    dispatch(sessionReset())
    void navigate({ pathname: '/', search }, { replace: true })
  }

  return (
    <Page>
      <Content>
        <Icon viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r="32" />
          <path d="M19 33l9 9 17-19" />
        </Icon>
        <Title>{t.success.title}</Title>
        <Subtitle>
          {plan && email ? t.success.text(plan.name, email) : t.success.textNoPlan}
        </Subtitle>
      </Content>
      <ScreenFooter>
        <Button variant="secondary" onClick={startOver}>
          {t.success.startOver}
        </Button>
      </ScreenFooter>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(10)} 0;
  text-align: center;
`

const Icon = styled.svg`
  width: 72px;
  height: 72px;
  margin-bottom: ${({ theme }) => theme.space(4)};

  circle {
    fill: ${({ theme }) => theme.colors.successSoft};
  }
  path {
    fill: none;
    stroke: ${({ theme }) => theme.colors.success};
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`
