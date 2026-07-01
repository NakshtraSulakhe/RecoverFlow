/**
 * Application constants
 */

export const APP_NAME = 'RecoverFlow'
export const APP_VERSION = '1.0.0'

/**
 * API constants
 */
export const API_TIMEOUT = 30000 // 30 seconds
export const API_RETRY_ATTEMPTS = 3
export const API_RETRY_DELAY = 1000 // 1 second

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme-mode',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  TENANT_ID: 'tenant-id',
} as const

/**
 * Status constants
 */
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

/**
 * Loan status constants
 */
export const LOAN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DISBURSED: 'disbursed',
  ACTIVE: 'active',
  PAID: 'paid',
  DEFAULTED: 'defaulted',
  WRITTEN_OFF: 'written_off',
  CLOSED: 'closed',
} as const

/**
 * Recovery case status constants
 */
export const CASE_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  PROMISE_TO_PAY: 'promise_to_pay',
  PAID: 'paid',
  LEGAL: 'legal',
  CLOSED: 'closed',
} as const

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const

/**
 * Pagination constants
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const

/**
 * Date format constants
 */
export const DATE_FORMATS = {
  SHORT: 'YYYY-MM-DD',
  LONG: 'MMMM DD, YYYY',
  FULL: 'dddd, MMMM DD, YYYY',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm',
} as const

/**
 * File upload constants
 */
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

/**
 * Notification duration constants
 */
export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
} as const
