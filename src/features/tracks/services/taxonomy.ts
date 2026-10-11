import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { TaxonomyTerm } from '@/features/tracks/types'

const META = '/api/v1/meta'

export const taxonomyKeys = {
  all: ['taxonomy'] as const,
  genres: () => [...taxonomyKeys.all, 'genres'] as const,
  moods: () => [...taxonomyKeys.all, 'moods'] as const,
  instruments: () => [...taxonomyKeys.all, 'instruments'] as const,
  keys: () => [...taxonomyKeys.all, 'keys'] as const,
}

export function useGenres() {
  return useQuery({
    queryKey: taxonomyKeys.genres(),
    queryFn: async () => {
      const { data } = await api.get<{ genres: TaxonomyTerm[] }>(`${META}/genres`)
      return data.genres
    },
    staleTime: 1000 * 60 * 30,
  })
}

export function useMoods() {
  return useQuery({
    queryKey: taxonomyKeys.moods(),
    queryFn: async () => {
      const { data } = await api.get<{ moods: TaxonomyTerm[] }>(`${META}/moods`)
      return data.moods
    },
    staleTime: 1000 * 60 * 30,
  })
}

export function useInstruments() {
  return useQuery({
    queryKey: taxonomyKeys.instruments(),
    queryFn: async () => {
      const { data } = await api.get<{ instruments: TaxonomyTerm[] }>(`${META}/instruments`)
      return data.instruments
    },
    staleTime: 1000 * 60 * 30,
  })
}

export function useMusicalKeys() {
  return useQuery({
    queryKey: taxonomyKeys.keys(),
    queryFn: async () => {
      const { data } = await api.get<{ keys: TaxonomyTerm[] }>(`${META}/keys`)
      return data.keys
    },
    staleTime: 1000 * 60 * 30,
  })
}
