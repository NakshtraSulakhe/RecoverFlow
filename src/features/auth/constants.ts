/**
 * Authentication Constants
 */

import { STORAGE_KEYS } from '../../utils/constants'

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: STORAGE_KEYS.TOKEN,
  REFRESH_TOKEN: STORAGE_KEYS.REFRESH_TOKEN,
  USER: STORAGE_KEYS.USER,
  SESSION_ID: 'session_id',
  REMEMBER_ME: 'remember_me',
  MFA_ENABLED: 'mfa_enabled',
} as const

export const AUTH_CONFIG = {
  // Token configuration
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiration
  TOKEN_REFRESH_RETRY_ATTEMPTS: 3,
  TOKEN_REFRESH_RETRY_DELAY: 1000, // 1 second

  // Session configuration
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  IDLE_TIMEOUT: 15 * 60 * 1000, // 15 minutes
  IDLE_CHECK_INTERVAL: 60 * 1000, // Check every minute

  // Password policy
  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    PREVENT_COMMON_PASSWORDS: true,
    MAX_AGE_DAYS: 90,
    HISTORY_COUNT: 5,
  },

  // OTP configuration
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  OTP_RESEND_COOLDOWN_SECONDS: 60,
  OTP_MAX_ATTEMPTS: 3,

  // MFA configuration
  MFA_ISSUER: 'RecoverFlow',
  MFA_DIGITS: 6,
  MFA_PERIOD: 30,

  // Login configuration
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,

  // Session management
  MAX_CONCURRENT_SESSIONS: 5,
  SESSION_SYNC_INTERVAL: 30 * 1000, // 30 seconds
} as const

export const AUTH_ROUTES = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  MFA_SETUP: '/mfa/setup',
  MFA_VERIFY: '/mfa/verify',
  SESSION_EXPIRED: '/session-expired',
  UNAUTHORIZED: '/unauthorized',
  ACCOUNT_LOCKED: '/account-locked',
  PASSWORD_EXPIRED: '/password-expired',
} as const

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact administrator',
  ACCOUNT_INACTIVE: 'Your account is inactive. Please contact administrator',
  PASSWORD_EXPIRED: 'Your password has expired. Please reset your password',
  TENANT_NOT_FOUND: 'Tenant not found. Please check your tenant code',
  TOKEN_EXPIRED: 'Your session has expired. Please login again',
  TOKEN_INVALID: 'Invalid authentication token',
  SESSION_EXPIRED: 'Your session has expired due to inactivity',
  UNAUTHORIZED: 'You do not have permission to access this resource',
  FORBIDDEN: 'Access denied',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  VALIDATION_ERROR: 'Please check your input and try again',
  OTP_INVALID: 'Invalid OTP code',
  OTP_EXPIRED: 'OTP has expired. Please request a new one',
  OTP_ATTEMPTS_EXCEEDED: 'Maximum OTP attempts exceeded. Please request a new one',
  MFA_REQUIRED: 'Multi-factor authentication is required',
  MFA_INVALID: 'Invalid MFA code',
} as const

export const PASSWORD_STRENGTH = {
  WEAK: 0,
  FAIR: 1,
  GOOD: 2,
  STRONG: 3,
} as const

export const SESSION_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  TOKEN_REFRESH: 'auth:token_refresh',
  SESSION_EXPIRED: 'auth:session_expired',
  IDLE_TIMEOUT: 'auth:idle_timeout',
  TAB_SYNC: 'auth:tab_sync',
  LAST_ACTIVITY: 'auth:last_activity',
} as const
