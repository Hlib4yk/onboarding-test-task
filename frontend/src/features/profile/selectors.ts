import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store'
import { validateEmail, validatePhone } from './validation'

export const selectPhoneCountry = (state: RootState) => state.profile.phoneCountry
export const selectPhoneNational = (state: RootState) => state.profile.phoneNational
export const selectEmailInput = (state: RootState) => state.profile.email

export const selectPhoneValidation = createSelector(
  [selectPhoneCountry, selectPhoneNational],
  validatePhone,
)

export const selectEmailValidation = createSelector([selectEmailInput], validateEmail)

/** Phone in E.164, or null while the input is not valid. */
export const selectPhoneE164 = (state: RootState): string | null => {
  const result = selectPhoneValidation(state)
  return result.ok ? result.value : null
}

/** Trimmed valid email, or null. */
export const selectValidEmail = (state: RootState): string | null => {
  const result = selectEmailValidation(state)
  return result.ok ? result.value : null
}
