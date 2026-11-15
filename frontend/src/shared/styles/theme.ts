/** Design tokens shared by every styled component (available as `props.theme`). */
export const theme = {
  colors: {
    background: '#f4f5fa',
    surface: '#ffffff',
    text: '#151826',
    textMuted: '#5d6378',
    border: '#dcdfe8',
    borderStrong: '#b9bed0',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primarySoft: '#eef0ff',
    onPrimary: '#ffffff',
    danger: '#c8261b',
    dangerSoft: '#fdf0ef',
    success: '#08855a',
    successSoft: '#e9f8f1',
    info: '#2a5bd7',
    infoSoft: '#edf2ff',
    focusRing: 'rgba(79, 70, 229, 0.35)',
  },
  /** 4px grid: space(4) === '16px'. */
  space: (multiplier: number) => `${multiplier * 4}px`,
  radii: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    pill: '999px',
  },
  font: {
    family: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    size: {
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      xxl: '28px',
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: 1.45,
  },
  layout: {
    contentMaxWidth: '480px',
  },
  shadows: {
    card: '0 12px 40px rgba(21, 24, 38, 0.08)',
  },
  /** Mobile-first: base styles are for phones, these queries add larger-screen tweaks. */
  media: {
    tablet: '@media (min-width: 640px)',
  },
  transition: '150ms ease',
} as const

export type AppTheme = typeof theme
