import type { AuthPayload, AuthResponse, AuthSession } from '@/features/auth/types'

export function toAuthSession(response: AuthResponse): AuthSession {
  return {
    accessToken: response.accessToken,
    user: response.user,
    profiles: response.profiles,
    activeProfile: response.activeProfile,
  }
}

export function toAuthSessionFromMe(payload: AuthPayload, accessToken: string): AuthSession {
  return {
    accessToken,
    user: payload.user,
    profiles: payload.profiles,
    activeProfile: payload.activeProfile,
  }
}
