import { useId, type SubmitEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useFlowNavigation } from '@/flow/useFlowNavigation'
import { analytics } from '@/shared/analytics/analytics'
import { t } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { OptionCard } from '@/shared/ui/OptionCard'
import { OptionList } from '@/shared/ui/OptionList'
import { ScreenBody, ScreenFooter, ScreenForm } from '@/shared/ui/ScreenLayout'
import { Subtitle, Title } from '@/shared/ui/Typography'
import { multiAnswerToggled, selectQuizAnswers, singleAnswerSelected } from './quizSlice'
import type { QuizQuestion } from './types'

interface QuizStepProps<OptionId extends string> {
  question: QuizQuestion<OptionId>
  /** single = radio buttons, multi = checkboxes. */
  mode: 'single' | 'multi'
  texts: { title: string; subtitle: string; options: Record<OptionId, string> }
}

/** Shared UI + behaviour of quiz screens. A quiz screen = question config + texts. */
export function QuizStep<OptionId extends string>({
  question,
  mode,
  texts,
}: QuizStepProps<OptionId>) {
  const dispatch = useAppDispatch()
  const answers = useAppSelector((state) => selectQuizAnswers(state, question.id))
  const { goNext } = useFlowNavigation()
  const titleId = useId()

  const handleSelect = (optionId: OptionId) => {
    const payload = { questionId: question.id, optionId }
    dispatch(mode === 'single' ? singleAnswerSelected(payload) : multiAnswerToggled(payload))
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (answers.length === 0) return
    analytics.track({ name: 'quiz_answered', questionId: question.id, answers: [...answers] })
    goNext()
  }

  return (
    <ScreenForm onSubmit={handleSubmit}>
      <ScreenBody>
        <div>
          <Title id={titleId}>{texts.title}</Title>
          <Subtitle>{texts.subtitle}</Subtitle>
        </div>
        <OptionList role={mode === 'single' ? 'radiogroup' : 'group'} aria-labelledby={titleId}>
          {question.options.map((optionId) => (
            <OptionCard
              key={optionId}
              kind={mode === 'single' ? 'radio' : 'checkbox'}
              title={texts.options[optionId]}
              selected={answers.includes(optionId)}
              onSelect={() => {
                handleSelect(optionId)
              }}
            />
          ))}
        </OptionList>
      </ScreenBody>
      <ScreenFooter>
        <Button type="submit" disabled={answers.length === 0}>
          {t.common.continue}
        </Button>
      </ScreenFooter>
    </ScreenForm>
  )
}
