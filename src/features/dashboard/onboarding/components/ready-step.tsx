import { motion, useReducedMotion } from 'motion/react'
import { PROFILE_TYPE_OPTIONS } from '@/features/dashboard/onboarding/constants'
import type { ProfileType } from '@/features/auth/types'

const EASE = [0.16, 1, 0.3, 1] as const

export function ReadyStep({
  type,
  displayName,
  username,
  avatar,
}: {
  type: ProfileType
  displayName: string
  username: string
  avatar: string | null
}) {
  const reduced = useReducedMotion()
  const meta = PROFILE_TYPE_OPTIONS.find((option) => option.type === type)
  const Icon = meta?.icon
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4"
    >
      <div className="flex items-center gap-3.5">
        <motion.div
          initial={reduced ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.08 }}
          className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-rose-500/20 text-[14px] font-semibold tracking-tight text-rose-300"
        >
          {avatar ? (
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            initials || '?'
          )}
        </motion.div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium tracking-[-0.01em] text-white">
            {displayName.trim()}
          </p>
          <p className="mt-0.5 truncate text-[13px] text-white/45">@{username}</p>
        </div>
      </div>
      <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-3 text-[13px]">
        <span className="text-white/40">Profile type</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-white/80">
          {Icon ? <Icon size={14} weight="fill" className="text-rose-400" /> : null}
          {meta?.label}
        </span>
      </div>
    </motion.div>
  )
}
