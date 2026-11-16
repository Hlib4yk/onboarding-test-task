import { z } from 'zod/mini'
import { apiRequest } from '@/shared/api/http'

/** All PaymentIntent statuses Stripe can return. */
const backendPaymentStatusSchema = z.enum([
  'requires_payment_method',
  'requires_confirmation',
  'requires_action',
  'processing',
  'requires_capture',
  'succeeded',
  'canceled',
])

const paymentSchema = z.object({
  id: z.string(),
  status: backendPaymentStatusSchema,
  planId: z.nullable(z.string()),
  amount: z.number(),
  currency: z.string(),
  errorMessage: z.nullable(z.string()),
})

const createdPaymentSchema = z.extend(paymentSchema, { clientSecret: z.string() })

const configSchema = z.object({ publishableKey: z.string() })

export type BackendPayment = z.infer<typeof paymentSchema>
export type BackendPaymentStatus = z.infer<typeof backendPaymentStatusSchema>

export interface CreatePaymentBody {
  planId: string
  email: string
  phone: string
}

/**
 * POST /payments. The Idempotency-Key makes repeats safe: same key + same body
 * returns the same PaymentIntent instead of creating a new one.
 */
export const createPayment = (body: CreatePaymentBody, idempotencyKey: string) =>
  apiRequest('/payments', createdPaymentSchema, {
    method: 'POST',
    body,
    headers: { 'Idempotency-Key': idempotencyKey },
  })

/** GET /payments/:id — the source of truth about the payment result. */
export const getPayment = (id: string) =>
  apiRequest(`/payments/${encodeURIComponent(id)}`, paymentSchema)

export const fetchStripeConfig = () => apiRequest('/config', configSchema)
