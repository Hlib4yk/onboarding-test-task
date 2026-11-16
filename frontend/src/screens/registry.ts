import type { ScreenDefinition } from '@/flow/types'
import { checkoutScreen } from './checkout'
import { emailScreen } from './email'
import { phoneScreen } from './phone'
import { quizMultiScreen } from './quiz-multi'
import { quizSingleScreen } from './quiz-single'
import { successScreen } from './success'

/**
 * Every screen the frontend knows. The ORDER here doesn't matter — the order
 * comes from the backend. Adding a screen = create a folder + add it to this list.
 */
const SCREENS: readonly ScreenDefinition[] = [
  phoneScreen,
  emailScreen,
  quizSingleScreen,
  quizMultiScreen,
  checkoutScreen,
  successScreen,
]

const screensByKey = new Map(SCREENS.map((screen) => [screen.key, screen]))

/** Backend keys -> screen definitions, in backend order. Unknown keys and duplicates are skipped. */
export function resolveSteps(keys: readonly string[]): ScreenDefinition[] {
  const uniqueKeys = [...new Set(keys)]
  return uniqueKeys.flatMap((key) => {
    const screen = screensByKey.get(key)
    return screen ? [screen] : []
  })
}

export const findUnknownScreens = (keys: readonly string[]) =>
  keys.filter((key) => !screensByKey.has(key))
