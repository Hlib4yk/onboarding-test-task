import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectPaymentStatus, verificationRequested, verifyPayment } from './paymentSlice'

const POLL_INTERVAL_MS = 2000
const MAX_POLLS = 15

/**
 * Keeps the UI in sync with the backend:
 * - status `verifying` (after confirm, after a redirect back, after reload) -> check once;
 * - status `processing` -> poll every 2s, give up after ~30s and offer a manual "Check status".
 */
export function usePaymentStatusSync() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectPaymentStatus)
  const [polls, setPolls] = useState(0)

  useEffect(() => {
    if (status === 'verifying') void dispatch(verifyPayment())
  }, [status, dispatch])

  useEffect(() => {
    if (status !== 'processing' || polls >= MAX_POLLS) return
    const timer = setTimeout(() => {
      setPolls((count) => count + 1)
      void dispatch(verifyPayment())
    }, POLL_INTERVAL_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [status, polls, dispatch])

  return {
    pollingExhausted: status === 'processing' && polls >= MAX_POLLS,
    checkAgain: () => {
      setPolls(0)
      dispatch(verificationRequested())
    },
  }
}
