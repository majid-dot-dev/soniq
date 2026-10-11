const DASHBOARD_HOSTS = new Set(['dashboard.soundsoniq.com', 'dashboard.localhost'])

export function isDashboardHost(hostname = window.location.hostname) {
  return DASHBOARD_HOSTS.has(hostname)
}

export function loginHref() {
  const { protocol, hostname, port } = window.location
  const portSuffix = port ? `:${port}` : ''

  if (hostname === 'dashboard.soundsoniq.com') return 'https://www.soundsoniq.com/login'
  if (hostname === 'dashboard.localhost') {
    return `${protocol}//localhost${portSuffix}/login`
  }

  return '/login'
}

export function dashboardHref(accessToken?: string | null) {
  const { protocol, hostname, port } = window.location
  const portSuffix = port ? `:${port}` : ''

  let href: string
  if (hostname === 'www.soundsoniq.com' || hostname === 'soundsoniq.com') {
    href = 'https://dashboard.soundsoniq.com/'
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    href = `${protocol}//dashboard.localhost${portSuffix}/`
  } else if (isDashboardHost(hostname)) {
    href = `${protocol}//${hostname}${portSuffix}/`
  } else {
    href = '/'
  }

  if (!accessToken) return href

  const url = new URL(href, window.location.origin)
  url.hash = `access_token=${encodeURIComponent(accessToken)}`
  return url.toString()
}

/** Pull a one-time access-token handoff out of the URL hash (cross-subdomain auth). */
export function consumeAccessTokenHandoff() {
  const { hash, pathname, search } = window.location
  if (!hash.startsWith('#access_token=')) return null

  const token = decodeURIComponent(hash.slice('#access_token='.length).split('&')[0] ?? '')
  window.history.replaceState(null, '', `${pathname}${search}`)
  return token || null
}
