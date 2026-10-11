import { Link } from 'react-router-dom'
import type { ReactNode, CSSProperties, ComponentPropsWithoutRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { fadeUp, Magnetic } from './motion'

/* ---------------------------------------------------------------------- */
/* Layout                                                                   */
/* ---------------------------------------------------------------------- */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1240px] px-6 lg:px-10', className)}>{children}</div>
}

/** Scroll-triggered fade + blur + slide entrance, once per element. */
export function Reveal({
  className,
  delay = 0,
  children,
  ...rest
}: {
  className?: string
  delay?: number
  children: ReactNode
} & Record<string, unknown>) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: delay / 1000 }}
      variants={fadeUp}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ---------------------------------------------------------------------- */
/* Typography helpers                                                       */
/* ---------------------------------------------------------------------- */

const eyebrowTones = {
  ember: 'text-ember before:bg-ember before:shadow-[0_0_10px_2px_rgba(226,85,31,0.5)]',
  yield: 'text-yield-bright before:bg-yield-bright before:shadow-[0_0_10px_2px_rgba(47,203,125,0.45)]',
  signal: 'text-signal before:bg-signal before:shadow-[0_0_10px_2px_rgba(123,114,232,0.45)]',
  ink: 'text-ink-mute before:bg-ink-faint',
  paper: 'text-white/70 before:bg-white/70',
}

export function Eyebrow({
  children,
  tone = 'ember',
  className,
}: {
  children: ReactNode
  tone?: keyof typeof eyebrowTones
  className?: string
}) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center gap-2 pl-3.5 text-[11px] font-semibold tracking-[0.16em] uppercase',
        "before:absolute before:left-0 before:top-1/2 before:h-[5px] before:w-[5px] before:-translate-y-1/2 before:rounded-full before:content-['']",
        eyebrowTones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  eyebrowTone = 'ember',
  title,
  description,
  align = 'left',
  size = 'lg',
  className,
}: {
  eyebrow?: ReactNode
  eyebrowTone?: keyof typeof eyebrowTones
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  size?: 'lg' | 'md'
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-5', align === 'center' && 'items-center text-center', className)}>
      {eyebrow && <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          'max-w-2xl text-balance font-medium tracking-[-0.02em] text-ink',
          size === 'lg'
            ? 'text-[34px] leading-[1.08] sm:text-[44px] lg:text-[52px]'
            : 'text-[28px] leading-[1.12] sm:text-[34px]',
          align === 'center' && 'mx-auto',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('max-w-xl text-[16px] leading-relaxed text-ink-mute', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Buttons                                                                   */
/* ---------------------------------------------------------------------- */

const buttonStyles = {
  primary:
    'bg-gradient-to-b from-rose-600 via-rose-500 to-rose-500/85 text-white',
  secondary:
    'border border-neutral-400 bg-white text-black hover:border-neutral-600 hover:bg-neutral-50',
  'on-dark-primary': 'bg-white text-ink-onlight shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)] hover:bg-white/90',
  'on-dark-secondary': 'bg-white/10 text-white border border-white/20 hover:bg-white/15',
  ghost: 'bg-transparent text-black hover:bg-black/4 hover:text-rose-600',
}

type ButtonVariant = keyof typeof buttonStyles

interface MarketingButtonOwnProps {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  children: ReactNode
  style?: CSSProperties
  magnetic?: boolean
}

export function MarketingButton({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  style,
  magnetic = false,
  ...rest
}: MarketingButtonOwnProps &
  Omit<
    ComponentPropsWithoutRef<'button'>,
    'className' | 'style' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  >) {
  const classes = cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-shadow duration-200',
    size === 'sm' && 'h-9 px-4 text-[13px]',
    size === 'md' && 'h-11 px-5 text-[14.5px]',
    size === 'lg' && 'h-12 px-6 text-[15px]',
    buttonStyles[variant],
    className,
  )

  const motionProps = {
    whileHover: { scale: 1.035 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring' as const, stiffness: 420, damping: 24 },
  }

  let node: ReactNode
  if (href) {
    const isInternal = href.startsWith('/')
    node = isInternal ? (
      <motion.div {...motionProps}>
        <Link to={href} className={classes} style={style}>
          {children}
        </Link>
      </motion.div>
    ) : (
      <motion.a href={href} className={classes} style={style} {...motionProps}>
        {children}
      </motion.a>
    )
  } else {
    node = (
      <motion.button type="button" className={classes} style={style} {...motionProps} {...rest}>
        {children}
      </motion.button>
    )
  }

  return magnetic ? <Magnetic>{node}</Magnetic> : node
}

/* ---------------------------------------------------------------------- */
/* Tags / pills                                                             */
/* ---------------------------------------------------------------------- */

const tagTones = {
  ember: 'bg-ember-soft text-ember-deep',
  yield: 'bg-yield-soft text-yield-deep',
  signal: 'bg-signal-soft text-signal-deep',
  ink: 'bg-white/[0.07] text-ink-2',
  dark: 'bg-white/10 text-white/80',
}

export function Tag({
  children,
  tone = 'ink',
  className,
}: {
  children: ReactNode
  tone?: keyof typeof tagTones
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em]',
        tagTones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------------- */
/* Waveform                                                                 */
/* ---------------------------------------------------------------------- */

export function Waveform({
  bars = 42,
  className,
  barClassName,
  animated = true,
  seed = 7,
}: {
  bars?: number
  className?: string
  barClassName?: string
  animated?: boolean
  seed?: number
}) {
  const heights = generateWaveform(bars, seed)
  return (
    <div className={cn('flex h-full items-center gap-[3px]', className)}>
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn('w-[2.5px] flex-none rounded-full bg-current', barClassName)}
          style={{
            height: `${h}%`,
            animation: animated ? `wave 1.2s ease-in-out infinite` : undefined,
            animationDelay: animated ? `${(i % 12) * 0.07}s` : undefined,
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  )
}

function generateWaveform(count: number, seed: number) {
  const out: number[] = []
  let s = seed
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280
    const rnd = s / 233280
    const wave = Math.sin(i / 2.4) * 0.5 + 0.5
    out.push(Math.max(14, Math.round((rnd * 0.5 + wave * 0.5) * 100)))
  }
  return out
}

/* ---------------------------------------------------------------------- */
/* Money formatting                                                        */
/* ---------------------------------------------------------------------- */

export function formatMoney(value: number, currency: '₦' | '$' = '₦') {
  return `${currency}${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}
