export interface Customer {
  id: string;
  tenant_id: string;
  customer_code: string;
  customer_type: 'individual' | 'business' | 'corporate';
  title?: string;
  first_name?: string;
  last_name?: string;
  display_name: string;
  legal_name?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  id_type?: string;
  id_number?: string;
  id_expiry_date?: string;
  tax_id?: string;
  pan_number?: string;
  aadhaar_number?: string;
  primary_address_id?: string;
  primary_phone?: string;
  primary_email?: string;
  secondary_phone?: string;
  secondary_email?: string;
  preferred_contact_method?: string;
  preferred_contact_time?: string;
  employment_status?: string;
  occupation?: string;
  employer_name?: string;
  annual_income?: number;
  net_income?: number;
  credit_score?: number;
  credit_score_date?: string;
  risk_score?: number;
  risk_level?: string;
  customer_segment?: string;
  source?: string;
  referred_by?: string;
  relationship_manager_id?: string;
  status: 'active' | 'inactive' | 'blacklisted';
  is_blacklisted: boolean;
  blacklist_reason?: string;
  notes?: string;
  preferences?: Record<string, any>;
  custom_fields?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted_at?: string;
  deleted_by?: string;
  is_deleted: boolean;
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  address_type: 'RESIDENTIAL' | 'OFFICIAL' | 'PERMANENT' | 'COMMUNICATION';
  address_line1: string;
  address_line2?: string;
  address_line3?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country_code: string;
  is_primary: boolean;
  is_verified: boolean;
  verified_at?: string;
  verified_by?: string;
  from_date: string;
  to_date?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CustomerContact {
  id: string;
  customer_id: string;
  contact_type: 'PHONE' | 'EMAIL' | 'WHATSAPP';
  contact_value: string;
  is_primary: boolean;
  is_verified: boolean;
  verified_at?: string;
  verified_by?: string;
  preferred: boolean;
  do_not_contact: boolean;
  dnc_reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CustomerEmployment {
  id: string;
  customer_id: string;
  employer_name: string;
  employment_type?: string;
  job_title?: string;
  department?: string;
  employment_status?: string;
  employment_start_date?: string;
  employment_end_date?: string;
  monthly_income?: number;
  work_address_line1?: string;
  work_address_line2?: string;
  work_city?: string;
  work_state?: string;
  work_postal_code?: string;
  work_country_code?: string;
  work_phone?: string;
  work_email?: string;
  industry?: string;
  company_size?: string;
  is_current_employment: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CustomerDocument {
  id: string;
  customer_id: string;
  document_type: 'ID_PROOF' | 'ADDRESS_PROOF' | 'INCOME_PROOF' | 'PHOTO' | 'OTHER';
  document_name: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  issuing_authority?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_mime_type?: string;
  is_verified: boolean;
  verified_at?: string;
  verified_by?: string;
  verification_notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  note_type: 'general' | 'warning' | 'important' | 'internal';
  title?: string;
  content: string;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerTag {
  id: string;
  customer_id: string;
  tag_name: string;
  tag_color?: string;
  created_by: string;
  created_at: string;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  risk_level?: string;
  customer_segment?: string;
  customer_type?: string;
  limit?: number;
  offset?: number;
}

export interface CustomerFormData {
  customer_type?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  legal_name?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  id_type?: string;
  id_number?: string;
  id_expiry_date?: string;
  tax_id?: string;
  pan_number?: string;
  aadhaar_number?: string;
  primary_phone?: string;
  primary_email?: string;
  secondary_phone?: string;
  secondary_email?: string;
  preferred_contact_method?: string;
  preferred_contact_time?: string;
  employment_status?: string;
  occupation?: string;
  employer_name?: string;
  annual_income?: number;
  net_income?: number;
  credit_score?: number;
  credit_score_date?: string;
  risk_level?: string;
  customer_segment?: string;
  relationship_manager_id?: string;
  status?: string;
  notes?: string;
  preferences?: Record<string, any>;
}
