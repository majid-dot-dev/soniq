import { useEffect, useRef, useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BrandMark } from '@/features/marketplace/components/layout/brand-mark'
import { EASE } from '@/features/marketplace/components/layout/constants'
import { HeaderActions } from '@/features/marketplace/components/layout/header-actions'
import { SearchForm } from '@/features/marketplace/components/layout/search-form'

export function ContentHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!searchOpen) return
    const id = window.requestAnimationFrame(() => searchInputRef.current?.focus())
    return () => window.cancelAnimationFrame(id)
  }, [searchOpen])

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-4 sm:py-4">
      {/* Mobile — logo + search + account; primary nav lives in the bottom bar */}
      <div className="flex w-full items-center gap-1.5 lg:hidden">
        <AnimatePresence mode="wait" initial={false}>
          {searchOpen ? (
            <motion.div
              key="search"
              className="flex min-w-0 flex-1 items-center"
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 4 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
            >
              <SearchForm
                className="w-full"
                inputRef={searchInputRef}
                onDone={() => setSearchOpen(false)}
                onCancel={() => setSearchOpen(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chrome"
              className="flex min-w-0 flex-1 items-center justify-between gap-2"
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
            >
              <BrandMark size="header" className="min-w-0 truncate" />
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-white/8 hover:text-white"
                >
                  <MagnifyingGlassIcon size={18} />
                </button>
                <HeaderActions compact hideCart />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop */}
      <div className="hidden min-w-0 flex-1 items-center justify-between gap-3 lg:flex">
        <SearchForm className="max-w-md flex-1" />
        <HeaderActions />
      </div>
    </header>
  )
}
