import type { Appearance } from '@stripe/stripe-js'
import { theme } from '@/shared/styles/theme'

/** Makes the Stripe Payment Element (rendered in an iframe) match our theme. */
export const stripeAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: theme.colors.primary,
    colorDanger: theme.colors.danger,
    colorText: theme.colors.text,
    colorBackground: theme.colors.surface,
    fontFamily: theme.font.family,
    borderRadius: theme.radii.md,
    spacingUnit: '4px',
  },
}
