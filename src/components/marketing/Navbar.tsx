import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container, MarketingButton } from './primitives'
import { EASE } from './motion'

const platformLinks = [
  { label: 'Distribution', desc: 'Release to every major DSP', href: '#release' },
  { label: 'Marketplace', desc: 'Buy and sell beats & licenses', href: '#marketplace' },
  { label: 'Royalties', desc: 'Splits, statements, and reporting', href: '#royalties' },
  { label: 'Analytics', desc: 'Catalog and audience insight', href: '#grow' },
  { label: 'Payments', desc: 'Balances, payouts, and transfers', href: '#financial' },
  { label: 'Rights', desc: 'Masters, compositions, collaborators', href: '#rights' },
]

const resourceLinks = [
  { label: 'Help Center', desc: 'Answers from the Soniq team', href: '#' },
  { label: 'Blog', desc: 'Notes on the business of music', href: '#' },
  { label: 'Guides', desc: 'Playbooks for artists & labels', href: '#' },
  { label: 'API', desc: 'Build on the Soniq platform', href: '#' },
  { label: 'Documentation', desc: 'Integration & release docs', href: '#' },
]

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group relative rounded-full px-3.5 py-2 text-sm text-black transition-colors hover:text-rose-600"
    >
      {children}
      <span className="absolute inset-x-3.5 bottom-1.5 h-[1.5px] origin-left scale-x-0 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  )
}

function NavDropdown({
  label,
  items,
}: {
  label: string
  items: { label: string; desc: string; href: string }[]
}) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const closeTimer = useRef<number | null>(null)

  const openMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpen(true)
  }

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 90)
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          scheduleClose()
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className="group relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm text-black transition-colors hover:text-rose-600"
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: EASE }}
          className="flex"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
        <span
          className={cn(
            'absolute inset-x-3.5 bottom-1.5 h-[1.5px] origin-left bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 transition-transform duration-300',
            open ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? { opacity: 0, x: '-50%' } : { opacity: 0, y: 10, scale: 0.96, x: '-50%' }}
            animate={reduceMotion ? { opacity: 1, x: '-50%' } : { opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={reduceMotion ? { opacity: 0, x: '-50%' } : { opacity: 0, y: 6, scale: 0.98, x: '-50%' }}
            transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: EASE }}
            style={{ transformOrigin: 'top center' }}
            className="absolute left-1/2 top-full z-40 w-120 pt-3"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.035,
                    delayChildren: reduceMotion ? 0 : 0.06,
                  },
                },
              }}
              className="grid grid-cols-2 gap-1 rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
            >
              {items.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.32, ease: EASE },
                    },
                  }}
                  whileHover={reduceMotion ? undefined : { y: -1 }}
                  className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-rose-50/70"
                >
                  <span className="text-[13.5px] font-medium text-black">{item.label}</span>
                  <span className="text-[12px] text-black/45">{item.desc}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-black/6 bg-white/80 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <Container className="flex h-[68px] items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="text-[22px] font-semibold tracking-[-0.02em] text-black">Sound<span className="text-rose-600">Soniq</span></span>
        </a>

        <nav className="hidden items-center gap-0.5 lg:flex">
          <NavDropdown label="Solutions" items={platformLinks} />
          <NavLink href="#artists">For Artists</NavLink>
          <NavLink href="#producers">For Producers</NavLink>
          <NavLink href="#labels">For Labels</NavLink>
          <NavDropdown label="Resources" items={resourceLinks} />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <MarketingButton variant="ghost" size="sm" href="#login">
            Log in
          </MarketingButton>
          <MarketingButton variant="primary" size="sm" href="#get-started" magnetic>
            Get started
          </MarketingButton>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <div
        className={cn(
          'fixed inset-x-0 top-[68px] z-40 origin-top border-t border-line-dark bg-ink-dark transition-all duration-200 lg:hidden',
          mobileOpen ? 'max-h-[calc(100vh-68px)] opacity-100' : 'pointer-events-none max-h-0 opacity-0',
        )}
        style={{ overflow: 'auto' }}
      >
        <Container className="flex flex-col gap-1 py-5">
          {[
            { label: 'Platform', href: '#platform' },
            { label: 'For Artists', href: '#artists' },
            { label: 'For Producers', href: '#producers' },
            { label: 'For Labels', href: '#labels' },
            { label: 'Resources', href: '#resources' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-3 text-[15px] font-medium text-white/70 hover:bg-white/[0.05] hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-line-dark pt-4">
            <MarketingButton variant="secondary" href="#login" className="w-full">
              Log in
            </MarketingButton>
            <MarketingButton variant="primary" href="#get-started" className="w-full">
              Get started
            </MarketingButton>
          </div>
        </Container>
      </div>
    </header>
  )
}
