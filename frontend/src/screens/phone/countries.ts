import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js'

export interface CountryOption {
  code: CountryCode
  name: string
  callingCode: string
  flag: string
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

const REGIONAL_INDICATOR_A = 0x1f1e6
const LETTER_A = 65

/** "UA" -> 🇺🇦: each letter maps to a regional-indicator symbol. */
const toFlag = (code: string) =>
  String.fromCodePoint(
    REGIONAL_INDICATOR_A + code.charCodeAt(0) - LETTER_A,
    REGIONAL_INDICATOR_A + code.charCodeAt(1) - LETTER_A,
  )

/** Every country libphonenumber knows, sorted by name. No hand-maintained list. */
export const COUNTRY_OPTIONS: readonly CountryOption[] = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) ?? code,
    callingCode: getCountryCallingCode(code),
    flag: toFlag(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export const findCountry = (code: string) =>
  COUNTRY_OPTIONS.find((country) => country.code === code)
