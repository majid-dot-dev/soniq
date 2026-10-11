import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-provider'
import {
  useRegister,
  useStartSignup,
  useVerifySignupOtp,
} from '@/features/auth/services'
import { getErrorMessage } from '@/lib/api/errors'
import { dashboardHref } from '@/lib/host'
import { toast, toastApiError } from '@/lib/toast'
import { cn } from '@/lib/utils'
import {
  AuthDivider,
  AuthField,
  AuthGoogleButton,
  AuthPasswordField,
  AuthShell,
  AuthSubmit,
} from './auth-shell'

type LoginStep = 'email' | 'password'
type SignupStep = 'email' | 'otp' | 'password'
type Step = LoginStep | SignupStep

const OTP_LENGTH = 6
const RESEND_SECONDS = 45

export function AuthFlow({ from }: { from: 'login' | 'signup' }) {
  const auth = useAuth()
  const startSignup = useStartSignup()
  const verifySignupOtp = useVerifySignupOtp()
  const register = useRegister()

  const [step, setStep] = useState<Step>('email')
  const [direction, setDirection] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [signupToken, setSignupToken] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [existingAccount, setExistingAccount] = useState(false)

  useEffect(() => {
    if (resendIn <= 0) return
    const id = window.setTimeout(() => setResendIn((value) => value - 1), 1000)
    return () => window.clearTimeout(id)
  }, [resendIn])

  function show(next: Step, dir: 1 | -1) {
    setExistingAccount(false)
    setDirection(dir)
    setStep(next)
  }

  function goToDashboard(accessToken?: string) {
    window.location.href = dashboardHref(accessToken)
  }

  function startResendTimer() {
    setResendIn(RESEND_SECONDS)
  }

  async function onEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = email.trim().toLowerCase()
    setEmail(next)
    setExistingAccount(false)

    if (from === 'login') {
      show('password', 1)
      return
    }

    setPending(true)
    try {
      await startSignup.mutateAsync({ email: next })
      setOtp('')
      setSignupToken(null)
      startResendTimer()
      show('otp', 1)
    } catch (err) {
      const message = getErrorMessage(err, 'Could not continue')
      if (/already|exists|registered/i.test(message)) {
        setExistingAccount(true)
      } else {
        toastApiError(err, 'Could not continue')
      }
    } finally {
      setPending(false)
    }
  }

  async function onVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (otp.length !== OTP_LENGTH) {
      toast.error(`Enter the ${OTP_LENGTH}-digit code`)
      return
    }

    setPending(true)
    try {
      const { signupToken: token } = await verifySignupOtp.mutateAsync({
        email,
        code: otp,
      })
      setSignupToken(token)
      show('password', 1)
    } catch {
      // API error toasted by axios interceptor
    } finally {
      setPending(false)
    }
  }

  async function onResendOtp() {
    if (resendIn > 0 || pending) return
    setPending(true)
    try {
      await startSignup.mutateAsync({ email })
      setOtp('')
      startResendTimer()
      toast.success('Code resent')
    } catch (err) {
      toastApiError(err, 'Could not resend code')
    } finally {
      setPending(false)
    }
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    try {
      const session = await auth.login({ email, password })
      goToDashboard(session.accessToken)
    } catch {
      // API error toasted by axios interceptor
    } finally {
      setPending(false)
    }
  }

  async function onCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!signupToken) {
      toast.error('Signup session expired. Start again.')
      show('email', -1)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setPending(true)
    try {
      const session = await register.mutateAsync({
        signupToken,
        password,
      })
      goToDashboard(session.accessToken)
    } catch {
      // API error toasted by axios interceptor
    } finally {
      setPending(false)
    }
  }

  const emailLine = (
    <p className="text-sm text-white/75">
      {email}{' '}
      <button type="button" onClick={() => show('email', -1)} className="underline underline-offset-4">
        Change
      </button>
    </p>
  )

  let title = from === 'login' ? 'Log in' : 'Get started'
  let footer: ReactNode
  let body: ReactNode

  if (from === 'login' && step === 'password') {
    title = 'Log in'
    body = (
      <form className="flex flex-col gap-4" onSubmit={onLogin}>
        {emailLine}
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Link to="/forgot-password" className="-mt-2 text-sm text-white/60 underline underline-offset-4">
          Forgot password?
        </Link>
        <AuthSubmit disabled={pending} loading={pending}>
          Log in
        </AuthSubmit>
      </form>
    )
  } else if (from === 'signup' && step === 'otp') {
    title = 'Check your email'
    body = (
      <form className="flex flex-col gap-4" onSubmit={onVerifyOtp}>
        <div className="space-y-1 text-sm text-white/65">
          <p>Enter the {OTP_LENGTH}-digit code we sent to</p>
          {emailLine}
        </div>
        <div className="py-5">
          <OtpInput value={otp} onChange={setOtp} disabled={pending} />
        </div>
        <AuthSubmit disabled={pending || otp.length !== OTP_LENGTH} loading={pending}>
          Verify email
        </AuthSubmit>
        <p className="text-center text-sm text-white/55">
          Didn’t get it?{' '}
          {resendIn > 0 ? (
            <span>Resend in {resendIn}s</span>
          ) : (
            <button
              type="button"
              onClick={onResendOtp}
              disabled={pending}
              className="underline underline-offset-4 disabled:opacity-50"
            >
              Resend code
            </button>
          )}
        </p>
      </form>
    )
  } else if (from === 'signup' && step === 'password') {
    title = 'Create your password'
    body = (
      <form className="flex flex-col gap-4" onSubmit={onCreateAccount}>
        {emailLine}
        <AuthPasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
        />
        <AuthPasswordField
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
        />
        <AuthSubmit disabled={pending} loading={pending}>
          Create account
        </AuthSubmit>
      </form>
    )
  } else {
    footer =
      from === 'login' ? (
        <>
          New here?{' '}
          <Link to="/signup" className="text-white underline underline-offset-4">
            Get started
          </Link>
        </>
      ) : (
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-white underline underline-offset-4">
            Log in
          </Link>
        </>
      )
    body = (
      <div className="flex flex-col gap-4">
        {existingAccount ? (
          <p className="rounded-xl border border-white/15 bg-white/8 px-3.5 py-3 text-sm text-white/80">
            This email already has an account.{' '}
            <Link to="/login" className="underline underline-offset-4">
              Log in
            </Link>
          </p>
        ) : null}
        <form className="flex flex-col gap-4" onSubmit={onEmail}>
          <AuthField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            autoFocus
            onChange={(event) => setEmail(event.target.value)}
          />
          <AuthSubmit disabled={pending} loading={pending}>
            Continue
          </AuthSubmit>
        </form>
        <AuthDivider />
        <AuthGoogleButton />
      </div>
    )
  }

  return (
    <AuthShell title={title} footer={footer} panelKey={`${from}-${step}`} direction={direction}>
      {body}
    </AuthShell>
  )
}

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? '')

  function write(next: string) {
    onChange(next.slice(0, OTP_LENGTH).replace(/\D/g, ''))
  }

  function focusAt(index: number) {
    refs.current[index]?.focus()
    refs.current[index]?.select()
  }

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1}`}
          maxLength={1}
          disabled={disabled}
          value={digit}
          autoFocus={index === 0}
          onChange={(event) => {
            const raw = event.target.value.replace(/\D/g, '')
            if (!raw) {
              const next = value.slice(0, index) + value.slice(index + 1)
              write(next)
              return
            }

            if (raw.length > 1) {
              write(raw)
              focusAt(Math.min(raw.length, OTP_LENGTH) - 1)
              return
            }

            const next = value.slice(0, index) + raw + value.slice(index + 1)
            write(next)
            if (index < OTP_LENGTH - 1) focusAt(index + 1)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digits[index] && index > 0) {
              focusAt(index - 1)
            }
          }}
          onPaste={(event) => {
            event.preventDefault()
            const pasted = event.clipboardData.getData('text').replace(/\D/g, '')
            if (!pasted) return
            write(pasted)
            focusAt(Math.min(pasted.length, OTP_LENGTH) - 1)
          }}
          className={cn(
            'h-12 w-10 rounded-xl border border-white/15 bg-white/8 text-center text-[18px] text-white outline-none sm:h-12 sm:w-11',
            'focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/15',
            'disabled:opacity-50',
          )}
        />
      ))}
    </div>
  )
}
