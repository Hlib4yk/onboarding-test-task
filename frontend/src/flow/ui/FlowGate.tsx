import { useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { t } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { StatusScreen } from '@/shared/ui/StatusScreen'
import { loadFlow, selectFlowState } from '../flowSlice'

/**
 * Makes sure the flow is loaded before any screen renders.
 *
 * Rules:
 * - flow name comes from ?flow=… (no param => backend default);
 * - it is loaded ONCE and then kept in the persisted store, so reloads and returns
 *   from payment pages reuse it instead of asking again;
 * - opening a link with a DIFFERENT ?flow= explicitly starts a new session.
 */
export function FlowGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, status, requestedName, error } = useAppSelector(selectFlowState)

  const requested = searchParams.get('flow') || null
  const needsLoad = !data || (requested !== null && requested !== data.name)
  const failedForThisRequest = status === 'failed' && requestedName === requested

  useEffect(() => {
    if (!needsLoad || status === 'loading' || failedForThisRequest) return
    void dispatch(loadFlow(requested))
  }, [needsLoad, status, failedForThisRequest, requested, dispatch])

  if (failedForThisRequest && error) {
    if (error.code === 'flow_not_found' && requested) {
      return (
        <StatusScreen
          title={t.flow.notFoundTitle}
          text={t.flow.notFoundText(requested)}
          actions={
            <Button
              onClick={() => {
                setSearchParams(
                  (params) => {
                    params.delete('flow')
                    return params
                  },
                  { replace: true },
                )
              }}
            >
              {t.flow.startDefault}
            </Button>
          }
        />
      )
    }
    return (
      <StatusScreen
        title={t.flow.errorTitle}
        text={error.message}
        actions={
          <Button onClick={() => void dispatch(loadFlow(requested))}>{t.common.retry}</Button>
        }
      />
    )
  }

  if (needsLoad) return <StatusScreen loading text={t.flow.loading} />

  return children
}
