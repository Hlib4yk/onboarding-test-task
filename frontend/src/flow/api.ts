import { z } from 'zod/mini'
import { apiRequest } from '@/shared/api/http'

export const flowSchema = z.object({
  name: z.string(),
  screens: z.array(z.string()),
})

export type FlowData = z.infer<typeof flowSchema>

/** GET /flow?name=… — without a name the backend returns the default flow. */
export const fetchFlow = (name: string | null) =>
  apiRequest('/flow', flowSchema, { query: { name } })
