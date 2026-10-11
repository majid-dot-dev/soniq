import { useMemo, useState } from 'react'
import {
  CheckIcon,
  EnvelopeSimpleIcon,
  LinkSimpleIcon,
  SealCheckIcon,
  XIcon,
  type Icon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export type ShareTrack = {
  id: string
  title: string
  producer: string
  cover: string
  genre?: string
  bpm?: number
  verified?: boolean
}

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
    transition: { duration: 0.36, ease: EASE },
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

const channelItem = {
  hidden: { opacity: 0, y: 10, scale: 0.88 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 420, damping: 22 },
  },
}

const channelRow = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function trackShareUrl(trackId: string) {
  const path = `/marketplace/tracks/${trackId}`
  if (typeof window === 'undefined') return path
  return `${window.location.origin}${path}`
}

function shareMessage(track: ShareTrack) {
  return `Listen to “${track.title}” by ${track.producer} on Soniq`
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

function openShareWindow(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer,width=640,height=720')
}

function ShareTrackModalBody({
  track,
  onClose,
}: {
  track: ShareTrack
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const url = useMemo(() => trackShareUrl(track.id), [track.id])
  const message = shareMessage(track)
  const springTap = { type: 'spring' as const, stiffness: 420, damping: 24 }

  const channels: {
    id: string
    label: string
    href: string
    icon?: Icon
    imageSrc?: string
  }[] = [
    {
      id: 'x',
      label: 'X',
      imageSrc: '/assets/x.png',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      imageSrc: '/assets/facebook.png',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      imageSrc: '/assets/whatsapp.png',
      href: `https://wa.me/?text=${encodeURIComponent(`${message}\n${url}`)}`,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      imageSrc: '/assets/telegram.png',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`,
    },
    {
      id: 'email',
      label: 'Email',
      icon: EnvelopeSimpleIcon,
      href: `mailto:?subject=${encodeURIComponent(`${track.title} — ${track.producer}`)}&body=${encodeURIComponent(`${message}\n\n${url}`)}`,
    },
  ]

  async function handleCopy() {
    const ok = await copyText(url)
    if (!ok) {
      toast.error('Couldn’t copy link')
      return
    }
    setCopied(true)
    toast.success('Link copied')
    window.setTimeout(() => setCopied(false), 1600)
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
            Share track
          </DialogTitle>
          <DialogDescription className="mt-1 truncate text-[13px] text-ink-mute">
            <span className="text-ink-2">{track.title}</span>
            <span className="text-ink-faint"> · </span>
            <span className="inline-flex items-center gap-1">
              {track.producer}
              {track.verified !== false ? (
                <SealCheckIcon
                  size={12}
                  weight="fill"
                  className="shrink-0 text-sky-400"
                  aria-label="Verified"
                />
              ) : null}
            </span>
          </DialogDescription>
        </motion.div>
        <motion.button
          type="button"
          aria-label="Close"
          variants={reduce ? undefined : fadeUp}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
          transition={springTap}
          onClick={onClose}
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/8 hover:text-white"
        >
          <XIcon size={16} weight="bold" />
        </motion.button>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <motion.div variants={reduce ? undefined : fadeUp}>
          <p className="text-[12px] font-medium text-ink-mute">Share to</p>
          <motion.div
            variants={reduce ? undefined : channelRow}
            className="mt-3 grid grid-cols-5 gap-2"
          >
            {channels.map((channel) => {
              const Icon = channel.icon
              return (
                <motion.button
                  key={channel.id}
                  type="button"
                  variants={reduce ? undefined : channelItem}
                  whileHover={reduce ? undefined : { y: -2, scale: 1.04 }}
                  whileTap={reduce ? undefined : { scale: 0.94 }}
                  transition={springTap}
                  onClick={() => {
                    if (channel.id === 'email') {
                      window.location.href = channel.href
                      return
                    }
                    openShareWindow(channel.href)
                  }}
                  className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-ink-2 transition-colors hover:bg-white/6 hover:text-white"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-white/8">
                    {channel.imageSrc ? (
                      <img
                        src={channel.imageSrc}
                        alt=""
                        aria-hidden
                        className="size-5 object-contain"
                      />
                    ) : Icon ? (
                      <Icon size={20} weight="fill" />
                    ) : null}
                  </span>
                  <span className="text-[11px] font-medium">{channel.label}</span>
                </motion.button>
              )
            })}
          </motion.div>
        </motion.div>

        <motion.div variants={reduce ? undefined : fadeUp}>
          <p className="text-[12px] font-medium text-ink-mute">Or copy link</p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={url}
              aria-label="Track link"
              onFocus={(event) => event.currentTarget.select()}
              className="h-11 min-w-0 flex-1 truncate rounded-full bg-white/6 px-4 text-[13px] text-ink-2 outline-none ring-1 ring-white/10"
            />
            <motion.button
              type="button"
              onClick={() => void handleCopy()}
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={springTap}
              className="inline-flex h-11 w-[6.75rem] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold text-black"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <CheckIcon size={16} weight="bold" />
                    Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <LinkSimpleIcon size={16} />
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function ShareTrackModal({
  track,
  open,
  onClose,
}: {
  track: ShareTrack | null
  open: boolean
  onClose: () => void
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
          <ShareTrackModalBody key={track.id} track={track} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
