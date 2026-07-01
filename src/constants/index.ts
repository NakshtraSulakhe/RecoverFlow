export const APP_NAME = 'RecoverFlow'
export const APP_VERSION = '1.0.0'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const STORAGE_KEYS = {
  TOKEN: 'recoverflow_token',
  USER: 'recoverflow_user',
  THEME: 'recoverflow_theme',
}

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TENANTS: '/tenants',
  USERS: '/users',
  CUSTOMERS: '/customers',
  CASES: '/cases',
  RECOVERY: '/recovery',
  PAYMENTS: '/payments',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  AI: '/ai',
}

export const STATUS_COLORS = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
  completed: 'success',
  failed: 'error',
  open: 'info',
  in_progress: 'warning',
  closed: 'default',
  settled: 'success',
} as const

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  CHECK: 'check',
} as const

export const RECOVERY_METHODS = {
  PHONE: 'phone',
  EMAIL: 'email',
  VISIT: 'visit',
  LEGAL: 'legal',
} as const
