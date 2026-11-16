import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import { getErrorMessage } from '@/shared/api/http'
import { fetchStripeConfig } from './api'

let stripePromise: Promise<Stripe> | null = null

/**
 * Loads Stripe.js once per page: gets the publishable key from GET /config,
 * then initialises Stripe. On failure the cache is cleared so "Try again" works.
 */
function loadStripeOnce(): Promise<Stripe> {
  stripePromise ??= (async () => {
    const { publishableKey } = await fetchStripeConfig()
    const stripe = await loadStripe(publishableKey)
    if (!stripe) throw new Error('Stripe.js failed to load')
    return stripe
  })().catch((error: unknown) => {
    stripePromise = null
    throw error
  })
  return stripePromise
}

type StripeState =
  | { status: 'loading' }
  | { status: 'ready'; stripe: Stripe }
  | { status: 'failed'; message: string }

/** The Stripe instance is not serialisable, so it lives in React state, not in Redux. */
export function useStripeInstance() {
  const [state, setState] = useState<StripeState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    loadStripeOnce().then(
      (stripe) => {
        if (active) setState({ status: 'ready', stripe })
      },
      (error: unknown) => {
        if (active) setState({ status: 'failed', message: getErrorMessage(error) })
      },
    )
    return () => {
      active = false
    }
  }, [attempt])

  const retry = () => {
    setState({ status: 'loading' })
    setAttempt((value) => value + 1)
  }

  return { state, retry }
}
