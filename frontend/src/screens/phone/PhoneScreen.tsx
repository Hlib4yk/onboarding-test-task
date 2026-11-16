import { getExampleNumber } from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'
import { useRef, type SubmitEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { phoneCountryChanged, phoneNationalChanged } from '@/features/profile/profileSlice'
import {
  selectPhoneCountry,
  selectPhoneNational,
  selectPhoneValidation,
} from '@/features/profile/selectors'
import { sanitizePhoneInput } from '@/features/profile/validation'
import { useFlowNavigation } from '@/flow/useFlowNavigation'
import { analytics } from '@/shared/analytics/analytics'
import { t } from '@/shared/i18n'
import { useFieldError } from '@/shared/lib/useFieldError'
import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { fieldErrorId, Input } from '@/shared/ui/Input'
import { ScreenBody, ScreenFooter, ScreenForm } from '@/shared/ui/ScreenLayout'
import { Subtitle, Title } from '@/shared/ui/Typography'
import { CountrySelect } from './CountrySelect'

const INPUT_ID = 'phone'

export default function PhoneScreen() {
  const dispatch = useAppDispatch()
  const country = useAppSelector(selectPhoneCountry)
  const national = useAppSelector(selectPhoneNational)
  const validation = useAppSelector(selectPhoneValidation)
  const { goNext } = useFlowNavigation()
  const inputRef = useRef<HTMLInputElement>(null)

  const field = useFieldError(validation.ok ? null : t.phone.errors[validation.reason])
  const placeholder = getExampleNumber(country, examples)?.formatNational()

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validation.ok) {
      field.reveal()
      inputRef.current?.focus()
      return
    }
    analytics.track({ name: 'phone_submitted', country })
    goNext()
  }

  return (
    <ScreenForm onSubmit={handleSubmit} noValidate>
      <ScreenBody>
        <div>
          <Title>{t.phone.title}</Title>
          <Subtitle>{t.phone.subtitle}</Subtitle>
        </div>
        <Field label={t.phone.label} inputId={INPUT_ID} error={field.error}>
          <CountrySelect
            value={country}
            label={t.phone.countryLabel}
            onChange={(code) => dispatch(phoneCountryChanged(code))}
          />
          <Input
            ref={inputRef}
            id={INPUT_ID}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
            value={national}
            onChange={(event) => {
              field.onChange()
              dispatch(phoneNationalChanged(sanitizePhoneInput(event.target.value)))
            }}
            onBlur={field.onBlur}
            aria-invalid={field.error !== null}
            aria-describedby={field.error ? fieldErrorId(INPUT_ID) : undefined}
          />
        </Field>
      </ScreenBody>
      <ScreenFooter>
        <Button type="submit">{t.common.continue}</Button>
      </ScreenFooter>
    </ScreenForm>
  )
}
