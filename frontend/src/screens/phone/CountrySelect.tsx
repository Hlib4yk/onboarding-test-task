import type { CountryCode } from 'libphonenumber-js'
import styled from 'styled-components'
import { COUNTRY_OPTIONS, findCountry } from './countries'

interface CountrySelectProps {
  value: CountryCode
  onChange: (country: CountryCode) => void
  label: string
}

/**
 * Shows a compact "🇺🇦 +380" but uses an invisible native <select> on top of it,
 * so phones open their own picker (searchable, accessible, no extra library).
 */
export function CountrySelect({ value, onChange, label }: CountrySelectProps) {
  const selected = findCountry(value)

  return (
    <Wrapper>
      <Display aria-hidden>
        <span>{selected?.flag}</span>
        <span>+{selected?.callingCode}</span>
        <Chevron viewBox="0 0 12 12">
          <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </Chevron>
      </Display>
      <NativeSelect
        aria-label={label}
        value={value}
        onChange={(event) => {
          const country = findCountry(event.target.value)
          if (country) onChange(country.code)
        }}
      >
        {COUNTRY_OPTIONS.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name} (+{country.callingCode})
          </option>
        ))}
      </NativeSelect>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  border-right: 1.5px solid ${({ theme }) => theme.colors.border};

  &:focus-within {
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`

const Display = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1.5)};
  padding: 0 ${({ theme }) => theme.space(3)};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-variant-numeric: tabular-nums;
`

const Chevron = styled.svg`
  width: 12px;
  height: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const NativeSelect = styled.select`
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  /* iOS zooms into inputs with font-size < 16px */
  font-size: 16px;
`
