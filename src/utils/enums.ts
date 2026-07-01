/**
 * Enum definitions for type safety
 */

/**
 * User roles enum
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent',
  SUPERVISOR = 'supervisor',
  VIEWER = 'viewer',
}

/**
 * User status enum
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

/**
 * Customer type enum
 */
export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}

/**
 * Loan type enum
 */
export enum LoanType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
  MORTGAGE = 'mortgage',
  AUTO = 'auto',
  EDUCATION = 'education',
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CASH = 'cash',
  CHEQUE = 'cheque',
  BANK_TRANSFER = 'bank_transfer',
  CARD = 'card',
  UPI = 'upi',
}

/**
 * Communication channel enum
 */
export enum CommunicationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PHONE = 'phone',
  POST = 'post',
}

/**
 * Case priority enum
 */
export enum CasePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Case status enum
 */
export enum CaseStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  PROMISE_TO_PAY = 'promise_to_pay',
  PAID = 'paid',
  LEGAL = 'legal',
  CLOSED = 'closed',
}

/**
 * Theme mode enum
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

/**
 * Notification type enum
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Sort order enum
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
