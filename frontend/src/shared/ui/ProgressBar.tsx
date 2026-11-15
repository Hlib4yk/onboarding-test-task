import styled from 'styled-components'

interface ProgressBarProps {
  /** 1-based number of the current step. */
  current: number
  total: number
  label: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <Track
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={label}
    >
      <Fill style={{ width: `${percent}%` }} />
    </Track>
  )
}

const Track = styled.div`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
`

const Fill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: inherit;
  transition: width 300ms ease;
`
