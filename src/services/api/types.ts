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
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  tenant_code: string;
  tenant_name: string;
  legal_name: string;
  business_type: 'bank' | 'nbfc' | 'collection_agency' | 'fintech' | 'lending_company' | 'microfinance';
  contact_email: string;
  contact_phone?: string;
  status: 'active' | 'suspended' | 'terminated';
  subscription_plan: string;
  features: Record<string, boolean>;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
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
  date_of_birth?: string;
  pan_number?: string;
  aadhaar_number?: string;
  status: 'active' | 'inactive' | 'blacklisted';
  created_at: string;
  updated_at: string;
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
  disbursement_date: string;
  due_date: string;
  status: 'active' | 'paid' | 'defaulted' | 'written_off' | 'settled';
  dpd_days: number;
  created_at: string;
  updated_at: string;
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
  next_action_date?: string;
  status: 'active' | 'inactive' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface PromiseToPay {
  id: string;
  tenant_id: string;
  recovery_case_id: string;
  amount: number;
  promise_date: string;
  status: 'pending' | 'kept' | 'broken' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
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

export interface AuthResponse {
  user: User;
  tenant: Tenant;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  tenant_id?: string;
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
