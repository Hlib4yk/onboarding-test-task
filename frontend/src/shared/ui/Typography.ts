import styled from 'styled-components'

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  line-height: 1.25;

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.font.size.xxl};
  }
`

export const Subtitle = styled.p`
  margin-top: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`
