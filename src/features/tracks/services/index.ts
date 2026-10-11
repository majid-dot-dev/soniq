import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CreateTrackInput,
  Track,
  TrackAssetSlot,
  UpdateTrackInput,
} from '@/features/tracks/types'
import { api } from '@/lib/api/client'

const TRACKS = '/api/v1/tracks'

export const trackKeys = {
  all: ['tracks'] as const,
  list: () => [...trackKeys.all, 'list'] as const,
  detail: (id: string) => [...trackKeys.all, 'detail', id] as const,
}

export function useTracks(enabled = true) {
  return useQuery({
    queryKey: trackKeys.list(),
    queryFn: async () => {
      const { data } = await api.get<{ tracks: Track[] }>(TRACKS)
      return data.tracks
    },
    enabled,
  })
}

export function useTrack(trackId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: trackKeys.detail(trackId ?? ''),
    queryFn: async () => {
      const { data } = await api.get<{ track: Track }>(`${TRACKS}/${trackId}`)
      return data.track
    },
    enabled: Boolean(trackId) && enabled,
  })
}

export function useCreateTrack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateTrackInput) => {
      const { data } = await api.post<{ track: Track }>(TRACKS, input)
      return data.track
    },
    onSuccess: (track) => {
      queryClient.setQueryData(trackKeys.detail(track.id), track)
      void queryClient.invalidateQueries({ queryKey: trackKeys.list() })
    },
  })
}

export function useUpdateTrack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ trackId, ...input }: UpdateTrackInput & { trackId: string }) => {
      const { data } = await api.patch<{ track: Track }>(`${TRACKS}/${trackId}`, input)
      return data.track
    },
    onSuccess: (track) => {
      queryClient.setQueryData(trackKeys.detail(track.id), track)
      void queryClient.invalidateQueries({ queryKey: trackKeys.list() })
    },
  })
}

export function useAttachTrackAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      trackId: string
      slot: TrackAssetSlot
      key: string
      originalFilename?: string
      durationMs?: number
    }) => {
      const { trackId, ...body } = input
      const { data } = await api.patch<{ track: Track }>(`${TRACKS}/${trackId}/assets`, body)
      return data.track
    },
    onSuccess: (track) => {
      queryClient.setQueryData(trackKeys.detail(track.id), track)
      void queryClient.invalidateQueries({ queryKey: trackKeys.list() })
    },
  })
}

export function usePublishTrack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (trackId: string) => {
      const { data } = await api.post<{ track: Track }>(`${TRACKS}/${trackId}/publish`)
      return data.track
    },
    onSuccess: (track) => {
      queryClient.setQueryData(trackKeys.detail(track.id), track)
      void queryClient.invalidateQueries({ queryKey: trackKeys.list() })
    },
  })
}

export function useArchiveTrack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (trackId: string) => {
      const { data } = await api.post<{ track: Track }>(`${TRACKS}/${trackId}/archive`)
      return data.track
    },
    onSuccess: (track) => {
      queryClient.removeQueries({ queryKey: trackKeys.detail(track.id) })
      void queryClient.invalidateQueries({ queryKey: trackKeys.list() })
    },
  })
}

export function useDeleteTrack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (trackId: string) => {
      const { data } = await api.delete<{ track: Track }>(`${TRACKS}/${trackId}`)
      return data.track
    },
    onSuccess: (track) => {
      queryClient.removeQueries({ queryKey: trackKeys.detail(track.id) })
      void queryClient.invalidateQueries({ queryKey: trackKeys.list() })
    },
  })
}
