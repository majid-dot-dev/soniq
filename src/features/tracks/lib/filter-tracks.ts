import type { Beat } from '@/features/dashboard/beats'

export const QUICK_TAGS = ['amapiano', 'afrobeats', 'log drum', 'r&b', 'dark', 'warm', 'drive'] as const

export const FILTER_MENUS = [
  { id: 'status', label: 'Status', options: ['All', 'Live', 'Draft', 'Sold'] },
  { id: 'genre', label: 'Genre', options: ['All', 'Amapiano', 'Afrobeats', 'Afro-fusion', 'Log Drum', 'R&B'] },
  { id: 'mood', label: 'Mood', options: ['All', 'Warm', 'Dark', 'Bright', 'Soft', 'Late', 'Drive', 'Dusty', 'Night'] },
  { id: 'bpm', label: 'BPM', options: ['All', 'Under 100', '100–130', '130+'] },
  { id: 'key', label: 'Key', options: ['All', 'Am', 'Dm', 'Em', 'Gm', 'F#m', 'Bbm', 'Cmaj'] },
  { id: 'price', label: 'Price', options: ['All', 'Under $50', '$50–$75', '$75+'] },
] as const

export type FilterId = (typeof FILTER_MENUS)[number]['id']
export type TrackFilters = Record<FilterId, string>
export type TracksViewMode = 'list' | 'grid'

export const DEFAULT_TRACK_FILTERS: TrackFilters = {
  status: 'All',
  genre: 'All',
  mood: 'All',
  bpm: 'All',
  key: 'All',
  price: 'All',
}

function matchesBpm(track: Beat, filter: string) {
  if (filter === 'All') return true
  if (filter === 'Under 100') return track.bpm < 100
  if (filter === '100–130') return track.bpm >= 100 && track.bpm <= 130
  return track.bpm > 130
}

function matchesPrice(track: Beat, filter: string) {
  if (filter === 'All') return true
  const amount = Number.parseInt(track.fromPrice.replace(/[^\d]/g, ''), 10)
  if (filter === 'Under $50') return amount < 50
  if (filter === '$50–$75') return amount >= 50 && amount <= 75
  return amount > 75
}

export function filterTracks(
  tracks: Beat[],
  {
    query,
    activeTag,
    filters,
  }: {
    query: string
    activeTag: string | null
    filters: TrackFilters
  },
) {
  const needle = query.trim().toLowerCase()

  return tracks.filter((track) => {
    if (filters.status !== 'All' && track.status !== filters.status) return false
    if (filters.genre !== 'All' && !track.genre.includes(filters.genre)) return false
    if (filters.mood !== 'All' && !track.mood.includes(filters.mood)) return false
    if (filters.key !== 'All' && track.key !== filters.key) return false
    if (!matchesBpm(track, filters.bpm)) return false
    if (!matchesPrice(track, filters.price)) return false

    if (activeTag) {
      const tag = activeTag.toLowerCase()
      const haystack =
        `${track.title} ${track.genre.join(' ')} ${track.mood.join(' ')} ${(track.tags ?? []).join(' ')}`.toLowerCase()
      if (!haystack.includes(tag)) return false
    }

    if (!needle) return true
    return [track.title, ...track.genre, ...track.mood, track.key, track.status, ...(track.tags ?? [])].some((value) =>
      value.toLowerCase().includes(needle),
    )
  })
}
