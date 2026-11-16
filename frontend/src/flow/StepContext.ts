import { createContext, use } from 'react'
import type { ScreenDefinition } from './types'

/** The step currently being rendered. Provided by <StepRoute>. */
export const StepContext = createContext<ScreenDefinition | null>(null)

export function useCurrentStep(): ScreenDefinition {
  const step = use(StepContext)
  if (!step) throw new Error('useCurrentStep must be used inside <StepRoute>')
  return step
}
