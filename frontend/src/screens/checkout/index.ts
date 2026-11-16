import { selectIsPaid } from '@/features/payment/paymentSlice'
import type { ScreenDefinition } from '@/flow/types'
import { lazyWithPreload } from '@/shared/lib/lazyWithPreload'

export const checkoutScreen: ScreenDefinition = {
  key: 'checkout',
  path: 'checkout',
  component: lazyWithPreload(() => import('./CheckoutScreen')),
  // Complete only when the BACKEND confirmed the payment — this is what guards /success.
  isComplete: selectIsPaid,
}
