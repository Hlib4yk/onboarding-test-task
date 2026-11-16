import { useRef, type SubmitEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { emailChanged } from '@/features/profile/profileSlice'
import { selectEmailInput, selectEmailValidation } from '@/features/profile/selectors'
import { useFlowNavigation } from '@/flow/useFlowNavigation'
import { analytics } from '@/shared/analytics/analytics'
import { t } from '@/shared/i18n'
import { useFieldError } from '@/shared/lib/useFieldError'
import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { fieldErrorId, Input } from '@/shared/ui/Input'
import { ScreenBody, ScreenFooter, ScreenForm } from '@/shared/ui/ScreenLayout'
import { Subtitle, Title } from '@/shared/ui/Typography'

const INPUT_ID = 'email'

export default function EmailScreen() {
  const dispatch = useAppDispatch()
  const email = useAppSelector(selectEmailInput)
  const validation = useAppSelector(selectEmailValidation)
  const { goNext } = useFlowNavigation()
  const inputRef = useRef<HTMLInputElement>(null)

  const field = useFieldError(validation.ok ? null : t.email.errors[validation.reason])

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validation.ok) {
      field.reveal()
      inputRef.current?.focus()
      return
    }
    analytics.track({ name: 'email_submitted' })
    goNext()
  }

  return (
    <ScreenForm onSubmit={handleSubmit} noValidate>
      <ScreenBody>
        <div>
          <Title>{t.email.title}</Title>
          <Subtitle>{t.email.subtitle}</Subtitle>
        </div>
        <Field label={t.email.label} inputId={INPUT_ID} error={field.error}>
          <Input
            ref={inputRef}
            id={INPUT_ID}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={t.email.placeholder}
            value={email}
            onChange={(event) => {
              field.onChange()
              dispatch(emailChanged(event.target.value))
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
