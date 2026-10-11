import { motion, useReducedMotion } from 'motion/react'
import { PROFILE_TYPE_OPTIONS } from '@/features/dashboard/onboarding/constants'
import type { ProfileType } from '@/features/auth/types'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

export function TypeStep({
  value,
  onChange,
}: {
  value: ProfileType
  onChange: (type: ProfileType) => void
}) {
  const reduced = useReducedMotion()

  return (
    <div className="grid gap-2.5" role="radiogroup" aria-label="Profile type">
      {PROFILE_TYPE_OPTIONS.map((option, index) => {
        const selected = value === option.type
        const Icon = option.icon
        return (
          <motion.button
            key={option.type}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.type)}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: EASE,
              delay: reduced ? 0 : 0.08 + index * 0.06,
            }}
            className={cn(
              'flex items-center gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition-colors',
              selected
                ? 'border-rose-500/45 bg-rose-500/10'
                : 'border-white/12 bg-white/[0.04] hover:bg-white/[0.07]',
            )}
          >
            <span
              className={cn(
                'grid size-10 shrink-0 place-items-center rounded-xl transition-colors',
                selected ? 'bg-rose-500/20 text-rose-400' : 'bg-white/8 text-white/65',
              )}
            >
              <Icon size={18} weight={selected ? 'fill' : 'regular'} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-medium tracking-[-0.01em] text-white">
                {option.label}
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-white/45">
                {option.hint}
              </span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
