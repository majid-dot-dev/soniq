import { beats } from '@/features/dashboard/beats'

export type StatsPeriod =
  | 'Last 7 days'
  | 'Last 30 days'
  | 'This month'
  | 'Last 3 months'
  | 'This year'
  | 'All time'

export type DailyStat = {
  date: string
  plays: number
  listeners: number
  freeDownloads: number
  visits: number
  sales: number
}

export type TrafficSource = {
  id: string
  label: string
  detail: string
  weight: number
}

export type CountryListen = {
  country: string
  code: string
  weight: number
}

/** Daily engagement from mid-2025 through Sep 2026 (mock). */
export const dailyStats: DailyStat[] = buildDailyStats()

export const trafficSources: TrafficSource[] = [
  { id: 'marketplace', label: 'Marketplace', detail: 'Browse, search, and related', weight: 0.38 },
  { id: 'store', label: 'Your store', detail: 'Pro page and embeds', weight: 0.27 },
  { id: 'share', label: 'Direct share', detail: 'Links you send', weight: 0.18 },
  { id: 'external', label: 'External', detail: 'Social and ads', weight: 0.12 },
  { id: 'chat', label: 'Chats', detail: 'In-app conversations', weight: 0.05 },
]

export const countryListens: CountryListen[] = [
  { country: 'United States', code: 'US', weight: 0.38 },
  { country: 'United Kingdom', code: 'GB', weight: 0.2 },
  { country: 'Nigeria', code: 'NG', weight: 0.17 },
  { country: 'Germany', code: 'DE', weight: 0.14 },
  { country: 'Brazil', code: 'BR', weight: 0.11 },
]

const liveBeats = beats.filter((beat) => beat.status === 'Live' || beat.plays > 0)

function buildDailyStats(): DailyStat[] {
  const points: DailyStat[] = []
  const start = new Date(2025, 6, 1)
  const end = new Date(2026, 8, 22)

  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const day = cursor.getDate()
    const dow = cursor.getDay()
    const weekend = dow === 0 || dow === 6 ? 0.82 : 1
    const growth = 0.72 + ((year - 2025) * 12 + month) * 0.018
    const wave = 1 + Math.sin(day * 0.55 + month) * 0.12
    const spike = day % 11 === 0 ? 1.35 : day % 7 === 3 ? 1.18 : 1
    const plays = Math.round(420 * growth * wave * spike * weekend)
    const listeners = Math.round(plays * (0.62 + (day % 5) * 0.02))
    const freeDownloads = Math.round(plays * (0.04 + (day % 4) * 0.008))
    const visits = Math.round(plays * (0.28 + (month % 3) * 0.02))
    const sales =
      plays > 700 && day % 5 === 0 ? 2 : plays > 550 && day % 4 === 1 ? 1 : plays > 800 && day % 9 === 0 ? 3 : 0

    points.push({
      date: formatKey(cursor),
      plays,
      listeners,
      freeDownloads,
      visits,
      sales,
    })
  }

  return points
}

function formatKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function periodStart(period: StatsPeriod, now = new Date()) {
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  if (period === 'All time') return null
  if (period === 'This year') return new Date(year, 0, 1)
  if (period === 'This month') return new Date(year, month, 1)
  if (period === 'Last 3 months') return new Date(year, month - 2, 1)
  if (period === 'Last 7 days') return new Date(year, month, day - 6)
  return new Date(year, month, day - 29)
}

export function filterDailyStats(period: StatsPeriod, rows = dailyStats, now = new Date()) {
  const start = periodStart(period, now)
  if (!start) return rows
  const startKey = formatKey(start)
  const endKey = formatKey(now)
  return rows.filter((row) => row.date >= startKey && row.date <= endKey)
}

export function sumDaily(rows: DailyStat[]) {
  return rows.reduce(
    (acc, row) => {
      acc.plays += row.plays
      acc.listeners += row.listeners
      acc.freeDownloads += row.freeDownloads
      acc.visits += row.visits
      acc.sales += row.sales
      return acc
    },
    { plays: 0, listeners: 0, freeDownloads: 0, visits: 0, sales: 0 },
  )
}

export function conversionRate(plays: number, sales: number) {
  if (plays <= 0) return 0
  return Math.round((sales / plays) * 10000) / 100
}

export function topBeatsForPeriod(period: StatsPeriod, rows: DailyStat[]) {
  const totals = sumDaily(rows)
  const allTotals = sumDaily(dailyStats)
  const scale = allTotals.plays > 0 ? totals.plays / allTotals.plays : 0

  return liveBeats
    .map((beat) => {
      const plays = Math.round(beat.plays * scale)
      const sales = Math.max(0, Math.round(beat.sales * scale))
      const freeDownloads = Math.round(plays * 0.055)
      return {
        id: beat.id,
        title: beat.title,
        image: beat.image,
        genre: beat.genre[0] ?? 'Beat',
        plays,
        sales,
        freeDownloads,
        conversion: conversionRate(plays, sales),
      }
    })
    .filter((beat) => beat.plays > 0 || period === 'All time')
    .sort((a, b) => b.plays - a.plays || b.sales - a.sales)
}

export function sourcesForPeriod(rows: DailyStat[]) {
  const plays = sumDaily(rows).plays
  return trafficSources
    .map((source) => ({
      ...source,
      plays: Math.round(plays * source.weight),
    }))
    .sort((a, b) => b.plays - a.plays)
}

export function countriesForPeriod(rows: DailyStat[]) {
  const { plays, listeners } = sumDaily(rows)
  return countryListens
    .map((entry) => ({
      country: entry.country,
      code: entry.code,
      plays: Math.round(plays * entry.weight),
      listeners: Math.round(listeners * entry.weight),
    }))
    .sort((a, b) => b.plays - a.plays)
}

export function flagSrc(code: string) {
  return `/flags/${code.toLowerCase()}.png`
}
