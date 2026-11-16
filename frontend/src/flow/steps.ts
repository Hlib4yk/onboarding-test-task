import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store'
import { resolveSteps } from '@/screens/registry'
import type { ScreenDefinition } from './types'

/**
 * The steps the user will actually walk through: backend order, unknown keys skipped.
 * Progress, "next", "back" and access checks are all computed from this list,
 * so they are correct for any flow.
 */
export const selectFlowSteps = createSelector(
  [(state: RootState) => state.flow.data],
  (flow): readonly ScreenDefinition[] => (flow ? resolveSteps(flow.screens) : []),
)

export const stepUrl = (step: ScreenDefinition) => `/${step.path}`

const isStepComplete = (step: ScreenDefinition, state: RootState) =>
  step.isComplete?.(state) ?? true

/**
 * First step before `beforeIndex` that isn't complete. Used as a guard:
 * you can't open checkout without phone/email, nor success without a confirmed payment.
 */
export function findFirstIncompleteStep(
  steps: readonly ScreenDefinition[],
  state: RootState,
  beforeIndex = steps.length,
): ScreenDefinition | undefined {
  return steps.slice(0, beforeIndex).find((step) => !isStepComplete(step, state))
}

/** Where to send the user who opens "/": the first unfinished step (or the last one). */
export function findResumeStep(
  steps: readonly ScreenDefinition[],
  state: RootState,
): ScreenDefinition | undefined {
  return findFirstIncompleteStep(steps, state) ?? steps.at(-1)
}
