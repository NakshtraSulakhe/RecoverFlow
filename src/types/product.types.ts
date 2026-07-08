export interface Product {
  id: string;
  tenant_id: string;
  product_code: string;
  product_name: string;
  description?: string;
  product_category: 'LOAN' | 'CREDIT_CARD' | 'MORTGAGE' | 'INSURANCE' | 'UTILITY';
  product_type: string;
  min_amount?: number;
  max_amount?: number;
  min_tenure_months?: number;
  max_tenure_months?: number;
  interest_rate_min?: number;
  interest_rate_max?: number;
  processing_fee_percent?: number;
  prepayment_allowed: boolean;
  prepayment_penalty_percent?: number;
  collateral_required: boolean;
  guarantor_required: boolean;
  insurance_required: boolean;
  document_requirements?: any[];
  eligibility_criteria?: Record<string, any>;
  terms_conditions?: string;
  is_active: boolean;
  is_system_product: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted_at?: string;
  deleted_by?: string;
  is_deleted: boolean;
}

export interface ProductFilters {
  product_category?: string;
  product_type?: string;
  is_active?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProductFormData {
  product_code?: string;
  product_name: string;
  description?: string;
  product_category: string;
  product_type: string;
  min_amount?: number;
  max_amount?: number;
  min_tenure_months?: number;
  max_tenure_months?: number;
  interest_rate_min?: number;
  interest_rate_max?: number;
  processing_fee_percent?: number;
  prepayment_allowed?: boolean;
  prepayment_penalty_percent?: number;
  collateral_required?: boolean;
  guarantor_required?: boolean;
  insurance_required?: boolean;
  document_requirements?: any[];
  eligibility_criteria?: Record<string, any>;
  terms_conditions?: string;
  is_active?: boolean;
}
