import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'

interface OptionCardProps {
  /** radio = pick one (quiz single, plans), checkbox = pick many (quiz multi). */
  kind: 'radio' | 'checkbox'
  selected: boolean
  onSelect: () => void
  title: ReactNode
  description?: ReactNode
  aside?: ReactNode
  badge?: ReactNode
  disabled?: boolean
}

/** A big tappable option row. Used by both quizzes and the plan picker. */
export function OptionCard({
  kind,
  selected,
  onSelect,
  title,
  description,
  aside,
  badge,
  disabled,
}: OptionCardProps) {
  return (
    <Card
      type="button"
      role={kind}
      aria-checked={selected}
      $selected={selected}
      onClick={onSelect}
      disabled={disabled}
    >
      <Indicator $kind={kind} $selected={selected} aria-hidden />
      <Body>
        <CardTitle>{title}</CardTitle>
        {description && <Description>{description}</Description>}
      </Body>
      {aside}
      {badge && <Badge>{badge}</Badge>}
    </Card>
  )
}

const Card = styled.button<{ $selected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  width: 100%;
  min-height: 60px;
  padding: ${({ theme }) => `${theme.space(4)} ${theme.space(4)}`};
  text-align: left;
  background: ${({ theme, $selected }) => ($selected ? theme.colors.primarySoft : theme.colors.surface)};
  border: 1.5px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  transition:
    border-color ${({ theme }) => theme.transition},
    background ${({ theme }) => theme.transition};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const Indicator = styled.span<{ $kind: 'radio' | 'checkbox'; $selected: boolean }>`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 2px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.borderStrong)};
  border-radius: ${({ $kind }) => ($kind === 'radio' ? '50%' : '6px')};
  background: ${({ theme, $selected }) => ($selected ? theme.colors.primary : 'transparent')};
  ${({ $selected, $kind, theme }) =>
    $selected &&
    ($kind === 'radio'
      ? css`
          box-shadow: inset 0 0 0 4px ${theme.colors.surface};
        `
      : css`
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-size: 14px;
          background-position: center;
          background-repeat: no-repeat;
        `)}
`

const Body = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`

const CardTitle = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`

const Description = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
`

const Badge = styled.span`
  position: absolute;
  top: -10px;
  right: ${({ theme }) => theme.space(4)};
  padding: 2px ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`
