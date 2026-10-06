/**
 * Axios wrapper around the `/api` envelope.
 *
 * The browser session lives in HttpOnly cookies set by the server, so the
 * instance runs with `withCredentials`. When the access cookie has expired the
 * first 401 triggers a single refresh (single-flight, because refresh tokens
 * rotate) and the original request is retried once.
 */

import axios, { AxiosError } from 'axios'

export class ApiError extends Error {
  readonly status: number
  readonly errors?: Record<string, string>

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

interface Envelope<T> {
  success?: boolean
  message?: string
  data?: T
  errors?: Record<string, string>
}

export interface ApiEnvelope<T> {
  data: T
  message?: string
  errors?: Record<string, string>
}

const http = axios.create({ baseURL: '/api', withCredentials: true, timeout: 15000 })
const refreshHttp = axios.create({ baseURL: '/api', withCredentials: true, timeout: 15000 })

let refreshInFlight: Promise<boolean> | null = null

function tryRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = refreshHttp
      .post('/auth/refresh')
      .then(() => true)
      .catch(() => false)
      .then((ok) => {
        refreshInFlight = null
        return ok
      })
  }
  return refreshInFlight
}

/** Configs that have already been through the 401 refresh cycle. */
const retried = new WeakSet<object>()

const isEnvelope = (body: unknown): body is Envelope<unknown> =>
  typeof body === 'object' && body !== null && ('success' in body || 'data' in body || 'message' in body)

http.interceptors.response.use(
  (response) => {
    const body = response.data
    if (isEnvelope(body)) {
      if (body.success === false) {
        throw new ApiError(body.message ?? 'Request failed.', response.status, body.errors)
      }
      response.data = body.data
    }
    return response
  },
  async (error: AxiosError<unknown>) => {
    const status = error.response?.status ?? 0
    const body = isEnvelope(error.response?.data) ? error.response.data : null
    const config = error.config

    if (status === 401 && config && !retried.has(config) && !config.url?.includes('/auth/refresh')) {
      retried.add(config)
      if (await tryRefresh()) return http.request(config)
    }

    if (status === 0) {
      throw new ApiError('Cannot reach the server. Please try again shortly.', 0)
    }
    throw new ApiError(body?.message ?? `Request failed (HTTP ${status}).`, status, body?.errors)
  },
)

export interface ApiRequest {
  method?: string
  body?: unknown
}

export async function apiFetch<T>(path: string, init: ApiRequest = {}): Promise<T> {
  const response = await http.request({
    url: path,
    method: init.method ?? 'GET',
    data: init.body,
    headers: { Accept: 'application/json' },
  })
  return response.data as T
}

/** Same call, but keeps the envelope `message` (password reset uses it). */
export async function apiFetchEnvelope<T>(path: string, init: ApiRequest = {}): Promise<ApiEnvelope<T>> {
  const response = await axios.request({
    url: `/api${path}`,
    method: init.method ?? 'GET',
    data: init.body,
    headers: { Accept: 'application/json' },
    withCredentials: true,
    timeout: 15000,
    validateStatus: (status) => status >= 200 && status < 300,
    transformResponse: [(raw) => raw],
  })
  let parsed: Envelope<T> = {}
  try {
    parsed = JSON.parse(String(response.data)) as Envelope<T>
  } catch {
    // Non-JSON body; everything below falls back to defaults.
  }
  return { data: parsed.data as T, message: parsed.message, errors: parsed.errors }
}

export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Something went wrong on our side. Please try again.'
