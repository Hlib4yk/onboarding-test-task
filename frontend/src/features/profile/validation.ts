import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'

export type ValidationResult<T> =
  { ok: true; value: T } | { ok: false; reason: 'empty' | 'invalid' }

/**
 * Validates a national number for the selected country and returns it in E.164
 * (+380501234567) — the format the backend expects.
 * libphonenumber knows real numbering plans, so "too short for Ukraine" is caught too.
 */
export function validatePhone(country: CountryCode, national: string): ValidationResult<string> {
  const trimmed = national.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }

  const parsed = parsePhoneNumberFromString(trimmed, country)
  // Calling code (not country) check: US and CA share +1, and that's fine.
  if (!parsed?.isValid() || parsed.countryCallingCode !== getCountryCallingCode(country)) {
    return { ok: false, reason: 'invalid' }
  }

  return { ok: true, value: parsed.number }
}

/** Same rule as the backend, so a value we accept is never rejected by the API. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): ValidationResult<string> {
  const trimmed = email.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  if (!EMAIL_RE.test(trimmed)) return { ok: false, reason: 'invalid' }
  return { ok: true, value: trimmed }
}

/** Keeps only characters that can appear in a typed phone number. */
export function sanitizePhoneInput(raw: string): string {
  return raw.replace(/[^\d\s()-]/g, '')
}
