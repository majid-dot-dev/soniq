import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-provider'
import { dashboardHref, loginHref } from '@/lib/host'

function LoadingScreen({ light = false }: { light?: boolean }) {
  return (
    <div
      className={
        light
          ? 'grid min-h-svh place-items-center bg-[#0c0c0e] text-[14px] text-white/60'
          : 'grid min-h-svh place-items-center bg-[#0c0c0e] text-[14px] text-ink-mute'
      }
    >
      Loading…
    </div>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const shouldRedirect = status !== 'loading' && status !== 'authenticated'

  useEffect(() => {
    if (!shouldRedirect) return
    window.location.href = loginHref()
  }, [shouldRedirect])

  if (status === 'loading' || shouldRedirect) {
    return <LoadingScreen />
  }

  return children
}

export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { status, accessToken } = useAuth()
  const shouldRedirect = status === 'authenticated'

  useEffect(() => {
    if (!shouldRedirect) return
    window.location.href = dashboardHref(accessToken)
  }, [shouldRedirect, accessToken])

  if (status === 'loading' || shouldRedirect) {
    return <LoadingScreen light />
  }

  return children
}

/** Dashboard routes: no profiles → /onboarding; has profiles → block /onboarding. */
export function RequireProfile({ children }: { children: ReactNode }) {
  const { status, profiles } = useAuth()
  const location = useLocation()
  const onOnboarding = location.pathname === '/onboarding'

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (status !== 'authenticated') {
    return null
  }

  if (profiles.length === 0 && !onOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  if (profiles.length > 0 && onOnboarding) {
    return <Navigate to="/" replace />
  }

  return children
}
