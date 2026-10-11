import type { ComponentProps, ReactNode } from 'react'
import { useState } from 'react'
import { CircleNotch, Eye, EyeSlash } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const fieldClassName =
  'h-11 rounded-xl border-white/15 bg-white/8 px-3.5 text-[15px] text-white shadow-none placeholder:text-white/35 focus-visible:border-white/40 focus-visible:ring-white/15 md:text-[15px]'

const slide = {
  enter: (direction: number) => ({
    x: direction > 0 ? 56 : -56,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -56 : 56,
    opacity: 0,
  }),
}

const fade = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

export function AuthShell({
  title,
  children,
  footer,
  panelKey,
  direction = 1,
}: {
  title: string
  children: ReactNode
  footer?: ReactNode
  panelKey?: string
  direction?: number
}) {
  const reduced = useReducedMotion()
  const panel = (
    <>
      <h1 className="text-[28px] font-medium tracking-[-0.03em]">{title}</h1>
      <div className="mt-7">{children}</div>
      {footer ? <div className="mt-6 text-sm text-white/60">{footer}</div> : null}
    </>
  )

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-12 text-white sm:px-6">
      <img
        src="/assets/caught-in-joy-ptVBlniJi50-unsplash.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.9)]" />

      <div className="relative flex w-full max-w-[420px] flex-col items-center">
        <div className="w-full overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 px-6 py-8 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-2xl sm:px-8 sm:py-10">
          <Link to="/" className="text-[22px] font-semibold tracking-[-0.02em] text-white">
            Sound<span className="text-rose-500">Soniq</span>
          </Link>
          {panelKey ? (
            <div className="relative mt-8 overflow-hidden">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={panelKey}
                  custom={direction}
                  variants={reduced ? fade : slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduced ? 0.18 : 0.38, ease: EASE }}
                >
                  {panel}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="mt-8">{panel}</div>
          )}
        </div>
        <p className="mt-6 text-center text-[12px] text-white/45">
          © {new Date().getFullYear()} SoundSoniq. All rights reserved.
        </p>
      </div>
    </main>
  )
}

export function AuthField({ label, className, ...props }: { label: string } & ComponentProps<typeof Input>) {
  const id = props.id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13px] text-white/75">
        {label}
      </Label>
      <Input id={id} required className={cn(fieldClassName, className)} {...props} />
    </div>
  )
}

export function AuthPasswordField({
  label,
  className,
  ...props
}: { label: string } & Omit<ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = useState(false)
  const id = props.id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13px] text-white/75">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          required
          type={visible ? 'text' : 'password'}
          className={cn(fieldClassName, 'pr-11', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-white/45 transition-colors hover:text-white/80"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeSlash size={18} weight="bold" /> : <Eye size={18} weight="bold" />}
        </button>
      </div>
    </div>
  )
}

export function AuthSubmit({
  children,
  disabled,
  loading,
}: {
  children: ReactNode
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 text-[14.5px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
    >
      {loading ? (
        <CircleNotch size={20} weight="bold" className="animate-spin" aria-hidden />
      ) : (
        children
      )}
    </button>
  )
}

export function AuthGoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/8 text-[14.5px] font-medium text-white transition-colors hover:bg-white/12"
    >
      <GoogleMark />
      Continue with Google
    </button>
  )
}

export function AuthDivider({ label = 'or' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-white/12" />
      <span className="text-[12px] text-white/45">{label}</span>
      <span className="h-px flex-1 bg-white/12" />
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37.3 44 32 44 24c0-1.3-.1-2.7-.4-3.9z"
      />
    </svg>
  )
}
