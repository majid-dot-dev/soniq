import { SealCheckIcon, UserPlusIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import HorizontalScroller, {
  ScrollerNav,
} from '@/features/marketplace/components/explore/horizontal-scroller'
import { useHorizontalScroller } from '@/features/marketplace/components/explore/use-horizontal-scroller'
import { marketplaceProducerPath } from '@/features/marketplace/data/marketplace-producers'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

type Creator = {
  id: string
  name: string
  username: string
  genres: string
  tracks: number
  plays: number
  cover: string
  accent: string
  /** Verified creator — shows a seal beside the name. */
  verified?: boolean
}

const CREATORS: Creator[] = [
  {
    id: 'kelu',
    name: 'Kelu',
    username: 'kelu',
    genres: 'Amapiano · Gqom',
    tracks: 42,
    plays: 184_200,
    cover: 'bg-stone-800',
    accent: 'from-rose-600/50 to-transparent',
  },
  {
    id: 'dewit',
    name: 'Dëwit',
    username: 'dewit',
    genres: 'Afrobeats · Alté',
    tracks: 28,
    plays: 96_400,
    cover: 'bg-rose-950',
    accent: 'from-orange-500/40 to-transparent',
  },
  {
    id: 'nao',
    name: 'Nao',
    username: 'nao',
    genres: 'Drill',
    tracks: 61,
    plays: 241_800,
    cover: 'bg-zinc-800',
    accent: 'from-violet-500/40 to-transparent',
  },
  {
    id: 'selasi',
    name: 'Selasi',
    username: 'selasi',
    genres: 'Afro-fusion',
    tracks: 19,
    plays: 72_100,
    cover: 'bg-neutral-800',
    accent: 'from-amber-500/35 to-transparent',
  },
  {
    id: 'riven',
    name: 'Riven',
    username: 'riven',
    genres: 'Alté · Gqom',
    tracks: 33,
    plays: 118_500,
    cover: 'bg-stone-900',
    accent: 'from-emerald-500/35 to-transparent',
  },
  {
    id: 'amara',
    name: 'Amara',
    username: 'amara',
    genres: 'R&B',
    tracks: 24,
    plays: 88_900,
    cover: 'bg-rose-900',
    accent: 'from-pink-500/40 to-transparent',
  },
  {
    id: 'koko',
    name: 'Koko',
    username: 'koko',
    genres: 'Afrobeats',
    tracks: 51,
    plays: 156_300,
    cover: 'bg-zinc-900',
    accent: 'from-sky-500/35 to-transparent',
  },
  {
    id: 'jules',
    name: 'Jules',
    username: 'jules',
    genres: 'Amapiano · Alté',
    tracks: 37,
    plays: 203_700,
    cover: 'bg-neutral-900',
    accent: 'from-rose-500/40 to-transparent',
  },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatPlays(plays: number) {
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (plays >= 1_000) return `${Math.round(plays / 1_000)}K`
  return String(plays)
}

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <article className="group w-[200px] shrink-0 sm:w-[220px]">
      <Link to={marketplaceProducerPath(creator.id)} className="block outline-none">
        <span className="relative block overflow-hidden rounded-2xl">
          <span
            className={cn(
              'relative grid aspect-[4/5] w-full place-items-center text-[28px] font-semibold tracking-tight text-white/25',
              creator.cover,
            )}
          >
            <span
              className={cn(
                'pointer-events-none absolute inset-0 bg-gradient-to-t',
                creator.accent,
              )}
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
            {initials(creator.name)}
            <span className="absolute bottom-3 left-3 right-3">
              <span className="flex items-end gap-2.5">
                <span
                  className={cn(
                    'grid size-11 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white ring-2 ring-black/40',
                    creator.cover,
                  )}
                >
                  {initials(creator.name)}
                </span>
                <span className="min-w-0 flex-1 pb-0.5">
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="truncate text-[15px] font-medium tracking-[-0.01em] text-white">
                      {creator.name}
                    </span>
                    {creator.verified !== false ? (
                      <SealCheckIcon
                        size={14}
                        weight="fill"
                        className="shrink-0 text-sky-400"
                        aria-label="Verified creator"
                      />
                    ) : null}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-white/65">
                    {creator.genres}
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </Link>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="tnum truncate text-[12px] text-ink-mute">
            {formatPlays(creator.plays)} plays
            <span className="text-ink-faint"> · </span>
            {creator.tracks} tracks
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/8 px-2.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/14"
        >
          <UserPlusIcon size={13} weight="bold" />
          Follow
        </button>
      </div>
    </article>
  )
}

export default function CreatorsToWatch({
  creators = CREATORS,
  title = 'Creators to watch',
  subtitle = 'Rising producers gaining plays this week.',
  showSubtitle = true,
  animate = false,
}: {
  creators?: Creator[]
  title?: string
  subtitle?: string
  showSubtitle?: boolean
  /** Stagger cards into view when true. */
  animate?: boolean
}) {
  const scroller = useHorizontalScroller()

  return (
    <section className="mt-10 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-medium tracking-[-0.02em] text-white">{title}</h2>
          {showSubtitle ? (
            <p className="mt-1 text-[13px] text-ink-mute">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ScrollerNav
            canPrev={scroller.canPrev}
            canNext={scroller.canNext}
            onPrev={scroller.scrollPrev}
            onNext={scroller.scrollNext}
          />
          <Link
            to="/marketplace/creators"
            className="text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
          >
            See all
          </Link>
        </div>
      </div>

      <HorizontalScroller
        scrollerRef={scroller.ref}
        className="mt-4"
        contentClassName="gap-4"
        aria-label={title}
      >
        {creators.map((creator, index) =>
          animate ? (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-24px' }}
              transition={{ duration: 0.38, ease: EASE, delay: Math.min(index, 6) * 0.04 }}
              whileHover={{ y: -3 }}
            >
              <CreatorCard creator={creator} />
            </motion.div>
          ) : (
            <CreatorCard key={creator.id} creator={creator} />
          ),
        )}
      </HorizontalScroller>
    </section>
  )
}
