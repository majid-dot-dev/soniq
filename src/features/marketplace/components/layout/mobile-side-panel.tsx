import { useEffect, useId } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE, moreSections } from '@/features/marketplace/components/layout/constants'
import { SideLinks } from '@/features/marketplace/components/layout/side-nav'

export function MobileSidePanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
            onClick={onClose}
          />
          <motion.aside
            id="marketplace-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[min(88svh,42rem)] w-full flex-col rounded-t-[1.75rem] border-t border-white/12 bg-[#121110] shadow-[0_-24px_60px_rgba(0,0,0,0.5)]"
            initial={reduce ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: '100%' }}
            transition={{ duration: reduce ? 0 : 0.34, ease: EASE }}
          >
            <div className="flex shrink-0 flex-col items-center pt-2.5">
              <span className="h-1 w-10 rounded-full bg-white/20" aria-hidden />
              <div className="flex w-full items-center justify-between gap-3 pr-3 pl-6 pt-3 pb-2">
                <p id={titleId} className="text-[15px] font-semibold text-white">
                  More
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-white/8 hover:text-white"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <SideLinks
                navSections={moreSections}
                layoutId="marketplace-mobile-sidebar-active"
                onNavigate={onClose}
              />
              {/* <div className="mt-auto border-t border-white/8 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <SellCard />
              </div> */}
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
