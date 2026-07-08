export interface Account {
  id: string;
  tenant_id: string;
  customer_id: string;
  account_number: string;
  account_type: 'SAVINGS' | 'CURRENT' | 'CREDIT_CARD' | 'LOAN_ACCOUNT' | 'MORTGAGE' | 'UTILITY' | 'INSURANCE';
  account_name?: string;
  product_id?: string;
  branch_id?: string;
  status: 'active' | 'inactive' | 'closed' | 'frozen' | 'dormant';
  opened_date: string;
  closed_date?: string;
  credit_limit?: number;
  current_balance: number;
  available_balance: number;
  currency: string;
  interest_rate?: number;
  account_holder_name?: string;
  joint_account_holders?: any[];
  nominee_name?: string;
  nominee_relationship?: string;
  is_primary_account: boolean;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted_at?: string;
  deleted_by?: string;
  is_deleted: boolean;
  customer_name?: string;
  customer_code?: string;
}

export interface AccountFilters {
  customer_id?: string;
  account_type?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface AccountFormData {
  customer_id: string;
  account_type: string;
  account_name?: string;
  product_id?: string;
  branch_id?: string;
  opened_date: string;
  closed_date?: string;
  credit_limit?: number;
  currency?: string;
  interest_rate?: number;
  account_holder_name?: string;
  joint_account_holders?: any[];
  nominee_name?: string;
  nominee_relationship?: string;
  is_primary_account?: boolean;
  notes?: string;
}
