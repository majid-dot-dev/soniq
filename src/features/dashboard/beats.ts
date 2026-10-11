export type BeatStatus = 'Live' | 'Draft' | 'Sold'

export type Beat = {
  id: string
  slug: string
  title: string
  bpm: number
  key: string
  genre: string[]
  mood: string[]
  status: BeatStatus
  plays: number
  sales: number
  fromPrice: string
  licenses: number
  duration: string
  year: string
  updated: string
  image: string
  /** Presigned tagged-audio URL for catalog / marketplace playback */
  previewUrl?: string | null
  about: string
  tags?: string[]
  trackType?: string
  instruments?: string[]
  visibility?: 'Private' | 'Public' | 'Unlisted'
  releaseDate?: string
}

export const beats: Beat[] = [
  {
    id: 'half-light',
    slug: 'half-light',
    title: 'Half Light',
    bpm: 96,
    key: 'F#m',
    genre: ['Amapiano'],
    mood: ['Warm'],
    status: 'Live',
    plays: 24080,
    sales: 22,
    fromPrice: '$60',
    licenses: 3,
    duration: '03:12',
    year: '2026',
    updated: '3d ago',
    image: '/assets/avatar-1.jpg',
    about: 'Soft keys and a patient log line. Built for late-night features.',
  },
  {
    id: 'quiet-riot',
    slug: 'quiet-riot',
    title: 'Quiet Riot',
    bpm: 172,
    key: 'Gm',
    genre: ['Log Drum'],
    mood: ['Dark'],
    status: 'Live',
    plays: 18420,
    sales: 14,
    fromPrice: '$50',
    licenses: 3,
    duration: '02:48',
    year: '2026',
    updated: '2h ago',
    image: '/assets/avatar-2.jpg',
    about: 'Hard hats over a dry drum kit. Made for punch-in verses.',
  },
  {
    id: 'harmattan',
    slug: 'harmattan',
    title: 'Harmattan',
    bpm: 102,
    key: 'Dm',
    genre: ['Afro-fusion'],
    mood: ['Dusty'],
    status: 'Live',
    plays: 15290,
    sales: 11,
    fromPrice: '$75',
    licenses: 3,
    duration: '03:41',
    year: '2025',
    updated: '1w ago',
    image: '/assets/avatar-3.jpg',
    about: 'Dusty pads and a slow climb. Works for hooks and bridges.',
  },
  {
    id: 'glass-city',
    slug: 'glass-city',
    title: 'Glass City',
    bpm: 140,
    key: 'Cmaj',
    genre: ['Afrobeats'],
    mood: ['Bright'],
    status: 'Sold',
    plays: 9210,
    sales: 1,
    fromPrice: '$850',
    licenses: 1,
    duration: '02:55',
    year: '2025',
    updated: '1d ago',
    image: '/assets/caught-in-joy-ptVBlniJi50-unsplash.jpg',
    about: 'Bright guitars sold exclusive. One buyer owns the master.',
  },
  {
    id: 'static-bloom',
    slug: 'static-bloom',
    title: 'Static Bloom',
    bpm: 118,
    key: 'Am',
    genre: ['Afro-fusion'],
    mood: ['Soft'],
    status: 'Live',
    plays: 6340,
    sales: 7,
    fromPrice: '$55',
    licenses: 2,
    duration: '03:04',
    year: '2026',
    updated: '5d ago',
    image: '/assets/avatar-1.jpg',
    about: 'A soft bloom under a steady kick. Easy to write on.',
  },
  {
    id: 'red-dust',
    slug: 'red-dust',
    title: 'Red Dust',
    bpm: 128,
    key: 'Em',
    genre: ['Afrobeats'],
    mood: ['Drive'],
    status: 'Live',
    plays: 4102,
    sales: 3,
    fromPrice: '$40',
    licenses: 2,
    duration: '02:37',
    year: '2026',
    updated: '2w ago',
    image: '/assets/avatar-2.jpg',
    about: 'Driving percussion with space left for a topline.',
  },
  {
    id: 'night-market',
    slug: 'night-market',
    title: 'Night Market',
    bpm: 104,
    key: 'Dm',
    genre: ['Amapiano'],
    mood: ['Late'],
    status: 'Draft',
    plays: 0,
    sales: 0,
    fromPrice: '$45',
    licenses: 0,
    duration: '03:20',
    year: '2026',
    updated: '6d ago',
    image: '/assets/avatar-3.jpg',
    about: 'Still a draft. Piano line is locked. Drums need a pass.',
  },
  {
    id: 'soft-wiring',
    slug: 'soft-wiring',
    title: 'Soft Wiring',
    bpm: 88,
    key: 'Bbm',
    genre: ['R&B'],
    mood: ['Night'],
    status: 'Draft',
    plays: 0,
    sales: 0,
    fromPrice: '$65',
    licenses: 0,
    duration: '02:51',
    year: '2026',
    updated: '3w ago',
    image: '/assets/caught-in-joy-ptVBlniJi50-unsplash.jpg',
    about: 'Night R&B sketch. Waiting on stems before it goes live.',
  },
]

export function formatCount(value: number) {
  return value.toLocaleString('en-US')
}

export function formatCompact(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`
  return String(value)
}
