import type { QuizQuestion } from '@/features/quiz/types'
import type { Messages } from '@/shared/i18n/en'

export const MAIN_GOAL_QUESTION: QuizQuestion<keyof Messages['quizSingle']['options']> = {
  id: 'main_goal',
  options: ['fitness', 'sleep', 'focus', 'stress'],
}
