import axios, {
  AxiosHeaders,
  isAxiosError,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ApiError } from '@/lib/api/errors'
import { clearSession, getAccessToken, getActiveProfileId, setAccessToken } from '@/lib/api/session'
import { toast } from '@/lib/toast'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

type ErrorBody = {
  message?: string
  details?: unknown
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean
    /** Internal: already attempted a refresh retry for this request. */
    _authRetry?: boolean
  }
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers)
  const token = getAccessToken()
  const profileId = getActiveProfileId()

  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (profileId) headers.set('X-Profile-Id', profileId)

  config.headers = headers
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `${API_URL}/api/v1/auth/refresh`,
        undefined,
        { withCredentials: true, headers: { Accept: 'application/json' } },
      )
      setAccessToken(data.accessToken)
      return data.accessToken
    } catch {
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorBody>) => {
    const config = error.config as InternalAxiosRequestConfig | undefined
    const status = error.response?.status
    const url = config?.url ?? ''
    const isAuthRefresh = url.includes('/auth/refresh') || url.includes('/auth/establish')

    if (
      status === 401 &&
      config &&
      !config._authRetry &&
      !isAuthRefresh &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/register')
    ) {
      config._authRetry = true
      const nextToken = await refreshAccessToken()
      if (nextToken) {
        const headers = AxiosHeaders.from(config.headers)
        headers.set('Authorization', `Bearer ${nextToken}`)
        config.headers = headers
        return api.request(config)
      }
    }

    const apiError = toApiError(error)
    if (!config?.skipErrorToast) {
      toast.error(apiError.message)
    }
    throw apiError
  },
)

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (isAxiosError<ErrorBody>(error)) {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.message ??
      (status ? `Request failed (${status})` : error.message || 'Network error')
    return new ApiError(message, status, error.response?.data?.details)
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0)
  }

  return new ApiError('Unexpected request error', 0)
}

export function apiUrl(path = '') {
  return `${API_URL}${path}`
}

/** Persist access token from auth responses. */
export function persistAccessToken(token: string | null) {
  setAccessToken(token)
}

export function resetAuthSession() {
  clearSession()
}
