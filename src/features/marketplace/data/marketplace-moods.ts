import {
  meshForGenreSlug,
  type GenreMesh,
  type MarketplaceGenreTerm,
} from '@/features/marketplace/data/marketplace-genres'

/**
 * Mirrors `MOOD_SEED` from `server/src/modules/taxonomy/seed-data.ts`.
 * Offline fallback when `/api/v1/meta/moods` is unavailable.
 */
export type MarketplaceMoodTerm = MarketplaceGenreTerm

export const MARKETPLACE_MOOD_SEED: MarketplaceMoodTerm[] = [
  { slug: 'chill', label: 'Chill' },
  { slug: 'dark', label: 'Dark' },
  { slug: 'aggressive', label: 'Aggressive' },
  { slug: 'hype', label: 'Hype' },
  { slug: 'melodic', label: 'Melodic' },
  { slug: 'emotional', label: 'Emotional' },
  { slug: 'romantic', label: 'Romantic' },
  { slug: 'energetic', label: 'Energetic' },
  { slug: 'uplifting', label: 'Uplifting' },
  { slug: 'laid-back', label: 'Laid Back' },
  { slug: 'dreamy', label: 'Dreamy' },
  { slug: 'mysterious', label: 'Mysterious' },
  { slug: 'epic', label: 'Epic' },
  { slug: 'smooth', label: 'Smooth' },
  { slug: 'sexy', label: 'Sexy' },
  { slug: 'sad', label: 'Sad' },
  { slug: 'happy', label: 'Happy' },
  { slug: 'quirky', label: 'Quirky' },
  { slug: 'powerful', label: 'Powerful' },
  { slug: 'soulful', label: 'Soulful' },
  { slug: 'moody', label: 'Moody' },
  { slug: 'groovy', label: 'Groovy' },
  { slug: 'festive', label: 'Festive' },
  { slug: 'inspiring', label: 'Inspiring' },
]

/** Hand-tuned meshes for flagship moods (Explore rail language). */
const MOOD_MESH_OVERRIDES: Record<string, GenreMesh> = {
  dark: {
    base: '#0c0c10',
    blobs: [
      { at: '22% 20%', color: 'oklch(48% 0.03 260 / 0.85)', falloff: '55%' },
      { at: '78% 38%', color: 'oklch(36% 0.02 280 / 0.8)', falloff: '58%', shape: 'ellipse' },
      { at: '48% 85%', color: 'oklch(22% 0.015 260 / 0.95)', falloff: '55%' },
      { at: '8% 70%', color: 'oklch(40% 0.04 20 / 0.3)', falloff: '42%' },
    ],
  },
  chill: {
    base: '#061822',
    blobs: [
      { at: '18% 24%', color: 'oklch(72% 0.12 230 / 0.9)', falloff: '55%' },
      { at: '75% 30%', color: 'oklch(62% 0.1 200 / 0.8)', falloff: '52%', shape: 'ellipse' },
      { at: '48% 82%', color: 'oklch(38% 0.08 240 / 0.9)', falloff: '58%' },
      { at: '95% 65%', color: 'oklch(58% 0.09 185 / 0.45)', falloff: '42%' },
    ],
  },
  melodic: {
    base: '#2a0812',
    blobs: [
      { at: '20% 22%', color: 'oklch(68% 0.18 12 / 0.9)', falloff: '52%' },
      { at: '72% 36%', color: 'oklch(55% 0.2 8 / 0.85)', falloff: '58%', shape: 'ellipse' },
      { at: '42% 84%', color: 'oklch(35% 0.12 5 / 0.9)', falloff: '55%' },
      { at: '90% 70%', color: 'oklch(50% 0.14 25 / 0.45)', falloff: '42%' },
    ],
  },
  energetic: {
    base: '#2c0e08',
    blobs: [
      { at: '20% 26%', color: 'oklch(72% 0.18 45 / 0.95)', falloff: '55%', shape: 'ellipse' },
      { at: '76% 24%', color: 'oklch(62% 0.2 35 / 0.85)', falloff: '50%' },
      { at: '48% 80%', color: 'oklch(40% 0.14 30 / 0.9)', falloff: '58%' },
      { at: '-5% 68%', color: 'oklch(52% 0.15 55 / 0.5)', falloff: '45%' },
    ],
  },
  aggressive: {
    base: '#1c0608',
    blobs: [
      { at: '16% 24%', color: 'oklch(58% 0.22 25 / 0.9)', falloff: '50%' },
      { at: '70% 28%', color: 'oklch(45% 0.18 15 / 0.85)', falloff: '55%', shape: 'ellipse' },
      { at: '45% 80%', color: 'oklch(30% 0.12 10 / 0.95)', falloff: '58%' },
      { at: '95% 62%', color: 'oklch(50% 0.16 35 / 0.45)', falloff: '42%' },
    ],
  },
  dreamy: {
    base: '#141210',
    blobs: [
      { at: '24% 22%', color: 'oklch(62% 0.04 70 / 0.8)', falloff: '55%' },
      { at: '72% 40%', color: 'oklch(48% 0.03 50 / 0.75)', falloff: '58%', shape: 'ellipse' },
      { at: '45% 85%', color: 'oklch(32% 0.02 40 / 0.9)', falloff: '55%' },
      { at: '90% 15%', color: 'oklch(70% 0.05 80 / 0.4)', falloff: '40%' },
    ],
  },
  emotional: {
    base: '#1a0610',
    blobs: [
      { at: '20% 22%', color: 'oklch(58% 0.18 8 / 0.9)', falloff: '52%' },
      { at: '74% 38%', color: 'oklch(48% 0.2 350 / 0.85)', falloff: '56%', shape: 'ellipse' },
      { at: '42% 84%', color: 'oklch(32% 0.12 5 / 0.9)', falloff: '55%' },
      { at: '8% 68%', color: 'oklch(45% 0.12 340 / 0.45)', falloff: '44%' },
    ],
  },
  hype: {
    base: '#2a1206',
    blobs: [
      { at: '14% 20%', color: 'oklch(80% 0.16 75 / 0.95)', falloff: '52%' },
      { at: '68% 34%', color: 'oklch(68% 0.19 50 / 0.88)', falloff: '56%', shape: 'ellipse' },
      { at: '48% 84%', color: 'oklch(42% 0.14 40 / 0.9)', falloff: '55%' },
      { at: '92% 12%', color: 'oklch(72% 0.12 85 / 0.45)', falloff: '40%' },
    ],
  },
}

/** Mood meshes — overrides first, then diversified genre mesh hash. */
export function meshForMoodSlug(slug: string): GenreMesh {
  return MOOD_MESH_OVERRIDES[slug] ?? meshForGenreSlug(`mood-${slug}`)
}

export function moodMatchKeys(term: MarketplaceMoodTerm) {
  return [term.label, term.slug, ...(term.aliases ?? [])].map((value) => value.toLowerCase())
}
