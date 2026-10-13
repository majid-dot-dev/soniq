import type { Icon } from '@phosphor-icons/react'
import {
  ChartLineUpIcon,
  CompassIcon,
  HeartIcon,
  MicrophoneStageIcon,
  MusicNotesIcon,
  PackageIcon,
  SmileyIcon,
  SparkleIcon,
  UsersIcon,
  WaveformIcon,
} from '@phosphor-icons/react'
import { dashboardHref } from '@/lib/host'

export const EASE = [0.16, 1, 0.3, 1] as const
export const SIDEBAR_COLLAPSED_KEY = 'soniq.marketplace.sidebarCollapsed'

export function studioFlow(path: string, accessToken?: string | null) {
  const url = new URL(dashboardHref(accessToken))
  url.pathname = path
  return url.toString()
}

export type NavItem = { to: string; label: string; icon: Icon; end?: boolean }
export type NavSection = { label: string; items: NavItem[] }

export const sections: NavSection[] = [
  {
    label: 'Discover',
    items: [
      { to: '/marketplace/explore', label: 'Explore', icon: CompassIcon },
      { to: '/marketplace/charts', label: 'Top charts', icon: ChartLineUpIcon },
      { to: '/marketplace', label: 'Made for you', icon: SparkleIcon, end: true },
      { to: '/marketplace/tracks', label: 'All Tracks', icon: WaveformIcon },
    ],
  },
  {
    label: 'Browse',
    items: [
      { to: '/marketplace/type-beats', label: 'Type Beats', icon: MicrophoneStageIcon },
      { to: '/marketplace/genres', label: 'Genres', icon: MusicNotesIcon },
      { to: '/marketplace/moods', label: 'Moods', icon: SmileyIcon },
      { to: '/marketplace/creators', label: 'Creators', icon: UsersIcon },
    ],
  },
  {
    label: 'Library',
    items: [
      { to: '/marketplace/favorites', label: 'Favorites', icon: HeartIcon },
      { to: '/marketplace/packs', label: 'All packs', icon: PackageIcon },
    ],
  },
]

/** Secondary destinations shown in the mobile “More” sheet (primary tabs cover the rest). */
export const moreSections: NavSection[] = [
  {
    label: 'Discover',
    items: [
      { to: '/marketplace/charts', label: 'Top charts', icon: ChartLineUpIcon },
      { to: '/marketplace', label: 'Made for you', icon: SparkleIcon, end: true },
    ],
  },
  {
    label: 'Browse',
    items: [
      { to: '/marketplace/type-beats', label: 'Type Beats', icon: MicrophoneStageIcon },
      { to: '/marketplace/genres', label: 'Genres', icon: MusicNotesIcon },
      { to: '/marketplace/moods', label: 'Moods', icon: SmileyIcon },
      { to: '/marketplace/creators', label: 'Creators', icon: UsersIcon },
    ],
  },
  {
    label: 'Library',
    items: [{ to: '/marketplace/packs', label: 'All packs', icon: PackageIcon }],
  },
]

const MORE_ROUTE_MATCHERS = [
  '/marketplace/charts',
  '/marketplace/type-beats',
  '/marketplace/genres',
  '/marketplace/moods',
  '/marketplace/creators',
  '/marketplace/packs',
  '/marketplace/producers',
] as const

export function isMoreRoute(pathname: string) {
  if (pathname === '/marketplace' || pathname === '/marketplace/') return true
  return MORE_ROUTE_MATCHERS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
