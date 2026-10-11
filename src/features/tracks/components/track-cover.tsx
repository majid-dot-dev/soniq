import type { Beat } from '@/features/dashboard/beats'
import { cn } from '@/lib/utils'

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #3f0a16 0%, #e11d48 48%, #881337 100%)',
  'linear-gradient(160deg, #1c1917 0%, #9f1239 42%, #fb7185 100%)',
  'linear-gradient(145deg, #450a0a 0%, #be123c 55%, #292524 100%)',
  'linear-gradient(125deg, #292524 0%, #e11d48 40%, #4c0519 100%)',
  'linear-gradient(150deg, #4c0519 0%, #f43f5e 52%, #1c1917 100%)',
] as const

function gradientForSeed(seed: string) {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0
  }
  return COVER_GRADIENTS[Math.abs(hash) % COVER_GRADIENTS.length]
}

export function TrackCoverPlaceholder({
  seed = '',
  className,
}: {
  seed?: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn('block ring-0 ring-inset ring-white/10', className)}
      style={{ backgroundImage: gradientForSeed(seed) }}
    />
  )
}

export function TrackCover({ track, className }: { track: Beat; className?: string }) {
  if (!track.image) {
    return <TrackCoverPlaceholder seed={track.id || track.title} className={className} />
  }

  return <img src={track.image} alt="" className={cn('object-cover', className)} />
}
