export type DiscountStatus = 'Active' | 'Scheduled' | 'Expired' | 'Disabled'
export type DiscountValueType = 'percent' | 'fixed'

export type CouponCode = {
  id: string
  code: string
  valueType: DiscountValueType
  amount: number
  licenses: string[]
  beatScope: 'All' | string[]
  startsAt: string
  endsAt: string | null
  uses: number
  maxUses: number | null
  perBuyerLimit: number | null
  status: DiscountStatus
}

export type PackageDeal = {
  id: string
  name: string
  buyQuantity: number
  freeQuantity: number
  licenses: string[]
  beatScope: 'All' | string[]
  startsAt: string
  endsAt: string | null
  uses: number
  status: DiscountStatus
}

export const licenseOptions = ['MP3 lease', 'WAV lease', 'Stems lease', 'Exclusive'] as const

export const couponCodes: CouponCode[] = [
  {
    id: 'dc-01',
    code: 'SONIQ20',
    valueType: 'percent',
    amount: 20,
    licenses: ['MP3 lease', 'WAV lease'],
    beatScope: 'All',
    startsAt: '2026-09-01',
    endsAt: '2026-12-31',
    uses: 14,
    maxUses: 100,
    perBuyerLimit: 1,
    status: 'Active',
  },
  {
    id: 'dc-02',
    code: 'FIRSTBEAT',
    valueType: 'percent',
    amount: 15,
    licenses: ['MP3 lease', 'WAV lease', 'Stems lease'],
    beatScope: 'All',
    startsAt: '2026-08-01',
    endsAt: null,
    uses: 31,
    maxUses: null,
    perBuyerLimit: 1,
    status: 'Active',
  },
  {
    id: 'dc-03',
    code: 'TENOFF',
    valueType: 'fixed',
    amount: 10,
    licenses: ['MP3 lease', 'WAV lease'],
    beatScope: 'All',
    startsAt: '2026-09-10',
    endsAt: '2026-10-10',
    uses: 6,
    maxUses: 200,
    perBuyerLimit: 2,
    status: 'Active',
  },
  {
    id: 'dc-04',
    code: 'FALL30',
    valueType: 'percent',
    amount: 30,
    licenses: ['MP3 lease', 'WAV lease'],
    beatScope: ['Half Light', 'Quiet Riot', 'Night Market'],
    startsAt: '2026-10-01',
    endsAt: '2026-10-15',
    uses: 0,
    maxUses: 50,
    perBuyerLimit: 1,
    status: 'Scheduled',
  },
  {
    id: 'dc-05',
    code: 'SUMMER25',
    valueType: 'percent',
    amount: 25,
    licenses: ['WAV lease', 'Stems lease'],
    beatScope: 'All',
    startsAt: '2026-06-01',
    endsAt: '2026-08-31',
    uses: 48,
    maxUses: 50,
    perBuyerLimit: null,
    status: 'Expired',
  },
  {
    id: 'dc-06',
    code: 'VIP40',
    valueType: 'percent',
    amount: 40,
    licenses: ['Exclusive'],
    beatScope: 'All',
    startsAt: '2026-07-12',
    endsAt: null,
    uses: 2,
    maxUses: 10,
    perBuyerLimit: 1,
    status: 'Disabled',
  },
]

export const packageDeals: PackageDeal[] = [
  {
    id: 'pk-01',
    name: 'Buy 2 get 1 free',
    buyQuantity: 2,
    freeQuantity: 1,
    licenses: ['MP3 lease', 'WAV lease'],
    beatScope: 'All',
    startsAt: '2026-09-01',
    endsAt: null,
    uses: 9,
    status: 'Active',
  },
  {
    id: 'pk-02',
    name: '3 for 2',
    buyQuantity: 2,
    freeQuantity: 1,
    licenses: ['MP3 lease'],
    beatScope: 'All',
    startsAt: '2026-08-15',
    endsAt: '2026-09-30',
    uses: 4,
    status: 'Active',
  },
  {
    id: 'pk-03',
    name: 'Buy 3 get 2 free',
    buyQuantity: 3,
    freeQuantity: 2,
    licenses: ['MP3 lease', 'WAV lease', 'Stems lease'],
    beatScope: ['Half Light', 'Quiet Riot', 'Harmattan', 'Glass City'],
    startsAt: '2026-10-01',
    endsAt: '2026-10-31',
    uses: 0,
    status: 'Scheduled',
  },
]

export function formatCouponValue(code: Pick<CouponCode, 'valueType' | 'amount'>) {
  return code.valueType === 'percent' ? `${code.amount}%` : `$${code.amount}`
}

export function formatLicenseScope(licenses: string[]) {
  if (licenses.length === licenseOptions.length) return 'All licenses'
  if (licenses.length <= 2) return licenses.join(', ')
  return `${licenses[0]} +${licenses.length - 1}`
}

export function formatBeatScope(beatScope: 'All' | string[]) {
  if (beatScope === 'All') return 'All tracks'
  if (beatScope.length === 1) return beatScope[0]
  return `${beatScope.length} tracks`
}

export function formatDiscountWindow(startsAt: string, endsAt: string | null) {
  const start = formatShortDate(startsAt)
  if (!endsAt) return `From ${start}`
  return `${start} – ${formatShortDate(endsAt)}`
}

export function formatPackageDeal(buyQuantity: number, freeQuantity: number) {
  return `Buy ${buyQuantity} get ${freeQuantity} free`
}

export function formatPerBuyerLimit(limit: number | null) {
  if (limit == null) return 'No per-buyer limit'
  if (limit === 1) return 'Once per buyer'
  return `${limit}× per buyer`
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T12:00:00`)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
