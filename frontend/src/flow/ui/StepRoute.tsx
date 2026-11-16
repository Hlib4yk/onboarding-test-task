import { Navigate, useLocation, useParams } from 'react-router'
import { useAppSelector } from '@/app/store/hooks'
import { StepContext } from '../StepContext'
import { findFirstIncompleteStep, selectFlowSteps, stepUrl } from '../steps'
import { StepLayout } from './StepLayout'

/**
 * Route for every step: /:stepPath.
 * - path not in the current flow (or unknown) -> back to "/" (resume);
 * - some earlier step is incomplete -> redirect to that step (the access guard);
 * - otherwise render the screen.
 */
export function StepRoute() {
  const { stepPath } = useParams()
  const { search } = useLocation()
  const steps = useAppSelector(selectFlowSteps)

  const index = steps.findIndex((step) => step.path === stepPath)
  const step = steps[index]
  const blockingStep = useAppSelector((state) =>
    step ? findFirstIncompleteStep(steps, state, index) : undefined,
  )

  if (!step) return <Navigate to={{ pathname: '/', search }} replace />
  if (blockingStep) return <Navigate to={{ pathname: stepUrl(blockingStep), search }} replace />

  return (
    <StepContext value={step}>
      <StepLayout key={step.key} />
    </StepContext>
  )
}
