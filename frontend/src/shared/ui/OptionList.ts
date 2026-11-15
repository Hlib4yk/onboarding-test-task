import styled from 'styled-components'

/** Vertical list of OptionCards. Give it role="radiogroup" / "group" where used. */
export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
`
