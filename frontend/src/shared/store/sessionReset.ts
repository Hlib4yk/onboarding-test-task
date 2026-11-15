import { createAction } from '@reduxjs/toolkit'

/**
 * Starts a new onboarding session: every slice that holds session data
 * returns to its initial state when it sees this action.
 */
export const sessionReset = createAction('session/reset')
