import type { MarketplaceTrack } from '@/components/shared/marketplace-track-card'

const COVERS = [
  'bg-rose-950',
  'bg-stone-900',
  'bg-zinc-800',
  'bg-neutral-900',
  'bg-stone-800',
  'bg-rose-900',
  'bg-zinc-900',
  'bg-neutral-800',
] as const

/** Instrument labels inferred from tags when a seed omits `instruments`. */
export const MARKETPLACE_INSTRUMENTS = [
  'Log drum',
  'Guitar',
  'Piano',
  'Vocal',
  'Brass',
  '808',
  'Pads',
  'Synth',
  'Strings',
  'Keys',
  'Percussion',
] as const

export type MarketplaceTrackDetail = MarketplaceTrack & {
  /** Up to 3 genres — `genre` stays the primary (first) for compact UIs. */
  genres: string[]
  plays: number
  key: string
  description: string
  /** ISO date — publish / upload day. */
  publishedAt: string
  durationSec: number
  tags: string[]
  instruments: string[]
}

/** Mock catalog used by charts, share links, and the track details page. */
type TrackSeed = Omit<
  MarketplaceTrackDetail,
  'publishedAt' | 'durationSec' | 'tags' | 'genres' | 'genre' | 'instruments'
> &
  Partial<
    Pick<
      MarketplaceTrackDetail,
      'publishedAt' | 'durationSec' | 'tags' | 'genres' | 'instruments'
    >
  > & {
    /** Primary genre, or full list when `genres` is omitted. */
    genre: string | string[]
  }

function instrumentsFromTags(tags: string[]) {
  const known = new Map(
    MARKETPLACE_INSTRUMENTS.map((name) => [name.toLowerCase(), name] as const),
  )
  const out: string[] = []
  for (const tag of tags) {
    const match = known.get(tag.toLowerCase())
    if (match && !out.includes(match)) out.push(match)
  }
  return out
}

const TRACK_SEEDS: TrackSeed[] = [
  {
    id: 'night-market',
    title: 'Night Market',
    producer: 'Jules',
    genre: ['Amapiano', 'Afro-fusion'],
    bpm: 114,
    priceLabel: '$35',
    cover: COVERS[0],
    plays: 184_200,
    key: 'B♭ min',
    description:
      'Log-drum bounce with warm pads and a late-night groove. Built for melodic toplines and club-ready drops.',
    publishedAt: '2026-07-10',
    durationSec: 198,
    tags: ['Amapiano', 'Log drum', 'Melodic', 'Jules Type'],
  },
  {
    id: 'glass-city',
    title: 'Glass City',
    producer: 'Dëwit',
    genre: ['Afrobeats', 'Alté'],
    bpm: 102,
    priceLabel: '$40',
    cover: COVERS[3],
    plays: 162_800,
    key: 'F♯ maj',
    description:
      'Shimmering guitar chops over a clean pocket. Bright, radio-ready energy with space for a strong hook.',
    publishedAt: '2026-06-22',
    durationSec: 204,
    tags: ['Afrobeats', 'Guitar', 'Radio', 'Wizkid Type'],
  },
  {
    id: 'iron-choir',
    title: 'Iron Choir',
    producer: 'Nao',
    genre: 'Drill',
    bpm: 150,
    priceLabel: '$30',
    cover: COVERS[5],
    plays: 149_400,
    key: 'C♯ min',
    description:
      'Sliding 808s and choir stabs cut for UK / NYC drill. Dark atmosphere with a hard snap on the snare.',
    publishedAt: '2026-08-01',
    durationSec: 172,
    tags: ['Drill', 'UK Drill', 'Dark', 'Central Cee Type'],
  },
  {
    id: 'half-light',
    title: 'Half Light',
    producer: 'Kelu',
    genre: 'Amapiano',
    bpm: 113,
    priceLabel: '$30',
    cover: COVERS[4],
    plays: 138_100,
    key: 'A min',
    description:
      'Soft piano motifs and airy percussion. Sunset energy that still moves the floor.',
    publishedAt: '2026-07-28',
    durationSec: 210,
    tags: ['Amapiano', 'Piano', 'Sunset'],
  },
  {
    id: 'after-service',
    title: 'After Service',
    producer: 'Amara',
    genre: 'R&B',
    bpm: 87,
    priceLabel: '$45',
    cover: COVERS[1],
    plays: 121_600,
    key: 'E♭ maj',
    description:
      'Velvet chords and a patient pocket for late-night vocals. Room for stacked harmonies and ad-libs.',
    publishedAt: '2026-05-14',
    durationSec: 226,
    tags: ['R&B', 'Slow', 'Vocal', 'SZA Type'],
  },
  {
    id: 'blue-hour',
    title: 'Blue Hour',
    producer: 'Jules',
    genre: 'Alté',
    bpm: 90,
    priceLabel: '$40',
    cover: COVERS[1],
    plays: 118_900,
    key: 'D min',
    description:
      'Hazy textures and off-kilter drums. Experimental but catchy — made for left-field pop and alté.',
    publishedAt: '2026-08-18',
    durationSec: 188,
    tags: ['Alté', 'Experimental', 'Hazy'],
  },
  {
    id: 'harmattan',
    title: 'Harmattan',
    producer: 'Selasi',
    genre: ['Afro-fusion', 'Afrobeats', 'R&B'],
    bpm: 96,
    priceLabel: '$35',
    cover: COVERS[4],
    plays: 109_300,
    key: 'G maj',
    description:
      'Dusty percussion and open chords with a warm low end. Crosses Afrobeats and contemporary R&B.',
    publishedAt: '2026-04-03',
    durationSec: 201,
    tags: ['Afro-fusion', 'Warm', 'Live feel'],
  },
  {
    id: 'quiet-riot',
    title: 'Quiet Riot',
    producer: 'Nao',
    genre: 'Drill',
    bpm: 144,
    priceLabel: '$25',
    cover: COVERS[2],
    plays: 97_800,
    key: 'F min',
    description:
      'Minimal drill with a tense melody loop. Perfect for hard verses and sparse arrangements.',
    publishedAt: '2026-09-02',
    durationSec: 165,
    tags: ['Drill', 'Minimal', 'Hard'],
  },
  {
    id: 'static-bloom',
    title: 'Static Bloom',
    producer: 'Kelu',
    genre: 'Gqom',
    bpm: 132,
    priceLabel: '$20',
    cover: COVERS[2],
    plays: 91_200,
    key: 'B min',
    description:
      'Broken kicks and blooming synths. High-energy Gqom with a modern sheen.',
    publishedAt: '2026-06-09',
    durationSec: 178,
    tags: ['Gqom', 'Club', 'Energy'],
  },
  {
    id: 'palm-wine',
    title: 'Palm Wine',
    producer: 'Koko',
    genre: 'Afrobeats',
    bpm: 105,
    priceLabel: '$30',
    cover: COVERS[0],
    plays: 86_500,
    key: 'C maj',
    description:
      'Sunny guitar riffs and a bounce that stays light. Easy topline canvas for summer singles.',
    publishedAt: '2026-07-01',
    durationSec: 192,
    tags: ['Afrobeats', 'Summer', 'Guitar'],
  },
  {
    id: 'concrete-garden',
    title: 'Concrete Garden',
    producer: 'Riven',
    genre: 'Gqom',
    bpm: 128,
    priceLabel: '$85',
    cover: COVERS[7],
    plays: 79_400,
    key: 'A♭ min',
    description:
      'Industrial textures meet melodic Gqom. Exclusive-ready production with dense sound design.',
    publishedAt: '2026-03-21',
    durationSec: 215,
    tags: ['Gqom', 'Industrial', 'Exclusive'],
  },
  {
    id: 'soft-landing',
    title: 'Soft Landing',
    producer: 'Amara',
    genre: 'R&B',
    bpm: 78,
    priceLabel: '$50',
    cover: COVERS[1],
    plays: 74_100,
    key: 'F maj',
    description:
      'Slow, intimate R&B with glassy keys. Built for vulnerable vocals and quiet climaxes.',
    publishedAt: '2026-08-30',
    durationSec: 234,
    tags: ['R&B', 'Intimate', 'Ballad'],
  },
  {
    id: 'red-dust',
    title: 'Red Dust',
    producer: 'Selasi',
    genre: 'Afro-fusion',
    bpm: 98,
    priceLabel: '$25',
    cover: COVERS[6],
    plays: 68_900,
    key: 'E min',
    description:
      'Earthy drums and a hypnotic bass figure. Mid-tempo fusion with live-band feel.',
    publishedAt: '2026-05-27',
    durationSec: 186,
    tags: ['Afro-fusion', 'Earthy', 'Mid-tempo'],
  },
  {
    id: 'sunday-drive',
    title: 'Sunday Drive',
    producer: 'Koko',
    genre: 'Afrobeats',
    bpm: 100,
    priceLabel: '$30',
    cover: COVERS[1],
    plays: 63_200,
    key: 'D maj',
    description:
      'Cruise-control Afrobeats with soft brass accents. Feel-good energy without forcing the drop.',
    publishedAt: '2026-09-11',
    durationSec: 195,
    tags: ['Afrobeats', 'Feel-good', 'Brass'],
  },
  {
    id: 'low-light',
    title: 'Low Light',
    producer: 'Riven',
    genre: 'Alté',
    bpm: 108,
    priceLabel: '$30',
    cover: COVERS[3],
    plays: 58_700,
    key: 'G♯ min',
    description:
      'Moody alté with clipped drums and neon pads. Ideal for atmospheric hooks.',
    publishedAt: '2026-09-20',
    durationSec: 181,
    tags: ['Alté', 'Moody', 'Atmospheric'],
  },
  // Extra catalog depth so “More from {producer}” has a full scroller.
  {
    id: 'midnight-toll',
    title: 'Midnight Toll',
    producer: 'Jules',
    genre: 'Amapiano',
    bpm: 112,
    priceLabel: '$35',
    cover: COVERS[5],
    plays: 54_200,
    key: 'C min',
    description: 'Late-hour log drums with a tolling bell motif and warm bass.',
  },
  {
    id: 'silk-route',
    title: 'Silk Route',
    producer: 'Jules',
    genre: 'Alté',
    bpm: 94,
    priceLabel: '$40',
    cover: COVERS[2],
    plays: 49_800,
    key: 'E min',
    description: 'Soft percussion and silk pads for left-field vocal writing.',
  },
  {
    id: 'ember-lane',
    title: 'Ember Lane',
    producer: 'Jules',
    genre: 'Amapiano',
    bpm: 115,
    priceLabel: '$30',
    cover: COVERS[6],
    plays: 45_100,
    key: 'F♯ min',
    description: 'Glowing keys over a patient pocket — sunset drive energy.',
  },
  {
    id: 'foghorn',
    title: 'Foghorn',
    producer: 'Jules',
    genre: 'Alté',
    bpm: 88,
    priceLabel: '$45',
    cover: COVERS[0],
    plays: 41_600,
    key: 'A maj',
    description: 'Wide stereo drones and a sticky mid-tempo groove.',
  },
  {
    id: 'chrome-tide',
    title: 'Chrome Tide',
    producer: 'Dëwit',
    genre: 'Afrobeats',
    bpm: 104,
    priceLabel: '$40',
    cover: COVERS[4],
    plays: 52_400,
    key: 'G maj',
    description: 'Polished guitar and bright drums ready for radio hooks.',
  },
  {
    id: 'golden-hour-loop',
    title: 'Golden Hour Loop',
    producer: 'Dëwit',
    genre: 'Afrobeats',
    bpm: 100,
    priceLabel: '$35',
    cover: COVERS[1],
    plays: 47_900,
    key: 'D maj',
    description: 'Feel-good bounce with soft brass and open space for vocals.',
  },
  {
    id: 'mirror-bay',
    title: 'Mirror Bay',
    producer: 'Dëwit',
    genre: 'Afrobeats',
    bpm: 108,
    priceLabel: '$45',
    cover: COVERS[7],
    plays: 43_300,
    key: 'B♭ maj',
    description: 'Shimmering chops and a clean pocket for melodic toasters.',
  },
  {
    id: 'coastline',
    title: 'Coastline',
    producer: 'Dëwit',
    genre: 'Afrobeats',
    bpm: 102,
    priceLabel: '$30',
    cover: COVERS[3],
    plays: 39_700,
    key: 'C maj',
    description: 'Light percussion and sunny harmony for summer singles.',
  },
  {
    id: 'vault-door',
    title: 'Vault Door',
    producer: 'Nao',
    genre: 'Drill',
    bpm: 142,
    priceLabel: '$30',
    cover: COVERS[5],
    plays: 51_200,
    key: 'D♯ min',
    description: 'Heavy 808s and a locked melody loop for hard verses.',
  },
  {
    id: 'cold-signal',
    title: 'Cold Signal',
    producer: 'Nao',
    genre: 'Drill',
    bpm: 148,
    priceLabel: '$25',
    cover: COVERS[2],
    plays: 46_500,
    key: 'G min',
    description: 'Sparse drill with icy pads and a snapping snare.',
  },
  {
    id: 'blackout-run',
    title: 'Blackout Run',
    producer: 'Nao',
    genre: 'Drill',
    bpm: 146,
    priceLabel: '$35',
    cover: COVERS[6],
    plays: 42_800,
    key: 'A min',
    description: 'Dark atmosphere and sliding bass built for NYC / UK energy.',
  },
  {
    id: 'wire-frame',
    title: 'Wire Frame',
    producer: 'Nao',
    genre: 'Drill',
    bpm: 140,
    priceLabel: '$28',
    cover: COVERS[0],
    plays: 38_400,
    key: 'E♭ min',
    description: 'Minimal structure with a tense lead — leave room to spit.',
  },
  {
    id: 'dusk-piano',
    title: 'Dusk Piano',
    producer: 'Kelu',
    genre: 'Amapiano',
    bpm: 113,
    priceLabel: '$30',
    cover: COVERS[4],
    plays: 50_100,
    key: 'B♭ min',
    description: 'Soft piano motifs over a rolling log-drum bed.',
  },
  {
    id: 'petal-kick',
    title: 'Petal Kick',
    producer: 'Kelu',
    genre: 'Gqom',
    bpm: 130,
    priceLabel: '$22',
    cover: COVERS[7],
    plays: 44_600,
    key: 'F min',
    description: 'Broken kicks with blooming synth stabs — dancefloor ready.',
  },
  {
    id: 'river-glass',
    title: 'River Glass',
    producer: 'Kelu',
    genre: 'Amapiano',
    bpm: 111,
    priceLabel: '$35',
    cover: COVERS[1],
    plays: 40_900,
    key: 'D min',
    description: 'Clear pads and a gentle pocket for melodic writing.',
  },
  {
    id: 'amber-grid',
    title: 'Amber Grid',
    producer: 'Kelu',
    genre: 'Gqom',
    bpm: 134,
    priceLabel: '$25',
    cover: COVERS[3],
    plays: 36_200,
    key: 'C♯ min',
    description: 'Tight grid drums with amber synth color.',
  },
  {
    id: 'velvet-room',
    title: 'Velvet Room',
    producer: 'Amara',
    genre: 'R&B',
    bpm: 82,
    priceLabel: '$45',
    cover: COVERS[5],
    plays: 48_700,
    key: 'A♭ maj',
    description: 'Intimate chords and a patient pocket for stacked vocals.',
  },
  {
    id: 'afterglow-keys',
    title: 'Afterglow Keys',
    producer: 'Amara',
    genre: 'R&B',
    bpm: 90,
    priceLabel: '$40',
    cover: COVERS[2],
    plays: 43_100,
    key: 'E maj',
    description: 'Glassy keys and soft drums for late-night confessions.',
  },
  {
    id: 'quiet-crowd',
    title: 'Quiet Crowd',
    producer: 'Amara',
    genre: 'R&B',
    bpm: 74,
    priceLabel: '$50',
    cover: COVERS[6],
    plays: 39_500,
    key: 'G maj',
    description: 'Ballad pace with room for vulnerable toplines.',
  },
  {
    id: 'moonlit-bass',
    title: 'Moonlit Bass',
    producer: 'Amara',
    genre: 'R&B',
    bpm: 85,
    priceLabel: '$42',
    cover: COVERS[0],
    plays: 35_800,
    key: 'C min',
    description: 'Warm bass and sparse percussion under moonlit chords.',
  },
  {
    id: 'sahel-breeze',
    title: 'Sahel Breeze',
    producer: 'Selasi',
    genre: 'Afro-fusion',
    bpm: 97,
    priceLabel: '$32',
    cover: COVERS[4],
    plays: 47_200,
    key: 'F maj',
    description: 'Live-feel percussion with open chords and warm air.',
  },
  {
    id: 'kente-loop',
    title: 'Kente Loop',
    producer: 'Selasi',
    genre: 'Afro-fusion',
    bpm: 101,
    priceLabel: '$28',
    cover: COVERS[7],
    plays: 42_000,
    key: 'A min',
    description: 'Patterned drums and a hypnotic mid-tempo figure.',
  },
  {
    id: 'dust-chorus',
    title: 'Dust Chorus',
    producer: 'Selasi',
    genre: 'Afro-fusion',
    bpm: 94,
    priceLabel: '$35',
    cover: COVERS[1],
    plays: 37_600,
    key: 'D maj',
    description: 'Earthy layers with a chorus-ready harmonic bed.',
  },
  {
    id: 'nomad-swing',
    title: 'Nomad Swing',
    producer: 'Selasi',
    genre: 'Afro-fusion',
    bpm: 99,
    priceLabel: '$30',
    cover: COVERS[3],
    plays: 33_900,
    key: 'E min',
    description: 'Swinging pocket with fusion colors for melodic writers.',
  },
  {
    id: 'mango-radio',
    title: 'Mango Radio',
    producer: 'Koko',
    genre: 'Afrobeats',
    bpm: 103,
    priceLabel: '$30',
    cover: COVERS[0],
    plays: 46_800,
    key: 'F♯ maj',
    description: 'Bright Afrobeats with sticky guitar and easy bounce.',
  },
  {
    id: 'lagoon-party',
    title: 'Lagoon Party',
    producer: 'Koko',
    genre: 'Afrobeats',
    bpm: 107,
    priceLabel: '$28',
    cover: COVERS[5],
    plays: 41_400,
    key: 'C maj',
    description: 'Party-ready drums without overcrowding the vocal lane.',
  },
  {
    id: 'soft-brass',
    title: 'Soft Brass',
    producer: 'Koko',
    genre: 'Afrobeats',
    bpm: 98,
    priceLabel: '$35',
    cover: COVERS[2],
    plays: 36_900,
    key: 'B♭ maj',
    description: 'Gentle brass accents over a cruise-control groove.',
  },
  {
    id: 'island-grid',
    title: 'Island Grid',
    producer: 'Koko',
    genre: 'Afrobeats',
    bpm: 106,
    priceLabel: '$32',
    cover: COVERS[6],
    plays: 32_500,
    key: 'G maj',
    description: 'Tight grid and sunny chops for summer singles.',
  },
  {
    id: 'neon-rubble',
    title: 'Neon Rubble',
    producer: 'Riven',
    genre: 'Gqom',
    bpm: 126,
    priceLabel: '$70',
    cover: COVERS[7],
    plays: 45_600,
    key: 'B min',
    description: 'Industrial Gqom with neon stabs and dense design.',
  },
  {
    id: 'signal-rain',
    title: 'Signal Rain',
    producer: 'Riven',
    genre: 'Alté',
    bpm: 110,
    priceLabel: '$35',
    cover: COVERS[3],
    plays: 40_200,
    key: 'F♯ min',
    description: 'Clipped drums and rainy pads for atmospheric hooks.',
  },
  {
    id: 'foundry',
    title: 'Foundry',
    producer: 'Riven',
    genre: 'Gqom',
    bpm: 129,
    priceLabel: '$60',
    cover: COVERS[5],
    plays: 35_400,
    key: 'D min',
    description: 'Metallic textures and a hard kick for exclusive energy.',
  },
  {
    id: 'after-image',
    title: 'After Image',
    producer: 'Riven',
    genre: 'Alté',
    bpm: 104,
    priceLabel: '$32',
    cover: COVERS[1],
    plays: 31_100,
    key: 'A min',
    description: 'Moody alté with ghosted vocals space and neon pads.',
  },
]

function hydrateTrack(seed: TrackSeed): MarketplaceTrackDetail {
  const genres = (
    seed.genres ?? (Array.isArray(seed.genre) ? seed.genre : [seed.genre])
  )
    .map((g) => g.trim())
    .filter(Boolean)
    .slice(0, 3)
  const primary = genres[0] ?? 'Other'
  const tags = seed.tags ?? [...genres, `${seed.bpm} BPM`, seed.key]
  const instruments =
    seed.instruments?.map((item) => item.trim()).filter(Boolean) ??
    instrumentsFromTags(tags)

  return {
    ...seed,
    genre: primary,
    genres: genres.length > 0 ? genres : [primary],
    publishedAt: seed.publishedAt ?? '2026-08-01',
    durationSec: seed.durationSec ?? 180,
    tags,
    instruments,
  }
}

export const MARKETPLACE_TRACKS: MarketplaceTrackDetail[] = TRACK_SEEDS.map(hydrateTrack)

export function getMarketplaceTrack(id: string) {
  return MARKETPLACE_TRACKS.find((track) => track.id === id) ?? null
}

export function getTracksByProducer(
  producer: string,
  excludeId?: string,
  limit = 12,
) {
  const rows = MARKETPLACE_TRACKS.filter(
    (track) => track.producer === producer && track.id !== excludeId,
  )
  return rows.slice(0, limit)
}

function sharesGenre(a: MarketplaceTrackDetail, b: MarketplaceTrackDetail) {
  return a.genres.some((genre) => b.genres.includes(genre))
}

/** Shared-genre first, then the rest of the catalog — excludes the producer’s other tracks. */
export function getRelatedTracks(track: MarketplaceTrackDetail, limit = 12) {
  const fromGenre = MARKETPLACE_TRACKS.filter(
    (row) =>
      row.id !== track.id &&
      row.producer !== track.producer &&
      sharesGenre(row, track),
  )
  const rest = MARKETPLACE_TRACKS.filter(
    (row) =>
      row.id !== track.id &&
      row.producer !== track.producer &&
      !sharesGenre(row, track),
  )

  const seen = new Set<string>()
  const out: MarketplaceTrackDetail[] = []
  for (const row of [...fromGenre, ...rest]) {
    if (seen.has(row.id)) continue
    seen.add(row.id)
    out.push(row)
    if (out.length >= limit) break
  }
  return out
}

export function formatDuration(totalSec: number) {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatPublishedDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function marketplaceTrackPath(id: string) {
  return `/marketplace/tracks/${id}`
}

export function formatPlayCount(value: number) {
  if (value >= 1_000_000) {
    const n = value / 1_000_000
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}M`
  }
  if (value >= 1_000) {
    const n = value / 1_000
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}K`
  }
  return value.toLocaleString('en-US')
}
