import type { ReactNode } from 'react'
import { CircleNotch } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { StepIndicator } from '@/features/dashboard/onboarding/components/step-indicator'
import { ONBOARDING_STEPS } from '@/features/dashboard/onboarding/constants'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const slide = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -28 : 28,
    opacity: 0,
  }),
}

const fade = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

export function OnboardingShell({
  stepIndex,
  direction,
  title,
  description,
  children,
}: {
  stepIndex: number
  direction: number
  title: string
  description?: string
  children: ReactNode
}) {
  const reduced = useReducedMotion()
  const step = ONBOARDING_STEPS[stepIndex]

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-12 text-white sm:px-6">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,#3a1520_0%,#0c0c0e_55%,#080809_100%)]"
        aria-hidden
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(225,29,72,0.14),transparent_45%)]"
        aria-hidden
        initial={reduced ? false : { opacity: 0, scale: 0.92 }}
        animate={
          reduced
            ? { opacity: 1 }
            : {
                opacity: [0.55, 1, 0.7],
                scale: 1,
              }
        }
        transition={
          reduced
            ? { duration: 0.4 }
            : {
                opacity: { duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
                scale: { duration: 0.9, ease: EASE },
              }
        }
      />

      <motion.div
        className="relative flex w-full max-w-[400px] flex-col items-center"
        initial={reduced ? false : { opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0.2 : 0.65, ease: EASE, delay: reduced ? 0 : 0.08 }}
      >
        <motion.div
          className="w-full rounded-[1.5rem] border border-white/15 bg-white/10 px-6 py-7 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-2xl sm:px-7 sm:py-8"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.12 }}
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: reduced ? 0 : 0.22 }}
          >
            <span className="text-[20px] font-semibold tracking-[-0.02em] text-white">
              Sound<span className="text-rose-500">Soniq</span>
            </span>
          </motion.div>

          <StepIndicator currentIndex={stepIndex} className="mt-5" entrance={!reduced} />

          <div className="relative mt-7 overflow-x-clip px-1.5 -mx-1.5">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step?.id ?? stepIndex}
                custom={direction}
                variants={reduced ? fade : slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduced ? 0.16 : 0.36, ease: EASE }}
              >
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.04 }}
                >
                  <h1 className="text-[24px] font-medium leading-tight tracking-[-0.03em] sm:text-[26px]">
                    {title}
                  </h1>
                  {description ? (
                    <p className="mt-2 text-[14px] leading-relaxed text-white/55">{description}</p>
                  ) : null}
                </motion.div>
                <div className="mt-6">{children}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.p
          className="mt-5 text-center text-[12px] text-white/40"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: EASE, delay: reduced ? 0 : 0.55 }}
        >
          © {new Date().getFullYear()} SoundSoniq. All rights reserved.
        </motion.p>
      </motion.div>
    </main>
  )
}

export function OnboardingBackLink({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-[13px] text-white/50 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-40"
    >
      Back
    </button>
  )
}

export function OnboardingContinueButton({
  children,
  onClick,
  disabled,
  loading,
  type = 'button',
  className,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 text-[14.5px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      {loading ? (
        <CircleNotch size={20} weight="bold" className="animate-spin" aria-hidden />
      ) : (
        children
      )}
    </button>
  )
}

/** Standard action stack: primary CTA, optional back. */
export function OnboardingActions({
  children,
  back,
}: {
  children: ReactNode
  back?: ReactNode
}) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {children}
      {back ? <div className="flex justify-center pt-0.5">{back}</div> : null}
    </div>
  )
}
