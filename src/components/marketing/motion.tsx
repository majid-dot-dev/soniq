import { useRef } from 'react'
import type { ReactNode, CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import { motion, useMotionValue, useMotionTemplate, useReducedMotion, useSpring, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

/* ---------------------------------------------------------------------- */
/* Shared variants                                                         */
/* ---------------------------------------------------------------------- */

export const EASE = [0.16, 1, 0.3, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 26, scale: 0.98, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE },
  },
}

export function staggerContainer(staggerChildren = 0.09, delayChildren = 0) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

/** Stagger container — animates children (using `fadeUp`) in sequence as the group enters view. */
export function Stagger({
  children,
  className,
  amount = 0.2,
  stagger = 0.09,
}: {
  children: ReactNode
  className?: string
  amount?: number
  stagger?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerContainer(stagger)}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  )
}

/* ---------------------------------------------------------------------- */
/* Floating ambient orbs — slow, elegant, non-decorative-only motion       */
/* ---------------------------------------------------------------------- */

export function FloatingOrb({
  className,
  style,
  duration = 14,
  delay = 0,
  travel = 26,
}: {
  className?: string
  style?: CSSProperties
  duration?: number
  delay?: number
  travel?: number
}) {
  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none absolute rounded-full blur-2xl', className)}
      style={style}
      animate={{
        x: [0, travel, -travel * 0.7, 0],
        y: [0, -travel * 0.8, travel * 0.6, 0],
        scale: [1, 1.06, 0.95, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ---------------------------------------------------------------------- */
/* Tilt card — subtle mouse-driven 3D tilt with a light-sweep highlight    */
/* ---------------------------------------------------------------------- */

export function TiltCard({
  children,
  className,
  style,
  max = 7,
  glow = true,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  max?: number
  glow?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, { stiffness: 260, damping: 22 })
  const rotateY = useSpring(0, { stiffness: 260, damping: 22 })
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const glowBg = useMotionTemplate`radial-gradient(220px circle at ${mx}% ${my}%, rgba(255,255,255,0.14), transparent 70%)`

  function onMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * max)
    rotateX.set(-(py - 0.5) * max)
    mx.set(px * 100)
    my.set(py * 100)
  }
  function onMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...style, rotateX, rotateY, transformPerspective: 900 }}
      className={cn('relative will-change-transform', className)}
    >
      {children}
      {glow && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ background: glowBg, mixBlendMode: 'overlay' }}
        />
      )}
    </motion.div>
  )
}

/* ---------------------------------------------------------------------- */
/* Magnetic — button wrapper that gently follows the cursor                */
/* ---------------------------------------------------------------------- */

export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 280, damping: 20, mass: 0.5 })
  const y = useSpring(0, { stiffness: 280, damping: 20, mass: 0.5 })

  function onMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }
  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}

/* ---------------------------------------------------------------------- */
/* Spotlight — cursor-following glow, used on hero / dark panels           */
/* ---------------------------------------------------------------------- */

export function Spotlight({
  children,
  className,
  color = 'rgba(226,85,31,0.18)',
  size = 700,
}: {
  children: ReactNode
  className?: string
  color?: string
  size?: number
}) {
  const mx = useMotionValue(50)
  const my = useMotionValue(20)
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mx}% ${my}%, ${color}, transparent 70%)`

  function onMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 100)
    my.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <div onMouseMove={onMouseMove} className={cn('relative', className)}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background }} />
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Scroll progress bar                                                     */
/* ---------------------------------------------------------------------- */

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.3 })
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left">
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-ember via-signal to-yield-bright"
      />
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Ambient background — persistent, fixed, warm corner-bleed glow          */
/* ---------------------------------------------------------------------- */

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-ink-dark">
      <motion.div
        className="absolute -right-[20%] -top-[30%] h-[80vh] w-[80vh] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(226,85,31,0.28), transparent 68%)' }}
        animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -left-[25%] top-[35%] h-[70vh] w-[70vh] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(87,79,201,0.16), transparent 70%)' }}
        animate={{ opacity: [0.7, 0.95, 0.7], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[10%] h-[60vh] w-[60vh] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(28,122,77,0.14), transparent 70%)' }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <div className="bg-grain absolute inset-0 opacity-[0.05]" />
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Gradient border — slow rotating conic-gradient sheen around a panel     */
/* ---------------------------------------------------------------------- */

export function GradientBorder({
  children,
  className,
  radius = 26,
  colors = '#e2551f, #574fc9, #1c7a4d, #e2551f',
  thickness = 1.5,
  duration = 10,
  opacity = 0.85,
  surfaceClassName = 'bg-ink-dark',
}: {
  children: ReactNode
  className?: string
  radius?: number
  colors?: string
  thickness?: number
  duration?: number
  opacity?: number
  surfaceClassName?: string
}) {
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ borderRadius: radius }}>
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[inherit]"
        style={{ background: `conic-gradient(from 0deg, ${colors})`, opacity }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
      <div className={cn('relative', surfaceClassName)} style={{ margin: thickness, borderRadius: radius - thickness }}>
        {children}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Parallax — wraps a child and offsets it slightly with page scroll       */
/* ---------------------------------------------------------------------- */

/** Scroll-linked tilt. The child lifts toward the viewer, then settles as it passes. */
export function Depth({
  children,
  className,
  strength = 4,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 1], [strength, 0, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.985, 1, 1])

  if (reduce) return <div className={className}>{children}</div>

  return (
    <div ref={ref} className={className} style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX, scale, transformStyle: 'preserve-3d', willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  )
}

export function Parallax({
  children,
  className,
  range = 40,
}: {
  children: ReactNode
  className?: string
  range?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [range, -range])
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
