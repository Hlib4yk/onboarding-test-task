import { selectIsQuestionAnswered } from '@/features/quiz/quizSlice'
import type { ScreenDefinition } from '@/flow/types'
import { lazyWithPreload } from '@/shared/lib/lazyWithPreload'
import { INTERESTS_QUESTION } from './question'

export const quizMultiScreen: ScreenDefinition = {
  key: 'quiz_multi',
  path: 'quiz-multi',
  component: lazyWithPreload(() => import('./QuizMultiScreen')),
  isComplete: (state) => selectIsQuestionAnswered(state, INTERESTS_QUESTION.id),
}
