import { Link } from 'react-router-dom'
import HorizontalScroller, {
  ScrollerNav,
} from '@/features/marketplace/components/explore/horizontal-scroller'
import { useHorizontalScroller } from '@/features/marketplace/components/explore/use-horizontal-scroller'
import { cn } from '@/lib/utils'

type MoodItem = {
  id: string
  label: string
  tracks: number
  accent: string
  tone: string
}

const MOODS: MoodItem[] = [
  {
    id: 'dark',
    label: 'Dark',
    tracks: 842,
    accent: 'text-zinc-200',
    tone: 'bg-[linear-gradient(145deg,#3f3f46_0%,#18181b_48%,#09090b_100%)]',
  },
  {
    id: 'melodic',
    label: 'Melodic',
    tracks: 1204,
    accent: 'text-rose-200',
    tone: 'bg-[linear-gradient(145deg,#be123c_0%,#4c0519_52%,#1c1917_100%)]',
  },
  {
    id: 'energetic',
    label: 'Energetic',
    tracks: 966,
    accent: 'text-orange-100',
    tone: 'bg-[linear-gradient(145deg,#ea580c_0%,#7c2d12_50%,#1c1917_100%)]',
  },
  {
    id: 'chill',
    label: 'Chill',
    tracks: 731,
    accent: 'text-sky-100',
    tone: 'bg-[linear-gradient(145deg,#0284c7_0%,#0c4a6e_50%,#0c0a09_100%)]',
  },
  {
    id: 'emotional',
    label: 'Emotional',
    tracks: 588,
    accent: 'text-rose-100',
    tone: 'bg-[linear-gradient(145deg,#e11d48_0%,#881337_48%,#0c0a09_100%)]',
  },
  {
    id: 'bouncy',
    label: 'Bouncy',
    tracks: 654,
    accent: 'text-amber-100',
    tone: 'bg-[linear-gradient(145deg,#d97706_0%,#78350f_50%,#0c0a09_100%)]',
  },
  {
    id: 'aggressive',
    label: 'Aggressive',
    tracks: 412,
    accent: 'text-red-100',
    tone: 'bg-[linear-gradient(145deg,#dc2626_0%,#7f1d1d_48%,#0c0a09_100%)]',
  },
  {
    id: 'dreamy',
    label: 'Dreamy',
    tracks: 523,
    accent: 'text-stone-100',
    tone: 'bg-[linear-gradient(145deg,#78716c_0%,#44403c_48%,#0c0a09_100%)]',
  },
]

function MoodCard({ mood }: { mood: MoodItem }) {
  return (
    <Link
      to={`/marketplace/tracks?mood=${encodeURIComponent(mood.label)}`}
      className={cn(
        'group relative flex h-[112px] w-[260px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl px-4 py-3.5 transition-transform duration-300 hover:scale-[1.015] sm:w-[280px]',
        mood.tone,
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute -right-1 -bottom-4 text-[64px] font-semibold tracking-[-0.04em] opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.05]',
          mood.accent,
        )}
      >
        {mood.label}
      </span>

      <span className="relative">
        <span className="block text-[18px] font-medium tracking-[-0.02em] text-white">{mood.label}</span>
        <span className="tnum mt-1 block text-[12px] text-white/70">
          {mood.tracks.toLocaleString('en-US')} tracks
        </span>
      </span>

      <span className="relative text-[12px] font-medium text-white/75 transition-colors group-hover:text-white">
        Browse
        <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  )
}

export default function Mood({ moods = MOODS }: { moods?: MoodItem[] }) {
  const scroller = useHorizontalScroller()

  return (
    <section className="mt-10 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white sm:text-[20px] lg:text-[22px]">
            Browse by mood
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ScrollerNav
            canPrev={scroller.canPrev}
            canNext={scroller.canNext}
            onPrev={scroller.scrollPrev}
            onNext={scroller.scrollNext}
          />
          <Link
            to="/marketplace/moods"
            className="text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
          >
            See all
          </Link>
        </div>
      </div>

      <HorizontalScroller
        scrollerRef={scroller.ref}
        className="mt-4"
        contentClassName="gap-3"
        aria-label="Browse by mood"
      >
        {moods.map((mood) => (
          <MoodCard key={mood.id} mood={mood} />
        ))}
      </HorizontalScroller>
    </section>
  )
}
