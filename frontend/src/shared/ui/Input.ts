import styled from 'styled-components'

/** Id of the field's error element, for `aria-describedby` on the input. */
export const fieldErrorId = (inputId: string) => `${inputId}-error`

/** Unstyled input meant to be placed inside <Field> (the Field draws the border). */
export const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 ${({ theme }) => theme.space(4)};
  border: none;
  background: transparent;
  font-size: ${({ theme }) => theme.font.size.lg};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.borderStrong};
  }
`
