import { z } from 'zod/mini'
import { apiRequest } from '@/shared/api/http'

const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.int().check(z.nonnegative()),
  currency: z.string(),
  period: z.string(),
  popular: z.optional(z.boolean()),
})

const plansResponseSchema = z.object({ plans: z.array(planSchema) })

export type Plan = z.infer<typeof planSchema>

export const fetchPlans = async (): Promise<Plan[]> =>
  (await apiRequest('/plans', plansResponseSchema)).plans
