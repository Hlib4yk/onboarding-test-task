import type { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner size={18} />}
      {children}
    </StyledButton>
  )
}

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    min-height: 40px;
  `,
}

const StyledButton = styled.button<{ $variant: Variant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  width: 100%;
  min-height: 52px;
  padding: 0 ${({ theme }) => theme.space(5)};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  transition: background ${({ theme }) => theme.transition};
  ${({ $variant }) => variants[$variant]}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`
