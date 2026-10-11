import { useMemo, useState } from 'react'
import { DownloadSimple, Eye, Play, TrendUp, Users } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCompact, formatCount } from '@/features/dashboard/beats'
import {
  countriesForPeriod,
  conversionRate,
  filterDailyStats,
  flagSrc,
  sourcesForPeriod,
  sumDaily,
  topBeatsForPeriod,
  type StatsPeriod,
} from '@/features/dashboard/stats'
import { useWorkspace } from '@/features/dashboard/workspace'
import { DashboardPage } from '@/features/dashboard/components/dashboard-page'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const SPRING = { type: 'spring' as const, stiffness: 420, damping: 28 }
const SPRING_SOFT = { type: 'spring' as const, stiffness: 360, damping: 32 }

const periods: StatsPeriod[] = [
  'Last 7 days',
  'Last 30 days',
  'This month',
  'Last 3 months',
  'This year',
  'All time',
]

const periodLabels: Record<StatsPeriod, string> = {
  'Last 7 days': '7d',
  'Last 30 days': '30d',
  'This month': 'Month',
  'Last 3 months': '90d',
  'This year': 'Year',
  'All time': 'All',
}

function fadeUp(reduce: boolean, delay = 0) {
  if (reduce) return {}
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.48, delay, ease: EASE },
  }
}

const metricList = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const metricItem = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
}

function dayFrom(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function monthKey(value: string) {
  return value.slice(0, 7)
}

export default function Stats() {
  const { current } = useWorkspace()
  if (current.type !== 'Producer') {
    return <DashboardPage title="Stats" description="Plays and discovery across your catalog." />
  }
  return <ProducerStats />
}

function ProducerStats() {
  const reduce = useReducedMotion()
  const [period, setPeriod] = useState<StatsPeriod>('This month')

  const rows = useMemo(() => filterDailyStats(period), [period])
  const totals = useMemo(() => sumDaily(rows), [rows])
  const conversion = conversionRate(totals.plays, totals.sales)
  const chartData = useMemo(() => buildChartData(period, rows), [period, rows])
  const topBeats = useMemo(() => topBeatsForPeriod(period, rows).slice(0, 5), [period, rows])
  const sources = useMemo(() => sourcesForPeriod(rows), [rows])
  const countries = useMemo(() => countriesForPeriod(rows).slice(0, 6), [rows])
  const maxCountryPlays = countries[0]?.plays ?? 1
  const sourceChartData = useMemo(
    () => sources.map((source) => ({ label: source.label, plays: source.plays, detail: source.detail })),
    [sources],
  )

  const metrics = [
    {
      label: 'Plays',
      value: formatCompact(totals.plays),
      hint: `${formatCount(totals.plays)} total`,
      icon: Play,
    },
    {
      label: 'Listeners',
      value: formatCompact(totals.listeners),
      hint: 'Unique in period',
      icon: Users,
    },
    {
      label: 'Free downloads',
      value: formatCompact(totals.freeDownloads),
      hint: 'Tagged MP3 grabs',
      icon: DownloadSimple,
    },
    {
      label: 'Store visits',
      value: formatCompact(totals.visits),
      hint: 'Profile and embeds',
      icon: Eye,
    },
    {
      label: 'Conversion',
      value: `${conversion}%`,
      hint: `${formatCount(totals.sales)} sales from plays`,
      icon: TrendUp,
      accent: true,
    },
  ] as const

  return (
    <div className="h-full min-h-0 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <motion.div {...fadeUp(!!reduce)} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]"
          >
            Stats
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
            className="mt-2 text-[14px] text-ink-mute"
          >
            Plays, discovery, and what converts. Orders stay in Sales.
          </motion.p>
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.08, ease: EASE }}
          className="flex flex-wrap gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10"
        >
          {periods.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={cn(
                'relative rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors',
                period === item ? 'text-white' : 'text-ink-mute hover:text-white',
              )}
            >
              {period === item ? (
                <motion.span
                  layoutId="stats-period"
                  className="absolute inset-0 rounded-full bg-white/12"
                  transition={SPRING_SOFT}
                />
              ) : null}
              <span className="relative z-10">{periodLabels[item]}</span>
            </button>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
        variants={reduce ? undefined : metricList}
        initial={reduce ? false : 'hidden'}
        animate="show"
      >
        {metrics.map((metric) => (
          <Metric
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
            icon={metric.icon}
            accent={'accent' in metric ? metric.accent : false}
            reduce={!!reduce}
          />
        ))}
      </motion.div>

      <motion.section
        {...fadeUp(!!reduce, 0.2)}
        whileHover={reduce ? undefined : { y: -1 }}
        transition={SPRING_SOFT}
        className="mt-5 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-medium text-white">Plays over time</h2>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${period}-plays-summary`}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="mt-1 text-[13px] text-ink-mute"
              >
                {formatCompact(totals.plays)} plays · {formatCompact(totals.listeners)} listeners
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-6 h-64 w-full sm:h-72">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={period}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="size-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stats-plays" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    minTickGap={28}
                    tick={{ fill: '#8f8672', fontSize: 12 }}
                    dy={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#8f8672', fontSize: 12 }}
                    tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}k` : String(value))}
                    width={48}
                  />
                  <Tooltip
                    cursor={{ stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1 }}
                    content={<ChartTooltip />}
                  />
                  <Area
                    type="monotone"
                    dataKey="plays"
                    name="Plays"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#stats-plays)"
                    activeDot={{ r: 4, fill: '#fff', stroke: '#f43f5e', strokeWidth: 2 }}
                    isAnimationActive={!reduce}
                    animationDuration={700}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      <motion.div {...fadeUp(!!reduce, 0.28)} className="mt-5 grid gap-5 xl:grid-cols-2">
        <motion.section
          whileHover={reduce ? undefined : { y: -1 }}
          transition={SPRING_SOFT}
          className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6"
        >
          <div className="shrink-0">
            <h2 className="text-[18px] font-medium text-white">Top tracks</h2>
            <p className="mt-1 text-[13px] text-ink-mute">What listeners play most in this period.</p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {topBeats.length === 0 ? (
              <motion.p
                key="empty-beats"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                className="mt-8 rounded-2xl bg-white/5 px-4 py-10 text-center text-[13px] text-ink-mute"
              >
                No plays in this period.
              </motion.p>
            ) : (
              <motion.div
                key={`${period}-beats`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 flex flex-col"
              >
                {topBeats.map((beat, index) => (
                  <BeatRow key={beat.id} beat={beat} index={index} reduce={!!reduce} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section
          whileHover={reduce ? undefined : { y: -1 }}
          transition={SPRING_SOFT}
          className="flex flex-col rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6 xl:h-0 xl:min-h-full"
        >
          <div className="shrink-0">
            <h2 className="text-[18px] font-medium text-white">Traffic sources</h2>
            <p className="mt-1 text-[13px] text-ink-mute">Where plays are coming from.</p>
          </div>
          <div className="mt-4 min-h-52 w-full flex-1 sm:min-h-56">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${period}-sources`}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="size-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sourceChartData}
                    margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
                    barCategoryGap="22%"
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tick={{ fill: '#8f8672', fontSize: 11 }}
                      dy={8}
                      height={36}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#8f8672', fontSize: 12 }}
                      tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}k` : String(value))}
                      width={40}
                    />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<SourceTooltip />} />
                    <Bar
                      dataKey="plays"
                      name="Plays"
                      fill="#f43f5e"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                      isAnimationActive={!reduce}
                      animationDuration={650}
                      animationBegin={60}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>
      </motion.div>

      <motion.section
        {...fadeUp(!!reduce, 0.36)}
        whileHover={reduce ? undefined : { y: -1 }}
        transition={SPRING_SOFT}
        className="mt-5 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-medium text-white">Top countries</h2>
            <p className="mt-1 text-[13px] text-ink-mute">
              Where listeners are — buyer markets live in Sales.
            </p>
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${period}-countries`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            {countries.map((entry, index) => (
              <CountryCard
                key={entry.country}
                entry={entry}
                index={index}
                maxPlays={maxCountryPlays}
                reduce={!!reduce}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.section>
    </div>
  )
}

function Metric({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
  reduce,
}: {
  label: string
  value: string
  hint: string
  icon: typeof Play
  accent?: boolean
  reduce: boolean
}) {
  return (
    <motion.div
      variants={reduce ? undefined : metricItem}
      whileHover={
        reduce
          ? undefined
          : {
              y: -3,
              backgroundColor: 'rgba(255,255,255,0.07)',
              transition: SPRING_SOFT,
            }
      }
      className={cn('min-w-0 rounded-2xl bg-white/5 p-4 ring-1 ring-white/8', accent && 'ring-rose-500/25')}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] text-ink-mute">{label}</p>
        <motion.span
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.15 }}
          className="inline-flex"
        >
          <Icon size={15} className={accent ? 'text-rose-400' : 'text-ink-mute'} />
        </motion.span>
      </div>
      <div className="relative mt-2 h-[1.85em] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={value}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="text-[26px] font-semibold tracking-[-0.04em] text-white tnum"
          >
            {value}
          </motion.p>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={hint}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 text-[12px] text-ink-faint"
        >
          {hint}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

function BeatRow({
  beat,
  index,
  reduce,
}: {
  beat: {
    id: string
    title: string
    image: string
    genre: string
    plays: number
    sales: number
    conversion: number
  }
  index: number
  reduce: boolean
}) {
  const delay = index * 0.045

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: reduce ? 0 : delay, ease: EASE }}
      whileHover={
        reduce
          ? undefined
          : {
              backgroundColor: 'rgba(255,255,255,0.03)',
              x: 3,
              transition: { duration: 0.2 },
            }
      }
      className="flex items-center gap-3 rounded-xl border-t border-white/8 py-3.5 pr-1 pl-1 first:border-t-0 first:pt-0"
    >
      <motion.span
        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...SPRING, delay: reduce ? 0 : delay + 0.04 }}
        className="w-5 shrink-0 text-[12px] font-medium text-ink-faint tnum"
      >
        {index + 1}
      </motion.span>
      <motion.img
        src={beat.image}
        alt=""
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: reduce ? 0 : delay + 0.05, ease: EASE }}
        className="size-10 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-white">{beat.title}</p>
        <p className="mt-0.5 text-[12px] text-ink-mute">
          {beat.genre} · {formatCount(beat.sales)} sales · {beat.conversion}% conv.
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[14px] font-medium text-white tnum">{formatCompact(beat.plays)}</p>
        <p className="mt-0.5 text-[11px] text-ink-faint">plays</p>
      </div>
    </motion.div>
  )
}

function CountryCard({
  entry,
  index,
  maxPlays,
  reduce,
}: {
  entry: { country: string; code: string; plays: number; listeners: number }
  index: number
  maxPlays: number
  reduce: boolean
}) {
  const pct = maxPlays > 0 ? (entry.plays / maxPlays) * 100 : 0
  const delay = index * 0.05

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: reduce ? 0 : delay, ease: EASE }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -2,
              backgroundColor: 'rgba(255,255,255,0.07)',
              transition: SPRING_SOFT,
            }
      }
      className="rounded-2xl bg-white/5 px-4 py-3.5 ring-1 ring-white/8"
    >
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium text-ink-faint tnum">{index + 1}</span>
        <motion.img
          src={flagSrc(entry.code)}
          alt=""
          initial={reduce ? false : { scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING, delay: reduce ? 0 : delay + 0.06 }}
          className="size-5 rounded-sm object-cover ring-1 ring-white/10"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-white">{entry.country}</p>
          <p className="mt-0.5 text-[12px] text-ink-mute">{formatCompact(entry.listeners)} listeners</p>
        </div>
        <p className="shrink-0 text-[13px] font-medium text-white tnum">{formatCompact(entry.plays)}</p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-white/35"
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${Math.max(pct, 6)}%` }}
          transition={{ duration: 0.55, delay: reduce ? 0 : delay + 0.12, ease: EASE }}
        />
      </div>
    </motion.div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value?: number; name?: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-[rgba(16,16,18,0.96)] px-3 py-2 text-[12px] text-white ring-1 ring-white/15">
      <p className="text-ink-mute">{label}</p>
      <p className="mt-0.5 font-medium tnum">{formatCount(Number(payload[0]?.value ?? 0))} plays</p>
    </div>
  )
}

function SourceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value?: number; payload?: { detail?: string } }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const detail = payload[0]?.payload?.detail
  return (
    <div className="rounded-xl bg-[rgba(16,16,18,0.96)] px-3 py-2 text-[12px] text-white ring-1 ring-white/15">
      <p className="font-medium text-white">{label}</p>
      {detail ? <p className="mt-0.5 text-ink-mute">{detail}</p> : null}
      <p className="mt-1 font-medium tnum">{formatCount(Number(payload[0]?.value ?? 0))} plays</p>
    </div>
  )
}

function buildChartData(period: StatsPeriod, rows: { date: string; plays: number; listeners: number }[]) {
  const now = new Date()
  const year = now.getFullYear()

  if (period === 'This year' || period === 'Last 3 months' || period === 'All time') {
    const byMonth = new Map<string, { plays: number; listeners: number }>()
    for (const row of rows) {
      const key = monthKey(row.date)
      const current = byMonth.get(key) ?? { plays: 0, listeners: 0 }
      current.plays += row.plays
      current.listeners += row.listeners
      byMonth.set(key, current)
    }

    const start =
      period === 'This year'
        ? new Date(year, 0, 1)
        : period === 'Last 3 months'
          ? new Date(year, now.getMonth() - 2, 1)
          : rows.length
            ? dayFrom(rows[0].date)
            : new Date(year, 0, 1)

    const points: { label: string; plays: number; listeners: number }[] = []
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
    const last = new Date(year, now.getMonth(), 1)
    while (cursor <= last) {
      const key = format(cursor, 'yyyy-MM')
      const stats = byMonth.get(key) ?? { plays: 0, listeners: 0 }
      points.push({
        label: format(cursor, period === 'This year' ? 'MMM' : 'MMM yyyy'),
        plays: stats.plays,
        listeners: stats.listeners,
      })
      cursor.setMonth(cursor.getMonth() + 1)
    }
    return points
  }

  return rows.map((row) => ({
    label: format(dayFrom(row.date), 'MMM d'),
    plays: row.plays,
    listeners: row.listeners,
  }))
}
