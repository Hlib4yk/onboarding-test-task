import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isSupportedCountry, type CountryCode } from 'libphonenumber-js'
import { sessionReset } from '@/shared/store/sessionReset'

/**
 * What the user typed on the phone and email screens.
 * We store the raw input (not only the valid result) so that the field
 * shows exactly what the user left when they come back to the screen.
 */
export interface ProfileState {
  phoneCountry: CountryCode
  phoneNational: string
  email: string
}

const FALLBACK_COUNTRY: CountryCode = 'UA'

/** Guess the country from the browser locale ("uk-UA" -> UA), fall back to Ukraine. */
function detectCountry(): CountryCode {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region
    return region && isSupportedCountry(region) ? region : FALLBACK_COUNTRY
  } catch {
    return FALLBACK_COUNTRY
  }
}

export const createInitialProfileState = (): ProfileState => ({
  phoneCountry: detectCountry(),
  phoneNational: '',
  email: '',
})

const profileSlice = createSlice({
  name: 'profile',
  initialState: createInitialProfileState,
  reducers: {
    phoneCountryChanged(state, action: PayloadAction<CountryCode>) {
      state.phoneCountry = action.payload
    },
    phoneNationalChanged(state, action: PayloadAction<string>) {
      state.phoneNational = action.payload
    },
    emailChanged(state, action: PayloadAction<string>) {
      state.email = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sessionReset, createInitialProfileState)
  },
})

export const { phoneCountryChanged, phoneNationalChanged, emailChanged } = profileSlice.actions
export const profileReducer = profileSlice.reducer
