import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import {
  useActivateProfile,
  useAuthSession,
  useCreateProfile,
  useLogin,
  useLogout,
  useRefreshSession,
  useRegister,
} from '@/features/auth/services'
import { authKeys } from '@/features/auth/lib/query-keys'
import type {
  AuthResponse,
  AuthSession,
  AuthStatus,
  CreateProfileInput,
  LoginInput,
  Profile,
  RegisterInput,
  User,
} from '@/features/auth/types'
import { ApiError } from '@/lib/api/errors'
import { setActiveProfileId } from '@/lib/api/session'

type AuthContextValue = {
  status: AuthStatus
  user: User | null
  profiles: Profile[]
  activeProfile: Profile | null
  accessToken: string | null
  login: (input: LoginInput) => Promise<AuthResponse>
  register: (input: RegisterInput) => Promise<AuthResponse>
  logout: () => Promise<void>
  refresh: () => Promise<AuthResponse | null>
  activateProfile: (profileId: string) => Promise<Profile>
  createProfile: (input: CreateProfileInput) => Promise<Profile>
  setActiveProfileLocal: (profileId: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const sessionQuery = useAuthSession()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const refreshMutation = useRefreshSession()
  const activateProfileMutation = useActivateProfile()
  const createProfileMutation = useCreateProfile()

  const session = sessionQuery.data ?? null
  const status: AuthStatus = sessionQuery.isLoading
    ? 'loading'
    : session
      ? 'authenticated'
      : 'anonymous'

  useEffect(() => {
    setActiveProfileId(session?.activeProfile?.id ?? null)
  }, [session?.activeProfile?.id])

  const login = useCallback(
    async (input: LoginInput) => loginMutation.mutateAsync(input),
    [loginMutation],
  )

  const register = useCallback(
    async (input: RegisterInput) => registerMutation.mutateAsync(input),
    [registerMutation],
  )

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  const refresh = useCallback(async () => {
    try {
      return await refreshMutation.mutateAsync()
    } catch {
      return null
    }
  }, [refreshMutation])

  const activateProfile = useCallback(
    async (profileId: string) => {
      if (!session) throw new ApiError('Not authenticated', 401)
      const { profile } = await activateProfileMutation.mutateAsync(profileId)
      return profile
    },
    [activateProfileMutation, session],
  )

  const createProfile = useCallback(
    async (input: CreateProfileInput) => {
      if (!session) throw new ApiError('Not authenticated', 401)
      const { profile } = await createProfileMutation.mutateAsync(input)
      return profile
    },
    [createProfileMutation, session],
  )

  const setActiveProfileLocal = useCallback(
    (profileId: string) => {
      const current = queryClient.getQueryData<AuthSession | null>(authKeys.session())
      if (!current) return
      const next = current.profiles.find((profile) => profile.id === profileId) ?? null
      setActiveProfileId(next?.id ?? null)
      queryClient.setQueryData<AuthSession>(authKeys.session(), {
        ...current,
        activeProfile: next,
      })
    },
    [queryClient],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      profiles: session?.profiles ?? [],
      activeProfile: session?.activeProfile ?? null,
      accessToken: session?.accessToken ?? null,
      login,
      register,
      logout,
      refresh,
      activateProfile,
      createProfile,
      setActiveProfileLocal,
    }),
    [
      status,
      session,
      login,
      register,
      logout,
      refresh,
      activateProfile,
      createProfile,
      setActiveProfileLocal,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
