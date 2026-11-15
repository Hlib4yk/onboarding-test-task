import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Spinner } from './Spinner'
import { Subtitle, Title } from './Typography'

interface StatusScreenProps {
  title?: string
  text?: string
  loading?: boolean
  actions?: ReactNode
}

/** Full-area state: loading, error, empty. Guarantees the user never sees a blank page. */
export function StatusScreen({ title, text, loading = false, actions }: StatusScreenProps) {
  return (
    <Wrapper role={loading ? 'status' : undefined} aria-live="polite">
      {loading && <Spinner />}
      {title && <Title as="h2">{title}</Title>}
      {text && <Subtitle>{text}</Subtitle>}
      {actions && <Actions>{actions}</Actions>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 60vh;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};

  & > ${Spinner} {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.space(2)};
  }
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  width: 100%;
  margin-top: ${({ theme }) => theme.space(6)};
`
