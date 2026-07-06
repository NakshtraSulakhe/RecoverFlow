export interface Department {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Team {
  id: string;
  tenant_id: string;
  department_id?: string;
  name: string;
  code: string;
  description?: string;
  manager_id?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Permission {
  id: string;
  module_code: string;
  permission_code: string;
  name: string;
  description?: string;
  permission_type: 'module' | 'page' | 'action' | 'feature';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: string;
  tenant_id?: string;
  name: string;
  code: string;
  description?: string;
  is_system_role: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  permissions?: Permission[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: Date;
  assigned_by?: string;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  profile_picture_url?: string;
  phone?: string;
  user_type: 'platform_owner' | 'tenant_admin' | 'recovery_manager' | 'team_leader' | 'recovery_agent' | 'legal_officer' | 'qa' | 'auditor' | 'read_only';
  department_id?: string;
  team_id?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  updated_at: Date;
  roles?: Role[];
  permissions?: string[];
}

export interface Tenant {
  id: string;
  tenant_code: string;
  tenant_name: string;
  legal_name?: string;
  business_type?: 'bank' | 'nbfc' | 'collection_agency' | 'fintech' | 'lending_company' | 'microfinance';
  contact_email: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  subdomain?: string;
  industry?: string;
  timezone?: string;
  currency?: string;
  gst_number?: string;
  pan_number?: string;
  logo_url?: string;
  brand_color?: string;
  subscription_tier?: string;
  subscription_status?: 'active' | 'suspended' | 'cancelled' | 'expired';
  subscription_expires_at?: Date;
  features: Record<string, boolean>;
  branding?: Record<string, any>;
  settings: Record<string, any>;
  security_settings?: Record<string, any>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Customer {
  id: string;
  tenant_id: string;
  customer_code: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country_code: string;
  date_of_birth?: Date;
  pan_number?: string;
  aadhaar_number?: string;
  status: 'active' | 'inactive' | 'blacklisted';
  created_at: Date;
  updated_at: Date;
}

export interface Loan {
  id: string;
  tenant_id: string;
  customer_id: string;
  loan_code: string;
  loan_type_id: string;
  principal_amount: number;
  outstanding_amount: number;
  interest_rate: number;
  tenure_months: number;
  emi_amount: number;
  disbursement_date: Date;
  due_date: Date;
  status: 'active' | 'paid' | 'defaulted' | 'written_off' | 'settled';
  dpd_days: number;
  created_at: Date;
  updated_at: Date;
}

export interface RecoveryCase {
  id: string;
  tenant_id: string;
  loan_id: string;
  customer_id: string;
  case_code: string;
  assigned_agent_id?: string;
  assigned_team_id?: string;
  stage: 'new' | 'contact_attempt' | 'negotiation' | 'promise_to_pay' | 'payment' | 'legal' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  recovery_score?: number;
  risk_score?: number;
  next_action_date?: Date;
  status: 'active' | 'inactive' | 'closed';
  created_at: Date;
  updated_at: Date;
}

export interface PromiseToPay {
  id: string;
  tenant_id: string;
  recovery_case_id: string;
  amount: number;
  promise_date: Date;
  status: 'pending' | 'kept' | 'broken' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  subscription_code: string;
  tenant_id: string;
  tenant_name?: string;
  tenant_code?: string;
  plan_code: string;
  plan_name: string;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  amount: number;
  currency: string;
  status: 'active' | 'suspended' | 'cancelled' | 'expired';
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Module {
  id: string;
  module_code: string;
  module_name: string;
  category: string;
  description?: string;
  icon?: string;
  route?: string;
  sort_order: number;
  status: 'active' | 'inactive';
  is_core_module: boolean;
  is_add_on: boolean;
  requires_subscription_tier?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TenantModule {
  id: string;
  tenant_id: string;
  module_id: string;
  module_code: string;
  is_enabled: boolean;
  is_custom: boolean;
  overrides_subscription: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  tenant_id: string;
  loan_id: string;
  customer_id: string;
  amount: number;
  payment_date: Date;
  payment_method: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  sub: string;
  tenant_id: string;
  email: string;
  user_type: string;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tenant: Tenant;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  [key: string]: any;
}
