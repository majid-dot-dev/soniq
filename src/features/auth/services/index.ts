import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/features/auth/lib/query-keys'
import { patchSession, resolveSession, writeSession } from '@/features/auth/lib/session'
import type {
  AuthResponse,
  CreateProfileInput,
  LoginInput,
  Profile,
  RegisterInput,
  SignupStartInput,
  SignupVerifyInput,
} from '@/features/auth/types'
import { toAuthSession } from '@/features/auth/utils/session'
import { api } from '@/lib/api/client'

const AUTH = '/api/v1/auth'
const PROFILES = '/api/v1/profiles'

export function useAuthSession(enabled = true) {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: resolveSession,
    enabled,
    staleTime: 60_000,
    retry: false,
    refetchOnMount: false,
  })
}

export function useStartSignup() {
  return useMutation({
    mutationFn: async (input: SignupStartInput) => {
      const { data } = await api.post<{ ok: true }>(`${AUTH}/signup/start`, input, {
        skipErrorToast: true,
      })
      return data
    },
  })
}

export function useVerifySignupOtp() {
  return useMutation({
    mutationFn: async (input: SignupVerifyInput) => {
      const { data } = await api.post<{ signupToken: string }>(
        `${AUTH}/signup/verify-otp`,
        input,
      )
      return data
    },
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post<AuthResponse>(`${AUTH}/login`, input)
      return data
    },
    onSuccess: (response) => {
      writeSession(queryClient, toAuthSession(response))
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data } = await api.post<AuthResponse>(`${AUTH}/register`, input)
      return data
    },
    onSuccess: (response) => {
      writeSession(queryClient, toAuthSession(response))
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post(`${AUTH}/logout`)
      } finally {
        writeSession(queryClient, null)
        queryClient.clear()
      }
    },
  })
}

export function useRefreshSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<AuthResponse>(`${AUTH}/refresh`)
      return data
    },
    onSuccess: (response) => {
      writeSession(queryClient, toAuthSession(response))
    },
    onError: () => {
      writeSession(queryClient, null)
    },
  })
}

export function useActivateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profileId: string) => {
      const { data } = await api.post<{ profile: Profile }>(
        `${PROFILES}/${profileId}/activate`,
      )
      return data
    },
    onSuccess: ({ profile }) => {
      patchSession(queryClient, (current) => ({
        ...current,
        activeProfile: profile,
        user: { ...current.user, lastActiveProfileId: profile.id },
      }))
    },
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProfileInput) => {
      const { data } = await api.post<{ profile: Profile }>(PROFILES, input)
      return data
    },
    onSuccess: ({ profile }) => {
      patchSession(queryClient, (current) => ({
        ...current,
        profiles: [...current.profiles, profile],
        activeProfile: current.activeProfile ?? profile,
        user: current.activeProfile
          ? current.user
          : { ...current.user, lastActiveProfileId: profile.id },
      }))
    },
  })
}

export function useListProfiles(enabled = true) {
  return useQuery({
    queryKey: authKeys.profiles(),
    queryFn: async () => {
      const { data } = await api.get<{ profiles: Profile[] }>(PROFILES)
      return data
    },
    enabled,
  })
}
