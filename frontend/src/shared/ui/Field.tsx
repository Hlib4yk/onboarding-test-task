import type { ReactNode } from 'react'
import styled from 'styled-components'
import { fieldErrorId } from './Input'

interface FieldProps {
  label: string
  inputId: string
  error: string | null
  children: ReactNode
}

/** Label + bordered control box + error text. The control (input, select…) goes inside. */
export function Field({ label, inputId, error, children }: FieldProps) {
  return (
    <Wrapper>
      <Label htmlFor={inputId}>{label}</Label>
      <Control $invalid={error !== null}>{children}</Control>
      {error !== null && (
        <ErrorText id={fieldErrorId(inputId)} role="alert">
          {error}
        </ErrorText>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`

const Control = styled.div<{ $invalid: boolean }>`
  display: flex;
  align-items: stretch;
  height: 56px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid
    ${({ theme, $invalid }) => ($invalid ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  transition:
    border-color ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:focus-within {
    border-color: ${({ theme, $invalid }) => ($invalid ? theme.colors.danger : theme.colors.primary)};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focusRing};
  }
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.font.size.sm};
`
