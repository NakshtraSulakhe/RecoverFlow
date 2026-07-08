-- =============================================
-- Sprint 7: Customer, Account, Loan & Recovery Case Engine
-- Database Schema
-- =============================================

\c recoverflow_dev;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Products Master
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    product_category VARCHAR(50) NOT NULL, -- LOAN, CREDIT_CARD, MORTGAGE, INSURANCE, UTILITY
    product_type VARCHAR(50) NOT NULL, -- PERSONAL_LOAN, VEHICLE_LOAN, GOLD_LOAN, etc.
    min_amount DECIMAL(15, 2),
    max_amount DECIMAL(15, 2),
    min_tenure_months INTEGER,
    max_tenure_months INTEGER,
    interest_rate_min DECIMAL(5, 2),
    interest_rate_max DECIMAL(5, 2),
    processing_fee_percent DECIMAL(5, 2),
    prepayment_allowed BOOLEAN DEFAULT TRUE,
    prepayment_penalty_percent DECIMAL(5, 2),
    collateral_required BOOLEAN DEFAULT FALSE,
    guarantor_required BOOLEAN DEFAULT FALSE,
    insurance_required BOOLEAN DEFAULT FALSE,
    document_requirements JSONB DEFAULT '[]',
    eligibility_criteria JSONB DEFAULT '{}',
    terms_conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_system_product BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, product_code)
);

CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_product_category ON products(product_category);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 2. Accounts Table
-- =============================================
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    account_number VARCHAR(50) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- SAVINGS, CURRENT, CREDIT_CARD, LOAN_ACCOUNT, MORTGAGE, UTILITY, INSURANCE
    account_name VARCHAR(255),
    product_id UUID REFERENCES products(id),
    branch_id UUID REFERENCES branches(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- ACTIVE, INACTIVE, CLOSED, FROZEN, DORMANT
    opened_date DATE NOT NULL,
    closed_date DATE,
    credit_limit DECIMAL(15, 2),
    current_balance DECIMAL(15, 2) DEFAULT 0,
    available_balance DECIMAL(15, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',
    interest_rate DECIMAL(5, 2),
    account_holder_name VARCHAR(255),
    joint_account_holders JSONB DEFAULT '[]',
    nominee_name VARCHAR(255),
    nominee_relationship VARCHAR(100),
    is_primary_account BOOLEAN DEFAULT FALSE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, account_number)
);

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_id ON accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_accounts_customer_id ON accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_accounts_account_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_product_id ON accounts(product_id);
CREATE INDEX IF NOT EXISTS idx_accounts_branch_id ON accounts(branch_id);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_accounts_opened_date ON accounts(opened_date);
CREATE INDEX IF NOT EXISTS idx_accounts_deleted_at ON accounts(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 3. Customers Table (Enhanced)
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_code VARCHAR(50) NOT NULL,
    customer_type VARCHAR(50) DEFAULT 'individual', -- INDIVIDUAL, BUSINESS, CORPORATE
    title VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality CHAR(2),
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    id_expiry_date DATE,
    tax_id VARCHAR(50),
    pan_number VARCHAR(20),
    aadhaar_number VARCHAR(20),
    primary_address_id UUID,
    primary_phone VARCHAR(50),
    primary_email VARCHAR(255),
    secondary_phone VARCHAR(50),
    secondary_email VARCHAR(255),
    preferred_contact_method VARCHAR(50),
    preferred_contact_time VARCHAR(50),
    employment_status VARCHAR(50),
    occupation VARCHAR(100),
    employer_name VARCHAR(255),
    annual_income DECIMAL(15, 2),
    net_income DECIMAL(15, 2),
    credit_score INTEGER,
    credit_score_date DATE,
    risk_score DECIMAL(5, 2),
    risk_level VARCHAR(20),
    customer_segment VARCHAR(50),
    source VARCHAR(50),
    referred_by UUID REFERENCES customers(id),
    relationship_manager_id UUID REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_blacklisted BOOLEAN DEFAULT FALSE,
    blacklist_reason TEXT,
    notes TEXT,
    preferences JSONB,
    custom_fields JSONB DEFAULT '{}',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, customer_code)
);

CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_customer_code ON customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_customers_display_name ON customers(display_name);
CREATE INDEX IF NOT EXISTS idx_customers_primary_phone ON customers(primary_phone);
CREATE INDEX IF NOT EXISTS idx_customers_primary_email ON customers(primary_email);
CREATE INDEX IF NOT EXISTS idx_customers_id_number ON customers(id_number);
CREATE INDEX IF NOT EXISTS idx_customers_risk_level ON customers(risk_level);
CREATE INDEX IF NOT EXISTS idx_customers_customer_segment ON customers(customer_segment);
CREATE INDEX IF NOT EXISTS idx_customers_relationship_manager_id ON customers(relationship_manager_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON customers(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 4. Customer Addresses Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_type VARCHAR(50) NOT NULL, -- RESIDENTIAL, OFFICIAL, PERMANENT, COMMUNICATION
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    address_line3 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    from_date DATE NOT NULL,
    to_date DATE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_address_type ON customer_addresses(address_type);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_primary ON customer_addresses(is_primary);

-- =============================================
-- 5. Customer Contacts Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- PHONE, EMAIL, WHATSAPP
    contact_value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    preferred BOOLEAN DEFAULT FALSE,
    do_not_contact BOOLEAN DEFAULT FALSE,
    dnc_reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(customer_id, contact_type, contact_value)
);

CREATE INDEX IF NOT EXISTS idx_customer_contacts_customer_id ON customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_contact_type ON customer_contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_contact_value ON customer_contacts(contact_value);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_is_primary ON customer_contacts(is_primary);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_do_not_contact ON customer_contacts(do_not_contact);

-- =============================================
-- 6. Customer Employment Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_employment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    employer_name VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50),
    job_title VARCHAR(100),
    department VARCHAR(100),
    employment_status VARCHAR(50),
    employment_start_date DATE,
    employment_end_date DATE,
    monthly_income DECIMAL(15, 2),
    work_address_line1 VARCHAR(255),
    work_address_line2 VARCHAR(255),
    work_city VARCHAR(100),
    work_state VARCHAR(100),
    work_postal_code VARCHAR(20),
    work_country_code CHAR(2),
    work_phone VARCHAR(50),
    work_email VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    is_current_employment BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_employment_customer_id ON customer_employment(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_employment_employer_name ON customer_employment(employer_name);
CREATE INDEX IF NOT EXISTS idx_customer_employment_is_current_employment ON customer_employment(is_current_employment);

-- =============================================
-- 7. Customer References Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reference_type VARCHAR(50) NOT NULL, -- PERSONAL, PROFESSIONAL, FAMILY
    reference_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2),
    occupation VARCHAR(100),
    years_known INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_references_customer_id ON customer_references(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_references_reference_type ON customer_references(reference_type);
CREATE INDEX IF NOT EXISTS idx_customer_references_reference_name ON customer_references(reference_name);

-- =============================================
-- 8. Customer Documents Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- ID_PROOF, ADDRESS_PROOF, INCOME_PROOF, PHOTO, OTHER
    document_name VARCHAR(255) NOT NULL,
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    issuing_authority VARCHAR(255),
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    file_mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_documents_customer_id ON customer_documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_documents_document_type ON customer_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_customer_documents_document_number ON customer_documents(document_number);
CREATE INDEX IF NOT EXISTS idx_customer_documents_is_verified ON customer_documents(is_verified);

-- =============================================
-- 9. Customer Bank Details Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_bank_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_type VARCHAR(50), -- SAVINGS, CURRENT
    ifsc_code VARCHAR(20),
    micr_code VARCHAR(20),
    branch_name VARCHAR(255),
    branch_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_bank_details_customer_id ON customer_bank_details(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_bank_details_account_number ON customer_bank_details(account_number);
CREATE INDEX IF NOT EXISTS idx_customer_bank_details_ifsc_code ON customer_bank_details(ifsc_code);
CREATE INDEX IF NOT EXISTS idx_customer_bank_details_is_primary ON customer_bank_details(is_primary);

-- =============================================
-- 10. Customer Notes Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    note_type VARCHAR(50) DEFAULT 'general', -- GENERAL, WARNING, IMPORTANT, INTERNAL
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON customer_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_notes_note_type ON customer_notes(note_type);
CREATE INDEX IF NOT EXISTS idx_customer_notes_created_by ON customer_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_customer_notes_created_at ON customer_notes(created_at);

-- =============================================
-- 11. Customer Tags Table
-- =============================================
CREATE TABLE IF NOT EXISTS customer_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    tag_color VARCHAR(7),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, tag_name)
);

CREATE INDEX IF NOT EXISTS idx_customer_tags_customer_id ON customer_tags(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_tags_tag_name ON customer_tags(tag_name);

-- =============================================
-- 12. Loans Table
-- =============================================
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id),
    loan_number VARCHAR(50) NOT NULL,
    product_id UUID REFERENCES products(id),
    loan_type_id UUID REFERENCES loan_types(id),
    loan_purpose VARCHAR(255),
    principal_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    interest_type VARCHAR(50) NOT NULL, -- FLAT, REDUCING, BALLOON
    tenure_months INTEGER NOT NULL,
    emi_amount DECIMAL(15, 2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    first_emi_date DATE,
    disbursement_date DATE,
    disbursement_amount DECIMAL(15, 2),
    outstanding_principal DECIMAL(15, 2) NOT NULL,
    outstanding_interest DECIMAL(15, 2) NOT NULL,
    total_outstanding DECIMAL(15, 2) NOT NULL,
    overdue_amount DECIMAL(15, 2) NOT NULL,
    overdue_days INTEGER NOT NULL,
    dpd_days INTEGER NOT NULL,
    last_payment_date DATE,
    next_payment_date DATE,
    payment_frequency VARCHAR(50) NOT NULL, -- MONTHLY, WEEKLY, BI_WEEKLY
    payment_day INTEGER,
    processing_fee DECIMAL(15, 2),
    insurance_amount DECIMAL(15, 2),
    collateral_type VARCHAR(50),
    collateral_value DECIMAL(15, 2),
    collateral_description TEXT,
    guarantor_required BOOLEAN DEFAULT FALSE,
    guarantor_count INTEGER DEFAULT 0,
    loan_status VARCHAR(50) NOT NULL, -- ACTIVE, PAID, DEFAULTED, WRITTEN_OFF, SETTLED, CLOSED
    recovery_status VARCHAR(50), -- NOT_STARTED, IN_PROGRESS, LEGAL, CLOSED
    recovery_bucket_id INTEGER REFERENCES recovery_buckets(id),
    assigned_to UUID REFERENCES users(id),
    relationship_manager_id UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    settlement_amount DECIMAL(15, 2),
    settlement_date DATE,
    notes TEXT,
    terms_conditions TEXT,
    custom_fields JSONB DEFAULT '{}',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, loan_number)
);

CREATE INDEX IF NOT EXISTS idx_loans_tenant_id ON loans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_loans_loan_number ON loans(loan_number);
CREATE INDEX IF NOT EXISTS idx_loans_customer_id ON loans(customer_id);
CREATE INDEX IF NOT EXISTS idx_loans_account_id ON loans(account_id);
CREATE INDEX IF NOT EXISTS idx_loans_product_id ON loans(product_id);
CREATE INDEX IF NOT EXISTS idx_loans_loan_type_id ON loans(loan_type_id);
CREATE INDEX IF NOT EXISTS idx_loans_loan_status ON loans(loan_status);
CREATE INDEX IF NOT EXISTS idx_loans_recovery_status ON loans(recovery_status);
CREATE INDEX IF NOT EXISTS idx_loans_recovery_bucket_id ON loans(recovery_bucket_id);
CREATE INDEX IF NOT EXISTS idx_loans_assigned_to ON loans(assigned_to);
CREATE INDEX IF NOT EXISTS idx_loans_relationship_manager_id ON loans(relationship_manager_id);
CREATE INDEX IF NOT EXISTS idx_loans_branch_id ON loans(branch_id);
CREATE INDEX IF NOT EXISTS idx_loans_start_date ON loans(start_date);
CREATE INDEX IF NOT EXISTS idx_loans_end_date ON loans(end_date);
CREATE INDEX IF NOT EXISTS idx_loans_next_payment_date ON loans(next_payment_date);
CREATE INDEX IF NOT EXISTS idx_loans_overdue_days ON loans(overdue_days);
CREATE INDEX IF NOT EXISTS idx_loans_dpd_days ON loans(dpd_days);
CREATE INDEX IF NOT EXISTS idx_loans_created_at ON loans(created_at);
CREATE INDEX IF NOT EXISTS idx_loans_deleted_at ON loans(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 13. Loan Collateral Table
-- =============================================
CREATE TABLE IF NOT EXISTS loan_collateral (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    collateral_type VARCHAR(50) NOT NULL, -- PROPERTY, VEHICLE, GOLD, SHARES, FD, OTHER
    collateral_name VARCHAR(255) NOT NULL,
    description TEXT,
    value DECIMAL(15, 2) NOT NULL,
    valuation_date DATE,
    ownership_type VARCHAR(50),
    ownership_details TEXT,
    location_address VARCHAR(255),
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    documents JSONB DEFAULT '[]',
    is_insured BOOLEAN DEFAULT FALSE,
    insurance_policy_number VARCHAR(100),
    insurance_expiry_date DATE,
    is_released BOOLEAN DEFAULT FALSE,
    released_date DATE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_loan_collateral_loan_id ON loan_collateral(loan_id);
CREATE INDEX IF NOT EXISTS idx_loan_collateral_collateral_type ON loan_collateral(collateral_type);
CREATE INDEX IF NOT EXISTS idx_loan_collateral_is_released ON loan_collateral(is_released);

-- =============================================
-- 14. Loan Guarantors Table
-- =============================================
CREATE TABLE IF NOT EXISTS loan_guarantors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    guarantor_id UUID REFERENCES customers(id),
    guarantor_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    guarantee_type VARCHAR(50), -- JOINT, SEVERAL, SEVERAL_AND_JOINT
    guarantee_amount DECIMAL(15, 2),
    guarantee_percentage DECIMAL(5, 2),
    is_primary_guarantor BOOLEAN DEFAULT FALSE,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(255),
    income DECIMAL(15, 2),
    occupation VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_loan_guarantors_loan_id ON loan_guarantors(loan_id);
CREATE INDEX IF NOT EXISTS idx_loan_guarantors_guarantor_id ON loan_guarantors(guarantor_id);
CREATE INDEX IF NOT EXISTS idx_loan_guarantors_is_primary_guarantor ON loan_guarantors(is_primary_guarantor);
CREATE INDEX IF NOT EXISTS idx_loan_guarantors_is_active ON loan_guarantors(is_active);

-- =============================================
-- 15. Recovery Cases Table
-- =============================================
CREATE TABLE IF NOT EXISTS recovery_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_number VARCHAR(50) NOT NULL,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    case_type_id UUID REFERENCES case_types(id),
    case_status_id UUID REFERENCES case_statuses(id),
    case_type VARCHAR(50) NOT NULL,
    case_priority VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    case_status VARCHAR(50) NOT NULL,
    workflow_template_id UUID REFERENCES workflow_templates(id),
    workflow_stage VARCHAR(50),
    assigned_business_unit_id UUID REFERENCES business_units(id),
    assigned_team_id UUID REFERENCES teams(id),
    assigned_user_id UUID REFERENCES users(id),
    assigned_date DATE NOT NULL,
    expected_resolution_date DATE,
    actual_resolution_date DATE,
    escalation_level INTEGER DEFAULT 0,
    escalated_to UUID REFERENCES users(id),
    escalated_at TIMESTAMP WITH TIME ZONE,
    escalation_reason TEXT,
    total_outstanding DECIMAL(15, 2) NOT NULL,
    recovered_amount DECIMAL(15, 2) NOT NULL,
    recovery_percentage DECIMAL(5, 2),
    risk_score DECIMAL(5, 2),
    recovery_probability DECIMAL(5, 2),
    sla_breach_date DATE,
    sla_status VARCHAR(20), -- ON_TRACK, AT_RISK, BREACHED
    communication_summary TEXT,
    last_activity TEXT,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    next_follow_up_date DATE,
    next_follow_up_type VARCHAR(50),
    ptp_amount DECIMAL(15, 2),
    ptp_date DATE,
    ptp_status VARCHAR(20), -- NONE, PENDING, KEPT, BROKEN
    communication_count INTEGER DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    payment_count INTEGER DEFAULT 0,
    legal_action_count INTEGER DEFAULT 0,
    ai_recommendations JSONB,
    notes TEXT,
    resolution_summary TEXT,
    custom_fields JSONB DEFAULT '{}',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, case_number)
);

CREATE INDEX IF NOT EXISTS idx_recovery_cases_tenant_id ON recovery_cases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_case_number ON recovery_cases(case_number);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_loan_id ON recovery_cases(loan_id);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_customer_id ON recovery_cases(customer_id);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_case_type_id ON recovery_cases(case_type_id);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_case_status_id ON recovery_cases(case_status_id);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_case_type ON recovery_cases(case_type);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_case_priority ON recovery_cases(case_priority);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_case_status ON recovery_cases(case_status);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_assigned_business_unit_id ON recovery_cases(assigned_business_unit_id);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_assigned_team_id ON recovery_cases(assigned_team_id);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_assigned_user_id ON recovery_cases(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_assigned_date ON recovery_cases(assigned_date);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_expected_resolution_date ON recovery_cases(expected_resolution_date);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_escalation_level ON recovery_cases(escalation_level);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_risk_score ON recovery_cases(risk_score);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_recovery_probability ON recovery_cases(recovery_probability);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_sla_status ON recovery_cases(sla_status);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_next_follow_up_date ON recovery_cases(next_follow_up_date);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_ptp_date ON recovery_cases(ptp_date);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_ptp_status ON recovery_cases(ptp_status);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_created_at ON recovery_cases(created_at);
CREATE INDEX IF NOT EXISTS idx_recovery_cases_deleted_at ON recovery_cases(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 16. Case Assignments Table (History)
-- =============================================
CREATE TABLE IF NOT EXISTS case_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    assigned_from_user_id UUID REFERENCES users(id),
    assigned_to_user_id UUID REFERENCES users(id),
    assigned_from_team_id UUID REFERENCES teams(id),
    assigned_to_team_id UUID REFERENCES teams(id),
    assigned_from_business_unit_id UUID REFERENCES business_units(id),
    assigned_to_business_unit_id UUID REFERENCES business_units(id),
    assignment_type VARCHAR(50), -- MANUAL, AUTOMATIC, ESCALATION, REASSIGNMENT
    assignment_reason TEXT,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_case_assignments_case_id ON case_assignments(case_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_assigned_to_user_id ON case_assignments(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_assigned_to_team_id ON case_assignments(assigned_to_team_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_is_active ON case_assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_case_assignments_assigned_at ON case_assignments(assigned_at);

-- =============================================
-- 17. Case History/Timeline Table
-- =============================================
CREATE TABLE IF NOT EXISTS case_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- CASE_CREATED, ASSIGNED, STATUS_CHANGED, CALL_MADE, SMS_SENT, EMAIL_SENT, WHATSAPP_SENT, PTP_CREATED, PAYMENT_RECEIVED, DOCUMENT_UPLOADED, SETTLEMENT_OFFERED, CLOSED, ESCALATED
    event_category VARCHAR(50) NOT NULL, -- SYSTEM, COMMUNICATION, PAYMENT, ACTIVITY, LEGAL, STATUS, ASSIGNMENT
    event_title VARCHAR(255) NOT NULL,
    event_description TEXT,
    old_value JSONB,
    new_value JSONB,
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_case_history_case_id ON case_history(case_id);
CREATE INDEX IF NOT EXISTS idx_case_history_event_type ON case_history(event_type);
CREATE INDEX IF NOT EXISTS idx_case_history_event_category ON case_history(event_category);
CREATE INDEX IF NOT EXISTS idx_case_history_performed_by ON case_history(performed_by);
CREATE INDEX IF NOT EXISTS idx_case_history_performed_at ON case_history(performed_at);

-- =============================================
-- 18. Case Tags Table
-- =============================================
CREATE TABLE IF NOT EXISTS case_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    tag_color VARCHAR(7),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(case_id, tag_name)
);

CREATE INDEX IF NOT EXISTS idx_case_tags_case_id ON case_tags(case_id);
CREATE INDEX IF NOT EXISTS idx_case_tags_tag_name ON case_tags(tag_name);

-- =============================================
-- 19. Case Notes Table
-- =============================================
CREATE TABLE IF NOT EXISTS case_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    note_type VARCHAR(50) DEFAULT 'general', -- GENERAL, WARNING, IMPORTANT, INTERNAL, LEGAL
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_note_type ON case_notes(note_type);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_by ON case_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_at ON case_notes(created_at);

-- =============================================
-- 20. Audit Log Table
-- =============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- CUSTOMER, LOAN, CASE, ACCOUNT, PRODUCT
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- CREATED, UPDATED, DELETED, ASSIGNED, STATUS_CHANGED, VIEWED
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_by ON audit_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_at ON audit_logs(performed_at);

-- =============================================
-- 21. Tasks Table
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    task_number VARCHAR(50) NOT NULL,
    task_type VARCHAR(50) NOT NULL, -- CALL, VISIT, EMAIL, SMS, FOLLOW_UP, DOCUMENT_COLLECTION, LEGAL
    task_category VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    related_entity_type VARCHAR(50), -- CASE, LOAN, CUSTOMER
    related_entity_id UUID,
    assigned_to UUID NOT NULL REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    due_time TIME,
    priority VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(20) NOT NULL, -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED, OVERDUE
    completed_date TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES users(id),
    estimated_hours DECIMAL(5, 2),
    actual_hours DECIMAL(5, 2),
    tags TEXT[],
    attachments JSONB,
    checklist JSONB,
    parent_task_id UUID REFERENCES tasks(id),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, task_number)
);

CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_task_number ON tasks(task_number);
CREATE INDEX IF NOT EXISTS idx_tasks_task_type ON tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_tasks_related_entity_type ON tasks(related_entity_type);
CREATE INDEX IF NOT EXISTS idx_tasks_related_entity_id ON tasks(related_entity_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_completed_date ON tasks(completed_date);
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 22. Activities Table
-- =============================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    activity_number VARCHAR(50) NOT NULL,
    activity_type_id UUID REFERENCES activity_types(id),
    activity_type VARCHAR(50) NOT NULL, -- CALL, SMS, EMAIL, WHATSAPP, VISIT, NOTE, PAYMENT, DOCUMENT
    related_entity_type VARCHAR(50) NOT NULL, -- CASE, LOAN, CUSTOMER
    related_entity_id UUID NOT NULL,
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    outcome VARCHAR(50), -- SUCCESSFUL, UNSUCCESSFUL, PENDING, CALLBACK
    direction VARCHAR(20), -- INBOUND, OUTBOUND
    subject VARCHAR(255),
    content TEXT,
    attachments JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, activity_number)
);

CREATE INDEX IF NOT EXISTS idx_activities_tenant_id ON activities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_activities_activity_number ON activities(activity_number);
CREATE INDEX IF NOT EXISTS idx_activities_activity_type_id ON activities(activity_type_id);
CREATE INDEX IF NOT EXISTS idx_activities_activity_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_related_entity_type ON activities(related_entity_type);
CREATE INDEX IF NOT EXISTS idx_activities_related_entity_id ON activities(related_entity_id);
CREATE INDEX IF NOT EXISTS idx_activities_performed_by ON activities(performed_by);
CREATE INDEX IF NOT EXISTS idx_activities_performed_at ON activities(performed_at);
CREATE INDEX IF NOT EXISTS idx_activities_outcome ON activities(outcome);

-- =============================================
-- 23. Promise to Pay (PTP) Table
-- =============================================
CREATE TABLE IF NOT EXISTS promise_to_pay (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    ptp_number VARCHAR(50) NOT NULL,
    case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    promise_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- PENDING, KEPT, BROKEN, CANCELLED
    payment_method VARCHAR(50),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, ptp_number)
);

CREATE INDEX IF NOT EXISTS idx_promise_to_pay_tenant_id ON promise_to_pay(tenant_id);
CREATE INDEX IF NOT EXISTS idx_promise_to_pay_ptp_number ON promise_to_pay(ptp_number);
CREATE INDEX IF NOT EXISTS idx_promise_to_pay_case_id ON promise_to_pay(case_id);
CREATE INDEX IF NOT EXISTS idx_promise_to_pay_loan_id ON promise_to_pay(loan_id);
CREATE INDEX IF NOT EXISTS idx_promise_to_pay_customer_id ON promise_to_pay(customer_id);
CREATE INDEX IF NOT EXISTS idx_promise_to_pay_promise_date ON promise_to_pay(promise_date);
CREATE INDEX IF NOT EXISTS idx_promise_to_pay_status ON promise_to_pay(status);

-- =============================================
-- 24. Settlements Table
-- =============================================
CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    settlement_number VARCHAR(50) NOT NULL,
    case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    original_amount DECIMAL(15, 2) NOT NULL,
    settlement_amount DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    settlement_type_id UUID REFERENCES settlement_types(id),
    settlement_type VARCHAR(50) NOT NULL, -- FULL_SETTLEMENT, PARTIAL_SETTLEMENT, ONE_TIME_SETTLEMENT
    status VARCHAR(20) NOT NULL, -- PROPOSED, APPROVED, REJECTED, COMPLETED, CANCELLED
    proposed_date DATE,
    approved_date DATE,
    completed_date DATE,
    payment_terms TEXT,
    approval_level VARCHAR(50),
    approved_by UUID REFERENCES users(id),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(tenant_id, settlement_number)
);

CREATE INDEX IF NOT EXISTS idx_settlements_tenant_id ON settlements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_settlements_settlement_number ON settlements(settlement_number);
CREATE INDEX IF NOT EXISTS idx_settlements_case_id ON settlements(settlements.case_id);
CREATE INDEX IF NOT EXISTS idx_settlements_loan_id ON settlements(loan_id);
CREATE INDEX IF NOT EXISTS idx_settlements_customer_id ON settlements(customer_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
CREATE INDEX IF NOT EXISTS idx_settlements_completed_date ON settlements(completed_date);

-- =============================================
-- End of Sprint 7 Schema
-- =============================================
