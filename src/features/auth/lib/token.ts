const ACCESS_TOKEN_KEY = 'soniq.accessToken'

export function getStoredAccessToken(): string | null {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredAccessToken(token: string | null) {
  try {
    if (!token) {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      return
    }
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
  } catch {
    // Ignore storage failures (private mode quotas, etc.)
  }
}
