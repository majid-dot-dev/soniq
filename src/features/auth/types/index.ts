export const PROFILE_TYPES = ['artist', 'producer', 'label'] as const

export type ProfileType = (typeof PROFILE_TYPES)[number]

export type User = {
  id: string
  email: string
  name: string
  emailVerifiedAt: string | null
  twoFactorEnabled: boolean
  lastLoginAt: string | null
  lastActiveProfileId: string | null
  createdAt: string
  updatedAt: string
}

export type ProfileSocial = {
  instagram: string
  twitter: string
  youtube: string
  tiktok: string
  website: string
}

export type Profile = {
  id: string
  userId: string
  type: ProfileType
  displayName: string
  username: string
  avatar: string
  cover: string
  bio: string
  location: string
  genres: string[]
  social: ProfileSocial
  verified: boolean
  createdAt: string
  updatedAt: string
}

export type AuthPayload = {
  user: User
  profiles: Profile[]
  activeProfile: Profile | null
}

export type AuthResponse = AuthPayload & {
  accessToken: string
}

export type AuthSession = {
  accessToken: string
  user: User
  profiles: Profile[]
  activeProfile: Profile | null
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export type RegisterInput = {
  signupToken: string
  password: string
}

export type SignupStartInput = {
  email: string
}

export type SignupVerifyInput = {
  email: string
  code: string
}

export type LoginInput = {
  email: string
  password: string
}

export type CreateProfileInput = {
  type: ProfileType
  displayName: string
  username: string
  avatar?: string
}
