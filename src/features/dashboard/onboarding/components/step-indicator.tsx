import { motion, useReducedMotion } from 'motion/react'
import { ONBOARDING_STEPS } from '@/features/dashboard/onboarding/constants'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

/** Segmented / broken-line progress — one dash per step. */
export function StepIndicator({
  currentIndex,
  className,
  entrance = false,
}: {
  currentIndex: number
  className?: string
  entrance?: boolean
}) {
  const reduced = useReducedMotion()

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={ONBOARDING_STEPS.length}
      aria-valuenow={currentIndex + 1}
      aria-label={`Step ${currentIndex + 1} of ${ONBOARDING_STEPS.length}`}
    >
      {ONBOARDING_STEPS.map((step, index) => {
        const filled = index <= currentIndex
        return (
          <motion.span
            key={step.id}
            className="relative h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/18"
            initial={
              entrance && !reduced
                ? { opacity: 0, scaleX: 0.4 }
                : false
            }
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              duration: 0.45,
              ease: EASE,
              delay: entrance && !reduced ? 0.32 + index * 0.07 : 0,
            }}
            style={{ originX: 0 }}
          >
            <motion.span
              className={cn('absolute inset-0 rounded-full bg-rose-500')}
              initial={false}
              animate={{ scaleX: filled ? 1 : 0 }}
              transition={{ duration: reduced ? 0.15 : 0.4, ease: EASE }}
              style={{ originX: 0 }}
            />
          </motion.span>
        )
      })}
    </div>
  )
}
