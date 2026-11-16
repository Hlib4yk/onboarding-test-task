import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store'
import { sessionReset } from '@/shared/store/sessionReset'

/** Answers to all quiz questions: questionId -> selected option ids. */
export interface QuizState {
  answers: Record<string, string[]>
}

interface AnswerPayload {
  questionId: string
  optionId: string
}

const initialState: QuizState = { answers: {} }

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    singleAnswerSelected(state, { payload }: PayloadAction<AnswerPayload>) {
      state.answers[payload.questionId] = [payload.optionId]
    },
    multiAnswerToggled(state, { payload }: PayloadAction<AnswerPayload>) {
      const current = state.answers[payload.questionId] ?? []
      state.answers[payload.questionId] = current.includes(payload.optionId)
        ? current.filter((id) => id !== payload.optionId)
        : [...current, payload.optionId]
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sessionReset, () => initialState)
  },
})

export const { singleAnswerSelected, multiAnswerToggled } = quizSlice.actions
export const quizReducer = quizSlice.reducer

const NO_ANSWERS: readonly string[] = []

export const selectQuizAnswers = (state: RootState, questionId: string): readonly string[] =>
  state.quiz.answers[questionId] ?? NO_ANSWERS

export const selectIsQuestionAnswered = (state: RootState, questionId: string): boolean =>
  selectQuizAnswers(state, questionId).length > 0
