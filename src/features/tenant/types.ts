/**
 * Multi-Tenant Platform Types
 */

export interface Tenant {
  id: string
  name: string
  code: string
  logo?: string
  favicon?: string
  domain?: string
  subdomain?: string
  status: TenantStatus
  subscription: TenantSubscription
  branding: TenantBranding
  settings: TenantSettings
  security: TenantSecurity
  features: TenantFeatures
  usage: TenantUsage
  primaryContact: TenantContact
  businessDetails: TenantBusinessDetails
  createdAt: string
  updatedAt: string
}

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export interface TenantSubscription {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startDate: string
  endDate: string
  renewalDate: string
  autoRenew: boolean
  paymentMethod?: string
  billingAddress?: BillingAddress
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  TRIAL = 'trial',
  EXPIRED = 'expired',
}

export interface BillingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface TenantBranding {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoLight?: string
  logoDark?: string
  favicon?: string
  loginBackground?: string
  emailHeader?: string
  emailFooter?: string
  reportHeader?: string
  reportFooter?: string
  customCSS?: string
}

export interface TenantSettings {
  timezone: string
  currency: string
  language: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  firstDayOfWeek: number
  businessHours: BusinessHours
  holidays: Holiday[]
}

export interface BusinessHours {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export interface DaySchedule {
  enabled: boolean
  startTime: string
  endTime: string
  breakStart?: string
  breakEnd?: string
}

export interface Holiday {
  id: string
  name: string
  date: string
  recurring: boolean
}

export interface TenantSecurity {
  passwordPolicy: PasswordPolicy
  sessionPolicy: SessionPolicy
  mfaEnabled: boolean
  mfaRequired: boolean
  ipWhitelist: string[]
  allowedDomains: string[]
  twoFactorMethods: TwoFactorMethod[]
}

export interface PasswordPolicy {
  minLength: number
  maxLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventCommonPasswords: boolean
  preventPersonalInfo: boolean
  maxAgeDays?: number
  historyCount?: number
}

export interface SessionPolicy {
  timeoutMinutes: number
  idleTimeoutMinutes: number
  maxConcurrentSessions: number
  rememberMeDays: number
}

export enum TwoFactorMethod {
  SMS = 'sms',
  EMAIL = 'email',
  AUTHENTICATOR = 'authenticator',
  HARDWARE_TOKEN = 'hardware_token',
}

export interface TenantFeatures {
  ai: FeatureFlag
  payments: FeatureFlag
  legal: FeatureFlag
  reports: FeatureFlag
  workflows: FeatureFlag
  notifications: FeatureFlag
  api: FeatureFlag
  integrations: FeatureFlag
  advancedAnalytics: FeatureFlag
  customFields: FeatureFlag
  multiCurrency: FeatureFlag
  multiLanguage: FeatureFlag
}

export interface FeatureFlag {
  enabled: boolean
  limit?: number
  expiresAt?: string
}

export interface TenantUsage {
  storage: StorageUsage
  users: UsageMetric
  branches: UsageMetric
  apiCalls: UsageMetric
  aiCredits: UsageMetric
}

export interface StorageUsage {
  used: number
  limit: number
  unit: 'GB' | 'TB'
}

export interface UsageMetric {
  used: number
  limit: number
}

export interface TenantContact {
  name: string
  email: string
  phone?: string
  role: string
}

export interface TenantBusinessDetails {
  industry: string
  companySize: CompanySize
  registrationNumber?: string
  taxId?: string
  website?: string
  address?: Address
}

export enum CompanySize {
  SOLO = 'solo',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise',
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  country: string
  postalCode: string
}

// Organization Types
export interface Branch {
  id: string
  tenantId: string
  name: string
  code: string
  type: BranchType
  parentId?: string
  managerId?: string
  location: Address
  contact: ContactInfo
  status: OrganizationStatus
  isHeadquarters: boolean
  createdAt: string
  updatedAt: string
}

export enum BranchType {
  HEADQUARTERS = 'headquarters',
  REGIONAL = 'regional',
  LOCAL = 'local',
  VIRTUAL = 'virtual',
}

export interface ContactInfo {
  email: string
  phone?: string
  fax?: string
}

export enum OrganizationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface Department {
  id: string
  tenantId: string
  branchId: string
  name: string
  code: string
  description?: string
  headId?: string
  parentId?: string
  budget?: number
  status: OrganizationStatus
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  tenantId: string
  branchId: string
  departmentId?: string
  name: string
  code: string
  description?: string
  leadId?: string
  memberIds: string[]
  status: OrganizationStatus
  createdAt: string
  updatedAt: string
}

export interface Designation {
  id: string
  tenantId: string
  title: string
  code: string
  level: DesignationLevel
  description?: string
  permissions: string[]
  status: OrganizationStatus
  createdAt: string
  updatedAt: string
}

export enum DesignationLevel {
  EXECUTIVE = 'executive',
  MANAGEMENT = 'management',
  SENIOR = 'senior',
  MID = 'mid',
  JUNIOR = 'junior',
  INTERN = 'intern',
}

export interface Location {
  id: string
  tenantId: string
  branchId: string
  name: string
  type: LocationType
  address: Address
  coordinates?: Coordinates
  capacity?: number
  facilities: string[]
  status: OrganizationStatus
  createdAt: string
  updatedAt: string
}

export enum LocationType {
  OFFICE = 'office',
  WAREHOUSE = 'warehouse',
  RETAIL = 'retail',
  BRANCH = 'branch',
  OTHER = 'other',
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface BusinessUnit {
  id: string
  tenantId: string
  name: string
  code: string
  description?: string
  headId?: string
  departmentIds: string[]
  status: OrganizationStatus
  createdAt: string
  updatedAt: string
}

// Audit Types
export interface TenantAuditLog {
  id: string
  tenantId: string
  userId: string
  action: AuditAction
  entityType: EntityType
  entityId: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  SUSPEND = 'suspend',
  UNSUSPEND = 'unsuspend',
}

export enum EntityType {
  TENANT = 'tenant',
  BRANCH = 'branch',
  DEPARTMENT = 'department',
  TEAM = 'team',
  USER = 'user',
  DESIGNATION = 'designation',
  LOCATION = 'location',
  BUSINESS_UNIT = 'business_unit',
  SETTINGS = 'settings',
  BRANDING = 'branding',
  FEATURE_FLAG = 'feature_flag',
}
