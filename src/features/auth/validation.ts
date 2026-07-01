/**
 * Authentication Validation Helpers
 */

import { validateEmail } from '../../utils/validation'
import { PasswordValidationResult } from './types'
import { AUTH_CONFIG } from './constants'

/**
 * Validate login credentials
 */
export const validateLoginCredentials = (email: string, password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!email) {
    errors.push('Email is required')
  } else if (!validateEmail(email)) {
    errors.push('Invalid email format')
  }

  if (!password) {
    errors.push('Password is required')
  } else if (password.length < AUTH_CONFIG.PASSWORD_POLICY.MIN_LENGTH) {
    errors.push(`Password must be at least ${AUTH_CONFIG.PASSWORD_POLICY.MIN_LENGTH} characters`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate registration credentials
 */
export const validateRegistrationCredentials = (
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!email) {
    errors.push('Email is required')
  } else if (!validateEmail(email)) {
    errors.push('Invalid email format')
  }

  if (!firstName) {
    errors.push('First name is required')
  }

  if (!lastName) {
    errors.push('Last name is required')
  }

  if (!password) {
    errors.push('Password is required')
  } else {
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors)
    }
  }

  if (!confirmPassword) {
    errors.push('Please confirm your password')
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  const policy = AUTH_CONFIG.PASSWORD_POLICY
  const errors: string[] = []

  if (password.length < policy.MIN_LENGTH) {
    errors.push(`Password must be at least ${policy.MIN_LENGTH} characters`)
  }

  if (password.length > policy.MAX_LENGTH) {
    errors.push(`Password must not exceed ${policy.MAX_LENGTH} characters`)
  }

  if (policy.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (policy.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (policy.REQUIRE_NUMBERS && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (policy.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  // Calculate strength
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

  if (score >= 5) strength = 'strong'
  else if (score >= 4) strength = 'good'
  else if (score >= 2) strength = 'fair'

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  }
}

/**
 * Validate forgot password request
 */
export const validateForgotPassword = (email: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!email) {
    errors.push('Email is required')
  } else if (!validateEmail(email)) {
    errors.push('Invalid email format')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate reset password request
 */
export const validateResetPassword = (
  token: string,
  password: string,
  confirmPassword: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!token) {
    errors.push('Reset token is required')
  }

  if (!password) {
    errors.push('Password is required')
  } else {
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors)
    }
  }

  if (!confirmPassword) {
    errors.push('Please confirm your password')
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate change password request
 */
export const validateChangePassword = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!currentPassword) {
    errors.push('Current password is required')
  }

  if (!newPassword) {
    errors.push('New password is required')
  } else {
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors)
    }
  }

  if (!confirmPassword) {
    errors.push('Please confirm your new password')
  } else if (newPassword !== confirmPassword) {
    errors.push('Passwords do not match')
  }

  if (currentPassword === newPassword) {
    errors.push('New password must be different from current password')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate OTP code
 */
export const validateOTP = (code: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!code) {
    errors.push('OTP code is required')
  } else if (!/^\d+$/.test(code)) {
    errors.push('OTP code must contain only numbers')
  } else if (code.length !== AUTH_CONFIG.OTP_LENGTH) {
    errors.push(`OTP code must be ${AUTH_CONFIG.OTP_LENGTH} digits`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate tenant code
 */
export const validateTenantCode = (code: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!code) {
    errors.push('Tenant code is required')
  } else if (code.length < 3) {
    errors.push('Tenant code must be at least 3 characters')
  } else if (!/^[a-zA-Z0-9-]+$/.test(code)) {
    errors.push('Tenant code can only contain letters, numbers, and hyphens')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
