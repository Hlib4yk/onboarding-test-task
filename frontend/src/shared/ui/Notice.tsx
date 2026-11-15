import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Spinner } from './Spinner'

type Tone = 'info' | 'error' | 'success'

interface NoticeProps {
  tone: Tone
  children: ReactNode
  loading?: boolean
  action?: ReactNode
}

/** Inline status message (payment error, processing, …). */
export function Notice({ tone, children, loading = false, action }: NoticeProps) {
  return (
    <Box $tone={tone} role={tone === 'error' ? 'alert' : 'status'}>
      <Row>
        {loading && <Spinner size={18} />}
        <span>{children}</span>
      </Row>
      {action}
    </Box>
  )
}

const TONE_COLORS = {
  info: { text: 'info', background: 'infoSoft' },
  error: { text: 'danger', background: 'dangerSoft' },
  success: { text: 'success', background: 'successSoft' },
} as const

const Box = styled.div<{ $tone: Tone }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(4)};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme, $tone }) => theme.colors[TONE_COLORS[$tone].text]};
  background: ${({ theme, $tone }) => theme.colors[TONE_COLORS[$tone].background]};
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
`
