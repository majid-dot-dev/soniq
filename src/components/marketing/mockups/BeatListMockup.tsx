import { Play } from 'lucide-react'
import { Waveform } from '../primitives'
import { MockupChrome } from './shared'
import { cn } from '@/lib/utils'

export const beats = [
  {
    title: 'Half Light',
    producer: 'Kelu',
    bpm: 96,
    key: 'F#m',
    genre: 'Amapiano',
    price: '$60',
    license: 'Non-exclusive',
    art: 'from-ember to-ember-deep',
  },
  {
    title: 'Glass City',
    producer: 'Dëwit',
    bpm: 140,
    key: 'Cmaj',
    genre: 'Afrobeats',
    price: '$85',
    license: 'Exclusive',
    art: 'from-signal to-signal-deep',
  },
  {
    title: 'Quiet Riot',
    producer: 'Nao Beats',
    bpm: 172,
    key: 'Gm',
    genre: 'Log Drum',
    price: '$50',
    license: 'Non-exclusive',
    art: 'from-yield to-yield-deep',
  },
  {
    title: 'Harmattan',
    producer: 'Selasi',
    bpm: 102,
    key: 'Dm',
    genre: 'Afro-fusion',
    price: '$75',
    license: 'Non-exclusive',
    art: 'from-ink-dark-2 to-ink-dark',
  },
]

export function BeatListMockup({ compact = false }: { compact?: boolean }) {
  const rows = compact ? beats.slice(0, 3) : beats

  return (
    <MockupChrome title="Beat Marketplace" meta="4,208 beats live" accent="ember">
      <div className="flex flex-col divide-y divide-line-dark">
        {rows.map((beat, i) => (
          <div key={beat.title} className={cn('flex items-center gap-3 py-3', i === 0 && 'pt-0')}>
            <div
              className={cn(
                'flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gradient-to-br text-[11px] font-semibold text-white',
                beat.art,
              )}
            >
              {beat.title
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </div>
            <button
              type="button"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line-dark text-ink-2 transition-colors hover:border-ember/40 hover:text-ember"
              aria-label={`Play ${beat.title}`}
            >
              <Play className="h-3.5 w-3.5" fill="currentColor" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[13.5px] font-medium text-ink">{beat.title}</span>
                <span className="hidden text-[12px] text-ink-faint sm:inline">
                  · {beat.producer}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-ink-mute">
                <span>{beat.bpm} BPM</span>
                <span>·</span>
                <span>{beat.key}</span>
                <span>·</span>
                <span>{beat.genre}</span>
              </div>
            </div>
            <Waveform bars={16} className="hidden h-6 text-ember/45 md:flex" animated={i === 0} />
            <div className="flex flex-none flex-col items-end gap-0.5">
              <span className="text-[13px] font-medium tnum text-ink">{beat.price}</span>
              <span className="text-[10.5px] text-ink-faint">{beat.license}</span>
            </div>
          </div>
        ))}
      </div>
    </MockupChrome>
  )
}
