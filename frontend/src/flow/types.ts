import type { RootState } from '@/app/store/store'
import type { PreloadableComponent } from '@/shared/lib/lazyWithPreload'

/**
 * Contract every screen implements to plug into the onboarding.
 * The flow engine knows screens ONLY through this interface.
 */
export interface ScreenDefinition {
  /** Key used by the backend in GET /flow (e.g. "quiz_single"). */
  key: string
  /** URL segment: /quiz-single */
  path: string
  /** Lazily loaded screen component. */
  component: PreloadableComponent
  /**
   * Has the user provided everything this step needs? Steps after an incomplete one
   * can't be opened. Omit for steps that need nothing (they count as complete).
   */
  isComplete?: (state: RootState) => boolean
  /** Hide the in-app "Back" button on this screen (e.g. after payment). */
  hideBackButton?: boolean
}
