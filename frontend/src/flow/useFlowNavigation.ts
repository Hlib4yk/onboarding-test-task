import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAppSelector } from '@/app/store/hooks'
import { useCurrentStep } from './StepContext'
import { selectFlowSteps, stepUrl } from './steps'
import type { ScreenDefinition } from './types'

/**
 * What a screen uses to move on. A screen only says "I'm done" (goNext) —
 * WHICH screen comes next is decided here, from the flow received from the backend.
 *
 * All navigation uses `replace`, so onboarding steps never pile up in browser history
 * and the browser "Back" button can't break the state. Query params (?flow=…) are kept.
 */
export function useFlowNavigation() {
  const current = useCurrentStep()
  const steps = useAppSelector(selectFlowSteps)
  const navigate = useNavigate()
  const { search } = useLocation()

  const index = steps.findIndex((step) => step.key === current.key)
  const previousStep = index > 0 ? steps[index - 1] : undefined
  const nextStep = steps[index + 1]

  const goTo = useCallback(
    (step: ScreenDefinition | undefined) => {
      if (step) void navigate({ pathname: stepUrl(step), search }, { replace: true })
    },
    [navigate, search],
  )

  return {
    /** 0-based position of the current step among the known steps. */
    index,
    total: steps.length,
    previousStep,
    nextStep,
    goNext: useCallback(() => {
      goTo(nextStep)
    }, [goTo, nextStep]),
    goBack: useCallback(() => {
      goTo(previousStep)
    }, [goTo, previousStep]),
  }
}
