import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    min-width: 320px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.font.size.md};
    line-height: ${({ theme }) => theme.font.lineHeight};
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, p {
    margin: 0;
  }

  button, input, select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }
  }
`
