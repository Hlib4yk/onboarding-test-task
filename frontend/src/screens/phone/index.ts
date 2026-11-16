import { selectPhoneValidation } from '@/features/profile/selectors'
import type { ScreenDefinition } from '@/flow/types'
import { lazyWithPreload } from '@/shared/lib/lazyWithPreload'

export const phoneScreen: ScreenDefinition = {
  key: 'phone',
  path: 'phone',
  component: lazyWithPreload(() => import('./PhoneScreen')),
  isComplete: (state) => selectPhoneValidation(state).ok,
}
