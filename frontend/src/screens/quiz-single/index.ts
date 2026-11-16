import { selectIsQuestionAnswered } from '@/features/quiz/quizSlice'
import type { ScreenDefinition } from '@/flow/types'
import { lazyWithPreload } from '@/shared/lib/lazyWithPreload'
import { MAIN_GOAL_QUESTION } from './question'

export const quizSingleScreen: ScreenDefinition = {
  key: 'quiz_single',
  path: 'quiz-single',
  component: lazyWithPreload(() => import('./QuizSingleScreen')),
  isComplete: (state) => selectIsQuestionAnswered(state, MAIN_GOAL_QUESTION.id),
}
