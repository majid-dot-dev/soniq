import { Link } from 'react-router-dom'
import MarketplaceTrackCard, {
  type MarketplaceTrack,
} from '@/components/shared/marketplace-track-card'
import HorizontalScroller, {
  ScrollerNav,
} from '@/features/marketplace/components/explore/horizontal-scroller'
import { useHorizontalScroller } from '@/features/marketplace/components/explore/use-horizontal-scroller'

const COVERS = [
  'bg-stone-800',
  'bg-rose-950',
  'bg-zinc-800',
  'bg-neutral-800',
  'bg-stone-900',
  'bg-rose-900',
  'bg-zinc-900',
  'bg-neutral-900',
] as const

const BEATS: MarketplaceTrack[] = [
  { id: 'palm-wine', title: 'Palm Wine', producer: 'Koko', genre: 'Afrobeats', bpm: 105, priceLabel: '$30', cover: COVERS[0] },
  { id: 'sunday-drive', title: 'Sunday Drive', producer: 'Koko', genre: 'Afrobeats', bpm: 100, priceLabel: '$30', cover: COVERS[1] },
  { id: 'quiet-riot', title: 'Quiet Riot', producer: 'Nao', genre: 'Drill', bpm: 144, priceLabel: '$25', cover: COVERS[2] },
  { id: 'low-light', title: 'Low Light', producer: 'Riven', genre: 'Alté', bpm: 108, priceLabel: '$30', cover: COVERS[3] },
  { id: 'half-light', title: 'Half Light', producer: 'Kelu', genre: 'Amapiano', bpm: 113, priceLabel: '$30', cover: COVERS[4] },
  { id: 'iron-choir', title: 'Iron Choir', producer: 'Nao', genre: 'Drill', bpm: 150, priceLabel: '$30', cover: COVERS[5] },
  { id: 'glass-city', title: 'Glass City', producer: 'Dëwit', genre: 'Afrobeats', bpm: 102, priceLabel: '$40', cover: COVERS[6] },
  { id: 'after-service', title: 'After Service', producer: 'Amara', genre: 'R&B', bpm: 87, priceLabel: '$45', cover: COVERS[7] },
  { id: 'night-market', title: 'Night Market', producer: 'Jules', genre: 'Amapiano', bpm: 114, priceLabel: '$35', cover: COVERS[0] },
  { id: 'soft-landing', title: 'Soft Landing', producer: 'Amara', genre: 'R&B', bpm: 78, priceLabel: '$50', cover: COVERS[1] },
]

export default function NewThisWeek({ beats = BEATS }: { beats?: MarketplaceTrack[] }) {
  const scroller = useHorizontalScroller()

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-medium tracking-[-0.02em] text-white">New this week</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ScrollerNav
            canPrev={scroller.canPrev}
            canNext={scroller.canNext}
            onPrev={scroller.scrollPrev}
            onNext={scroller.scrollNext}
          />
          <Link
            to="/marketplace/tracks"
            className="text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
          >
            See all
          </Link>
        </div>
      </div>

      <HorizontalScroller
        scrollerRef={scroller.ref}
        className="mt-4"
        contentClassName="gap-3.5"
        aria-label="New this week"
      >
        {beats.map((beat) => (
          <MarketplaceTrackCard key={beat.id} track={beat} />
        ))}
      </HorizontalScroller>
    </section>
  )
}
