/**
 * Authentication Types and Interfaces
 */

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string
  phone?: string
  role: UserRole
  permissions: string[]
  tenantId?: string
  tenantName?: string
  branchId?: string
  branchName?: string
  departmentId?: string
  departmentName?: string
  language: string
  theme: 'light' | 'dark' | 'system'
  timezone: string
  isActive: boolean
  isLocked: boolean
  lastLoginAt?: string
  passwordExpiresAt?: string
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPERVISOR = 'supervisor',
  AGENT = 'agent',
  VIEWER = 'viewer',
}

export interface LoginCredentials {
  email: string
  password: string
  tenantCode?: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  tenantCode?: string
}

export interface ForgotPasswordRequest {
  email: string
  tenantCode?: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface SessionInfo {
  id: string
  userId: string
  device: string
  browser: string
  os: string
  ipAddress: string
  location?: string
  lastActive: string
  isCurrent: boolean
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  tokenExpiresAt: string | null
  isLoading: boolean
  error: string | null
  sessionTimeout: number
  idleTimeout: number
}

export interface AuthError {
  code: string
  message: string
  details?: any
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  PASSWORD_EXPIRED = 'PASSWORD_EXPIRED',
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventCommonPasswords: boolean
  preventPersonalInfo: boolean
  maxAgeDays?: number
  historyCount?: number
}

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'fair' | 'good' | 'strong'
}

export interface OTPRequest {
  email: string
  purpose: 'forgot_password' | 'verify_email' | 'mfa'
}

export interface OTPVerifyRequest {
  email: string
  code: string
  purpose: 'forgot_password' | 'verify_email' | 'mfa'
}

export interface MFASetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface MFAVerifyRequest {
  code: string
  backupCode?: string
}
