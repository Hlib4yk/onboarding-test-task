/** Query params Stripe appends to return_url after a redirect / 3DS. */
const STRIPE_RETURN_PARAMS = [
  'payment_intent',
  'payment_intent_client_secret',
  'redirect_status',
] as const

/**
 * Where Stripe sends the user back after a redirect payment method:
 * the current page (checkout) with our own params like ?flow= preserved.
 */
export function buildReturnUrl(): string {
  const url = new URL(window.location.href)
  for (const param of STRIPE_RETURN_PARAMS) url.searchParams.delete(param)
  return url.toString()
}

/**
 * We deliberately IGNORE these params (the result comes from GET /payments/:id)
 * and remove them so they don't travel to the next screens.
 */
export function stripStripeReturnParams(search: string): string | null {
  const params = new URLSearchParams(search)
  if (!STRIPE_RETURN_PARAMS.some((param) => params.has(param))) return null
  for (const param of STRIPE_RETURN_PARAMS) params.delete(param)
  const rest = params.toString()
  return rest ? `?${rest}` : ''
}
