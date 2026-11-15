import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const Spinner = styled.span.attrs({ role: 'presentation' })<{ size?: number }>`
  display: inline-block;
  flex-shrink: 0;
  width: ${({ size = 32 }) => size}px;
  height: ${({ size = 32 }) => size}px;
  border: 3px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  opacity: 0.8;
  animation: ${spin} 0.8s linear infinite;
`
