import type { QueryClient } from '@tanstack/react-query'
import { authKeys } from '@/features/auth/lib/query-keys'
import type { AuthPayload, AuthResponse, AuthSession } from '@/features/auth/types'
import { toAuthSession, toAuthSessionFromMe } from '@/features/auth/utils/session'
import { api, persistAccessToken, resetAuthSession } from '@/lib/api/client'
import { ApiError } from '@/lib/api/errors'
import { getAccessToken, setActiveProfileId } from '@/lib/api/session'
import { consumeAccessTokenHandoff } from '@/lib/host'

const AUTH = '/api/v1/auth'

let refreshInFlight: Promise<AuthSession | null> | null = null

async function refreshSession(): Promise<AuthSession | null> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    try {
      const { data } = await api.post<AuthResponse>(`${AUTH}/refresh`, undefined, {
        skipErrorToast: true,
      })
      persistAccessToken(data.accessToken)
      return toAuthSession(data)
    } catch {
      return null
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

/** After cross-host handoff, mint a refresh cookie for this browser host. */
async function establishFromAccessToken(accessToken: string): Promise<AuthSession | null> {
  try {
    const { data } = await api.post<AuthResponse>(`${AUTH}/establish`, undefined, {
      skipErrorToast: true,
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    persistAccessToken(data.accessToken)
    return toAuthSession(data)
  } catch {
    return null
  }
}

export async function resolveSession(): Promise<AuthSession | null> {
  const handedOff = consumeAccessTokenHandoff()
  if (handedOff) {
    persistAccessToken(handedOff)
    const established = await establishFromAccessToken(handedOff)
    if (established) return established
  }

  const stored = getAccessToken()

  if (stored) {
    try {
      const { data } = await api.get<AuthPayload>(`${AUTH}/me`, { skipErrorToast: true })
      return toAuthSessionFromMe(data, stored)
    } catch (error) {
      // Only fall through to refresh on auth failures. Keep the token on
      // transient/network errors so a handoff isn't wiped before retry.
      if (!(error instanceof ApiError) || (error.status !== 401 && error.status !== 403)) {
        return null
      }
    }
  }

  const refreshed = await refreshSession()
  if (!refreshed) {
    resetAuthSession()
    return null
  }
  return refreshed
}

export function writeSession(queryClient: QueryClient, session: AuthSession | null) {
  if (!session) {
    resetAuthSession()
    setActiveProfileId(null)
    queryClient.setQueryData<AuthSession | null>(authKeys.session(), null)
    return
  }

  persistAccessToken(session.accessToken)
  setActiveProfileId(session.activeProfile?.id ?? null)
  queryClient.setQueryData<AuthSession>(authKeys.session(), session)
}

export function patchSession(
  queryClient: QueryClient,
  updater: (current: AuthSession) => AuthSession,
) {
  const current = queryClient.getQueryData<AuthSession | null>(authKeys.session())
  if (!current) return
  writeSession(queryClient, updater(current))
}
