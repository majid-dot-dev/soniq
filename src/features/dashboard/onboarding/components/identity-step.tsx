import { useId, useRef } from 'react'
import { Camera, User, X } from '@phosphor-icons/react'
import { isValidUsername } from '@/features/dashboard/onboarding/constants'
import { fileToAvatarDataUrl } from '@/features/dashboard/onboarding/lib/avatar'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const fieldClassName =
  'h-11 w-full rounded-xl border border-white/15 bg-white/8 px-3.5 text-[15px] text-white shadow-none outline-none placeholder:text-white/35 focus:border-white/40 focus:ring-2 focus:ring-white/15'

export function IdentityStep({
  displayName,
  username,
  avatar,
  onDisplayNameChange,
  onUsernameChange,
  onAvatarChange,
}: {
  displayName: string
  username: string
  avatar: string | null
  onDisplayNameChange: (value: string) => void
  onUsernameChange: (value: string) => void
  onAvatarChange: (value: string | null) => void
}) {
  const inputId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const handle = username.trim().toLowerCase()
  const usernameOk = handle.length === 0 || isValidUsername(handle)

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      onAvatarChange(dataUrl)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not use that image')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={cn(
              'group relative grid size-[88px] place-items-center overflow-hidden rounded-full border transition-colors',
              avatar
                ? 'border-white/20'
                : 'border-dashed border-white/25 bg-white/5 hover:border-white/40 hover:bg-white/8',
            )}
            aria-label={avatar ? 'Change profile photo' : 'Add profile photo'}
          >
            {avatar ? (
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              <User size={28} className="text-white/35 transition-colors group-hover:text-white/55" />
            )}
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/55 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={14} className="text-white" />
            </span>
          </button>

          {avatar ? (
            <button
              type="button"
              onClick={() => onAvatarChange(null)}
              className="absolute -top-0.5 -right-0.5 grid size-6 place-items-center rounded-full border border-white/20 bg-[#1a1214] text-white/70 transition-colors hover:bg-rose-500 hover:text-white"
              aria-label="Remove profile photo"
            >
              <X size={12} weight="bold" />
            </button>
          ) : null}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-[13px] font-medium text-rose-400 transition-colors hover:text-rose-300"
          >
            {avatar ? 'Change photo' : 'Add a photo'}
          </button>
          <p className="mt-0.5 text-[12px] text-white/40">Optional · JPG or PNG</p>
        </div>

        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => void onFileChange(event)}
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-white/70">Display name</span>
        <input
          name="displayName"
          type="text"
          autoComplete="nickname"
          autoFocus
          value={displayName}
          onChange={(event) => onDisplayNameChange(event.target.value)}
          placeholder="Shown on your public profile"
          maxLength={60}
          className={fieldClassName}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-white/70">Username</span>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[15px] text-white/35">
            @
          </span>
          <input
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value.toLowerCase())}
            placeholder="unique_handle"
            maxLength={30}
            spellCheck={false}
            className={cn(fieldClassName, 'pl-8', !usernameOk && 'border-rose-500/50')}
            aria-invalid={!usernameOk || undefined}
          />
        </div>
        <span className={cn('text-[12px]', usernameOk ? 'text-white/40' : 'text-rose-300')}>
          {usernameOk
            ? '3–30 characters: a–z, 0–9, underscore'
            : 'Use 3–30 characters: a–z, 0–9, underscore'}
        </span>
      </label>
    </div>
  )
}
