import type { ReactNode } from 'react'
import { CircleNotch } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.06,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE },
  },
}

const iconPop = {
  hidden: { opacity: 0, scale: 0.55, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 420, damping: 22, mass: 0.7 },
  },
}

export type ActionModalProps = {
  open: boolean
  title: string
  description?: ReactNode
  /** Optional leading icon shown above the title */
  icon?: ReactNode
  children?: ReactNode
  cancelLabel?: string
  confirmLabel?: string
  /** Destructive confirm uses rose styling */
  tone?: 'default' | 'destructive'
  busy?: boolean
  onClose: () => void
  onConfirm: () => void
  className?: string
}

export function ActionModal({
  open,
  title,
  description,
  icon,
  children,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  tone = 'default',
  busy = false,
  onClose,
  onConfirm,
  className,
}: ActionModalProps) {
  const reduce = useReducedMotion()

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onClose()
      }}
      disablePointerDismissal={busy}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/70 backdrop-blur-sm duration-300 data-open:fade-in-0 data-closed:fade-out-0"
        className={cn(
          'gap-0 rounded-3xl bg-[#161618] p-5 text-ink ring-0 ring-white/12 sm:max-w-md sm:p-6',
          'duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-open:zoom-in-95 data-open:slide-in-from-bottom-3 data-closed:zoom-out-95 data-closed:slide-out-to-bottom-2',
          className,
        )}
      >
        <motion.div
          key={open ? 'open' : 'closed'}
          variants={reduce ? undefined : container}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <DialogHeader className="gap-1.5">
            {icon ? (
              <motion.span
                aria-hidden
                variants={reduce ? undefined : iconPop}
                className={cn(
                  'mb-3.5 grid size-11 place-items-center rounded-2xl [&_svg]:size-5',
                  tone === 'destructive'
                    ? 'bg-rose-500/15 text-rose-300'
                    : 'bg-white/8 text-white',
                )}
              >
                {icon}
              </motion.span>
            ) : null}
            <motion.div variants={reduce ? undefined : fadeUp}>
              <DialogTitle className="text-[22px] font-semibold tracking-[-0.03em] text-white">
                {title}
              </DialogTitle>
            </motion.div>
            {description ? (
              <motion.div variants={reduce ? undefined : fadeUp}>
                <DialogDescription className="text-[13px] leading-relaxed text-ink-mute">
                  {description}
                </DialogDescription>
              </motion.div>
            ) : null}
          </DialogHeader>

          {children ? (
            <motion.div variants={reduce ? undefined : fadeUp} className="mt-5">
              {children}
            </motion.div>
          ) : null}

          <motion.div variants={reduce ? undefined : fadeUp}>
            <DialogFooter className="mx-0 mb-0 mt-6 flex-row gap-2 border-0 bg-transparent p-0 sm:justify-stretch">
              <motion.button
                type="button"
                disabled={busy}
                onClick={onClose}
                whileHover={reduce || busy ? undefined : { scale: 1.02 }}
                whileTap={reduce || busy ? undefined : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="inline-flex h-10 w-full flex-1 items-center justify-center rounded-full bg-white/8 px-4 text-[13px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white disabled:pointer-events-none disabled:opacity-50"
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                type="button"
                disabled={busy}
                onClick={onConfirm}
                aria-busy={busy}
                whileHover={reduce || busy ? undefined : { scale: 1.02 }}
                whileTap={reduce || busy ? undefined : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className={cn(
                  'inline-flex h-10 w-full flex-1 items-center justify-center rounded-full px-4 text-[13px] font-medium text-white disabled:pointer-events-none disabled:opacity-50',
                  tone === 'destructive'
                    ? 'bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85'
                    : 'bg-white/12 hover:bg-white/16',
                )}
              >
                {busy ? (
                  <>
                    <CircleNotch size={20} weight="bold" className="animate-spin" aria-hidden />
                    <span className="sr-only">{confirmLabel}</span>
                  </>
                ) : (
                  confirmLabel
                )}
              </motion.button>
            </DialogFooter>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default ActionModal
