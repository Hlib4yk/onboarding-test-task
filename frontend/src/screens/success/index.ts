import type { ScreenDefinition } from '@/flow/types'
import { lazyWithPreload } from '@/shared/lib/lazyWithPreload'

export const successScreen: ScreenDefinition = {
  key: 'success',
  path: 'success',
  component: lazyWithPreload(() => import('./SuccessScreen')),
  hideBackButton: true,
}
