import { useMemo, useState } from 'react'
import { CaretDown, CurrencyDollar, MagnifyingGlass, Play, Receipt } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { motion, useReducedMotion } from 'motion/react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { beats, formatCompact } from '@/features/dashboard/beats'
import { formatMoney, sales, type Sale, type SaleStatus } from '@/features/dashboard/sales'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const WORLD_MAP = '/maps/world-110m.json'

const periods = [
  'Last 7 days',
  'Last 30 days',
  'This month',
  'Last 3 months',
  'This year',
  'All time',
] as const

const periodLabels: Record<(typeof periods)[number], string> = {
  'Last 7 days': '7d',
  'Last 30 days': '30d',
  'This month': 'Month',
  'Last 3 months': '90d',
  'This year': 'Year',
  'All time': 'All',
}

const statuses = ['All', 'Completed', 'Pending', 'Canceled'] as const

const countryCoords: Record<string, [number, number]> = {
  'United States': [-97, 38],
  'United Kingdom': [-2, 54],
  Nigeria: [8, 9],
  Germany: [10, 51],
  Brazil: [-51, -10],
}

const countryCodes: Record<string, string> = {
  'United States': 'US',
  'United Kingdom': 'GB',
  Nigeria: 'NG',
  Germany: 'DE',
  Brazil: 'BR',
}

const countryChanges: Record<string, number> = {
  'United States': 10,
  'United Kingdom': 50,
  Nigeria: -25,
  Germany: 15,
  Brazil: -10,
}

const geoNameByCountry: Record<string, string> = {
  'United States': 'United States of America',
  'United Kingdom': 'United Kingdom',
  Nigeria: 'Nigeria',
  Germany: 'Germany',
  Brazil: 'Brazil',
}

type Period = (typeof periods)[number]
type StatusFilter = (typeof statuses)[number]

function dayFrom(value: string) {
  const [datePart, timePart] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  if (!timePart) return new Date(year, month - 1, day)
  const [hour = 0, minute = 0] = timePart.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

function dateKey(value: string) {
  return value.slice(0, 10)
}

function inPeriod(soldAt: string, period: Period) {
  if (period === 'All time') return true
  const sold = dayFrom(soldAt)
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  if (period === 'This month') {
    return sold.getFullYear() === now.getFullYear() && sold.getMonth() === now.getMonth()
  }
  if (period === 'This year') {
    return sold.getFullYear() === now.getFullYear()
  }
  if (period === 'Last 3 months') {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    return sold >= start && sold <= end
  }

  const days = period === 'Last 7 days' ? 6 : 29
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days)
  return sold >= start && sold <= end
}

function formatDay(value: string) {
  return format(dayFrom(value), 'MMM d')
}

function formatTime(value: string) {
  return format(dayFrom(value), 'h:mm a')
}

function coverFor(beatId: string) {
  return beats.find((beat) => beat.id === beatId)?.image
}

function flagSrc(country: string) {
  const code = countryCodes[country]
  return code ? `/flags/${code.toLowerCase()}.png` : undefined
}

export default function Sales() {
  const reduce = useReducedMotion()
  const [period, setPeriod] = useState<Period>('This month')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [query, setQuery] = useState('')

  const inRange = useMemo(() => sales.filter((sale) => inPeriod(sale.soldAt, period)), [period])
  const completed = useMemo(() => inRange.filter((sale) => sale.status === 'Completed'), [inRange])
  const pending = useMemo(() => inRange.filter((sale) => sale.status === 'Pending').length, [inRange])
  const revenue = completed.reduce((sum, sale) => sum + sale.amount, 0)
  const avgOrder = completed.length > 0 ? revenue / completed.length : 0
  const totalPlays = beats.reduce((sum, beat) => sum + beat.plays, 0)
  const chartData = useMemo(() => buildChartData(period, completed), [completed, period])
  const countries = useMemo(() => {
    const totals = new Map<string, { amount: number; sales: number }>()
    for (const sale of completed) {
      const current = totals.get(sale.country) ?? { amount: 0, sales: 0 }
      totals.set(sale.country, { amount: current.amount + sale.amount, sales: current.sales + 1 })
    }
    return [...totals.entries()]
      .map(([country, stats]) => ({
        country,
        amount: stats.amount,
        sales: stats.sales,
        change: countryChanges[country] ?? 0,
        coordinates: countryCoords[country],
        geoName: geoNameByCountry[country] ?? country,
      }))
      .filter((entry) => entry.coordinates)
      .sort((a, b) => b.sales - a.sales || b.amount - a.amount)
  }, [completed])
  const activeGeoNames = useMemo(() => new Set(countries.map((entry) => entry.geoName)), [countries])
  const topCountries = countries.slice(0, 5)

  const orders = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return inRange.filter((sale) => {
      if (status !== 'All' && sale.status !== status) return false
      if (!needle) return true
      return [sale.beatTitle, sale.buyerName, sale.licenseName, sale.id].some((value) =>
        value.toLowerCase().includes(needle),
      )
    })
  }, [inRange, query, status])

  return (
    <div className="h-full min-h-0 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]">Sales</h1>
          <p className="mt-2 text-[14px] text-ink-mute">Who bought a beat, and which files they downloaded.</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
          {periods.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={cn(
                'rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors',
                period === item ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
              )}
            >
              {periodLabels[item]}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(16rem,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Revenue"
                value={formatMoney(revenue)}
                hint={completed.length > 0 ? `${formatMoney(avgOrder)} avg order` : 'No completed sales'}
                icon={CurrencyDollar}
              />
              <Metric
                label="Sales"
                value={String(completed.length)}
                hint={pending > 0 ? `${pending} pending` : 'Completed orders'}
                icon={Receipt}
              />
              <Metric
                label="Plays"
                value={formatCompact(totalPlays)}
                hint="Across your catalog"
                icon={Play}
              />
            </div>

            <div className="mt-8 h-64 w-full sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sales-revenue" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="revenue"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#sales-revenue)"
                    activeDot={{ r: 4, fill: '#fff', stroke: '#f43f5e', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[18px] font-medium text-white">Orders</h2>
              <div className="flex items-center gap-4">
                <label className="flex w-full max-w-48 items-center gap-2 rounded-xl bg-white/8 px-3 py-2 sm:w-48">
                  <MagnifyingGlass size={14} className="shrink-0 text-ink-mute" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buyer or beat"
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
                  />
                </label>
                <FilterSelect
                  label="Status"
                  value={status}
                  options={statuses}
                  onChange={(value) => setStatus(value as StatusFilter)}
                />
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="mt-8 rounded-2xl bg-white/5 px-4 py-12 text-center text-[14px] text-ink-mute">
                No orders match these filters.
              </p>
            ) : (
              <div className="mt-4">
                <div className="hidden grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_7.5rem_7rem_6.5rem_5rem] gap-3 px-2 pb-2 text-[11px] font-medium tracking-[0.04em] text-ink-faint uppercase lg:grid">
                  <span>Beat</span>
                  <span>Buyer</span>
                  <span>Date</span>
                  <span>License</span>
                  <span>Status</span>
                  <span className="text-right">Amount</span>
                </div>
                <div className="flex flex-col">
                  {orders.map((sale) => (
                    <SaleRow key={sale.id} sale={sale} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-5">
          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <h2 className="text-[18px] font-medium text-white">Global stats</h2>
            <div className="mt-4">
              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{ scale: 145, center: [8, 8] }}
                width={800}
                height={420}
                className="h-auto w-full"
              >
                <Geographies geography={WORLD_MAP}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const name = String(geo.properties?.name ?? '')
                      const active = activeGeoNames.has(name)
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={active ? 'rgba(244,63,94,0.35)' : 'rgba(255,255,255,0.12)'}
                          stroke="rgba(255,255,255,0.16)"
                          strokeWidth={0.5}
                          className="outline-none"
                        />
                      )
                    })
                  }
                </Geographies>
                {countries.map((entry, index) => {
                  const rank = index + 1
                  return (
                    <Marker key={entry.country} coordinates={entry.coordinates!}>
                      <g transform="scale(2.4)">
                        <path
                          d="M0,0 L-6.5,-12 A6.5,6.5 0 1,0 6.5,-12 Z"
                          fill="#f43f5e"
                          stroke="#ffffff"
                          strokeWidth={0.75}
                          strokeLinejoin="round"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          y={-12}
                          style={{
                            fontSize: 7.5,
                            fontWeight: 700,
                            fill: '#ffffff',
                            pointerEvents: 'none',
                          }}
                        >
                          {rank}
                        </text>
                      </g>
                      <title>
                        #{rank} {entry.country}: {formatMoney(entry.amount)}
                      </title>
                    </Marker>
                  )
                })}
              </ComposableMap>
            </div>
          </section>

          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-medium text-white">Top markets</h2>
                <p className="mt-1 text-[13px] text-ink-mute">
                  {topCountries.length === 0
                    ? 'No completed sales in this period.'
                    : `${formatMoney(revenue)} across ${topCountries.length} ${topCountries.length === 1 ? 'country' : 'countries'}`}
                </p>
              </div>
            </div>

            {topCountries.length > 0 ? (
              <ol className="mt-6 divide-y divide-white/8">
                {topCountries.map((entry, index) => {
                  const share = revenue > 0 ? Math.round((entry.amount / revenue) * 100) : 0
                  const lead = index === 0
                  return (
                    <li key={entry.country} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                      <span
                        className={cn(
                          'w-6 shrink-0 text-[12px] font-medium tnum',
                          lead ? 'text-rose-400' : 'text-ink-faint',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <img
                        src={flagSrc(entry.country)}
                        alt=""
                        className="size-9 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-white">{entry.country}</span>
                        <span className="mt-0.5 block text-[12px] text-ink-mute">
                          {entry.sales} {entry.sales === 1 ? 'sale' : 'sales'} · {share}% of revenue
                        </span>
                      </span>
                      <TrendPill value={entry.change} />
                      <span className={cn('shrink-0 text-[15px] font-semibold tracking-[-0.02em] tnum', lead ? 'text-white' : 'text-ink-2')}>
                        {formatMoney(entry.amount)}
                      </span>
                    </li>
                  )
                })}
              </ol>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  )
}

function SaleRow({ sale }: { sale: Sale }) {
  const cover = coverFor(sale.beatId)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2 py-2.5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_7.5rem_7rem_6.5rem_5rem]">
      <div className="flex min-w-0 items-center gap-3">
        {cover ? <img src={cover} alt="" className="size-10 shrink-0 rounded-lg object-cover" /> : null}
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-white">{sale.beatTitle}</p>
          <p className="mt-0.5 truncate text-[12px] text-ink-mute tnum">{sale.id}</p>
          <div className="mt-1 lg:hidden">
            <StatusPill status={sale.status} />
          </div>
        </div>
      </div>
      <div className="hidden min-w-0 items-center gap-2.5 lg:flex">
        <img src={sale.buyerAvatar} alt="" className="size-6 shrink-0 rounded-full object-cover" />
        <p className="min-w-0 truncate text-[13px] text-ink-2">{sale.buyerName}</p>
      </div>
      <div className="hidden min-w-0 lg:block">
        <p className="text-[13px] text-ink-2">{formatDay(sale.soldAt)} {formatTime(sale.soldAt)}</p>
        {/* <p className="mt-0.5 text-[12px] text-ink-mute tnum">{formatTime(sale.soldAt)}</p> */}
      </div>
      <p className="hidden truncate text-[13px] text-ink-mute lg:block">{sale.licenseName}</p>
      <div className="hidden lg:block">
        <StatusPill status={sale.status} />
      </div>
      <p className="text-right text-[14px] font-medium text-white tnum">{formatMoney(sale.amount)}</p>
    </div>
  )
}

function TrendPill({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span
      className={cn(
        'inline-flex min-w-14 shrink-0 items-center justify-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium tnum',
        positive ? 'bg-yield-tint text-yield-bright' : 'bg-rose-500/15 text-rose-300',
      )}
    >
      <svg viewBox="0 0 8 6" className="size-2 shrink-0 fill-current" aria-hidden>
        {positive ? <path d="M4 0L8 6H0z" /> : <path d="M0 0h8L4 6z" />}
      </svg>
      {Math.abs(value)}%
    </span>
  )
}

function StatusPill({ status }: { status: SaleStatus }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium',
        status === 'Completed' && 'bg-yield-tint text-yield-bright',
        status === 'Pending' && 'bg-amber-400/12 text-amber-300',
        status === 'Canceled' && 'bg-rose-500/15 text-rose-300',
      )}
    >
      {/* <span
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          status === 'Completed' && 'bg-yield-bright',
          status === 'Pending' && 'bg-amber-300',
          status === 'Canceled' && 'bg-rose-300',
        )}
        aria-hidden
      /> */}
      {status}
    </span>
  )
}

function Metric({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: typeof CurrencyDollar
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/5 p-4 ring-1 ring-white/8">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/8 text-ink-mute">
          <Icon size={16} weight="bold" />
        </span>
        <p className="text-[12px] font-medium text-ink-mute">{label}</p>
      </div>
      <p className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-white tnum sm:text-[28px]">{value}</p>
      <p className="mt-1 text-[12px] text-ink-faint">{hint}</p>
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value?: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-[rgba(16,16,18,0.96)] px-3 py-2 text-[12px] text-white ring-1 ring-white/15">
      <p className="text-ink-mute">{label}</p>
      <p className="mt-0.5 font-medium tnum">{formatMoney(Number(payload[0]?.value ?? 0))}</p>
    </div>
  )
}

function monthKey(value: string | Date) {
  const date = typeof value === 'string' ? dayFrom(value) : value
  return format(date, 'yyyy-MM')
}

function buildDailyChartData(start: Date, end: Date, completed: { soldAt: string; amount: number }[]) {
  const points: { label: string; revenue: number }[] = []
  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const key = format(cursor, 'yyyy-MM-dd')
    points.push({
      label: format(cursor, 'MMM d'),
      revenue: completed.filter((sale) => dateKey(sale.soldAt) === key).reduce((sum, sale) => sum + sale.amount, 0),
    })
  }
  return points
}

function buildMonthlyChartData(start: Date, end: Date, completed: { soldAt: string; amount: number }[]) {
  const points: { label: string; revenue: number }[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  const last = new Date(end.getFullYear(), end.getMonth(), 1)

  while (cursor <= last) {
    const key = monthKey(cursor)
    points.push({
      label: format(cursor, 'MMM yyyy'),
      revenue: completed
        .filter((sale) => monthKey(sale.soldAt) === key)
        .reduce((sum, sale) => sum + sale.amount, 0),
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return points
}

function buildChartData(period: Period, completed: { soldAt: string; amount: number }[]) {
  const now = new Date()
  const year = now.getFullYear()
  const end = new Date(year, now.getMonth(), now.getDate())

  if (period === 'This year') {
    return buildMonthlyChartData(new Date(year, 0, 1), end, completed)
  }

  if (period === 'Last 3 months') {
    return buildMonthlyChartData(new Date(year, now.getMonth() - 2, 1), end, completed)
  }

  if (period === 'All time') {
    const earliest = completed.reduce((min, sale) => {
      const sold = dayFrom(sale.soldAt)
      return sold < min ? sold : min
    }, end)
    return buildMonthlyChartData(new Date(earliest.getFullYear(), earliest.getMonth(), 1), end, completed)
  }

  const start =
    period === 'This month'
      ? new Date(year, now.getMonth(), 1)
      : period === 'Last 7 days'
        ? new Date(year, now.getMonth(), now.getDate() - 6)
        : new Date(year, now.getMonth(), now.getDate() - 29)

  return buildDailyChartData(start, end, completed)
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="relative inline-flex shrink-0 items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent py-1.5 pr-5 pl-0 text-[13px] font-medium text-ink-2 outline-none transition-colors hover:text-white"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#121214] text-white">
            {option === 'All' ? label : option}
          </option>
        ))}
      </select>
      <CaretDown size={12} className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-ink-mute" />
    </label>
  )
}
