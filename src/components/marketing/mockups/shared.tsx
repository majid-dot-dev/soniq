import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { EASE } from '../motion'

const accentBar = {
  ember: 'from-ember via-ember-bright to-signal',
  signal: 'from-signal via-signal-deep to-yield-bright',
  yield: 'from-yield via-yield-bright to-signal',
  none: '',
}

/** Window-chrome wrapper used by every product UI mockup for a consistent "real SaaS" feel. */
export function MockupChrome({
  title,
  meta,
  children,
  className,
  accent = 'none',
}: {
  title: string
  meta?: ReactNode
  children: ReactNode
  className?: string
  dark?: boolean
  accent?: keyof typeof accentBar
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-line-dark bg-surface-dark shadow-[0_30px_70px_-28px_rgba(0,0,0,0.55)]',
        className,
      )}
    >
      {accent !== 'none' && (
        <span className={cn('absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r', accentBar[accent])} />
      )}
      <div className="flex items-center justify-between border-b border-line-dark px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ember/70" />
          <span className="h-2 w-2 rounded-full bg-signal/70" />
          <span className="h-2 w-2 rounded-full bg-yield/70" />
          <span className="ml-2 text-[12px] font-medium text-text-dark-mute">{title}</span>
        </div>
        {meta && <div className="text-[11px] text-white/35">{meta}</div>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  )
}

export function StatBlock({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'positive'
  dark?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-xl border border-line-dark bg-surface-dark-2 px-4 py-3.5',
        tone === 'positive' && 'border-yield/25',
      )}
    >
      <span className="text-[11px] font-medium text-text-dark-mute">{label}</span>
      <span className={cn('tnum text-[20px] font-medium tracking-[-0.01em]', tone === 'positive' ? 'text-yield-bright' : 'text-white')}>
        {value}
      </span>
      {hint && <span className="text-[11px] text-white/30">{hint}</span>}
    </div>
  )
}

/** Minimal SVG line chart from an array of y-values (0-100 scale), drawn in on scroll. */
export function LineChart({
  points,
  className,
  stroke = '#e2551f',
  fill = 'rgba(226,85,31,0.16)',
  height = 120,
}: {
  points: number[]
  className?: string
  stroke?: string
  fill?: string
  height?: number
}) {
  const w = 100
  const h = 100
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const step = w / (points.length - 1)

  const coords = points.map((p, i) => {
    const x = i * step
    const y = h - ((p - min) / range) * h
    return [x, y]
  })

  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn('w-full', className)} style={{ height }}>
      <motion.path
        d={areaPath}
        fill={fill}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: EASE }}
      />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 2.2 : 0} fill={stroke} />
      ))}
    </svg>
  )
}

export function BarRow({
  label,
  display,
  percent,
  color = 'bg-ember',
}: {
  label: string
  display: string
  percent: number
  color?: string
  dark?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[92px] flex-none truncate text-[12.5px] text-white/45">{label}</span>
      <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
      <span className="w-[76px] flex-none text-right text-[12.5px] tnum text-white">{display}</span>
    </div>
  )
}

export function MiniBars({ values, className, color = 'bg-signal' }: { values: number[]; className?: string; color?: string }) {
  const max = Math.max(...values)
  return (
    <div className={cn('flex h-10 items-end gap-[3px]', className)}>
      {values.map((v, i) => (
        <span
          key={i}
          className={cn('flex-1 rounded-sm', color)}
          style={{ height: `${Math.max(8, (v / max) * 100)}%`, opacity: 0.35 + (v / max) * 0.65 }}
        />
      ))}
    </div>
  )
}
