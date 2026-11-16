import { QuizStep } from '@/features/quiz/QuizStep'
import { t } from '@/shared/i18n'
import { MAIN_GOAL_QUESTION } from './question'

export default function QuizSingleScreen() {
  return <QuizStep mode="single" question={MAIN_GOAL_QUESTION} texts={t.quizSingle} />
}
