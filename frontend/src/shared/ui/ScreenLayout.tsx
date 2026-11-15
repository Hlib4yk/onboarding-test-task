import styled from 'styled-components'

/**
 * Standard screen skeleton: content on top, primary action pinned to the bottom
 * (thumb-friendly on phones). Rendered as a <form> so Enter submits.
 */
export const ScreenForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(6)};
`

export const ScreenBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(6)};
`

export const ScreenFooter = styled.div`
  position: sticky;
  bottom: 0;
  margin-top: auto;
  padding: ${({ theme }) => theme.space(3)} 0 ${({ theme }) => theme.space(2)};
  background: linear-gradient(
    to bottom,
    transparent,
    ${({ theme }) => theme.colors.background} 30%
  );

  ${({ theme }) => theme.media.tablet} {
    position: static;
    background: none;
  }
`
