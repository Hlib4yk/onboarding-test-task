import { QuizStep } from '@/features/quiz/QuizStep'
import { t } from '@/shared/i18n'
import { INTERESTS_QUESTION } from './question'

export default function QuizMultiScreen() {
  return <QuizStep mode="multi" question={INTERESTS_QUESTION} texts={t.quizMulti} />
}
