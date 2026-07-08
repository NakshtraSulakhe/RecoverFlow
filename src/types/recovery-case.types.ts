export interface RecoveryCase {
  id: string;
  tenant_id: string;
  case_number: string;
  loan_id: string;
  customer_id: string;
  case_type_id?: string;
  case_status_id?: string;
  case_type: string;
  case_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  case_status: string;
  workflow_template_id?: string;
  workflow_stage?: string;
  assigned_business_unit_id?: string;
  assigned_team_id?: string;
  assigned_user_id?: string;
  assigned_date: string;
  expected_resolution_date?: string;
  actual_resolution_date?: string;
  escalation_level: number;
  escalated_to?: string;
  escalated_at?: string;
  escalation_reason?: string;
  total_outstanding: number;
  recovered_amount: number;
  recovery_percentage?: number;
  risk_score?: number;
  recovery_probability?: number;
  sla_breach_date?: string;
  sla_status?: 'ON_TRACK' | 'AT_RISK' | 'BREACHED';
  communication_summary?: string;
  last_activity?: string;
  last_activity_date?: string;
  next_follow_up_date?: string;
  next_follow_up_type?: string;
  ptp_amount?: number;
  ptp_date?: string;
  ptp_status: 'NONE' | 'PENDING' | 'KEPT' | 'BROKEN';
  communication_count: number;
  visit_count: number;
  payment_count: number;
  legal_action_count: number;
  ai_recommendations?: Record<string, any>;
  notes?: string;
  resolution_summary?: string;
  custom_fields?: Record<string, any>;
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
  primary_phone?: string;
  loan_number?: string;
  loan_status?: string;
  dpd_days?: number;
  loan_outstanding?: number;
  assigned_user_name?: string;
  assigned_team_name?: string;
  assigned_business_unit_name?: string;
  case_status_name?: string;
  case_status_color?: string;
  case_type_name?: string;
}

export interface CaseAssignment {
  id: string;
  case_id: string;
  assigned_from_user_id?: string;
  assigned_to_user_id?: string;
  assigned_from_team_id?: string;
  assigned_to_team_id?: string;
  assigned_from_business_unit_id?: string;
  assigned_to_business_unit_id?: string;
  assigned_from_user_name?: string;
  assigned_to_user_name?: string;
  assigned_from_team_name?: string;
  assigned_to_team_name?: string;
  assigned_from_business_unit_name?: string;
  assigned_to_business_unit_name?: string;
  assignment_type: 'MANUAL' | 'AUTOMATIC' | 'ESCALATION' | 'REASSIGNMENT' | 'ROUND_ROBIN';
  assignment_reason?: string;
  assigned_by: string;
  assigned_at: string;
  is_active: boolean;
}

export interface CaseHistory {
  id: string;
  case_id: string;
  event_type: string;
  event_category: 'SYSTEM' | 'COMMUNICATION' | 'PAYMENT' | 'ACTIVITY' | 'LEGAL' | 'STATUS' | 'ASSIGNMENT';
  event_title: string;
  event_description?: string;
  old_value?: Record<string, any>;
  new_value?: Record<string, any>;
  performed_by?: string;
  performed_by_name?: string;
  performed_at: string;
  metadata?: Record<string, any>;
}

export interface CaseTag {
  id: string;
  case_id: string;
  tag_name: string;
  tag_color?: string;
  created_by: string;
  created_at: string;
}

export interface CaseNote {
  id: string;
  case_id: string;
  note_type: 'general' | 'warning' | 'important' | 'internal' | 'legal';
  title?: string;
  content: string;
  is_private: boolean;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface RecoveryCaseFilters {
  customer_id?: string;
  loan_id?: string;
  case_type?: string;
  case_priority?: string;
  case_status?: string;
  assigned_user_id?: string;
  assigned_team_id?: string;
  assigned_business_unit_id?: string;
  sla_status?: string;
  ptp_status?: string;
  risk_min?: number;
  risk_max?: number;
  next_follow_up_from?: string;
  next_follow_up_to?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface RecoveryCaseFormData {
  loan_id: string;
  customer_id: string;
  case_type_id?: string;
  case_type: string;
  case_priority: string;
  case_status: string;
  workflow_template_id?: string;
  assigned_business_unit_id?: string;
  assigned_team_id?: string;
  assigned_user_id?: string;
  expected_resolution_date?: string;
  total_outstanding: number;
  risk_score?: number;
  recovery_probability?: number;
  sla_breach_date?: string;
  notes?: string;
  custom_fields?: Record<string, any>;
}

export interface DashboardStats {
  today_new_cases: number;
  assigned_cases: number;
  open_cases: number;
  high_risk_cases: number;
  ptp_due: number;
  broken_ptp: number;
  closed_cases: number;
}
