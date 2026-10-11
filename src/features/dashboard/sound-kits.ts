export type SoundKitStatus = 'Live' | 'Draft'

export type SoundKitType =
  | 'Drum kit'
  | 'Loop kit'
  | 'Melody kit'
  | 'Construction kit'
  | 'One-shots'
  | 'MIDI kit'

export type SoundKit = {
  id: string
  title: string
  type: SoundKitType
  sounds: number
  status: SoundKitStatus
  plays: number
  sales: number
  fromPrice: string
  licenses: number
  year: string
  updated: string
  image: string
  about: string
  tags?: string[]
  genre?: string[]
  visibility?: 'Private' | 'Public' | 'Unlisted'
}

export const kitTypes: SoundKitType[] = [
  'Drum kit',
  'Loop kit',
  'Melody kit',
  'Construction kit',
  'One-shots',
  'MIDI kit',
]

export const soundKits: SoundKit[] = [
  {
    id: 'log-room-drums',
    title: 'Log Room Drums',
    type: 'Drum kit',
    sounds: 64,
    status: 'Live',
    plays: 9200,
    sales: 38,
    fromPrice: '$29',
    licenses: 2,
    year: '2026',
    updated: '2d ago',
    image: '/assets/avatar-1.jpg',
    about: 'Dry kicks, snappy claps, and log-friendly hats. Built for punch-in drums.',
    tags: ['drums', 'log drum', 'one-shots'],
    genre: ['Amapiano', 'Log Drum'],
    visibility: 'Public',
  },
  {
    id: 'night-bus-loops',
    title: 'Night Bus Loops',
    type: 'Loop kit',
    sounds: 42,
    status: 'Live',
    plays: 7100,
    sales: 21,
    fromPrice: '$35',
    licenses: 2,
    year: '2026',
    updated: '5d ago',
    image: '/assets/avatar-2.jpg',
    about: 'Late keys and soft percussion loops. Drop them under a verse and leave space.',
    tags: ['loops', 'keys', 'night'],
    genre: ['R&B', 'Afro-fusion'],
    visibility: 'Public',
  },
  {
    id: 'harmattan-melodies',
    title: 'Harmattan Melodies',
    type: 'Melody kit',
    sounds: 28,
    status: 'Live',
    plays: 5400,
    sales: 17,
    fromPrice: '$40',
    licenses: 2,
    year: '2025',
    updated: '1w ago',
    image: '/assets/avatar-3.jpg',
    about: 'Dusty pads and climbing plucks. Key-labeled phrases for hooks and bridges.',
    tags: ['melody', 'pads', 'plucks'],
    genre: ['Afro-fusion'],
    visibility: 'Public',
  },
  {
    id: 'glass-city-kit',
    title: 'Glass City Kit',
    type: 'Construction kit',
    sounds: 86,
    status: 'Live',
    plays: 12100,
    sales: 44,
    fromPrice: '$49',
    licenses: 2,
    year: '2026',
    updated: '1d ago',
    image: '/assets/caught-in-joy-ptVBlniJi50-unsplash.jpg',
    about: 'Full construction folders with drums, bass, and MIDI. Finish a sketch in one drop.',
    tags: ['construction', 'midi', 'bass'],
    genre: ['Amapiano'],
    visibility: 'Public',
  },
  {
    id: 'soft-wiring-ones',
    title: 'Soft Wiring Ones',
    type: 'One-shots',
    sounds: 120,
    status: 'Draft',
    plays: 0,
    sales: 0,
    fromPrice: '$25',
    licenses: 1,
    year: '2026',
    updated: '4d ago',
    image: '/assets/avatar-1.jpg',
    about: 'Clean one-shots waiting on artwork before they go live.',
    tags: ['one-shots', 'fx'],
    genre: ['R&B'],
    visibility: 'Private',
  },
  {
    id: 'red-dust-midi',
    title: 'Red Dust MIDI',
    type: 'MIDI kit',
    sounds: 36,
    status: 'Live',
    plays: 3100,
    sales: 9,
    fromPrice: '$19',
    licenses: 1,
    year: '2025',
    updated: '3w ago',
    image: '/assets/avatar-2.jpg',
    about: 'MIDI progressions and drum patterns. Swap your own sounds in and rewrite fast.',
    tags: ['midi', 'chords'],
    genre: ['Afrobeats'],
    visibility: 'Public',
  },
]
