import type { Icon } from '@phosphor-icons/react'
import { MicrophoneStage, Storefront, Waveform } from '@phosphor-icons/react'
import type { ProfileType } from '@/features/auth/types'

export const ONBOARDING_STEPS = [
  { id: 'type', label: 'Role', title: 'How will you use SoundSoniq?' },
  { id: 'identity', label: 'Profile', title: 'Name your profile' },
  { id: 'ready', label: 'Ready', title: 'Looking good' },
] as const

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]['id']

export type ProfileTypeMeta = {
  type: ProfileType
  label: string
  hint: string
  icon: Icon
}

export const PROFILE_TYPE_OPTIONS: ProfileTypeMeta[] = [
  {
    type: 'artist',
    label: 'Artist',
    hint: 'Release music, manage splits, and track royalties.',
    icon: MicrophoneStage,
  },
  {
    type: 'producer',
    label: 'Producer',
    hint: 'Sell tracks and kits, run licenses, and grow sales.',
    icon: Waveform,
  },
  {
    type: 'label',
    label: 'Label',
    hint: 'Run your roster, releases, and payouts in one place.',
    icon: Storefront,
  },
]

export function suggestUsername(displayName: string) {
  return displayName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 30)
}

export function isValidUsername(value: string) {
  return /^[a-z0-9_]{3,30}$/.test(value)
}
