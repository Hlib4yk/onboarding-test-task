import type { QuizQuestion } from '@/features/quiz/types'
import type { Messages } from '@/shared/i18n/en'

export const INTERESTS_QUESTION: QuizQuestion<keyof Messages['quizMulti']['options']> = {
  id: 'interests',
  options: ['workouts', 'meditation', 'nutrition', 'habits', 'breathing'],
}
