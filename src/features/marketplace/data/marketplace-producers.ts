import {
  formatPlayCount,
  getTracksByProducer,
  MARKETPLACE_TRACKS,
} from '@/features/marketplace/data/marketplace-tracks'

export type MarketplaceProducer = {
  slug: string
  name: string
  username: string
  bio: string
  genres: string[]
  location: string
  joinedAt: string
  verified: boolean
  avatar: string
  cover: string
  followers: number
}

const PRODUCER_SEEDS: MarketplaceProducer[] = [
  {
    slug: 'jules',
    name: 'Jules',
    username: 'jules',
    bio: 'Amapiano and alté nights. Building melodic pockets for toplines that stay with you.',
    genres: ['Amapiano', 'Alté'],
    location: 'Lagos, NG',
    joinedAt: '2024-03-12',
    verified: true,
    avatar: '/assets/avatar-3.jpg',
    cover: 'bg-neutral-900',
    followers: 12_400,
  },
  {
    slug: 'dewit',
    name: 'Dëwit',
    username: 'dewit',
    bio: 'Radio-ready Afrobeats with bright guitars and clean space for hooks.',
    genres: ['Afrobeats', 'Alté'],
    location: 'Accra, GH',
    joinedAt: '2023-11-02',
    verified: true,
    avatar: '/assets/avatar-1.jpg',
    cover: 'bg-rose-950',
    followers: 8_920,
  },
  {
    slug: 'nao',
    name: 'Nao',
    username: 'nao',
    bio: 'UK / NYC drill energy. Sliding 808s, tense loops, and room to spit.',
    genres: ['Drill'],
    location: 'London, UK',
    joinedAt: '2024-01-18',
    verified: true,
    avatar: '/assets/avatar-2.jpg',
    cover: 'bg-zinc-800',
    followers: 21_300,
  },
  {
    slug: 'kelu',
    name: 'Kelu',
    username: 'kelu',
    bio: 'Sunset Amapiano and club Gqom. Soft motifs that still move the floor.',
    genres: ['Amapiano', 'Gqom'],
    location: 'Johannesburg, ZA',
    joinedAt: '2023-08-09',
    verified: false,
    avatar: '/assets/avatar-1.jpg',
    cover: 'bg-stone-800',
    followers: 6_540,
  },
  {
    slug: 'amara',
    name: 'Amara',
    username: 'amara',
    bio: 'Late-night R&B. Velvet chords and patient pockets for stacked vocals.',
    genres: ['R&B'],
    location: 'Atlanta, US',
    joinedAt: '2024-05-21',
    verified: true,
    avatar: '/assets/avatar-3.jpg',
    cover: 'bg-rose-900',
    followers: 9_180,
  },
  {
    slug: 'selasi',
    name: 'Selasi',
    username: 'selasi',
    bio: 'Afro-fusion with live-band feel — dusty drums, warm bass, open chords.',
    genres: ['Afro-fusion', 'Afrobeats', 'R&B'],
    location: 'Kumasi, GH',
    joinedAt: '2023-06-14',
    verified: true,
    avatar: '/assets/avatar-2.jpg',
    cover: 'bg-neutral-800',
    followers: 5_760,
  },
  {
    slug: 'koko',
    name: 'Koko',
    username: 'koko',
    bio: 'Sunny Afrobeats for summer singles. Easy bounce, sticky guitar, soft brass.',
    genres: ['Afrobeats'],
    location: 'Abuja, NG',
    joinedAt: '2024-02-28',
    verified: false,
    avatar: '/assets/avatar-1.jpg',
    cover: 'bg-zinc-900',
    followers: 11_050,
  },
  {
    slug: 'riven',
    name: 'Riven',
    username: 'riven',
    bio: 'Industrial Gqom and moody alté. Dense design for exclusive-ready records.',
    genres: ['Gqom', 'Alté'],
    location: 'Berlin, DE',
    joinedAt: '2023-09-30',
    verified: true,
    avatar: '/assets/avatar-3.jpg',
    cover: 'bg-stone-900',
    followers: 7_430,
  },
]

export const MARKETPLACE_PRODUCERS = PRODUCER_SEEDS

export function getMarketplaceProducer(slug: string) {
  const key = slug.trim().toLowerCase()
  return MARKETPLACE_PRODUCERS.find((row) => row.slug === key) ?? null
}

export function getMarketplaceProducerByName(name: string) {
  const key = name.trim().toLowerCase()
  return (
    MARKETPLACE_PRODUCERS.find(
      (row) => row.name.toLowerCase() === key || row.username.toLowerCase() === key,
    ) ?? null
  )
}

export function marketplaceProducerPath(slugOrName: string) {
  const bySlug = getMarketplaceProducer(slugOrName)
  if (bySlug) return `/marketplace/producers/${bySlug.slug}`
  const byName = getMarketplaceProducerByName(slugOrName)
  if (byName) return `/marketplace/producers/${byName.slug}`
  return `/marketplace/producers/${encodeURIComponent(slugOrName.trim().toLowerCase())}`
}

export function getProducerTrackStats(name: string) {
  const tracks = getTracksByProducer(name, undefined, 200)
  const plays = tracks.reduce((sum, track) => sum + track.plays, 0)
  const catalogCount = MARKETPLACE_TRACKS.filter((track) => track.producer === name).length
  return {
    tracks: tracks.length || catalogCount,
    plays,
    playsLabel: formatPlayCount(plays),
  }
}

export function getProducerPopularTracks(name: string, limit = 8) {
  return [...getTracksByProducer(name, undefined, 200)]
    .sort((a, b) => b.plays - a.plays)
    .slice(0, limit)
}

export function getProducerNewTracks(name: string, limit = 8) {
  return [...getTracksByProducer(name, undefined, 200)]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit)
}

export type ProducerBundle = {
  id: string
  title: string
  subtitle: string
  priceLabel: string
  cover: string
  itemCount: number
}

const BUNDLE_COVERS = [
  'bg-rose-950',
  'bg-stone-900',
  'bg-zinc-800',
  'bg-neutral-900',
  'bg-rose-900',
  'bg-zinc-900',
] as const

const COLLECTION_SEEDS: Record<string, ProducerBundle[]> = {
  jules: [
    {
      id: 'jules-night-drive',
      title: 'Night Drive',
      subtitle: 'Amapiano for late sessions',
      priceLabel: '6 tracks',
      cover: BUNDLE_COVERS[0],
      itemCount: 6,
    },
    {
      id: 'jules-haze',
      title: 'Haze Tape',
      subtitle: 'Alté loops & pockets',
      priceLabel: '8 tracks',
      cover: BUNDLE_COVERS[1],
      itemCount: 8,
    },
    {
      id: 'jules-club',
      title: 'Club Ready',
      subtitle: 'Floor-first selections',
      priceLabel: '5 tracks',
      cover: BUNDLE_COVERS[2],
      itemCount: 5,
    },
  ],
  nao: [
    {
      id: 'nao-uk-drill',
      title: 'UK Drill Vault',
      subtitle: 'Hard slides & sparse loops',
      priceLabel: '10 tracks',
      cover: BUNDLE_COVERS[3],
      itemCount: 10,
    },
    {
      id: 'nao-nyc',
      title: 'NYC Pressure',
      subtitle: 'Dark atmosphere packs',
      priceLabel: '7 tracks',
      cover: BUNDLE_COVERS[4],
      itemCount: 7,
    },
  ],
  dewit: [
    {
      id: 'dewit-radio',
      title: 'Radio Ready',
      subtitle: 'Bright Afrobeats cuts',
      priceLabel: '6 tracks',
      cover: BUNDLE_COVERS[5],
      itemCount: 6,
    },
    {
      id: 'dewit-summer',
      title: 'Summer Singles',
      subtitle: 'Guitar-led bounce',
      priceLabel: '5 tracks',
      cover: BUNDLE_COVERS[0],
      itemCount: 5,
    },
  ],
}

const SOUND_PACK_SEEDS: Record<string, ProducerBundle[]> = {
  jules: [
    {
      id: 'jules-log-drum-kit',
      title: 'Log Drum Kit Vol. 1',
      subtitle: 'One-shots · MIDI · loops',
      priceLabel: '$29',
      cover: BUNDLE_COVERS[2],
      itemCount: 84,
    },
    {
      id: 'jules-pad-bank',
      title: 'Pad Bank',
      subtitle: 'Warm textures for toplines',
      priceLabel: '$19',
      cover: BUNDLE_COVERS[3],
      itemCount: 42,
    },
  ],
  nao: [
    {
      id: 'nao-808-lab',
      title: '808 Lab',
      subtitle: 'Slides · tails · mono bass',
      priceLabel: '$35',
      cover: BUNDLE_COVERS[1],
      itemCount: 60,
    },
    {
      id: 'nao-drill-drums',
      title: 'Drill Drum Kit',
      subtitle: 'Snares, hats, percussion',
      priceLabel: '$25',
      cover: BUNDLE_COVERS[4],
      itemCount: 120,
    },
  ],
  kelu: [
    {
      id: 'kelu-gqom-kit',
      title: 'Gqom Starter',
      subtitle: 'Broken kicks & synth hits',
      priceLabel: '$22',
      cover: BUNDLE_COVERS[5],
      itemCount: 96,
    },
  ],
  amara: [
    {
      id: 'amara-keys',
      title: 'Velvet Keys',
      subtitle: 'R&B chords & stabs',
      priceLabel: '$28',
      cover: BUNDLE_COVERS[0],
      itemCount: 54,
    },
  ],
}

function defaultBundles(producer: MarketplaceProducer, kind: 'collection' | 'pack'): ProducerBundle[] {
  const cover = producer.cover || BUNDLE_COVERS[0]
  if (kind === 'collection') {
    return [
      {
        id: `${producer.slug}-essentials`,
        title: `${producer.name} Essentials`,
        subtitle: 'Fan favorites in one place',
        priceLabel: '4 tracks',
        cover,
        itemCount: 4,
      },
      {
        id: `${producer.slug}-deep-cuts`,
        title: 'Deep Cuts',
        subtitle: 'Under-the-radar selections',
        priceLabel: '5 tracks',
        cover: BUNDLE_COVERS[1],
        itemCount: 5,
      },
    ]
  }
  return [
    {
      id: `${producer.slug}-starter-kit`,
      title: 'Starter Sound Pack',
      subtitle: 'Loops · one-shots · MIDI',
      priceLabel: '$24',
      cover: BUNDLE_COVERS[2],
      itemCount: 48,
    },
  ]
}

export function getProducerCollections(slug: string) {
  const producer = getMarketplaceProducer(slug)
  if (!producer) return []
  return COLLECTION_SEEDS[slug] ?? defaultBundles(producer, 'collection')
}

export function getProducerSoundPacks(slug: string) {
  const producer = getMarketplaceProducer(slug)
  if (!producer) return []
  return SOUND_PACK_SEEDS[slug] ?? defaultBundles(producer, 'pack')
}
