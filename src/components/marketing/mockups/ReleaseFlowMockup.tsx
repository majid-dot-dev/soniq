import { Check, Loader2 } from 'lucide-react'
import { MockupChrome } from './shared'
import { cn } from '@/lib/utils'

const stores = [
  { name: 'Spotify', status: 'live', date: 'Delivered Sep 12' },
  { name: 'Apple Music', status: 'live', date: 'Delivered Sep 12' },
  { name: 'YouTube Music', status: 'live', date: 'Delivered Sep 12' },
  { name: 'Audiomack', status: 'live', date: 'Delivered Sep 12' },
  { name: 'Boomplay', status: 'processing', date: 'Processing' },
  { name: 'TikTok', status: 'processing', date: 'Processing' },
  { name: 'Deezer', status: 'scheduled', date: 'Scheduled Sep 14' },
]

const statusStyle: Record<string, string> = {
  live: 'text-yield-deep bg-yield-soft',
  processing: 'text-signal-deep bg-signal-soft',
  scheduled: 'text-ink-mute bg-ink/[0.06]',
}

const statusLabel: Record<string, string> = {
  live: 'Live',
  processing: 'Processing',
  scheduled: 'Scheduled',
}

export function ReleaseFlowMockup() {
  return (
    <MockupChrome title="Release · Lagos Nights" meta="Single · Sep 12, 2026" accent="signal">
      <div className="mb-5 flex items-center gap-2">
        {['Submitted', 'In review', 'Delivered', 'Live'].map((step, i) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                'flex h-6 w-6 flex-none items-center justify-center rounded-full text-[10px] font-semibold',
                i < 3 ? 'bg-yield text-white' : 'bg-yield/15 text-yield-bright',
              )}
            >
              {i < 3 ? <Check className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
            <span className="hidden truncate text-[11px] text-ink-mute sm:inline">{step}</span>
            {i < 3 && <span className="h-px flex-1 bg-yield/40" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-line-dark">
        {stores.map((store) => (
          <div key={store.name} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-semibold',
                  'bg-ink/[0.05] text-ink-2',
                )}
              >
                {store.name.slice(0, 1)}
              </span>
              <span className="text-[13px] text-ink">{store.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] text-ink-faint sm:inline">{store.date}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10.5px] font-medium',
                  statusStyle[store.status],
                )}
              >
                {statusLabel[store.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </MockupChrome>
  )
}
