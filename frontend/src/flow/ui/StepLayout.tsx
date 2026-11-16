import { Suspense, useEffect } from 'react'
import styled from 'styled-components'
import { analytics } from '@/shared/analytics/analytics'
import { t } from '@/shared/i18n'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { StatusScreen } from '@/shared/ui/StatusScreen'
import { useCurrentStep } from '../StepContext'
import { useFlowNavigation } from '../useFlowNavigation'

/** Common chrome around every screen: back button, progress bar, lazy-loaded content. */
export function StepLayout() {
  const step = useCurrentStep()
  const { index, total, nextStep, goBack } = useFlowNavigation()

  useEffect(() => {
    analytics.track({ name: 'screen_view', screen: step.key })
  }, [step.key])

  // While the user is busy with this screen, download the next one's code.
  useEffect(() => {
    void nextStep?.component.preload()
  }, [nextStep])

  const Screen = step.component
  const canGoBack = index > 0 && !step.hideBackButton

  return (
    <>
      <Header>
        <BackButton
          type="button"
          onClick={goBack}
          aria-label={t.common.back}
          $hidden={!canGoBack}
          disabled={!canGoBack}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </BackButton>
        <ProgressBar current={index + 1} total={total} label={t.flow.progress(index + 1, total)} />
        <StepCounter aria-hidden>
          {index + 1}/{total}
        </StepCounter>
      </Header>
      <Suspense fallback={<StatusScreen loading />}>
        <Screen />
      </Suspense>
    </>
  )
}

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  margin-bottom: ${({ theme }) => theme.space(6)};
`

const BackButton = styled.button<{ $hidden: boolean }>`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-left: -${({ theme }) => theme.space(2)};
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`

const StepCounter = styled.span`
  min-width: 32px;
  text-align: right;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-variant-numeric: tabular-nums;
`
