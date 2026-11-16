import { selectEmailValidation } from '@/features/profile/selectors'
import type { ScreenDefinition } from '@/flow/types'
import { lazyWithPreload } from '@/shared/lib/lazyWithPreload'

export const emailScreen: ScreenDefinition = {
  key: 'email',
  path: 'email',
  component: lazyWithPreload(() => import('./EmailScreen')),
  isComplete: (state) => selectEmailValidation(state).ok,
}
