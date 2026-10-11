import { Checkbox } from '@/components/ui/checkbox'
import { LICENSE_FIELD_CLASS } from '@/features/licenses/lib/draft'
import { cn } from '@/lib/utils'

export function CapField({
  label,
  value,
  unlimited,
  onValue,
  onUnlimited,
}: {
  label: string
  value: string
  unlimited: boolean
  onValue: (value: string) => void
  onUnlimited: (unlimited: boolean) => void
}) {
  return (
    <div className="rounded-2xl bg-white/5 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-ink-mute">{label}</span>
        <label className="flex items-center gap-2 text-[12px] text-ink-2">
          <Checkbox checked={unlimited} onCheckedChange={(checked) => onUnlimited(checked === true)} />
          Unlimited
        </label>
      </div>
      <input
        type="number"
        min={0}
        disabled={unlimited}
        value={unlimited ? '' : value}
        onChange={(event) => onValue(event.target.value)}
        placeholder={unlimited ? 'Unlimited' : '0'}
        className={cn(LICENSE_FIELD_CLASS, 'tnum disabled:opacity-40')}
      />
    </div>
  )
}

