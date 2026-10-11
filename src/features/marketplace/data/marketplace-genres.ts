/**
 * Mirrors `GENRE_SEED` from `server/src/modules/taxonomy/seed-data.ts`.
 * Used as an offline fallback when `/api/v1/meta/genres` is unavailable.
 */
export type MarketplaceGenreTerm = {
  slug: string
  label: string
  aliases?: string[]
}

export const MARKETPLACE_GENRE_SEED: MarketplaceGenreTerm[] = [
  { slug: 'afrobeats', label: 'Afrobeats' },
  { slug: 'amapiano', label: 'Amapiano' },
  { slug: 'afro-house', label: 'Afro House' },
  { slug: 'afro-pop', label: 'Afro Pop', aliases: ['afropop'] },
  { slug: 'afro-drill', label: 'Afro Drill' },
  { slug: 'afroswing', label: 'Afroswing' },
  { slug: 'highlife', label: 'Highlife' },
  { slug: 'afro-soul', label: 'Afro Soul' },
  { slug: 'gospel', label: 'Gospel' },
  { slug: 'dancehall', label: 'Dancehall' },
  { slug: 'reggae', label: 'Reggae' },
  { slug: 'trap', label: 'Trap' },
  { slug: 'drill', label: 'Drill' },
  { slug: 'uk-drill', label: 'UK Drill' },
  { slug: 'hip-hop', label: 'Hip Hop', aliases: ['hiphop', 'rap'] },
  { slug: 'boom-bap', label: 'Boom Bap' },
  { slug: 'rnb', label: 'R&B', aliases: ['r&b', 'r and b'] },
  { slug: 'soul', label: 'Soul' },
  { slug: 'pop', label: 'Pop' },
  { slug: 'lo-fi', label: 'Lo-fi', aliases: ['lofi'] },
  { slug: 'house', label: 'House' },
  { slug: 'gqom', label: 'Gqom' },
  { slug: 'reggaeton', label: 'Reggaeton' },
  { slug: 'latin', label: 'Latin' },
  { slug: 'phonk', label: 'Phonk' },
  { slug: 'electronic', label: 'Electronic' },
  { slug: 'jazz', label: 'Jazz' },
  { slug: 'other', label: 'Other' },
]

export type MeshBlob = {
  at: string
  color: string
  falloff?: string
  shape?: 'circle' | 'ellipse'
}

export type GenreMesh = {
  base: string
  blobs: MeshBlob[]
}

/** Hand-tuned meshes for flagship genres. */
const MESH_OVERRIDES: Record<string, GenreMesh> = {
  amapiano: {
    base: '#2a1206',
    blobs: [
      { at: '12% 18%', color: 'oklch(86% 0.17 85 / 0.95)', falloff: '52%' },
      { at: '58% 32%', color: 'oklch(72% 0.2 55 / 0.9)', falloff: '58%', shape: 'ellipse' },
      { at: '78% 72%', color: 'oklch(48% 0.16 40 / 0.85)', falloff: '55%' },
      { at: '28% 88%', color: 'oklch(38% 0.12 35 / 0.75)', falloff: '48%' },
      { at: '92% 8%', color: 'oklch(70% 0.14 70 / 0.45)', falloff: '40%' },
    ],
  },
  afrobeats: {
    base: '#2c0e08',
    blobs: [
      { at: '22% 28%', color: 'oklch(78% 0.19 45 / 0.95)', falloff: '55%', shape: 'ellipse' },
      { at: '75% 22%', color: 'oklch(68% 0.21 35 / 0.85)', falloff: '50%' },
      { at: '48% 78%', color: 'oklch(42% 0.15 30 / 0.9)', falloff: '60%' },
      { at: '-5% 70%', color: 'oklch(55% 0.16 55 / 0.55)', falloff: '45%' },
      { at: '95% 55%', color: 'oklch(62% 0.18 25 / 0.5)', falloff: '42%' },
    ],
  },
  drill: {
    base: '#0c0c10',
    blobs: [
      { at: '25% 20%', color: 'oklch(55% 0.04 260 / 0.85)', falloff: '55%' },
      { at: '78% 38%', color: 'oklch(42% 0.03 280 / 0.8)', falloff: '58%', shape: 'ellipse' },
      { at: '48% 85%', color: 'oklch(28% 0.02 260 / 0.95)', falloff: '55%' },
      { at: '8% 75%', color: 'oklch(48% 0.05 20 / 0.35)', falloff: '42%' },
      { at: '92% 12%', color: 'oklch(62% 0.04 250 / 0.4)', falloff: '40%' },
    ],
  },
  gqom: {
    base: '#1c0608',
    blobs: [
      { at: '16% 24%', color: 'oklch(62% 0.24 25 / 0.9)', falloff: '50%' },
      { at: '70% 28%', color: 'oklch(48% 0.2 15 / 0.85)', falloff: '55%', shape: 'ellipse' },
      { at: '45% 80%', color: 'oklch(32% 0.14 10 / 0.95)', falloff: '58%' },
      { at: '95% 65%', color: 'oklch(55% 0.18 35 / 0.5)', falloff: '42%' },
      { at: '-5% 50%', color: 'oklch(40% 0.12 5 / 0.45)', falloff: '45%' },
    ],
  },
  rnb: {
    base: '#1a0614',
    blobs: [
      { at: '22% 20%', color: 'oklch(58% 0.18 350 / 0.9)', falloff: '55%' },
      { at: '72% 40%', color: 'oklch(68% 0.2 340 / 0.85)', falloff: '52%', shape: 'ellipse' },
      { at: '40% 85%', color: 'oklch(35% 0.12 345 / 0.9)', falloff: '58%' },
      { at: '95% 18%', color: 'oklch(72% 0.14 20 / 0.4)', falloff: '40%' },
      { at: '8% 70%', color: 'oklch(45% 0.14 300 / 0.45)', falloff: '45%' },
    ],
  },
  other: {
    base: '#121214',
    blobs: [
      { at: '30% 30%', color: 'oklch(42% 0.02 260 / 0.7)', falloff: '55%' },
      { at: '70% 60%', color: 'oklch(35% 0.015 280 / 0.65)', falloff: '58%', shape: 'ellipse' },
      { at: '50% 85%', color: 'oklch(28% 0.01 260 / 0.8)', falloff: '50%' },
    ],
  },
}

function hashSlug(slug: string) {
  let hash = 2166136261
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** Deterministic Apple Music–style mesh from slug (neighbouring OKLCH hues). */
export function meshForGenreSlug(slug: string): GenreMesh {
  const override = MESH_OVERRIDES[slug]
  if (override) return override

  const hash = hashSlug(slug)
  const hue = hash % 360
  const sat = 0.12 + ((hash >>> 8) % 10) / 100
  const layout = hash % 3

  const layouts: Array<{ at: string; falloff: string; shape?: 'ellipse' }[]> = [
    [
      { at: '16% 20%', falloff: '52%' },
      { at: '72% 32%', falloff: '56%', shape: 'ellipse' },
      { at: '48% 82%', falloff: '58%' },
      { at: '92% 70%', falloff: '42%' },
      { at: '-6% 62%', falloff: '44%' },
    ],
    [
      { at: '78% 18%', falloff: '50%' },
      { at: '24% 38%', falloff: '58%', shape: 'ellipse' },
      { at: '60% 78%', falloff: '55%' },
      { at: '8% 82%', falloff: '42%' },
      { at: '95% 48%', falloff: '40%' },
    ],
    [
      { at: '40% 16%', falloff: '48%', shape: 'ellipse' },
      { at: '12% 55%', falloff: '55%' },
      { at: '82% 42%', falloff: '52%' },
      { at: '55% 88%', falloff: '56%' },
      { at: '90% 85%', falloff: '40%' },
    ],
  ]

  const points = layouts[layout]!
  const hues = [
    hue,
    (hue + 18) % 360,
    (hue + 340) % 360,
    (hue + 28) % 360,
    (hue + 8) % 360,
  ]
  const light = [78, 62, 40, 55, 48]
  const alpha = [0.92, 0.85, 0.9, 0.5, 0.45]

  return {
    base: `oklch(14% ${Math.max(sat * 0.45, 0.03)} ${hue})`,
    blobs: points.map((point, index) => ({
      at: point.at,
      falloff: point.falloff,
      shape: point.shape,
      color: `oklch(${light[index]}% ${sat + index * 0.01} ${hues[index]} / ${alpha[index]})`,
    })),
  }
}

export function genreMatchKeys(term: MarketplaceGenreTerm) {
  return [term.label, term.slug, ...(term.aliases ?? [])].map((value) => value.toLowerCase())
}
