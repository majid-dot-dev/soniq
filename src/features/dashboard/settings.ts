export type SettingsSection =
  | 'profile'
  | 'security'
  | 'payouts'
  | 'notifications'
  | 'preferences'

export type SocialLinks = {
  instagram: string
  twitter: string
  youtube: string
  tiktok: string
  website: string
}

export type ProfileSettings = {
  avatar: string
  displayName: string
  username: string
  bio: string
  location: string
  genres: string[]
  social: SocialLinks
}

export type TwoFactorMethod = 'app' | 'sms' | null

export type SecuritySettings = {
  firstName: string
  lastName: string
  email: string
  twoFactorEnabled: boolean
  twoFactorMethod: TwoFactorMethod
  phone: string
  backupCodesRemaining: number
}

export type NotificationChannel = {
  email: boolean
  inApp: boolean
}

export type NotificationSettings = {
  sales: NotificationChannel
  refunds: NotificationChannel
  downloads: NotificationChannel
  chats: NotificationChannel
  payouts: NotificationChannel
  clearing: NotificationChannel
  followers: NotificationChannel
  profileActivity: NotificationChannel
  splits: NotificationChannel
  exclusives: NotificationChannel
  discounts: NotificationChannel
  product: NotificationChannel
  marketing: NotificationChannel
  weeklyDigest: NotificationChannel
}

export type NotificationRow = {
  key: keyof NotificationSettings
  title: string
  detail: string
}

export type NotificationGroup = {
  title: string
  detail: string
  rows: NotificationRow[]
}

export type PreferenceSettings = {
  language: string
  timezone: string
}

export type PayoutMethodType = 'bank' | 'paypal'

export type SettingsPayoutMethod = {
  id: string
  type: PayoutMethodType
  label: string
  detail: string
  isDefault: boolean
  status: 'Verified' | 'Pending'
}

export type BankDraft = {
  accountName: string
  bankName: string
  routingNumber: string
  accountNumber: string
  accountType: 'checking' | 'savings'
}

export type PaypalDraft = {
  email: string
}

export const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'de', label: 'Deutsch' },
] as const

export const timezones = [
  { value: 'Africa/Lagos', label: 'West Africa (WAT)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Central Europe (CET)' },
  { value: 'America/Sao_Paulo', label: 'Brasília (BRT)' },
] as const

export const profileGenreOptions = [
  'Amapiano',
  'Afrobeats',
  'Afro-fusion',
  'Log Drum',
  'R&B',
  'Hip-Hop',
  'Trap',
  'Drill',
  'Pop',
  'Dancehall',
] as const

export const defaultProfile: ProfileSettings = {
  avatar: '/assets/avatar-2.jpg',
  displayName: 'Nao',
  username: 'nao',
  bio: 'Lagos-born producer. Amapiano, night R&B, and patient drums for artists who write late.',
  location: 'Lagos, Nigeria',
  genres: ['Amapiano', 'R&B', 'Afrobeats'],
  social: {
    instagram: 'nao.beats',
    twitter: 'naobeats',
    youtube: '',
    tiktok: '@nao.beats',
    website: 'https://nao.sound',
  },
}

export const defaultSecurity: SecuritySettings = {
  firstName: 'Nao',
  lastName: 'Okeke',
  email: 'nao@soundsoniq.com',
  twoFactorEnabled: false,
  twoFactorMethod: null,
  phone: '',
  backupCodesRemaining: 0,
}

export const defaultNotifications: NotificationSettings = {
  sales: { email: true, inApp: true },
  refunds: { email: true, inApp: true },
  downloads: { email: false, inApp: true },
  chats: { email: false, inApp: true },
  payouts: { email: true, inApp: true },
  clearing: { email: true, inApp: false },
  followers: { email: false, inApp: true },
  profileActivity: { email: false, inApp: true },
  splits: { email: true, inApp: true },
  exclusives: { email: true, inApp: true },
  discounts: { email: false, inApp: true },
  product: { email: true, inApp: false },
  marketing: { email: false, inApp: false },
  weeklyDigest: { email: true, inApp: false },
}

export const notificationGroups: NotificationGroup[] = [
  {
    title: 'Sales & orders',
    detail: 'Money and files moving on your catalog.',
    rows: [
      { key: 'sales', title: 'New sales', detail: 'When someone buys a beat or kit.' },
      { key: 'refunds', title: 'Refunds & chargebacks', detail: 'When a sale is reversed or disputed.' },
      { key: 'downloads', title: 'Buyer downloads', detail: 'When a buyer downloads licensed files.' },
      { key: 'exclusives', title: 'Exclusive sold', detail: 'When a track is taken off sale after an exclusive.' },
      { key: 'discounts', title: 'Discount activity', detail: 'When a code is used or hits its limit.' },
    ],
  },
  {
    title: 'Messages',
    detail: 'Conversations in Chats.',
    rows: [{ key: 'chats', title: 'Chat messages', detail: 'New messages from buyers and collaborators.' }],
  },
  {
    title: 'Wallet & payouts',
    detail: 'Cash clearing into and out of your balance.',
    rows: [
      { key: 'payouts', title: 'Withdrawals', detail: 'Sent, processing, arrived, or failed.' },
      { key: 'clearing', title: 'Funds cleared', detail: 'When pending sales become available to withdraw.' },
    ],
  },
  {
    title: 'Account & social',
    detail: 'Activity on your public Account page.',
    rows: [
      { key: 'followers', title: 'New followers', detail: 'Someone follows your Account.' },
      { key: 'profileActivity', title: 'Profile activity', detail: 'Likes, comments, and mentions on your posts.' },
      { key: 'splits', title: 'Splits & collabs', detail: 'Invites and accepted collaboration splits.' },
    ],
  },
  {
    title: 'SoundSoniq',
    detail: 'Product news and optional digests.',
    rows: [
      { key: 'product', title: 'Product updates', detail: 'New features and important product changes.' },
      { key: 'marketing', title: 'Tips & offers', detail: 'Growth tips, campaigns, and partner offers.' },
      { key: 'weeklyDigest', title: 'Weekly digest', detail: 'A Sunday summary of plays, sales, and chats.' },
    ],
  },
]

export const defaultPreferences: PreferenceSettings = {
  language: 'en',
  timezone: 'Africa/Lagos',
}

export const defaultPayoutMethods: SettingsPayoutMethod[] = [
  {
    id: 'bank-chase',
    type: 'bank',
    label: 'Chase ····4821',
    detail: 'ACH · Checking · Nao Okeke',
    isDefault: true,
    status: 'Verified',
  },
  {
    id: 'paypal-nao',
    type: 'paypal',
    label: 'PayPal',
    detail: 'nao@soundsoniq.com',
    isDefault: false,
    status: 'Verified',
  },
]

export const emptyBankDraft: BankDraft = {
  accountName: '',
  bankName: '',
  routingNumber: '',
  accountNumber: '',
  accountType: 'checking',
}

export const emptyPaypalDraft: PaypalDraft = {
  email: '',
}

export const settingsNav: { id: SettingsSection; label: string; detail: string }[] = [
  { id: 'profile', label: 'Profile', detail: 'What shows on your public Account' },
  { id: 'security', label: 'Security', detail: 'Email, password, legal name' },
  { id: 'payouts', label: 'Payouts', detail: 'Bank and PayPal for withdrawals' },
  { id: 'notifications', label: 'Notifications', detail: 'Email and in-app alerts' },
  { id: 'preferences', label: 'Preferences', detail: 'Language and timezone' },
]

/** ISO timestamp of the most recent successful sign-in (mock). */
export const lastLoginAt = '2026-09-22T18:41:00'
