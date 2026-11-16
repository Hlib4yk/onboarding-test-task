import styled from 'styled-components'

/** Mobile-first page container: full-screen column on phones, centred card on larger screens. */
export const AppShell = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  min-height: 100dvh;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(4)};
  padding-bottom: max(${({ theme }) => theme.space(4)}, env(safe-area-inset-bottom));

  ${({ theme }) => theme.media.tablet} {
    min-height: min(760px, calc(100dvh - ${({ theme }) => theme.space(20)}));
    margin: ${({ theme }) => theme.space(10)} auto;
    padding: ${({ theme }) => theme.space(8)};
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`
