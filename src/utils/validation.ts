/**
 * Email validation
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Phone number validation
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Required field validation
 */
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

/**
 * Password validation
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * URL validation
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Number range validation
 */
export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Date validation
 */
export const validateDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return !isNaN(dateObj.getTime())
}

/**
 * Future date validation
 */
export const validateFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return !isNaN(dateObj.getTime()) && dateObj > new Date()
}

/**
 * Past date validation
 */
export const validatePastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return !isNaN(dateObj.getTime()) && dateObj < new Date()
}

