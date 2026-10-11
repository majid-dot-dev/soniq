import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CaretDown,
  Coins,
  MagnifyingGlass,
  Receipt,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  balanceSummary as seedBalance,
  formatPayoutMoney,
  formatSignedMoney,
  ledgerEntries as seedLedger,
  MIN_WITHDRAW,
  payoutHistory as seedHistory,
  payoutMethod,
  type ActivityKind,
  type ActivityStatus,
  type LedgerEntry,
  type PayoutRecord,
  type PayoutStatus,
} from '@/features/dashboard/wallet'
import { useWorkspace } from '@/features/dashboard/workspace'
import { DashboardPage } from '@/features/dashboard/components/dashboard-page'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const SPRING = { type: 'spring' as const, stiffness: 420, damping: 28 }
const SPRING_SOFT = { type: 'spring' as const, stiffness: 360, damping: 32 }

const activityFilters = ['All', 'Sales', 'Payouts', 'Fees', 'Refunds'] as const
const chartPeriods = [
  'Last 7 days',
  'Last 30 days',
  'This month',
  'Last 3 months',
  'This year',
  'All time',
] as const

const chartPeriodLabels: Record<(typeof chartPeriods)[number], string> = {
  'Last 7 days': '7d',
  'Last 30 days': '30d',
  'This month': 'Month',
  'Last 3 months': '90d',
  'This year': 'Year',
  'All time': 'All',
}

type ActivityFilter = (typeof activityFilters)[number]
type ChartPeriod = (typeof chartPeriods)[number]

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
    transition: { staggerChildren: 0.075, delayChildren: 0.1 },
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
  const [datePart, timePart] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  if (!timePart) return new Date(year, month - 1, day)
  const [hour = 0, minute = 0] = timePart.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

function formatWhen(value: string) {
  return format(dayFrom(value), 'MMM d · h:mm a')
}

function formatDay(value: string) {
  return format(dayFrom(value), 'MMM d, yyyy')
}

function matchesFilter(entry: LedgerEntry, filter: ActivityFilter) {
  if (filter === 'All') return true
  if (filter === 'Sales') return entry.kind === 'sale'
  if (filter === 'Payouts') return entry.kind === 'payout'
  if (filter === 'Fees') return entry.kind === 'fee'
  return entry.kind === 'refund'
}

export default function Wallet() {
  const { current } = useWorkspace()
  if (current.type !== 'Producer') {
    return <DashboardPage title="Wallet" description="Streaming earnings you can pay out." />
  }
  return <ProducerWallet />
}

function ProducerWallet() {
  const reduce = useReducedMotion()
  const [balance, setBalance] = useState(seedBalance)
  const [ledger, setLedger] = useState(seedLedger)
  const [history, setHistory] = useState(seedHistory)
  const [filter, setFilter] = useState<ActivityFilter>('All')
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('This month')
  const [query, setQuery] = useState('')
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [amount, setAmount] = useState('')

  const activity = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return ledger
      .filter((entry) => matchesFilter(entry, filter))
      .filter((entry) => {
        if (!needle) return true
        return [entry.title, entry.detail, entry.status].some((value) => value.toLowerCase().includes(needle))
      })
      .sort((a, b) => dayFrom(b.at).getTime() - dayFrom(a.at).getTime())
  }, [filter, ledger, query])

  const chartData = useMemo(() => buildCashflowChartData(chartPeriod, ledger), [chartPeriod, ledger])
  const receivedTotal = chartData.reduce((sum, point) => sum + point.received, 0)
  const withdrawnTotal = chartData.reduce((sum, point) => sum + point.withdrawn, 0)

  const payouts = useMemo(
    () => [...history].sort((a, b) => dayFrom(b.requestedAt).getTime() - dayFrom(a.requestedAt).getTime()),
    [history],
  )

  const canWithdraw = balance.available >= MIN_WITHDRAW

  function submitWithdraw() {
    const value = Number(amount)
    if (!Number.isFinite(value) || value < MIN_WITHDRAW || value > balance.available) return

    const fee = 0.5
    const net = Math.round((value - fee) * 100) / 100
    const now = new Date()
    const stamp = now.toISOString().slice(0, 19)

    const record: PayoutRecord = {
      id: `PO-${2000 + history.length + 1}`,
      amount: value,
      fee,
      net,
      methodLabel: payoutMethod.label,
      status: 'Processing',
      requestedAt: stamp,
    }

    const entry: LedgerEntry = {
      id: `le-local-${Date.now()}`,
      kind: 'payout',
      title: 'Withdrawal',
      detail: payoutMethod.label,
      amount: -value,
      status: 'Processing',
      at: stamp,
    }

    setHistory((current) => [record, ...current])
    setLedger((current) => [entry, ...current])
    setBalance((current) => ({
      ...current,
      available: Math.round((current.available - value) * 100) / 100,
      paidOut: Math.round((current.paidOut + value) * 100) / 100,
    }))
    setAmount('')
    setWithdrawOpen(false)
  }

  return (
    <div className="h-full min-h-0 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <motion.div
        {...fadeUp(!!reduce)}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]"
          >
            Wallet
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
            className="mt-2 text-[14px] text-ink-mute"
          >
            Money from beat and kit sales. Orders stay in Sales.
          </motion.p>
        </div>
        <motion.button
          type="button"
          disabled={!canWithdraw}
          onClick={() => {
            setAmount(String(Math.floor(balance.available)))
            setWithdrawOpen(true)
          }}
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={canWithdraw && !reduce ? { scale: 1.04 } : undefined}
          whileTap={canWithdraw && !reduce ? { scale: 0.96 } : undefined}
          transition={SPRING}
          className="inline-flex h-9 select-none items-center justify-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium tracking-[-0.01em] text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <motion.span
            animate={canWithdraw && !reduce ? { rotate: [0, -12, 8, 0] } : undefined}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
            className="inline-flex"
          >
            <Coins size={15} weight="fill" />
          </motion.span>
          Withdraw
        </motion.button>
      </motion.div>

      <motion.div
        className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        variants={reduce ? undefined : metricList}
        initial={reduce ? false : 'hidden'}
        animate="show"
      >
        <Metric
          label="Available"
          value={formatSignedMoney(balance.available)}
          hint="Ready to withdraw"
          accent
          reduce={!!reduce}
        />
        <Metric
          label="Pending"
          value={formatSignedMoney(balance.pending)}
          hint="Still clearing"
          reduce={!!reduce}
        />
        <Metric
          label="Lifetime earned"
          value={formatSignedMoney(balance.lifetimeEarned)}
          hint="Gross from sales"
          reduce={!!reduce}
        />
        <Metric
          label="Paid out"
          value={formatSignedMoney(balance.paidOut)}
          hint="Sent to your bank"
          reduce={!!reduce}
        />
      </motion.div>

      <motion.div
        {...fadeUp(!!reduce, 0.22)}
        className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <motion.section
          whileHover={reduce ? undefined : { y: -1 }}
          transition={SPRING_SOFT}
          className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-medium text-white">Cash flow</h2>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={`${chartPeriod}-totals`}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="mt-1 text-[13px] text-ink-mute"
                >
                  Received {formatSignedMoney(receivedTotal)} · Withdrawn {formatSignedMoney(withdrawnTotal)}
                </motion.p>
              </AnimatePresence>
              <div className="mt-2 flex items-center gap-4 text-[12px] text-ink-mute">
                <span className="inline-flex items-center gap-1.5">
                  <motion.span
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...SPRING, delay: 0.28 }}
                    className="size-2 rounded-sm bg-rose-500"
                  />
                  Received
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <motion.span
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...SPRING, delay: 0.34 }}
                    className="size-2 rounded-sm bg-white/35"
                  />
                  Withdrawn
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
              {chartPeriods.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setChartPeriod(item)}
                  className={cn(
                    'relative rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors',
                    chartPeriod === item ? 'text-white' : 'text-ink-mute hover:text-white',
                  )}
                >
                  {chartPeriod === item ? (
                    <motion.span
                      layoutId="wallet-chart-period"
                      className="absolute inset-0 rounded-full bg-white/12"
                      transition={SPRING_SOFT}
                    />
                  ) : null}
                  <span className="relative z-10">{chartPeriodLabels[item]}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 text-[12px] text-ink-faint">{balance.clearingNote}</p>

          <div className="mt-5 h-56 w-full sm:h-64">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={chartPeriod}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="size-full"
              >
                <CashflowChart data={chartData} animate={!reduce} />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {!canWithdraw ? (
              <motion.p
                initial={reduce ? false : { opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={reduce ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex items-center gap-2 overflow-hidden text-[13px] text-amber-300/90"
              >
                <WarningCircle size={15} />
                Minimum withdrawal is {formatSignedMoney(MIN_WITHDRAW)}.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.section>

        <motion.section
          whileHover={reduce ? undefined : { y: -1 }}
          transition={SPRING_SOFT}
          className="flex flex-col overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6 xl:h-0 xl:min-h-full"
        >
          <div className="shrink-0">
            <h2 className="text-[18px] font-medium text-white">Payout history</h2>
            <p className="mt-1 text-[13px] text-ink-mute">Withdrawals to {payoutMethod.label}.</p>
          </div>
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout" initial={false}>
              {payouts.length === 0 ? (
                <motion.p
                  key="empty-payouts"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  className="rounded-2xl bg-white/5 px-4 py-10 text-center text-[13px] text-ink-mute"
                >
                  No withdrawals yet.
                </motion.p>
              ) : (
                <div className="flex flex-col">
                  {payouts.map((item, index) => (
                    <PayoutRow key={item.id} item={item} index={index} reduce={!!reduce} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </motion.div>

      <motion.section
        {...fadeUp(!!reduce, 0.32)}
        className="mt-5 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[18px] font-medium text-white">Activity</h2>
            <p className="mt-1 text-[13px] text-ink-mute">Credits, fees, refunds, and withdrawals.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex w-full max-w-48 items-center gap-2 rounded-xl bg-white/8 px-3 py-2 transition-[box-shadow,background-color] focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-white/15 sm:w-48">
              <MagnifyingGlass size={14} className="shrink-0 text-ink-mute" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search activity"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
              />
            </label>
            <FilterSelect
              label="Type"
              value={filter}
              options={activityFilters}
              onChange={(value) => setFilter(value as ActivityFilter)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {activity.length === 0 ? (
            <motion.p
              key="empty-activity"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="mt-8 rounded-2xl bg-white/5 px-4 py-12 text-center text-[14px] text-ink-mute"
            >
              No activity matches.
            </motion.p>
          ) : (
            <motion.div
              key={`${filter}-${query}`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="mt-4"
            >
              <div className="hidden grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_7rem_6.5rem_6.5rem] items-center gap-3 px-2 pb-2 text-[11px] font-medium tracking-[0.04em] text-ink-faint uppercase lg:grid">
                <span />
                <span>Entry</span>
                <span>Detail</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="flex flex-col">
                <AnimatePresence initial={false}>
                  {activity.map((entry, index) => (
                    <ActivityRow key={entry.id} entry={entry} index={index} reduce={!!reduce} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <AnimatePresence>
        {withdrawOpen ? (
          <WithdrawModal
            available={balance.available}
            amount={amount}
            onAmountChange={setAmount}
            onClose={() => setWithdrawOpen(false)}
            onSubmit={submitWithdraw}
            reduce={!!reduce}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Metric({
  label,
  value,
  hint,
  accent = false,
  reduce,
}: {
  label: string
  value: string
  hint: string
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
      className={cn(
        'min-w-0 rounded-2xl bg-white/5 p-4 ring-1 ring-white/8',
        accent && 'ring-rose-500/25',
      )}
    >
      <p className="text-[12px] text-ink-mute">{label}</p>
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
      <p className="mt-1 text-[12px] text-ink-faint">{hint}</p>
    </motion.div>
  )
}

function ActivityRow({
  entry,
  index,
  reduce,
}: {
  entry: LedgerEntry
  index: number
  reduce: boolean
}) {
  const credit = entry.amount > 0
  const delay = Math.min(index, 12) * 0.03

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.32, delay: reduce ? 0 : delay, ease: EASE }}
      whileHover={
        reduce
          ? undefined
          : {
              backgroundColor: 'rgba(255,255,255,0.03)',
              transition: { duration: 0.2 },
            }
      }
      className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-t border-white/8 px-2 py-3.5 lg:grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_7rem_6.5rem_6.5rem]"
    >
      <motion.span
        initial={reduce ? false : { scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING, delay: reduce ? 0 : delay + 0.04 }}
        className={cn(
          'grid size-8 place-items-center rounded-full',
          credit ? 'bg-yield-bright/15 text-yield-bright' : 'bg-white/8 text-ink-mute',
        )}
      >
        {kindIcon(entry.kind)}
      </motion.span>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium text-white">{entry.title}</p>
        <p className="mt-0.5 truncate text-[12px] text-ink-mute lg:hidden">
          {entry.detail} · {formatWhen(entry.at)}
        </p>
      </div>
      <p className="hidden truncate text-[13px] text-ink-mute lg:block">{entry.detail}</p>
      <p className="hidden text-[13px] text-ink-mute lg:block">{formatDay(entry.at)}</p>
      <div className="hidden lg:block">
        <StatusPill status={entry.status} />
      </div>
      <p
        className={cn(
          'text-right text-[14px] font-medium tnum',
          credit ? 'text-yield-bright' : 'text-white',
        )}
      >
        {formatPayoutMoney(entry.amount)}
      </p>
    </motion.div>
  )
}

function PayoutRow({
  item,
  index,
  reduce,
}: {
  item: PayoutRecord
  index: number
  reduce: boolean
}) {
  const delay = Math.min(index, 8) * 0.04

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: -8 }}
      transition={{ duration: 0.35, delay: reduce ? 0 : delay, ease: EASE }}
      whileHover={
        reduce
          ? undefined
          : {
              backgroundColor: 'rgba(255,255,255,0.03)',
              x: 2,
              transition: { duration: 0.2 },
            }
      }
      className="flex items-start justify-between gap-3 rounded-xl border-t border-white/8 py-3.5 pr-1 pl-1 first:border-t-0 first:pt-0"
    >
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium text-white">{item.id}</p>
        <p className="mt-0.5 truncate text-[12px] text-ink-mute">
          {formatDay(item.requestedAt)}
          {item.arrivedAt ? ` · Arrived ${formatDay(item.arrivedAt)}` : ''}
        </p>
        <div className="mt-2 lg:hidden">
          <StatusPill status={item.status} />
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[14px] font-medium text-white tnum">{formatSignedMoney(item.net)}</p>
        <p className="mt-0.5 text-[11px] text-ink-faint">Fee {formatSignedMoney(item.fee)}</p>
        <div className="mt-2 hidden justify-end lg:flex">
          <StatusPill status={item.status} />
        </div>
      </div>
    </motion.div>
  )
}

function WithdrawModal({
  available,
  amount,
  onAmountChange,
  onClose,
  onSubmit,
  reduce,
}: {
  available: number
  amount: string
  onAmountChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
  reduce: boolean
}) {
  const value = Number(amount)
  const fee = 0.5
  const valid = Number.isFinite(value) && value >= MIN_WITHDRAW && value <= available
  const net = valid ? Math.round((value - fee) * 100) / 100 : 0

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Withdraw funds"
        initial={reduce ? false : { opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 14, scale: 0.97 }}
        transition={{ duration: 0.34, ease: EASE }}
        className="w-full max-w-md rounded-3xl bg-[#161618] p-5 ring-1 ring-white/12 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-white">Withdraw</h2>
            <p className="mt-1 text-[13px] text-ink-mute">
              Available {formatSignedMoney(available)} · Min {formatSignedMoney(MIN_WITHDRAW)}
            </p>
          </div>
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            whileHover={reduce ? undefined : { scale: 1.08, rotate: 90 }}
            whileTap={reduce ? undefined : { scale: 0.92 }}
            transition={SPRING}
            className="grid size-8 place-items-center rounded-full bg-white/8 text-ink-mute transition-colors hover:bg-white/12 hover:text-white"
          >
            <X size={14} />
          </motion.button>
        </div>

        <motion.label
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06, ease: EASE }}
          className="mt-6 block"
        >
          <span className="text-[12px] font-medium text-ink-mute">Amount (USD)</span>
          <input
            type="number"
            min={MIN_WITHDRAW}
            max={available}
            step="0.01"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[18px] font-medium text-white outline-none tnum placeholder:text-ink-mute"
          />
        </motion.label>

        <div className="mt-3 flex gap-2">
          {[0.25, 0.5, 1].map((portion, index) => {
            const next = Math.floor(available * portion)
            return (
              <motion.button
                key={portion}
                type="button"
                onClick={() => onAmountChange(String(next))}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.04, ease: EASE }}
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={reduce ? undefined : { scale: 0.95 }}
                className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
              >
                {portion === 1 ? 'Max' : `${portion * 100}%`}
              </motion.button>
            )
          })}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14, ease: EASE }}
          className="mt-5 rounded-2xl bg-white/5 px-4 py-3 text-[13px] text-ink-2"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-ink-mute">Payout method</span>
            <span>{payoutMethod.label}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-ink-mute">Fee</span>
            <span className="tnum">{formatSignedMoney(fee)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-white/8 pt-2">
            <span className="text-ink-mute">You receive</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={valid ? net : 'invalid'}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="font-medium text-white tnum"
              >
                {valid ? formatSignedMoney(net) : '—'}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.button
          type="button"
          disabled={!valid}
          onClick={onSubmit}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18, ease: EASE }}
          whileHover={valid && !reduce ? { scale: 1.02 } : undefined}
          whileTap={valid && !reduce ? { scale: 0.98 } : undefined}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm withdrawal
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function kindIcon(kind: ActivityKind) {
  if (kind === 'sale') return <ArrowDownLeft size={15} weight="bold" />
  if (kind === 'payout') return <ArrowUpRight size={15} weight="bold" />
  if (kind === 'refund') return <ArrowUpRight size={15} weight="bold" />
  return <Receipt size={14} />
}

function StatusPill({ status }: { status: ActivityStatus | PayoutStatus }) {
  const tone =
    status === 'Cleared' || status === 'Paid'
      ? 'bg-yield-bright/15 text-yield-bright'
      : status === 'Pending' || status === 'Processing'
        ? 'bg-amber-400/15 text-amber-300'
        : status === 'Failed' || status === 'Reversed'
          ? 'bg-rose-500/15 text-rose-400'
          : 'bg-white/8 text-ink-mute'

  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium', tone)}>
      {status}
    </span>
  )
}

function CashflowChart({
  data,
  animate,
}: {
  data: { label: string; received: number; withdrawn: number }[]
  animate: boolean
}) {
  const margin = { top: 8, right: 4, left: -18, bottom: 0 }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={margin} barGap={2} barCategoryGap="28%">
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
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<ChartTooltip />} />
        <Bar
          dataKey="received"
          name="Received"
          fill="#f43f5e"
          radius={[5, 5, 0, 0]}
          maxBarSize={18}
          isAnimationActive={animate}
          animationDuration={650}
          animationBegin={40}
          animationEasing="ease-out"
        />
        <Bar
          dataKey="withdrawn"
          name="Withdrawn"
          fill="rgba(255,255,255,0.28)"
          radius={[5, 5, 0, 0]}
          maxBarSize={18}
          isAnimationActive={animate}
          animationDuration={650}
          animationBegin={120}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value?: number; name?: string; color?: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-[rgba(16,16,18,0.96)] px-3 py-2 text-[12px] text-white ring-1 ring-white/15">
      <p className="text-ink-mute">{label}</p>
      <div className="mt-1 flex flex-col gap-0.5">
        {payload.map((item) => (
          <p key={item.name} className="font-medium tnum">
            <span className="text-ink-mute">{item.name}: </span>
            {formatSignedMoney(Number(item.value ?? 0))}
          </p>
        ))}
      </div>
    </div>
  )
}

function dateKey(value: string) {
  return value.slice(0, 10)
}

function monthKey(value: string | Date) {
  const date = typeof value === 'string' ? dayFrom(value) : value
  return format(date, 'yyyy-MM')
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

function isReceived(entry: LedgerEntry) {
  return entry.kind === 'sale' && entry.status === 'Cleared'
}

function isWithdrawn(entry: LedgerEntry) {
  return entry.kind === 'payout' && (entry.status === 'Paid' || entry.status === 'Processing')
}

function sumReceived(entries: LedgerEntry[]) {
  return roundMoney(entries.reduce((sum, entry) => sum + entry.amount, 0))
}

function sumWithdrawn(entries: LedgerEntry[]) {
  return roundMoney(entries.reduce((sum, entry) => sum + Math.abs(entry.amount), 0))
}

function buildDailyPoints(
  start: Date,
  end: Date,
  received: LedgerEntry[],
  withdrawn: LedgerEntry[],
) {
  const points: { label: string; received: number; withdrawn: number }[] = []
  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const key = format(cursor, 'yyyy-MM-dd')
    points.push({
      label: format(cursor, 'MMM d'),
      received: sumReceived(received.filter((entry) => dateKey(entry.at) === key)),
      withdrawn: sumWithdrawn(withdrawn.filter((entry) => dateKey(entry.at) === key)),
    })
  }
  return points
}

function buildMonthlyPoints(
  start: Date,
  end: Date,
  received: LedgerEntry[],
  withdrawn: LedgerEntry[],
) {
  const points: { label: string; received: number; withdrawn: number }[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  const last = new Date(end.getFullYear(), end.getMonth(), 1)

  while (cursor <= last) {
    const key = monthKey(cursor)
    points.push({
      label: format(cursor, 'MMM yyyy'),
      received: sumReceived(received.filter((entry) => monthKey(entry.at) === key)),
      withdrawn: sumWithdrawn(withdrawn.filter((entry) => monthKey(entry.at) === key)),
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return points
}

function buildCashflowChartData(period: ChartPeriod, entries: LedgerEntry[]) {
  const received = entries.filter(isReceived)
  const withdrawn = entries.filter(isWithdrawn)
  const now = new Date()
  const year = now.getFullYear()
  const end = new Date(year, now.getMonth(), now.getDate())

  if (period === 'This year') {
    return buildMonthlyPoints(new Date(year, 0, 1), end, received, withdrawn)
  }

  if (period === 'Last 3 months') {
    const start = new Date(year, now.getMonth() - 2, 1)
    return buildMonthlyPoints(start, end, received, withdrawn)
  }

  if (period === 'All time') {
    const earliest = entries.reduce((min, entry) => {
      const at = dayFrom(entry.at)
      return at < min ? at : min
    }, end)
    const start = new Date(earliest.getFullYear(), earliest.getMonth(), 1)
    return buildMonthlyPoints(start, end, received, withdrawn)
  }

  const start =
    period === 'This month'
      ? new Date(year, now.getMonth(), 1)
      : period === 'Last 7 days'
        ? new Date(year, now.getMonth(), now.getDate() - 6)
        : new Date(year, now.getMonth(), now.getDate() - 29)

  return buildDailyPoints(start, end, received, withdrawn)
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
    <label className="relative inline-flex items-center gap-2 text-[13px] text-ink-mute">
      <span className="hidden sm:inline">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="appearance-none rounded-xl bg-white/8 py-2 pr-8 pl-3 text-[13px] text-white outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-[#121214]">
              {option}
            </option>
          ))}
        </select>
        <CaretDown size={12} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-ink-mute" />
      </span>
    </label>
  )
}
