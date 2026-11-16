import { Navigate, useLocation } from 'react-router'
import { useAppSelector } from '@/app/store/hooks'
import { t } from '@/shared/i18n'
import { StatusScreen } from '@/shared/ui/StatusScreen'
import { findResumeStep, selectFlowSteps, stepUrl } from '../steps'

/** "/" and unknown URLs: continue from the first unfinished step. */
export function ResumeRedirect() {
  const { search } = useLocation()
  const steps = useAppSelector(selectFlowSteps)
  const target = useAppSelector((state) => findResumeStep(steps, state))

  if (!target) return <StatusScreen title={t.flow.emptyTitle} text={t.flow.emptyText} />

  return <Navigate to={{ pathname: stepUrl(target), search }} replace />
}
