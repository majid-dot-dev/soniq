import { useEffect, useState, type ReactNode } from 'react'
import {
  Bell,
  Bank,
  CaretDown,
  Check,
  CreditCard,
  DeviceMobile,
  GearSix,
  LockKey,
  Plus,
  ShieldCheck,
  Trash,
  UserCircle,
  X,
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import {
  defaultNotifications,
  defaultPayoutMethods,
  defaultPreferences,
  defaultProfile,
  defaultSecurity,
  emptyBankDraft,
  emptyPaypalDraft,
  languages,
  lastLoginAt,
  notificationGroups,
  profileGenreOptions,
  settingsNav,
  timezones,
  type BankDraft,
  type NotificationSettings,
  type PaypalDraft,
  type PreferenceSettings,
  type ProfileSettings,
  type SecuritySettings,
  type SettingsPayoutMethod,
  type SettingsSection,
  type TwoFactorMethod,
} from '@/features/dashboard/settings'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const navIcons = {
  profile: UserCircle,
  security: LockKey,
  payouts: Bank,
  notifications: Bell,
  preferences: GearSix,
} as const

const fieldClass =
  'mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-ink-mute transition-[box-shadow,background-color] focus:bg-white/10 focus:ring-1 focus:ring-white/15'

const selectClass =
  'mt-2 w-full appearance-none rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none transition-[box-shadow,background-color] focus:bg-white/10 focus:ring-1 focus:ring-white/15'

export default function Settings() {
  const reduce = useReducedMotion()
  const [section, setSection] = useState<SettingsSection>('profile')
  const [profile, setProfile] = useState(defaultProfile)
  const [security, setSecurity] = useState(defaultSecurity)
  const [notifications, setNotifications] = useState(defaultNotifications)
  const [payoutMethods, setPayoutMethods] = useState(defaultPayoutMethods)
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [savedAt, setSavedAt] = useState(0)

  function markSaved() {
    setSavedAt(Date.now())
  }

  useEffect(() => {
    if (!savedAt) return
    const timer = window.setTimeout(() => setSavedAt(0), 2200)
    return () => window.clearTimeout(timer)
  }, [savedAt])

  return (
    <div className="h-full min-h-0 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]">
            Settings
          </h1>
          <p className="mt-2 max-w-xl text-[14px] text-ink-mute">
            Edit your public brand, login security, payout methods, and alerts.
          </p>
        </div>
        <AnimatePresence>
          {savedAt ? (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-yield-bright/15 px-3 py-1.5 text-[12px] font-medium text-yield-bright"
            >
              <Check size={14} weight="bold" />
              Saved
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="flex min-w-0 flex-col gap-3">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl bg-white/5 p-1.5 ring-1 ring-white/10 lg:flex-col lg:overflow-visible">
            {settingsNav.map((item) => {
              const active = section === item.id
              const Icon = navIcons[item.id]
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={cn(
                    'relative shrink-0 rounded-xl px-3.5 py-2.5 text-left transition-colors lg:px-3',
                    active ? 'text-white' : 'text-ink-mute hover:text-white',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="settings-nav"
                      className="absolute inset-0 rounded-xl bg-white/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative z-10 flex items-center gap-2.5 text-[13px] font-medium lg:text-[14px]">
                    <Icon size={16} className="shrink-0" />
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
          <p className="px-1 text-[12px] text-ink-faint">
            Last login{' '}
            <span className="text-ink-mute">
              {format(new Date(lastLoginAt), 'MMM d · h:mm a')}
            </span>
          </p>
        </aside>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="min-w-0"
          >
            {section === 'profile' ? (
              <ProfilePanel
                value={profile}
                onChange={setProfile}
                onSave={markSaved}
              />
            ) : null}
            {section === 'security' ? (
              <SecurityPanel
                value={security}
                onChange={setSecurity}
                onSave={markSaved}
              />
            ) : null}
            {section === 'payouts' ? (
              <PayoutsPanel
                methods={payoutMethods}
                onChange={(next) => {
                  setPayoutMethods(next)
                  markSaved()
                }}
              />
            ) : null}
            {section === 'notifications' ? (
              <NotificationsPanel
                value={notifications}
                onChange={(next) => {
                  setNotifications(next)
                  markSaved()
                }}
              />
            ) : null}
            {section === 'preferences' ? (
              <PreferencesPanel
                value={preferences}
                onChange={setPreferences}
                onSave={markSaved}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function PanelShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
      <div>
        <h2 className="text-[18px] font-medium text-white">{title}</h2>
        <p className="mt-1 text-[13px] text-ink-mute">{description}</p>
      </div>
      <div className="mt-6">{children}</div>
      {footer ? <div className="mt-6 border-t border-white/8 pt-5">{footer}</div> : null}
    </section>
  )
}

function SaveButton({
  onClick,
  label = 'Save changes',
  disabled = false,
}: {
  onClick: () => void
  label?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 items-center justify-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  )
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block min-w-0', className)}>
      <span className="text-[12px] font-medium text-ink-mute">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-[12px] text-ink-faint">{hint}</span> : null}
    </label>
  )
}

function ProfilePanel({
  value,
  onChange,
  onSave,
}: {
  value: ProfileSettings
  onChange: (value: ProfileSettings) => void
  onSave: () => void
}) {
  function patch<K extends keyof ProfileSettings>(key: K, next: ProfileSettings[K]) {
    onChange({ ...value, [key]: next })
  }

  function patchSocial(key: keyof ProfileSettings['social'], next: string) {
    onChange({ ...value, social: { ...value.social, [key]: next } })
  }

  return (
    <PanelShell
      title="Profile"
      description="Controls what shows on your Account page — photo, bio, and socials. Followers and posts stay on Account."
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <SaveButton onClick={onSave} />
          <Link
            to="/account"
            className="inline-flex h-9 items-center justify-center rounded-full bg-white/8 px-4 text-[13px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
          >
            View Account
          </Link>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-4">
        <img
          src={value.avatar}
          alt=""
          className="size-20 rounded-2xl object-cover ring-1 ring-white/12"
        />
        <div>
          <p className="text-[14px] font-medium text-white">Profile photo</p>
          <p className="mt-1 text-[12px] text-ink-mute">Square crop works best. JPG or PNG.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => patch('avatar', '/assets/avatar-1.jpg')}
              className="rounded-full px-3 py-1.5 text-[12px] font-medium text-ink-mute transition-colors hover:text-white"
            >
              Use sample
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Display name">
          <input
            type="text"
            value={value.displayName}
            onChange={(event) => patch('displayName', event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Username" hint="soundsoniq.com/u/…">
          <div className="relative mt-2">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] text-ink-faint">
              @
            </span>
            <input
              type="text"
              value={value.username}
              onChange={(event) =>
                patch('username', event.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))
              }
              className={cn(fieldClass, 'mt-0 pl-7')}
            />
          </div>
        </Field>
        <Field label="Location" className="sm:col-span-2">
          <input
            type="text"
            value={value.location}
            onChange={(event) => patch('location', event.target.value)}
            className={fieldClass}
            placeholder="City, country"
          />
        </Field>
        <Field label="Genres" hint="Pick the styles buyers should associate with you." className="sm:col-span-2">
          <div className="mt-2">
            <GenreMultiSelect value={value.genres} onChange={(genres) => patch('genres', genres)} />
          </div>
        </Field>
        <Field label="Bio" className="sm:col-span-2">
          <textarea
            value={value.bio}
            onChange={(event) => patch('bio', event.target.value)}
            rows={4}
            className={cn(fieldClass, 'resize-y')}
            placeholder="A short line about your sound."
          />
        </Field>
      </div>

      <div className="mt-8">
        <h3 className="text-[14px] font-medium text-white">Social links</h3>
        <p className="mt-1 text-[12px] text-ink-mute">Shown on your public profile.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(
            [
              ['instagram', 'Instagram'],
              ['twitter', 'X / Twitter'],
              ['youtube', 'YouTube channel ID'],
              ['tiktok', 'TikTok'],
              ['website', 'Website'],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label} className={key === 'website' ? 'sm:col-span-2' : undefined}>
              <input
                type="text"
                value={value.social[key]}
                onChange={(event) => patchSocial(key, event.target.value)}
                className={fieldClass}
                placeholder={key === 'website' ? 'https://' : ''}
              />
            </Field>
          ))}
        </div>
      </div>
    </PanelShell>
  )
}

function SecurityPanel({
  value,
  onChange,
  onSave,
}: {
  value: SecuritySettings
  onChange: (value: SecuritySettings) => void
  onSave: () => void
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordReady =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword

  function patch<K extends keyof SecuritySettings>(key: K, next: SecuritySettings[K]) {
    onChange({ ...value, [key]: next })
  }

  function saveIdentity() {
    onSave()
  }

  function savePassword() {
    if (!passwordReady) return
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    onSave()
  }

  return (
    <div className="flex flex-col gap-5">
      <PanelShell
        title="Security"
        description="Login email and the legal name used on licenses and contracts. Your public Account page is separate."
        footer={<SaveButton onClick={saveIdentity} label="Save identity" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Legal first name" hint="Printed on sales contracts.">
            <input
              type="text"
              value={value.firstName}
              onChange={(event) => patch('firstName', event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Legal last name">
            <input
              type="text"
              value={value.lastName}
              onChange={(event) => patch('lastName', event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field
            label="Email"
            hint="Used to sign in and receive receipts. Confirm changes by email later."
            className="sm:col-span-2"
          >
            <input
              type="email"
              value={value.email}
              onChange={(event) => patch('email', event.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>
      </PanelShell>

      <PanelShell
        title="Password"
        description="Choose a strong password you don’t reuse elsewhere."
        footer={
          <SaveButton onClick={savePassword} label="Update password" disabled={!passwordReady} />
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current password" className="sm:col-span-2">
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="New password" hint="At least 8 characters.">
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Confirm new password">
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>
        {newPassword && confirmPassword && newPassword !== confirmPassword ? (
          <p className="mt-3 text-[12px] text-rose-400">Passwords don’t match.</p>
        ) : null}
        {!passwordReady && (currentPassword || newPassword || confirmPassword) ? (
          <p className="mt-3 text-[12px] text-ink-faint">
            Enter your current password and a matching new password to update.
          </p>
        ) : null}
      </PanelShell>

      <TwoFactorPanel value={value} onChange={onChange} onSave={onSave} />

      <section className="rounded-3xl bg-rose-500/8 p-5 ring-1 ring-rose-500/20 sm:p-6">
        <h2 className="text-[18px] font-medium text-white">Close account</h2>
        <p className="mt-1 text-[13px] text-ink-mute">
          Permanently remove this login. Catalog, sales history, and licenses already sold to buyers are
          not deleted from their side.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex h-9 items-center justify-center rounded-full bg-rose-500/20 px-4 text-[13px] font-medium text-rose-300 transition-colors hover:bg-rose-500/30 hover:text-rose-200"
        >
          Request account closure
        </button>
      </section>
    </div>
  )
}

function TwoFactorPanel({
  value,
  onChange,
  onSave,
}: {
  value: SecuritySettings
  onChange: (value: SecuritySettings) => void
  onSave: () => void
}) {
  const [setupMethod, setSetupMethod] = useState<Exclude<TwoFactorMethod, null> | null>(null)
  const [code, setCode] = useState('')
  const [phoneDraft, setPhoneDraft] = useState(value.phone)
  const codeReady = /^\d{6}$/.test(code.trim())

  function startSetup(method: Exclude<TwoFactorMethod, null>) {
    setSetupMethod(method)
    setCode('')
    if (method === 'sms') setPhoneDraft(value.phone)
  }

  function cancelSetup() {
    setSetupMethod(null)
    setCode('')
  }

  function confirmSetup() {
    if (!setupMethod || !codeReady) return
    if (setupMethod === 'sms' && phoneDraft.trim().length < 8) return
    onChange({
      ...value,
      twoFactorEnabled: true,
      twoFactorMethod: setupMethod,
      phone: setupMethod === 'sms' ? phoneDraft.trim() : value.phone,
      backupCodesRemaining: 8,
    })
    setSetupMethod(null)
    setCode('')
    onSave()
  }

  function disableTwoFactor() {
    onChange({
      ...value,
      twoFactorEnabled: false,
      twoFactorMethod: null,
      backupCodesRemaining: 0,
    })
    cancelSetup()
    onSave()
  }

  function regenerateBackupCodes() {
    onChange({ ...value, backupCodesRemaining: 8 })
    onSave()
  }

  const methodLabel =
    value.twoFactorMethod === 'app'
      ? 'Authenticator app'
      : value.twoFactorMethod === 'sms'
        ? `SMS · ${value.phone || 'phone'}`
        : null

  return (
    <PanelShell
      title="Two-factor authentication"
      description="Add a second step when you sign in. Recommended for anyone selling on SoundSoniq."
    >
      {value.twoFactorEnabled && !setupMethod ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/8">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-yield-bright/15 text-yield-bright">
              <ShieldCheck size={18} weight="fill" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-white">2FA is on</p>
              <p className="mt-0.5 text-[12px] text-ink-mute">{methodLabel}</p>
            </div>
            <button
              type="button"
              onClick={disableTwoFactor}
              className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
            >
              Turn off
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/8">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-white">Backup codes</p>
              <p className="mt-0.5 text-[12px] text-ink-mute">
                {value.backupCodesRemaining} unused codes left. Keep them somewhere safe.
              </p>
            </div>
            <button
              type="button"
              onClick={regenerateBackupCodes}
              className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
            >
              Regenerate
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => startSetup('app')}
              className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
            >
              Switch to authenticator
            </button>
            <button
              type="button"
              onClick={() => startSetup('sms')}
              className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
            >
              Switch to SMS
            </button>
          </div>
        </div>
      ) : null}

      {!value.twoFactorEnabled && !setupMethod ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => startSetup('app')}
            className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-4 text-left ring-1 ring-white/8 transition-colors hover:bg-white/8"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/8 text-ink-2">
              <ShieldCheck size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-medium text-white">Authenticator app</span>
              <span className="mt-0.5 block text-[12px] text-ink-mute">
                Use Authy, Google Authenticator, or 1Password.
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => startSetup('sms')}
            className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-4 text-left ring-1 ring-white/8 transition-colors hover:bg-white/8"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/8 text-ink-2">
              <DeviceMobile size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-medium text-white">Text message</span>
              <span className="mt-0.5 block text-[12px] text-ink-mute">
                Get a 6-digit code by SMS when you sign in.
              </span>
            </span>
          </button>
        </div>
      ) : null}

      <AnimatePresence initial={false}>
        {setupMethod ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:p-5"
          >
            {setupMethod === 'app' ? (
              <div>
                <p className="text-[14px] font-medium text-white">Set up authenticator</p>
                <p className="mt-1 text-[12px] text-ink-mute">
                  Scan this key in your app, then enter the 6-digit code it shows.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="grid size-28 place-items-center rounded-2xl bg-white text-[11px] font-medium tracking-wide text-black">
                    QR PLACEHOLDER
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-ink-mute">Or enter this code manually</p>
                    <p className="mt-1 font-mono text-[13px] tracking-[0.08em] text-white tnum">
                      SNIQ · 7K4M · P2QX · 9HLD
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[14px] font-medium text-white">Set up SMS</p>
                <p className="mt-1 text-[12px] text-ink-mute">
                  We’ll text a code to this number whenever you sign in from a new device.
                </p>
                <Field label="Phone number" className="mt-4">
                  <input
                    type="tel"
                    value={phoneDraft}
                    onChange={(event) => setPhoneDraft(event.target.value)}
                    className={fieldClass}
                    placeholder="+234 801 234 5678"
                  />
                </Field>
              </div>
            )}

            <Field label="Verification code" className="mt-4" hint="Enter the 6-digit code to confirm.">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                className={cn(fieldClass, 'tracking-[0.2em] tnum')}
                placeholder="000000"
              />
            </Field>

            <div className="mt-4 flex flex-wrap gap-2">
              <SaveButton
                onClick={confirmSetup}
                label="Enable 2FA"
                disabled={
                  !codeReady || (setupMethod === 'sms' && phoneDraft.trim().length < 8)
                }
              />
              <button
                type="button"
                onClick={cancelSetup}
                className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PanelShell>
  )
}

function GenreMultiSelect({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) {
  function toggle(option: string, checked: boolean) {
    onChange(checked ? [...value, option] : value.filter((item) => item !== option))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          fieldClass,
          'mt-0 flex min-h-11 items-center justify-between gap-2 text-left',
          value.length === 0 && 'text-ink-mute',
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {value.length === 0 ? (
            'Select genres'
          ) : (
            value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[12px] font-medium text-white"
              >
                {item}
                <span
                  role="button"
                  aria-label={`Remove ${item}`}
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onChange(value.filter((current) => current !== item))
                  }}
                  className="grid size-3.5 place-items-center"
                >
                  <X size={10} weight="bold" />
                </span>
              </span>
            ))
          )}
        </span>
        <CaretDown size={14} className="shrink-0 text-ink-mute" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-64 overflow-auto bg-[rgba(16,16,18,0.96)] p-1.5 text-white ring-white/15">
        {profileGenreOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={value.includes(option)}
            closeOnClick={false}
            onCheckedChange={(checked) => toggle(option, checked)}
            className="cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-ink-2 focus:bg-white/8 focus:text-white focus:**:text-white data-checked:text-white"
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationsPanel({
  value,
  onChange,
}: {
  value: NotificationSettings
  onChange: (value: NotificationSettings) => void
}) {
  function patchChannel(
    key: keyof NotificationSettings,
    channel: 'email' | 'inApp',
    checked: boolean,
  ) {
    onChange({
      ...value,
      [key]: { ...value[key], [channel]: checked },
    })
  }

  function setGroupAll(groupKeys: (keyof NotificationSettings)[], channel: 'email' | 'inApp', on: boolean) {
    const next = { ...value }
    for (const key of groupKeys) {
      next[key] = { ...next[key], [channel]: on }
    }
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-5">
      <PanelShell
        title="Notifications"
        description="Choose what reaches email versus the bell. Grouped by sales, money, social, and product."
      >
        <div className="flex flex-col gap-5">
          {notificationGroups.map((group) => {
            const keys = group.rows.map((row) => row.key)
            const allEmail = keys.every((key) => value[key].email)
            const allInApp = keys.every((key) => value[key].inApp)
            return (
              <div key={group.title} className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/8 bg-white/4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-white">{group.title}</p>
                    <p className="mt-0.5 text-[12px] text-ink-mute">{group.detail}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setGroupAll(keys, 'email', !allEmail)}
                      className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
                    >
                      {allEmail ? 'Email off' : 'Email on'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupAll(keys, 'inApp', !allInApp)}
                      className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
                    >
                      {allInApp ? 'In-app off' : 'In-app on'}
                    </button>
                  </div>
                </div>
                <div className="hidden grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] gap-3 border-b border-white/8 px-4 py-2 text-[11px] font-medium tracking-[0.04em] text-ink-faint uppercase sm:grid">
                  <span>Alert</span>
                  <span className="text-center">Email</span>
                  <span className="text-center">In-app</span>
                </div>
                {group.rows.map((row, index) => (
                  <div
                    key={row.key}
                    className={cn(
                      'grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] sm:items-center',
                      index > 0 && 'border-t border-white/8',
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-white">{row.title}</p>
                      <p className="mt-0.5 text-[12px] text-ink-mute">{row.detail}</p>
                    </div>
                    <label className="flex items-center justify-between gap-3 sm:justify-center">
                      <span className="text-[12px] text-ink-mute sm:sr-only">Email</span>
                      <Switch
                        checked={value[row.key].email}
                        onCheckedChange={(checked) => patchChannel(row.key, 'email', checked)}
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3 sm:justify-center">
                      <span className="text-[12px] text-ink-mute sm:sr-only">In-app</span>
                      <Switch
                        checked={value[row.key].inApp}
                        onCheckedChange={(checked) => patchChannel(row.key, 'inApp', checked)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        <p className="mt-4 flex items-center gap-2 text-[12px] text-ink-faint">
          <Bell size={13} />
          Changes save as you toggle.
        </p>
      </PanelShell>
    </div>
  )
}

function PayoutsPanel({
  methods,
  onChange,
}: {
  methods: SettingsPayoutMethod[]
  onChange: (value: SettingsPayoutMethod[]) => void
}) {
  const [adding, setAdding] = useState<'bank' | 'paypal' | null>(null)
  const [bankDraft, setBankDraft] = useState<BankDraft>(emptyBankDraft)
  const [paypalDraft, setPaypalDraft] = useState<PaypalDraft>(emptyPaypalDraft)

  const bankReady =
    bankDraft.accountName.trim().length > 1 &&
    bankDraft.bankName.trim().length > 1 &&
    bankDraft.routingNumber.replace(/\D/g, '').length >= 9 &&
    bankDraft.accountNumber.replace(/\D/g, '').length >= 4

  const paypalReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalDraft.email.trim())

  function setDefault(id: string) {
    onChange(methods.map((method) => ({ ...method, isDefault: method.id === id })))
  }

  function removeMethod(id: string) {
    const remaining = methods.filter((method) => method.id !== id)
    if (remaining.length && !remaining.some((method) => method.isDefault)) {
      remaining[0] = { ...remaining[0], isDefault: true }
    }
    onChange(remaining)
  }

  function addBank() {
    if (!bankReady) return
    const last4 = bankDraft.accountNumber.replace(/\D/g, '').slice(-4)
    const next: SettingsPayoutMethod = {
      id: `bank-${Date.now()}`,
      type: 'bank',
      label: `${bankDraft.bankName} ····${last4}`,
      detail: `ACH · ${bankDraft.accountType === 'checking' ? 'Checking' : 'Savings'} · ${bankDraft.accountName}`,
      isDefault: methods.length === 0,
      status: 'Pending',
    }
    onChange([...methods, next])
    setBankDraft(emptyBankDraft)
    setAdding(null)
  }

  function addPaypal() {
    if (!paypalReady) return
    const next: SettingsPayoutMethod = {
      id: `paypal-${Date.now()}`,
      type: 'paypal',
      label: 'PayPal',
      detail: paypalDraft.email.trim(),
      isDefault: methods.length === 0,
      status: 'Verified',
    }
    onChange([...methods, next])
    setPaypalDraft(emptyPaypalDraft)
    setAdding(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <PanelShell
        title="Payout methods"
        description="Where Wallet withdrawals go. Set a default bank or PayPal. Withdraw from Wallet when you’re ready."
        footer={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAdding(adding === 'bank' ? null : 'bank')}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/8 px-3.5 text-[13px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
            >
              <Plus size={14} />
              Add bank
            </button>
            <button
              type="button"
              onClick={() => setAdding(adding === 'paypal' ? null : 'paypal')}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/8 px-3.5 text-[13px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
            >
              <Plus size={14} />
              Add PayPal
            </button>
            <Link
              to="/wallet"
              className="inline-flex h-9 items-center justify-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white"
            >
              Open Wallet
            </Link>
          </div>
        }
      >
        {methods.length === 0 ? (
          <p className="rounded-2xl bg-white/5 px-4 py-10 text-center text-[13px] text-ink-mute">
            No payout methods yet. Add a bank account or PayPal.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/8"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/8 text-ink-2">
                  {method.type === 'bank' ? <Bank size={18} /> : <CreditCard size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-medium text-white">{method.label}</p>
                    {method.isDefault ? (
                      <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-medium text-rose-300">
                        Default
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-medium',
                        method.status === 'Verified'
                          ? 'bg-yield-bright/15 text-yield-bright'
                          : 'bg-amber-400/15 text-amber-300',
                      )}
                    >
                      {method.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-mute">{method.detail}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!method.isDefault ? (
                    <button
                      type="button"
                      onClick={() => setDefault(method.id)}
                      className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
                    >
                      Make default
                    </button>
                  ) : null}
                  <button
                    type="button"
                    aria-label={`Remove ${method.label}`}
                    onClick={() => removeMethod(method.id)}
                    className="grid size-8 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/8 hover:text-rose-300"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelShell>

      <AnimatePresence initial={false}>
        {adding === 'bank' ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <PanelShell
              title="Add bank account"
              description="US ACH for now. We’ll verify micro-deposits before the first withdrawal."
              footer={
                <div className="flex flex-wrap gap-2">
                  <SaveButton onClick={addBank} label="Save bank" disabled={!bankReady} />
                  <button
                    type="button"
                    onClick={() => {
                      setAdding(null)
                      setBankDraft(emptyBankDraft)
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Account holder name" className="sm:col-span-2">
                  <input
                    type="text"
                    value={bankDraft.accountName}
                    onChange={(event) => setBankDraft({ ...bankDraft, accountName: event.target.value })}
                    className={fieldClass}
                    placeholder="Name on the account"
                  />
                </Field>
                <Field label="Bank name">
                  <input
                    type="text"
                    value={bankDraft.bankName}
                    onChange={(event) => setBankDraft({ ...bankDraft, bankName: event.target.value })}
                    className={fieldClass}
                    placeholder="Chase"
                  />
                </Field>
                <Field label="Account type">
                  <select
                    value={bankDraft.accountType}
                    onChange={(event) =>
                      setBankDraft({
                        ...bankDraft,
                        accountType: event.target.value as BankDraft['accountType'],
                      })
                    }
                    className={selectClass}
                  >
                    <option value="checking" className="bg-[#121214]">
                      Checking
                    </option>
                    <option value="savings" className="bg-[#121214]">
                      Savings
                    </option>
                  </select>
                </Field>
                <Field label="Routing number">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={bankDraft.routingNumber}
                    onChange={(event) =>
                      setBankDraft({ ...bankDraft, routingNumber: event.target.value.replace(/\D/g, '').slice(0, 9) })
                    }
                    className={fieldClass}
                    placeholder="9 digits"
                  />
                </Field>
                <Field label="Account number">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={bankDraft.accountNumber}
                    onChange={(event) =>
                      setBankDraft({
                        ...bankDraft,
                        accountNumber: event.target.value.replace(/\D/g, '').slice(0, 17),
                      })
                    }
                    className={fieldClass}
                    placeholder="Account number"
                  />
                </Field>
              </div>
            </PanelShell>
          </motion.div>
        ) : null}

        {adding === 'paypal' ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <PanelShell
              title="Add PayPal"
              description="Withdrawals can go to this PayPal email."
              footer={
                <div className="flex flex-wrap gap-2">
                  <SaveButton onClick={addPaypal} label="Save PayPal" disabled={!paypalReady} />
                  <button
                    type="button"
                    onClick={() => {
                      setAdding(null)
                      setPaypalDraft(emptyPaypalDraft)
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              }
            >
              <Field label="PayPal email">
                <input
                  type="email"
                  value={paypalDraft.email}
                  onChange={(event) => setPaypalDraft({ email: event.target.value })}
                  className={fieldClass}
                  placeholder="you@email.com"
                />
              </Field>
            </PanelShell>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function PreferencesPanel({
  value,
  onChange,
  onSave,
}: {
  value: PreferenceSettings
  onChange: (value: PreferenceSettings) => void
  onSave: () => void
}) {
  return (
    <PanelShell
      title="Preferences"
      description="Language for the dashboard and how dates are framed."
      footer={<SaveButton onClick={onSave} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Language">
          <select
            value={value.language}
            onChange={(event) => onChange({ ...value, language: event.target.value })}
            className={selectClass}
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value} className="bg-[#121214]">
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Timezone">
          <select
            value={value.timezone}
            onChange={(event) => onChange({ ...value, timezone: event.target.value })}
            className={selectClass}
          >
            {timezones.map((item) => (
              <option key={item.value} value={item.value} className="bg-[#121214]">
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <p className="mt-4 flex items-center gap-2 text-[12px] text-ink-faint">
        <GearSix size={13} />
        Sales, Stats, and Wallet charts follow this timezone later.
      </p>
    </PanelShell>
  )
}
