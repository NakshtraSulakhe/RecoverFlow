-- =============================================
-- Sprint 5 Seed Data
-- =============================================

\c recoverflow_dev;

-- =============================================
-- Seed Industry Templates
-- =============================================
INSERT INTO industry_templates (industry_code, industry_name, description, is_active) VALUES
('BANKING', 'Banking', 'Retail and corporate banking recovery operations', true),
('NBFC', 'NBFC', 'Non-banking financial companies', true),
('COLLECTION_AGENCY', 'Collection Agency', 'Third-party debt collection agencies', true),
('FINTECH', 'FinTech', 'Financial technology companies', true),
('INSURANCE', 'Insurance', 'Insurance claims recovery', true),
('TELECOM', 'Telecom', 'Telecom bill collections', true),
('UTILITIES', 'Utilities', 'Electricity, water, gas utilities', true),
('HEALTHCARE', 'Healthcare', 'Healthcare and medical bill collections', true),
('EDUCATION', 'Education', 'Educational institution fee collections', true),
('B2B_RECEIVABLES', 'B2B Receivables', 'Business-to-business receivables management', true),
('CUSTOM', 'Custom', 'Custom industry configuration', true)
ON CONFLICT (industry_code) DO NOTHING;

-- =============================================
-- Seed Domain Packs
-- =============================================

-- Banking Domain Pack
INSERT INTO domain_packs (
    industry_code,
    pack_code,
    pack_name,
    description,
    is_system_pack,
    is_active,
    default_modules,
    default_business_units,
    default_workflows,
    default_roles,
    default_dashboard,
    default_business_rules
) VALUES (
    'BANKING',
    'BANKING_STANDARD',
    'Banking - Standard',
    'Standard banking recovery domain pack',
    true,
    true,
    '["dashboard", "customers", "accounts", "recovery", "dialer", "sms", "whatsapp", "email", "payments", "reports", "workflow", "legal", "settlement", "document_management", "notification_center"]',
    '[
        {"code": "RETAIL_COLLECTIONS", "name": "Retail Collections", "type": "DEPARTMENT"},
        {"code": "CORPORATE_COLLECTIONS", "name": "Corporate Collections", "type": "DEPARTMENT"},
        {"code": "FIELD_OPERATIONS", "name": "Field Operations", "type": "DEPARTMENT"},
        {"code": "LEGAL", "name": "Legal", "type": "DEPARTMENT"},
        {"code": "COMPLIANCE", "name": "Compliance", "type": "DEPARTMENT"},
        {"code": "CUSTOMER_CARE", "name": "Customer Care", "type": "DEPARTMENT"}
    ]',
    '[
        {
            "code": "STANDARD_RECOVERY",
            "name": "Standard Recovery Workflow",
            "stages": [
                {"code": "NEW_CASE", "name": "New Case", "order": 1, "color": "#3B82F6", "is_initial": true},
                {"code": "ASSIGNED", "name": "Assigned", "order": 2, "color": "#8B5CF6"},
                {"code": "TELE_CALLING", "name": "Tele Calling", "order": 3, "color": "#06B6D4"},
                {"code": "REMINDER", "name": "Reminder", "order": 4, "color": "#F59E0B"},
                {"code": "PAYMENT", "name": "Payment Made", "order": 5, "color": "#10B981", "is_final": true},
                {"code": "CLOSED", "name": "Closed", "order": 6, "color": "#6B7280", "is_final": true}
            ]
        }
    ]',
    '[
        {"code": "TENANT_ADMIN", "name": "Tenant Admin"},
        {"code": "RECOVERY_MANAGER", "name": "Recovery Manager"},
        {"code": "TEAM_LEADER", "name": "Team Leader"},
        {"code": "RECOVERY_AGENT", "name": "Recovery Agent"},
        {"code": "FIELD_AGENT", "name": "Field Agent"},
        {"code": "LEGAL_OFFICER", "name": "Legal Officer"},
        {"code": "CUSTOMER_CARE", "name": "Customer Care Executive"}
    ]',
    '[
        {"type": "total_recovery", "title": "Total Recovery", "width": 3, "height": 2},
        {"type": "pending_cases", "title": "Pending Cases", "width": 3, "height": 2},
        {"type": "recovery_rate", "title": "Recovery Rate", "width": 3, "height": 2},
        {"type": "agent_performance", "title": "Agent Performance", "width": 6, "height": 2}
    ]',
    '[
        {"code": "AUTO_ASSIGN_DPD", "name": "Auto Assign by DPD", "rule_type": "ASSIGNMENT"}
    ]'
)
ON CONFLICT (industry_code, pack_code) WHERE tenant_id IS NULL DO NOTHING;

-- NBFC Domain Pack
INSERT INTO domain_packs (
    industry_code,
    pack_code,
    pack_name,
    description,
    is_system_pack,
    is_active,
    default_modules,
    default_business_units,
    default_workflows,
    default_roles,
    default_dashboard,
    default_business_rules
) VALUES (
    'NBFC',
    'NBFC_STANDARD',
    'NBFC - Standard',
    'Standard NBFC recovery domain pack',
    true,
    true,
    '["dashboard", "customers", "accounts", "recovery", "field_visits", "dialer", "sms", "whatsapp", "email", "payments", "reports", "workflow", "legal", "settlement", "document_management", "notification_center"]',
    '[
        {"code": "MICROFINANCE", "name": "Microfinance", "type": "DEPARTMENT"},
        {"code": "SME_LOANS", "name": "SME Loans", "type": "DEPARTMENT"},
        {"code": "VEHICLE_LOANS", "name": "Vehicle Loans", "type": "DEPARTMENT"},
        {"code": "FIELD_OPERATIONS", "name": "Field Operations", "type": "DEPARTMENT"},
        {"code": "LEGAL", "name": "Legal", "type": "DEPARTMENT"},
        {"code": "COMPLIANCE", "name": "Compliance", "type": "DEPARTMENT"}
    ]',
    '[
        {
            "code": "NBFC_RECOVERY",
            "name": "NBFC Recovery Workflow",
            "stages": [
                {"code": "NEW_CASE", "name": "New Case", "order": 1, "color": "#3B82F6", "is_initial": true},
                {"code": "ASSIGNED", "name": "Assigned", "order": 2, "color": "#8B5CF6"},
                {"code": "FIELD_VISIT", "name": "Field Visit", "order": 3, "color": "#F59E0B"},
                {"code": "SETTLEMENT", "name": "Settlement", "order": 4, "color": "#06B6D4"},
                {"code": "PAYMENT", "name": "Payment Made", "order": 5, "color": "#10B981", "is_final": true},
                {"code": "CLOSED", "name": "Closed", "order": 6, "color": "#6B7280", "is_final": true}
            ]
        }
    ]',
    '[
        {"code": "TENANT_ADMIN", "name": "Tenant Admin"},
        {"code": "RECOVERY_MANAGER", "name": "Recovery Manager"},
        {"code": "TEAM_LEADER", "name": "Team Leader"},
        {"code": "RECOVERY_AGENT", "name": "Recovery Agent"},
        {"code": "FIELD_AGENT", "name": "Field Agent"},
        {"code": "LEGAL_OFFICER", "name": "Legal Officer"}
    ]',
    '[
        {"type": "total_recovery", "title": "Total Recovery", "width": 3, "height": 2},
        {"type": "pending_cases", "title": "Pending Cases", "width": 3, "height": 2},
        {"type": "field_visits_today", "title": "Field Visits Today", "width": 3, "height": 2},
        {"type": "agent_performance", "title": "Agent Performance", "width": 6, "height": 2}
    ]',
    '[
        {"code": "AUTO_ASSIGN_DPD", "name": "Auto Assign by DPD", "rule_type": "ASSIGNMENT"}
    ]'
)
ON CONFLICT (industry_code, pack_code) WHERE tenant_id IS NULL DO NOTHING;

-- Collection Agency Domain Pack
INSERT INTO domain_packs (
    industry_code,
    pack_code,
    pack_name,
    description,
    is_system_pack,
    is_active,
    default_modules,
    default_business_units,
    default_workflows,
    default_roles,
    default_dashboard,
    default_business_rules
) VALUES (
    'COLLECTION_AGENCY',
    'COLLECTION_STANDARD',
    'Collection Agency - Standard',
    'Standard collection agency domain pack',
    true,
    true,
    '["dashboard", "customers", "accounts", "recovery", "field_visits", "dialer", "sms", "whatsapp", "email", "payments", "reports", "workflow", "legal", "settlement", "document_management", "notification_center", "analytics"]',
    '[
        {"code": "COLLECTIONS", "name": "Collections", "type": "DEPARTMENT"},
        {"code": "FIELD_OPERATIONS", "name": "Field Operations", "type": "DEPARTMENT"},
        {"code": "LEGAL", "name": "Legal", "type": "DEPARTMENT"},
        {"code": "QUALITY_ASSURANCE", "name": "Quality Assurance", "type": "DEPARTMENT"},
        {"code": "CLIENT_MANAGEMENT", "name": "Client Management", "type": "DEPARTMENT"}
    ]',
    '[
        {
            "code": "COLLECTION_WORKFLOW",
            "name": "Collection Workflow",
            "stages": [
                {"code": "NEW_CASE", "name": "New Case", "order": 1, "color": "#3B82F6", "is_initial": true},
                {"code": "ASSIGNED", "name": "Assigned", "order": 2, "color": "#8B5CF6"},
                {"code": "TELE_CALLING", "name": "Tele Calling", "order": 3, "color": "#06B6D4"},
                {"code": "FIELD_VISIT", "name": "Field Visit", "order": 4, "color": "#F59E0B"},
                {"code": "SETTLEMENT", "name": "Settlement", "order": 5, "color": "#EC4899"},
                {"code": "PAYMENT", "name": "Payment Made", "order": 6, "color": "#10B981", "is_final": true},
                {"code": "CLOSED", "name": "Closed", "order": 7, "color": "#6B7280", "is_final": true}
            ]
        }
    ]',
    '[
        {"code": "TENANT_ADMIN", "name": "Tenant Admin"},
        {"code": "RECOVERY_MANAGER", "name": "Recovery Manager"},
        {"code": "TEAM_LEADER", "name": "Team Leader"},
        {"code": "RECOVERY_AGENT", "name": "Recovery Agent"},
        {"code": "FIELD_AGENT", "name": "Field Agent"},
        {"code": "QUALITY_ANALYST", "name": "Quality Analyst"},
        {"code": "CLIENT_ACCOUNT_MANAGER", "name": "Client Account Manager"}
    ]',
    '[
        {"type": "total_recovery", "title": "Total Recovery", "width": 3, "height": 2},
        {"type": "pending_cases", "title": "Pending Cases", "width": 3, "height": 2},
        {"type": "client_wise_recovery", "title": "Client-wise Recovery", "width": 6, "height": 2},
        {"type": "agent_performance", "title": "Agent Performance", "width": 6, "height": 2}
    ]',
    '[
        {"code": "AUTO_ASSIGN_DPD", "name": "Auto Assign by DPD", "rule_type": "ASSIGNMENT"},
        {"code": "ESCALATE_7_DAYS", "name": "Escalate after 7 days", "rule_type": "ESCALATION"}
    ]'
)
ON CONFLICT (industry_code, pack_code) WHERE tenant_id IS NULL DO NOTHING;

-- =============================================
-- Seed Default Workflow Templates
-- =============================================
-- First insert base workflow templates, then stages
-- (Stages will be added in separate seed file or via code)
-- For now, insert the standard recovery workflow template
INSERT INTO workflow_templates (
    template_code,
    template_name,
    description,
    is_system_template,
    is_active
) VALUES (
    'STANDARD_RECOVERY',
    'Standard Recovery Workflow',
    'Default standard recovery workflow for all industries',
    true,
    true
)
ON CONFLICT (template_code) WHERE tenant_id IS NULL DO NOTHING;

-- =============================================
-- Optional: Add Sample Workflow Stages (if template exists)
-- =============================================
DO $$
DECLARE
    v_workflow_id UUID;
BEGIN
    SELECT id INTO v_workflow_id FROM workflow_templates WHERE template_code = 'STANDARD_RECOVERY' LIMIT 1;
    
    IF v_workflow_id IS NOT NULL THEN
        INSERT INTO workflow_stages (
            workflow_template_id,
            stage_code,
            stage_name,
            description,
            order_index,
            color,
            is_initial,
            is_final
        ) VALUES
            (v_workflow_id, 'NEW_CASE', 'New Case', 'Newly created recovery case', 1, '#3B82F6', true, false),
            (v_workflow_id, 'ASSIGNED', 'Assigned', 'Case assigned to an agent', 2, '#8B5CF6', false, false),
            (v_workflow_id, 'TELE_CALLING', 'Tele Calling', 'Agent is making calls to the customer', 3, '#06B6D4', false, false),
            (v_workflow_id, 'REMINDER', 'Reminder', 'Sending reminders to customer', 4, '#F59E0B', false, false),
            (v_workflow_id, 'PAYMENT', 'Payment Made', 'Customer has made payment', 5, '#10B981', false, true),
            (v_workflow_id, 'CLOSED', 'Closed', 'Case closed', 6, '#6B7280', false, true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- =============================================
-- Additional Sprint 5 Domain Packs
-- =============================================
INSERT INTO domain_packs (
  industry_code, pack_code, pack_name, description, is_system_pack, is_active,
  default_modules, default_business_units, default_workflows, default_roles,
  default_dashboard, default_business_rules
)
SELECT industry_code, pack_code, pack_name, description, true, true,
       default_modules::jsonb, default_business_units::jsonb, default_workflows::jsonb,
       default_roles::jsonb, default_dashboard::jsonb, default_business_rules::jsonb
FROM (VALUES
('INSURANCE', 'INSURANCE_STANDARD', 'Insurance - Standard', 'Insurance claims recovery domain pack',
 '["dashboard","customers","accounts","recovery","workflow","reports","legal","notification_center"]',
 '[{"code":"CLAIMS_RECOVERY","name":"Claims Recovery","type":"DEPARTMENT"},{"code":"FRAUD_INVESTIGATION","name":"Fraud Investigation","type":"DEPARTMENT"},{"code":"LEGAL","name":"Legal","type":"DEPARTMENT"}]',
 '[{"code":"INSURANCE_RECOVERY","name":"Insurance Recovery Workflow","stages":[{"code":"CLAIM_FILED","name":"Claim Filed","order":1,"color":"#3B82F6","is_initial":true},{"code":"INVESTIGATION","name":"Investigation","order":2,"color":"#F59E0B"},{"code":"RECOVERY","name":"Recovery","order":3,"color":"#8B5CF6"},{"code":"SETTLEMENT","name":"Settlement","order":4,"color":"#10B981","is_final":true},{"code":"CLOSED","name":"Closed","order":5,"color":"#6B7280","is_final":true}]}]',
 '[{"code":"TENANT_ADMIN","name":"Tenant Admin"},{"code":"RECOVERY_MANAGER","name":"Recovery Manager"},{"code":"LEGAL_OFFICER","name":"Legal Officer"}]',
 '[{"type":"total_recovery","title":"Total Recovery","width":3,"height":2},{"type":"pending_cases","title":"Pending Cases","width":3,"height":2}]',
 '[{"code":"FRAUD_ESCALATION","name":"Fraud Escalation","rule_type":"ESCALATION"}]'),
('FINTECH', 'FINTECH_STANDARD', 'FinTech - Standard', 'Digital lending and fintech recovery domain pack',
 '["dashboard","customers","accounts","recovery","sms","whatsapp","email","payments","workflow","reports","analytics"]',
 '[{"code":"DIGITAL_COLLECTIONS","name":"Digital Collections","type":"DEPARTMENT"},{"code":"CUSTOMER_SUCCESS","name":"Customer Success","type":"DEPARTMENT"},{"code":"RISK","name":"Risk","type":"DEPARTMENT"}]',
 '[{"code":"DIGITAL_RECOVERY","name":"Digital Recovery Workflow","stages":[{"code":"NEW_CASE","name":"New Case","order":1,"color":"#3B82F6","is_initial":true},{"code":"DIGITAL_OUTREACH","name":"Digital Outreach","order":2,"color":"#06B6D4"},{"code":"PAYMENT_LINK","name":"Payment Link Sent","order":3,"color":"#F59E0B"},{"code":"PAID","name":"Paid","order":4,"color":"#10B981","is_final":true},{"code":"CLOSED","name":"Closed","order":5,"color":"#6B7280","is_final":true}]}]',
 '[{"code":"TENANT_ADMIN","name":"Tenant Admin"},{"code":"RECOVERY_MANAGER","name":"Recovery Manager"},{"code":"RECOVERY_AGENT","name":"Recovery Agent"}]',
 '[{"type":"recovery_rate","title":"Recovery Rate","width":3,"height":2},{"type":"agent_performance","title":"Agent Performance","width":6,"height":2}]',
 '[{"code":"AUTO_DIGITAL_REMINDER","name":"Auto Digital Reminder","rule_type":"REMINDER"}]'),
('TELECOM', 'TELECOM_STANDARD', 'Telecom - Standard', 'Telecom bill collection domain pack',
 '["dashboard","customers","accounts","recovery","sms","email","payments","workflow","reports"]',
 '[{"code":"BILLING_COLLECTIONS","name":"Billing Collections","type":"DEPARTMENT"},{"code":"RETENTION","name":"Retention","type":"DEPARTMENT"},{"code":"FIELD_OPERATIONS","name":"Field Operations","type":"DEPARTMENT"}]',
 '[{"code":"TELECOM_COLLECTION","name":"Telecom Collection Workflow","stages":[{"code":"OVERDUE","name":"Overdue","order":1,"color":"#3B82F6","is_initial":true},{"code":"REMINDER","name":"Reminder","order":2,"color":"#F59E0B"},{"code":"SERVICE_HOLD","name":"Service Hold","order":3,"color":"#EF4444"},{"code":"PAID","name":"Paid","order":4,"color":"#10B981","is_final":true},{"code":"CLOSED","name":"Closed","order":5,"color":"#6B7280","is_final":true}]}]',
 '[{"code":"TENANT_ADMIN","name":"Tenant Admin"},{"code":"RECOVERY_MANAGER","name":"Recovery Manager"},{"code":"RECOVERY_AGENT","name":"Recovery Agent"}]',
 '[{"type":"pending_cases","title":"Pending Bills","width":3,"height":2},{"type":"total_recovery","title":"Collections","width":3,"height":2}]',
 '[{"code":"SERVICE_HOLD_NOTICE","name":"Service Hold Notice","rule_type":"NOTIFICATION"}]'),
('HEALTHCARE', 'HEALTHCARE_STANDARD', 'Healthcare - Standard', 'Healthcare and medical bill collections domain pack',
 '["dashboard","customers","accounts","recovery","email","payments","workflow","reports","document_management"]',
 '[{"code":"PATIENT_BILLING","name":"Patient Billing","type":"DEPARTMENT"},{"code":"INSURANCE_FOLLOWUP","name":"Insurance Follow-up","type":"DEPARTMENT"},{"code":"COMPLIANCE","name":"Compliance","type":"DEPARTMENT"}]',
 '[{"code":"HEALTHCARE_COLLECTION","name":"Healthcare Collection Workflow","stages":[{"code":"BILL_DUE","name":"Bill Due","order":1,"color":"#3B82F6","is_initial":true},{"code":"INSURANCE_CHECK","name":"Insurance Check","order":2,"color":"#8B5CF6"},{"code":"PATIENT_CONTACT","name":"Patient Contact","order":3,"color":"#06B6D4"},{"code":"PAID","name":"Paid","order":4,"color":"#10B981","is_final":true},{"code":"CLOSED","name":"Closed","order":5,"color":"#6B7280","is_final":true}]}]',
 '[{"code":"TENANT_ADMIN","name":"Tenant Admin"},{"code":"RECOVERY_MANAGER","name":"Recovery Manager"},{"code":"RECOVERY_AGENT","name":"Recovery Agent"}]',
 '[{"type":"pending_cases","title":"Pending Bills","width":3,"height":2},{"type":"recovery_rate","title":"Collection Rate","width":3,"height":2}]',
 '[{"code":"INSURANCE_FOLLOWUP","name":"Insurance Follow-up","rule_type":"REMINDER"}]'),
('EDUCATION', 'EDUCATION_STANDARD', 'Education - Standard', 'Education fee collection domain pack',
 '["dashboard","customers","accounts","recovery","sms","email","payments","workflow","reports"]',
 '[{"code":"FEE_COLLECTIONS","name":"Fee Collections","type":"DEPARTMENT"},{"code":"STUDENT_SERVICES","name":"Student Services","type":"DEPARTMENT"},{"code":"ACCOUNTS","name":"Accounts","type":"DEPARTMENT"}]',
 '[{"code":"FEE_COLLECTION","name":"Fee Collection Workflow","stages":[{"code":"DUE","name":"Due","order":1,"color":"#3B82F6","is_initial":true},{"code":"REMINDER","name":"Reminder","order":2,"color":"#F59E0B"},{"code":"COUNSELING","name":"Counseling","order":3,"color":"#8B5CF6"},{"code":"PAID","name":"Paid","order":4,"color":"#10B981","is_final":true},{"code":"CLOSED","name":"Closed","order":5,"color":"#6B7280","is_final":true}]}]',
 '[{"code":"TENANT_ADMIN","name":"Tenant Admin"},{"code":"RECOVERY_MANAGER","name":"Recovery Manager"},{"code":"RECOVERY_AGENT","name":"Recovery Agent"}]',
 '[{"type":"pending_cases","title":"Pending Fees","width":3,"height":2},{"type":"total_recovery","title":"Fees Collected","width":3,"height":2}]',
 '[{"code":"FEE_REMINDER","name":"Fee Reminder","rule_type":"REMINDER"}]')
) AS packs(industry_code, pack_code, pack_name, description, default_modules, default_business_units, default_workflows, default_roles, default_dashboard, default_business_rules)
ON CONFLICT (industry_code, pack_code) WHERE tenant_id IS NULL DO NOTHING;

INSERT INTO workflow_templates (template_code, template_name, description, industry_code, is_system_template, is_active, stages)
SELECT template_code, template_name, description, industry_code, true, true, stages::jsonb
FROM (VALUES
('INSURANCE_RECOVERY', 'Insurance Recovery Workflow', 'Default insurance recovery workflow', 'INSURANCE', '[{"code":"CLAIM_FILED","name":"Claim Filed","order":1,"color":"#3B82F6","is_initial":true},{"code":"INVESTIGATION","name":"Investigation","order":2,"color":"#F59E0B"},{"code":"CLOSED","name":"Closed","order":3,"color":"#6B7280","is_final":true}]'),
('DIGITAL_RECOVERY', 'Digital Recovery Workflow', 'Default fintech digital recovery workflow', 'FINTECH', '[{"code":"NEW_CASE","name":"New Case","order":1,"color":"#3B82F6","is_initial":true},{"code":"DIGITAL_OUTREACH","name":"Digital Outreach","order":2,"color":"#06B6D4"},{"code":"CLOSED","name":"Closed","order":3,"color":"#6B7280","is_final":true}]'),
('TELECOM_COLLECTION', 'Telecom Collection Workflow', 'Default telecom collection workflow', 'TELECOM', '[{"code":"OVERDUE","name":"Overdue","order":1,"color":"#3B82F6","is_initial":true},{"code":"REMINDER","name":"Reminder","order":2,"color":"#F59E0B"},{"code":"CLOSED","name":"Closed","order":3,"color":"#6B7280","is_final":true}]'),
('HEALTHCARE_COLLECTION', 'Healthcare Collection Workflow', 'Default healthcare collection workflow', 'HEALTHCARE', '[{"code":"BILL_DUE","name":"Bill Due","order":1,"color":"#3B82F6","is_initial":true},{"code":"PATIENT_CONTACT","name":"Patient Contact","order":2,"color":"#06B6D4"},{"code":"CLOSED","name":"Closed","order":3,"color":"#6B7280","is_final":true}]'),
('FEE_COLLECTION', 'Fee Collection Workflow', 'Default education fee collection workflow', 'EDUCATION', '[{"code":"DUE","name":"Due","order":1,"color":"#3B82F6","is_initial":true},{"code":"REMINDER","name":"Reminder","order":2,"color":"#F59E0B"},{"code":"CLOSED","name":"Closed","order":3,"color":"#6B7280","is_final":true}]')
) AS workflows(template_code, template_name, description, industry_code, stages)
ON CONFLICT (template_code) WHERE tenant_id IS NULL DO NOTHING;
