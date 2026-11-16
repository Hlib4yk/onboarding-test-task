import { useAppSelector } from '@/app/store/hooks'
import { selectPaymentError, selectPaymentStatus } from '@/features/payment/paymentSlice'
import { t } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { Notice } from '@/shared/ui/Notice'

interface PaymentStatusNoticeProps {
  pollingExhausted: boolean
  onCheckAgain: () => void
}

/** One distinct UI state per payment status: failed, verifying, processing, succeeded… */
export function PaymentStatusNotice({ pollingExhausted, onCheckAgain }: PaymentStatusNoticeProps) {
  const status = useAppSelector(selectPaymentStatus)
  const error = useAppSelector(selectPaymentError)

  const checkAgainButton = (
    <Button variant="secondary" onClick={onCheckAgain}>
      {t.checkout.checkAgain}
    </Button>
  )

  switch (status) {
    case 'failed':
      return (
        <Notice tone="error">
          {error ?? t.payment.failed} {t.checkout.tryAgainHint}
        </Notice>
      )
    case 'verifying':
      return (
        <Notice tone="info" loading>
          {t.checkout.verifying}
        </Notice>
      )
    case 'processing':
      return pollingExhausted ? (
        <Notice tone="info" action={checkAgainButton}>
          {t.checkout.stillProcessing}
        </Notice>
      ) : (
        <Notice tone="info" loading>
          {t.checkout.processing}
        </Notice>
      )
    case 'unverified':
      return (
        <Notice tone="error" action={checkAgainButton}>
          {t.checkout.unverified}
        </Notice>
      )
    case 'succeeded':
      return <Notice tone="success">{t.checkout.succeeded}</Notice>
    case 'idle':
    case 'submitting':
      return null
  }
}
