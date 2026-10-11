import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActivateProfile, useCreateProfile } from '@/features/auth/services'
import type { ProfileType } from '@/features/auth/types'
import { IdentityStep } from '@/features/dashboard/onboarding/components/identity-step'
import {
  OnboardingActions,
  OnboardingBackLink,
  OnboardingContinueButton,
  OnboardingShell,
} from '@/features/dashboard/onboarding/components/onboarding-shell'
import { ReadyStep } from '@/features/dashboard/onboarding/components/ready-step'
import { TypeStep } from '@/features/dashboard/onboarding/components/type-step'
import {
  isValidUsername,
  ONBOARDING_STEPS,
  suggestUsername,
} from '@/features/dashboard/onboarding/constants'
import { getErrorMessage } from '@/lib/api/errors'
import { toast, toastApiError } from '@/lib/toast'

export default function Onboarding() {
  const navigate = useNavigate()
  const createProfile = useCreateProfile()
  const activateProfile = useActivateProfile()

  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [type, setType] = useState<ProfileType>('producer')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const step = ONBOARDING_STEPS[stepIndex]!
  const isFirst = stepIndex === 0

  function goTo(next: number) {
    setDirection(next > stepIndex ? 1 : -1)
    setStepIndex(next)
  }

  function goBack() {
    if (isFirst) return
    goTo(stepIndex - 1)
  }

  function goNext() {
    if (step.id === 'type') {
      goTo(1)
      return
    }

    if (step.id === 'identity') {
      const name = displayName.trim()
      const handle = username.trim().toLowerCase()

      if (name.length < 1) {
        toast.error('Display name is required')
        return
      }
      if (!isValidUsername(handle)) {
        toast.error('Username must be 3–30 characters: a–z, 0–9, underscore')
        return
      }

      setDisplayName(name)
      setUsername(handle)
      goTo(2)
    }
  }

  async function finish() {
    const name = displayName.trim()
    const handle = username.trim().toLowerCase()

    setPending(true)
    try {
      const { profile } = await createProfile.mutateAsync({
        type,
        displayName: name,
        username: handle,
        ...(avatar ? { avatar } : {}),
      })
      await activateProfile.mutateAsync(profile.id)
      navigate('/', { replace: true })
    } catch (err) {
      toastApiError(err, getErrorMessage(err, 'Could not create profile'))
    } finally {
      setPending(false)
    }
  }

  function onDisplayNameChange(value: string) {
    setDisplayName(value)
    if (!username || username === suggestUsername(displayName)) {
      setUsername(suggestUsername(value))
    }
  }

  const copy =
    step.id === 'type'
      ? {
          title: 'Set up your profile',
          description: 'Choose how you show up on SoundSoniq. You can add more later.',
        }
      : step.id === 'identity'
        ? {
            title: 'Name your profile',
            description: 'Add a photo and the name people will see.',
          }
        : {
            title: 'Looking good',
            description: 'Confirm your details, then jump into the dashboard.',
          }

  return (
    <OnboardingShell
      stepIndex={stepIndex}
      direction={direction}
      title={copy.title}
      description={copy.description}
    >
      {step.id === 'type' ? (
        <>
          <TypeStep value={type} onChange={setType} />
          <OnboardingActions>
            <OnboardingContinueButton onClick={goNext}>Continue</OnboardingContinueButton>
          </OnboardingActions>
        </>
      ) : null}

      {step.id === 'identity' ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            goNext()
          }}
        >
          <IdentityStep
            displayName={displayName}
            username={username}
            avatar={avatar}
            onDisplayNameChange={onDisplayNameChange}
            onUsernameChange={setUsername}
            onAvatarChange={setAvatar}
          />
          <OnboardingActions back={<OnboardingBackLink onClick={goBack} />}>
            <OnboardingContinueButton type="submit">Continue</OnboardingContinueButton>
          </OnboardingActions>
        </form>
      ) : null}

      {step.id === 'ready' ? (
        <>
          <ReadyStep
            type={type}
            displayName={displayName}
            username={username}
            avatar={avatar}
          />
          <OnboardingActions
            back={<OnboardingBackLink onClick={goBack} disabled={pending} />}
          >
            <OnboardingContinueButton onClick={() => void finish()} loading={pending}>
              Go to dashboard
            </OnboardingContinueButton>
          </OnboardingActions>
        </>
      ) : null}
    </OnboardingShell>
  )
}
