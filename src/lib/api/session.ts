import { getStoredAccessToken, setStoredAccessToken } from '@/features/auth/lib/token'

let memoryToken: string | null = getStoredAccessToken()
let activeProfileId: string | null = null

export function getAccessToken() {
  return memoryToken
}

export function setAccessToken(token: string | null) {
  memoryToken = token
  setStoredAccessToken(token)
}

export function getActiveProfileId() {
  return activeProfileId
}

export function setActiveProfileId(profileId: string | null) {
  activeProfileId = profileId
}

export function clearSession() {
  memoryToken = null
  activeProfileId = null
  setStoredAccessToken(null)
}
