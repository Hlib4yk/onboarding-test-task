import { z } from 'zod/mini'
import { API_URL } from '@/shared/config/env'
import { t } from '@/shared/i18n'

/** Error shape returned by the backend: { error: { code, message } }. */
const errorBodySchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
})

export class ApiError extends Error {
  /** HTTP status, or 0 when the request never reached the server. */
  readonly status: number
  /** Backend error code (e.g. "flow_not_found") or a client-side one ("network_error"). */
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  query?: Record<string, string | null | undefined>
  body?: unknown
  headers?: Record<string, string>
}

/**
 * The only place that talks to the backend.
 * Every response is validated with a zod schema, so data entering the app is typed for real,
 * not just cast with `as`.
 */
export async function apiRequest<T>(
  path: string,
  schema: z.ZodMiniType<T>,
  { method = 'GET', query, body, headers }: RequestOptions = {},
): Promise<T> {
  const url = new URL(API_URL + path, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) url.searchParams.set(key, value)
  }

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'network_error', t.errors.network)
  }

  const json: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const parsed = errorBodySchema.safeParse(json)
    throw parsed.success
      ? new ApiError(response.status, parsed.data.error.code, parsed.data.error.message)
      : new ApiError(response.status, 'http_error', t.errors.unexpected)
  }

  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    throw new ApiError(response.status, 'invalid_response', t.errors.unexpected)
  }
  return parsed.data
}

/** Turns anything thrown into a message we can show to the user. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return t.errors.unexpected
}
