import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CheckIcon, HandshakeIcon, ShoppingBagOpenIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCap, formatMoney, formatTerm } from '@/features/licenses/lib/format'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
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

const coverPop = {
  hidden: { opacity: 0, scale: 0.82, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 420, damping: 22, mass: 0.7 },
  },
}

const listItem = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: EASE },
  },
}

const heightTransition = { duration: 0.38, ease: EASE }

/** Smoothly animates wrapper height when inner content size changes. */
function SmoothHeight({
  childKey,
  reduce,
  className,
  children,
}: {
  childKey: string
  reduce: boolean | null
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) {
      setHeight('auto')
      return
    }

    const ro = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.height
      if (typeof next === 'number') setHeight(next)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [childKey, reduce])

  return (
    <motion.div
      initial={false}
      animate={reduce ? undefined : { height }}
      transition={heightTransition}
      className={cn('overflow-hidden', className)}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}

type LicenseTrack = {
  id: string
  title: string
  producer: string
  genre: string
  bpm: number
  priceLabel: string
  cover: string
}

export type MarketplaceLicenseOption = {
  id: string
  name: string
  kind: 'lease' | 'exclusive' | 'free'
  description: string
  priceCents: number
  /** When set, buyers can negotiate / make an offer at or above this amount. */
  minOfferPrice: number | null
  filesDelivered: string[]
  streams: number | null
  distributionCopies: number | null
  freeDownloads: number | null
  radioStations: number | null
  monetizedMusicVideos: number | null
  nonMonetizedMusicVideos: number | null
  performancesForProfit: number | null
  termYears: number | null
  publishingLabel: string
}

export type LicenseCheckoutAction = 'cart' | 'buy' | 'negotiate'

function parsePriceDollars(label: string) {
  const n = Number(label.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 30
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** Mock lease tiers scaled from the track’s starting price (until marketplace API lands). */
export function licensesForTrack(track: LicenseTrack): MarketplaceLicenseOption[] {
  const base = Math.round(parsePriceDollars(track.priceLabel) * 100)
  return [
    {
      id: 'mp3',
      name: 'MP3 Lease',
      kind: 'lease',
      description: 'Tagged + untagged MP3 for non-exclusive use.',
      priceCents: base,
      minOfferPrice: null,
      filesDelivered: ['Tagged MP3', 'Untagged MP3'],
      streams: 50_000,
      distributionCopies: 2_000,
      freeDownloads: 0,
      radioStations: 0,
      monetizedMusicVideos: 1,
      nonMonetizedMusicVideos: 1,
      performancesForProfit: 0,
      termYears: 2,
      publishingLabel: 'Producer keeps publishing',
    },
    {
      id: 'wav',
      name: 'WAV Lease',
      kind: 'lease',
      description: 'Untagged WAV for higher-quality releases.',
      priceCents: Math.round(base * 1.67),
      minOfferPrice: null,
      filesDelivered: ['Tagged MP3', 'Untagged MP3', 'WAV'],
      streams: 100_000,
      distributionCopies: 3_000,
      freeDownloads: 0,
      radioStations: 1,
      monetizedMusicVideos: 1,
      nonMonetizedMusicVideos: 2,
      performancesForProfit: 0,
      termYears: 2,
      publishingLabel: 'Producer keeps publishing',
    },
    {
      id: 'trackout',
      name: 'Trackout Lease',
      kind: 'lease',
      description: 'Stems included so you can mix around the beat.',
      priceCents: Math.round(base * 3.33),
      minOfferPrice: null,
      filesDelivered: ['Tagged MP3', 'Untagged MP3', 'WAV', 'Stems'],
      streams: 200_000,
      distributionCopies: 5_000,
      freeDownloads: 0,
      radioStations: 2,
      monetizedMusicVideos: 2,
      nonMonetizedMusicVideos: 2,
      performancesForProfit: 1,
      termYears: 2,
      publishingLabel: 'Producer keeps publishing',
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      kind: 'exclusive',
      description: 'One buyer. Beat comes off the store after sale.',
      priceCents: Math.round(base * 16.67),
      minOfferPrice: Math.round(base * 8.33),
      filesDelivered: ['Tagged MP3', 'Untagged MP3', 'WAV', 'Stems'],
      streams: null,
      distributionCopies: null,
      freeDownloads: null,
      radioStations: null,
      monetizedMusicVideos: null,
      nonMonetizedMusicVideos: null,
      performancesForProfit: null,
      termYears: null,
      publishingLabel: '50% producer / 50% buyer',
    },
  ]
}

export function licenseInclusionRows(license: MarketplaceLicenseOption) {
  const rows: string[] = [
    `Files: ${license.filesDelivered.join(', ')}`,
    `Audio streams: ${formatCap(license.streams)}`,
    `Distribution copies: ${formatCap(license.distributionCopies)}`,
    `Free downloads: ${formatCap(license.freeDownloads)}`,
    `Radio stations: ${formatCap(license.radioStations)}`,
    `Monetized music videos: ${formatCap(license.monetizedMusicVideos)}`,
    `Non-monetized music videos: ${formatCap(license.nonMonetizedMusicVideos)}`,
    `Paid performances: ${formatCap(license.performancesForProfit)}`,
    `Term: ${formatTerm(license.termYears)}`,
    `Publishing: ${license.publishingLabel}`,
  ]

  if (license.kind === 'exclusive') {
    rows.unshift('Exclusive rights — beat removed from further sale')
  } else if (license.kind === 'lease') {
    rows.unshift('Non-exclusive — producer may sell to others')
  }

  if (license.minOfferPrice != null) {
    rows.push(`Offers accepted from ${formatMoney(license.minOfferPrice)}`)
  }

  return rows
}

function dollarsInputToCents(value: string) {
  const n = Number(value.replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}

function LicenseModalBody({
  track,
  licenses,
  initialLicenseId,
  intent = 'add',
  onClose,
  onCheckout,
}: {
  track: LicenseTrack
  licenses?: MarketplaceLicenseOption[]
  /** Pre-select this license (e.g. current cart tier when changing). */
  initialLicenseId?: string
  /** `change` = update cart line; hides buy/negotiate. */
  intent?: 'add' | 'change'
  onClose: () => void
  onCheckout?: (
    action: LicenseCheckoutAction,
    license: MarketplaceLicenseOption,
    offerCents?: number,
  ) => void
}) {
  const reduce = useReducedMotion()
  const options = useMemo(() => licenses ?? licensesForTrack(track), [track, licenses])
  const [selectedId, setSelectedId] = useState(() => {
    if (initialLicenseId && options.some((l) => l.id === initialLicenseId)) {
      return initialLicenseId
    }
    return options[0]?.id ?? ''
  })
  const [negotiating, setNegotiating] = useState(false)
  const [offerDollars, setOfferDollars] = useState('')
  const [offerError, setOfferError] = useState<string | null>(null)

  const selected = options.find((l) => l.id === selectedId) ?? options[0]
  if (!selected) return null

  const inclusions = licenseInclusionRows(selected)
  const canNegotiate = intent === 'add' && selected.minOfferPrice != null
  const isFree = selected.priceCents === 0
  const isChange = intent === 'change'
  const springTap = { type: 'spring' as const, stiffness: 420, damping: 24 }

  function selectLicense(id: string) {
    setSelectedId(id)
    setNegotiating(false)
    setOfferDollars('')
    setOfferError(null)
  }

  function complete(action: LicenseCheckoutAction, offerCents?: number) {
    onCheckout?.(action, selected, offerCents)
    if (action === 'cart') {
      toast.success(
        isChange
          ? `Updated “${track.title}” to ${selected.name}`
          : `Added “${track.title}” (${selected.name}) to cart`,
      )
    }
    onClose()
  }

  function submitOffer() {
    if (selected.minOfferPrice == null) return
    const cents = dollarsInputToCents(offerDollars)
    if (cents == null) {
      setOfferError('Enter a valid offer amount')
      return
    }
    if (cents < selected.minOfferPrice) {
      setOfferError(`Minimum offer is ${formatMoney(selected.minOfferPrice)}`)
      return
    }
    if (cents > selected.priceCents) {
      setOfferError(`Offer can’t exceed list price (${formatMoney(selected.priceCents)})`)
      return
    }
    setOfferError(null)
    complete('negotiate', cents)
  }

  return (
    <motion.div
      variants={reduce ? undefined : container}
      initial={reduce ? false : 'hidden'}
      animate="show"
      className="flex flex-col"
    >
      <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4 sm:px-6">
        <motion.span
          aria-hidden
          variants={reduce ? undefined : coverPop}
          className={cn(
            'grid size-14 shrink-0 place-items-center rounded-xl text-[15px] font-semibold tracking-tight text-white/80',
            track.cover,
          )}
        >
          {initials(track.title)}
        </motion.span>
        <motion.div variants={reduce ? undefined : fadeUp} className="min-w-0 flex-1 pt-0.5">
          <DialogTitle className="truncate text-[17px] font-semibold tracking-[-0.02em] text-white">
            {track.title}
          </DialogTitle>
          <DialogDescription className="mt-0.5 truncate text-[13px] text-ink-mute">
            {track.producer}
            <span className="text-ink-faint"> · </span>
            {track.genre}
            <span className="text-ink-faint"> · </span>
            {track.bpm} BPM
          </DialogDescription>
        </motion.div>
        <motion.div variants={reduce ? undefined : fadeUp}>
          <DialogClose
            aria-label="Close"
            className="grid size-8 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/8 hover:text-white cursor-pointer"
          >
            <XIcon size={16} />
          </DialogClose>
        </motion.div>
      </div>

      <div className="max-h-[min(70svh,520px)] overflow-y-auto px-5 py-4 sm:px-6">
        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-faint"
        >
          Choose a license
        </motion.p>
        <motion.ul
          variants={reduce ? undefined : container}
          className="mt-3 space-y-2"
          role="listbox"
          aria-label="License options"
        >
          {options.map((license) => {
            const active = license.id === selected.id
            return (
              <motion.li key={license.id} variants={reduce ? undefined : listItem}>
                <motion.button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => selectLicense(license.id)}
                  whileHover={reduce ? undefined : { scale: 1.01 }}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  transition={springTap}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors cursor-pointer',
                    active
                      ? 'bg-white/10 ring-1 ring-white/16'
                      : 'bg-white/4 ring-1 ring-transparent hover:bg-white/7',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-full border transition-colors',
                      active
                        ? 'border-white bg-white text-black'
                        : 'border-white/25 text-transparent',
                    )}
                  >
                    <CheckIcon size={12} weight="bold" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="block truncate text-[14px] font-medium text-white">
                        {license.name}
                      </span>
                      {license.minOfferPrice != null ? (
                        <span className="shrink-0 rounded-md bg-white/8 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-mute">
                          Negotiable
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-ink-mute">
                      {license.description}
                    </span>
                  </span>
                  <span className="tnum shrink-0 text-[14px] font-semibold text-white">
                    {license.priceCents === 0 ? 'Free' : formatMoney(license.priceCents)}
                  </span>
                </motion.button>
              </motion.li>
            )
          })}
        </motion.ul>

        <motion.div variants={reduce ? undefined : fadeUp} className="mt-5">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-faint">
            What&apos;s included
          </p>
          <SmoothHeight childKey={selected.id} reduce={reduce} className="mt-3">
            <ul className="space-y-2.5">
              {inclusions.map((row, i) => (
                <motion.li
                  key={`${selected.id}-${row}`}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.34,
                    delay: reduce ? 0 : i * 0.035,
                    ease: EASE,
                  }}
                  className="flex items-start gap-2.5 text-[13px] text-ink-2"
                >
                  <CheckIcon
                    size={14}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-emerald-400/90"
                  />
                  <span>{row}</span>
                </motion.li>
              ))}
            </ul>
          </SmoothHeight>
        </motion.div>

        <AnimatePresence initial={false}>
          {negotiating && canNegotiate ? (
            <motion.div
              key="offer"
              initial={reduce ? false : { opacity: 0, height: 0, y: 8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={reduce ? undefined : { opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-5 rounded-2xl bg-white/4 p-3.5 ring-1 ring-white/10">
                <label
                  htmlFor="license-offer"
                  className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-faint"
                >
                  Your offer
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-[14px] text-ink-mute">
                    $
                  </span>
                  <input
                    id="license-offer"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder={
                      selected.minOfferPrice != null ? String(selected.minOfferPrice / 100) : '0'
                    }
                    value={offerDollars}
                    onChange={(e) => {
                      setOfferDollars(e.target.value)
                      if (offerError) setOfferError(null)
                    }}
                    className="h-11 w-full rounded-xl bg-black/30 pl-8 pr-3 text-[15px] text-white outline-none ring-1 ring-white/10 placeholder:text-ink-faint focus:ring-white/25"
                  />
                </div>
                <p className="mt-2 text-[12px] text-ink-mute">
                  Minimum {formatMoney(selected.minOfferPrice!)} · List{' '}
                  {formatMoney(selected.priceCents)}
                </p>
                {offerError ? (
                  <p className="mt-1.5 text-[12px] text-rose-300">{offerError}</p>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="border-t border-white/8 px-5 py-4 sm:px-6"
      >
        <SmoothHeight
          childKey={`${negotiating && canNegotiate ? 'offer' : 'buy'}-${canNegotiate ? 'n' : 'x'}`}
          reduce={reduce}
        >
          <AnimatePresence mode="wait" initial={false}>
            {negotiating && canNegotiate ? (
              <motion.div
                key="negotiate-actions"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="space-y-2"
              >
                <motion.button
                  type="button"
                  onClick={submitOffer}
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={springTap}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 text-[14px] font-semibold text-black"
                >
                  <HandshakeIcon size={18} weight="regular" />
                  Send offer
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setNegotiating(false)
                    setOfferError(null)
                  }}
                  whileHover={reduce ? undefined : { scale: 1.01 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  transition={springTap}
                  className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full px-4 text-[13px] font-medium text-ink-mute transition-colors hover:bg-white/6 hover:text-white"
                >
                  Back
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="purchase-actions"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="space-y-2"
              >
                {isChange ? (
                  <motion.button
                    type="button"
                    onClick={() => complete('cart')}
                    whileHover={reduce ? undefined : { scale: 1.02 }}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    transition={springTap}
                    className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-black"
                  >
                    <ShoppingBagOpenIcon size={17} weight="regular" />
                    Update cart · {formatMoney(selected.priceCents)}
                  </motion.button>
                ) : (
                  <>
                    <div className="flex gap-2">
                      {!isFree ? (
                        <motion.button
                          type="button"
                          onClick={() => complete('cart')}
                          whileHover={reduce ? undefined : { scale: 1.02 }}
                          whileTap={reduce ? undefined : { scale: 0.97 }}
                          transition={springTap}
                          className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white/8 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/12"
                        >
                          <ShoppingBagOpenIcon size={17} weight="regular" />
                          Add to cart
                        </motion.button>
                      ) : null}
                      <motion.button
                        type="button"
                        onClick={() => complete('buy')}
                        whileHover={reduce ? undefined : { scale: 1.02 }}
                        whileTap={reduce ? undefined : { scale: 0.97 }}
                        transition={springTap}
                        className={cn(
                          'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-black',
                          isFree ? 'w-full' : 'flex-1',
                        )}
                      >
                        {isFree ? 'Download free' : `Buy now · ${formatMoney(selected.priceCents)}`}
                      </motion.button>
                    </div>
                    {canNegotiate ? (
                      <motion.button
                        type="button"
                        onClick={() => {
                          setNegotiating(true)
                          setOfferDollars(
                            selected.minOfferPrice != null
                              ? String(selected.minOfferPrice / 100)
                              : '',
                          )
                          setOfferError(null)
                        }}
                        whileHover={reduce ? undefined : { scale: 1.01 }}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        transition={springTap}
                        className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-[13px] font-medium text-ink-2 transition-colors hover:bg-white/6 hover:text-white"
                      >
                        <HandshakeIcon size={16} weight="regular" />
                        Negotiate · from {formatMoney(selected.minOfferPrice!)}
                      </motion.button>
                    ) : null}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </SmoothHeight>
      </motion.div>
    </motion.div>
  )
}

export default function LicenseModal({
  track,
  open,
  onClose,
  licenses,
  initialLicenseId,
  intent = 'add',
  onCheckout,
}: {
  track: LicenseTrack | null
  open: boolean
  onClose: () => void
  licenses?: MarketplaceLicenseOption[]
  initialLicenseId?: string
  intent?: 'add' | 'change'
  onCheckout?: (
    action: LicenseCheckoutAction,
    license: MarketplaceLicenseOption,
    offerCents?: number,
  ) => void
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/70 backdrop-blur-sm duration-300 data-open:fade-in-0 data-closed:fade-out-0"
        className={cn(
          'gap-0 overflow-hidden rounded-3xl bg-[#161618] p-0 text-ink ring-0 ring-white/12',
          'w-full max-w-[calc(100%-2rem)] sm:max-w-md',
          'duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-open:zoom-in-95 data-open:slide-in-from-bottom-3 data-closed:zoom-out-95 data-closed:slide-out-to-bottom-2',
        )}
      >
        {track && open ? (
          <LicenseModalBody
            key={`${track.id}:${initialLicenseId ?? 'default'}:${intent}`}
            track={track}
            licenses={licenses}
            initialLicenseId={initialLicenseId}
            intent={intent}
            onClose={onClose}
            onCheckout={onCheckout}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}