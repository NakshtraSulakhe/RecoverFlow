-- =============================================
-- Sprint 7: Customer, Account, Loan & Recovery Case Engine
-- Seed Data
-- =============================================

\c recoverflow_dev;

-- =============================================
-- 1. Seed Products
-- =============================================
INSERT INTO products (id, tenant_id, product_code, product_name, description, product_category, product_type, min_amount, max_amount, min_tenure_months, max_tenure_months, interest_rate_min, interest_rate_max, processing_fee_percent, prepayment_allowed, prepayment_penalty_percent, collateral_required, guarantor_required, insurance_required, is_active, is_system_product, created_at, updated_at) VALUES
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PROD-001', 'Personal Loan', 'Unsecured personal loan for various purposes', 'LOAN', 'PERSONAL_LOAN', 10000.00, 500000.00, 12, 60, 10.50, 18.00, 2.00, true, 2.00, false, false, false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PROD-002', 'Vehicle Loan', 'Loan for purchasing new or used vehicles', 'LOAN', 'VEHICLE_LOAN', 100000.00, 2000000.00, 12, 84, 8.50, 14.00, 1.50, true, 3.00, true, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PROD-003', 'Gold Loan', 'Loan against gold ornaments', 'LOAN', 'GOLD_LOAN', 5000.00, 1000000.00, 3, 24, 9.00, 12.00, 0.50, true, 0.00, true, false, false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PROD-004', 'Home Loan', 'Loan for purchasing or constructing home', 'LOAN', 'MORTGAGE', 500000.00, 10000000.00, 60, 360, 7.50, 11.00, 1.00, true, 2.00, true, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PROD-005', 'Credit Card', 'Revolving credit facility', 'CREDIT_CARD', 'CREDIT_CARD', 10000.00, 500000.00, 0, 0, 18.00, 36.00, 0.00, true, 0.00, false, false, false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PROD-006', 'Education Loan', 'Loan for higher education', 'LOAN', 'EDUCATION_LOAN', 50000.00, 2000000.00, 12, 120, 9.00, 13.00, 1.00, true, 0.00, true, true, false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PROD-007', 'Business Loan', 'Loan for business expansion and working capital', 'LOAN', 'BUSINESS_LOAN', 100000.00, 5000000.00, 12, 60, 11.00, 16.00, 2.50, true, 3.00, true, true, false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- 2. Seed Sample Customers
-- =============================================
INSERT INTO customers (id, tenant_id, customer_code, customer_type, title, first_name, last_name, display_name, date_of_birth, gender, nationality, id_type, id_number, pan_number, primary_phone, primary_email, preferred_contact_method, employment_status, occupation, employer_name, annual_income, credit_score, risk_score, risk_level, customer_segment, status, created_at, updated_at) VALUES
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CUST-001', 'individual', 'Mr.', 'Rahul', 'Sharma', 'Rahul Sharma', '1985-05-15', 'male', 'IN', 'AADHAAR', '1234-5678-9012', 'ABCDE1234F', '+919876543210', 'rahul.sharma@email.com', 'PHONE', 'employed', 'Software Engineer', 'Tech Corp India Pvt Ltd', 1200000.00, 750, 25.00, 'LOW', 'PRIME', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_viv(), (SELECT id FROM tenants LIMIT 1), 'CUST-002', 'individual', 'Ms.', 'Priya', 'Patel', 'Priya Patel', '1990-08-22', 'female', 'IN', 'AADHAAR', '2345-6789-0123', 'BCDEF5678G', '+919876543211', 'priya.patel@email.com', 'EMAIL', 'self-employed', 'Doctor', 'Self Practice', 1800000.00, 780, 20.00, 'LOW', 'PRIME', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CUST-003', 'individual', 'Mr.', 'Amit', 'Kumar', 'Amit Kumar', '1982-12-10', 'male', 'IN', 'AADHAAR', '3456-7890-1234', 'CDEF6789H', '+919876543212', 'amit.kumar@email.com', 'PHONE', 'employed', 'Manager', 'Global Services Ltd', 900000.00, 680, 35.00, 'MEDIUM', 'STANDARD', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CUST-004', 'individual', 'Mr.', 'Vikram', 'Singh', 'Vikram Singh', '1978-03-25', 'male', 'IN', 'AADHAAR', '4567-8901-2345', 'DEFG7890I', '+919876543213', 'vikram.singh@email.com', 'PHONE', 'employed', 'Sales Executive', 'Retail Solutions', 600000.00, 620, 45.00, 'MEDIUM', 'STANDARD', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CUST-005', 'individual', 'Ms.', 'Sneha', 'Reddy', 'Sneha Reddy', '1995-11-08', 'female', 'IN', 'AADHAAR', '5678-9012-3456', 'EFGH8901J', '+919876543214', 'sneha.reddy@email.com', 'EMAIL', 'employed', 'Teacher', 'Government School', 480000.00, 700, 30.00, 'MEDIUM', 'STANDARD', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- 3. Seed Customer Addresses
-- =============================================
INSERT INTO customer_addresses (customer_id, address_type, address_line1, address_line2, city, state, postal_code, country_code, is_primary, from_date) VALUES
((SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 'RESIDENTIAL', '123, Sector 15', 'Near Metro Station', 'Pune', 'Maharashtra', '411045', 'IN', true, CURRENT_DATE),
((SELECT id FROM customers WHERE customer_code = 'CUST-002' LIMIT 1), 'RESIDENTIAL', '456, Park Street', 'Apartment 201', 'Mumbai', 'Maharashtra', '400001', 'IN', true, CURRENT_DATE),
((SELECT id FROM customers WHERE customer_code = 'CUST-003' LIMIT 1), 'RESIDENTIAL', '789, Main Road', 'HNO 15', 'Bangalore', 'Karnataka', '560001', 'IN', true, CURRENT_DATE),
((SELECT id FROM customers WHERE customer_code = 'CUST-004' LIMIT 1), 'RESIDENTIAL', '321, Civil Lines', 'Block A', 'Delhi', 'Delhi', '110001', 'IN', true, CURRENT_DATE),
((SELECT id FROM customers WHERE customer_code = 'CUST-005' LIMIT 1), 'RESIDENTIAL', '654, Lake View', 'Flat 302', 'Hyderabad', 'Telangana', '500001', 'IN', true, CURRENT_DATE);

-- =============================================
-- 4. Seed Customer Contacts
-- =============================================
INSERT INTO customer_contacts (customer_id, contact_type, contact_value, is_primary, is_verified) VALUES
((SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 'PHONE', '+919876543210', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 'EMAIL', 'rahul.sharma@email.com', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 'WHATSAPP', '+919876543210', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-002' LIMIT 1), 'PHONE', '+919876543211', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-002' LIMIT 1), 'EMAIL', 'priya.patel@email.com', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-003' LIMIT 1), 'PHONE', '+919876543212', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-003' LIMIT 1), 'EMAIL', 'amit.kumar@email.com', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-004' LIMIT 1), 'PHONE', '+919876543213', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-004' LIMIT 1), 'EMAIL', 'vikram.singh@email.com', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-005' LIMIT 1), 'PHONE', '+919876543214', true, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-005' LIMIT 1), 'EMAIL', 'sneha.reddy@email.com', true, true);

-- =============================================
-- 5. Seed Customer Employment
-- =============================================
INSERT INTO customer_employment (customer_id, employer_name, employment_type, job_title, employment_status, employment_start_date, monthly_income, is_current_employment) VALUES
((SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 'Tech Corp India Pvt Ltd', 'FULL_TIME', 'Software Engineer', 'ACTIVE', '2020-01-15', 100000.00, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-002' LIMIT 1), 'Self Practice', 'SELF_EMPLOYED', 'Doctor', 'ACTIVE', '2018-06-01', 150000.00, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-003' LIMIT 1), 'Global Services Ltd', 'FULL_TIME', 'Manager', 'ACTIVE', '2019-03-10', 75000.00, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-004' LIMIT 1), 'Retail Solutions', 'FULL_TIME', 'Sales Executive', 'ACTIVE', '2021-07-20', 50000.00, true),
((SELECT id FROM customers WHERE customer_code = 'CUST-005' LIMIT 1), 'Government School', 'FULL_TIME', 'Teacher', 'ACTIVE', '2020-02-01', 40000.00, true);

-- =============================================
-- 6. Seed Accounts
-- =============================================
INSERT INTO accounts (id, tenant_id, customer_id, account_number, account_type, account_name, product_id, status, opened_date, current_balance, currency, is_primary_account) VALUES
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 'ACC-001', 'SAVINGS', 'Savings Account - Rahul Sharma', (SELECT id FROM products WHERE product_code = 'PROD-001' LIMIT 1), 'active', '2020-01-15', 50000.00, 'INR', true),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-002' LIMIT 1), 'ACC-002', 'SAVINGS', 'Savings Account - Priya Patel', (SELECT id FROM products WHERE product_code = 'PROD-001' LIMIT 1), 'active', '2018-06-01', 150000.00, 'INR', true),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-003' LIMIT 1), 'ACC-003', 'SAVINGS', 'Savings Account - Amit Kumar', (SELECT id FROM products WHERE product_code = 'PROD-001' LIMIT 1), 'active', '2019-03-10', 75000.00, 'INR', true),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-004' LIMIT 1), 'ACC-004', 'SAVINGS', 'Savings Account - Vikram Singh', (SELECT id FROM products WHERE product_code = 'PROD-001' LIMIT 1), 'active', '2021-07-20', 30000.00, 'INR', true),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-005' LIMIT 1), 'ACC-005', 'SAVINGS', 'Savings Account - Sneha Reddy', (SELECT id FROM products WHERE product_code = 'PROD-001' LIMIT 1), 'active', '2020-02-01', 40000.00, 'INR', true);

-- =============================================
-- 7. Seed Loans
-- =============================================
INSERT INTO loans (id, tenant_id, customer_id, account_id, loan_number, product_id, loan_purpose, principal_amount, interest_rate, interest_type, tenure_months, emi_amount, start_date, end_date, first_emi_date, disbursement_date, outstanding_principal, outstanding_interest, total_outstanding, overdue_amount, overdue_days, dpd_days, payment_frequency, loan_status, recovery_status, created_at, updated_at) VALUES
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), (SELECT id FROM accounts WHERE account_number = 'ACC-001' LIMIT 1), 'LOAN-001', (SELECT id FROM products WHERE product_code = 'PROD-001' LIMIT 1), 'Home Renovation', 500000.00, 12.50, 'REDUCING', 36, 16750.00, '2023-01-15', '2026-01-15', '2023-02-15', '2023-01-15', 350000.00, 25000.00, 375000.00, 50000.00, 30, 30, 'MONTHLY', 'active', 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-002' LIMIT 1), (SELECT id FROM accounts WHERE account_number = 'ACC-002' LIMIT 1), 'LOAN-002', (SELECT id FROM products WHERE product_code = 'PROD-002' LIMIT 1), 'Car Purchase', 800000.00, 10.00, 'REDUCING', 60, 17000.00, '2022-06-01', '2027-06-01', '2022-07-01', '2022-06-01', 600000.00, 40000.00, 640000.00, 80000.00, 60, 60, 'MONTHLY', 'active', 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-003' LIMIT 1), (SELECT id FROM accounts WHERE account_number = 'ACC-003' LIMIT 1), 'LOAN-003', (SELECT id FROM products WHERE product_code = 'PROD-001' LIMIT 1), 'Medical Emergency', 200000.00, 14.00, 'REDUCING', 24, 9500.00, '2023-03-10', '2025-03-10', '2023-04-10', '2023-03-10', 150000.00, 15000.00, 165000.00, 20000.00, 45, 45, 'MONTHLY', 'active', 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-004' LIMIT 1), (SELECT id FROM accounts WHERE account_number = 'ACC-004' LIMIT 1), 'LOAN-004', (SELECT id FROM products WHERE product_code = 'PROD-001' LIMIT 1), 'Business Expansion', 300000.00, 13.50, 'REDUCING', 36, 10200.00, '2022-07-20', '2025-07-20', '2022-08-20', '2022-07-20', 200000.00, 30000.00, 230000.00, 45000.00, 90, 90, 'MONTHLY', 'active', 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-005' LIMIT 1), (SELECT id FROM accounts WHERE account_number = 'ACC-005' LIMIT 1), 'LOAN-005', (SELECT id FROM products WHERE product_code = 'PROD-006' LIMIT 1), 'Higher Education', 500000.00, 11.00, 'REDUCING', 84, 8000.00, '2021-02-01', '2028-02-01', '2021-03-01', '2021-02-01', 400000.00, 35000.00, 435000.00, 35000.00, 15, 15, 'MONTHLY', 'active', 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- 8. Seed Recovery Cases
-- =============================================
INSERT INTO recovery_cases (id, tenant_id, case_number, loan_id, customer_id, case_type, case_priority, case_status, assigned_user_id, assigned_date, total_outstanding, recovered_amount, recovery_percentage, risk_score, recovery_probability, sla_status, ptp_status, communication_count, created_at, updated_at) VALUES
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CASE-001', (SELECT id FROM loans WHERE loan_number = 'LOAN-001' LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 'COLLECTION', 'MEDIUM', 'IN_PROGRESS', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_DATE, 375000.00, 0.00, 0.00, 35.00, 75.00, 'ON_TRACK', 'NONE', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CASE-002', (SELECT id FROM loans WHERE loan_number = 'LOAN-002' LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-002' LIMIT 1), 'COLLECTION', 'HIGH', 'IN_PROGRESS', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_DATE, 640000.00, 0.00, 0.00, 45.00, 65.00, 'AT_RISK', 'PENDING', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CASE-003', (SELECT id FROM loans WHERE loan_number = 'LOAN-003' LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-003' LIMIT 1), 'COLLECTION', 'MEDIUM', 'IN_PROGRESS', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_DATE, 165000.00, 0.00, 0.00, 40.00, 70.00, 'ON_TRACK', 'NONE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CASE-004', (SELECT id FROM loans WHERE loan_number = 'LOAN-004' LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-004' LIMIT 1), 'COLLECTION', 'CRITICAL', 'IN_PROGRESS', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_DATE, 230000.00, 0.00, 0.00, 55.00, 45.00, 'BREACHED', 'BROKEN', 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'CASE-005', (SELECT id FROM loans WHERE loan_number = 'LOAN-005' LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-005' LIMIT 1), 'COLLECTION', 'LOW', 'IN_PROGRESS', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_DATE, 435000.00, 0.00, 0.00, 30.00, 80.00, 'ON_TRACK', 'KEPT', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- 9. Seed Case History (Timeline)
-- =============================================
INSERT INTO case_history (case_id, event_type, event_category, event_title, event_description, performed_by, performed_at) VALUES
((SELECT id FROM recovery_cases WHERE case_number = 'CASE-001' LIMIT 1), 'CASE_CREATED', 'SYSTEM', 'Case Created', 'Recovery case created for loan LOAN-001', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM recovery_cases WHERE case_number = 'CASE-001' LIMIT 1), 'ASSIGNED', 'ASSIGNMENT', 'Case Assigned', 'Case assigned to recovery agent', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM recovery_cases WHERE case_number = 'CASE-001' LIMIT 1), 'CALL_MADE', 'COMMUNICATION', 'Call Attempted', 'First call attempt made to customer', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM recovery_cases WHERE case_number = 'CASE-002' LIMIT 1), 'CASE_CREATED', 'SYSTEM', 'Case Created', 'Recovery case created for loan LOAN-002', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM recovery_cases WHERE case_number = 'CASE-002' LIMIT 1), 'ASSIGNED', 'ASSIGNMENT', 'Case Assigned', 'Case assigned to recovery agent', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM recovery_cases WHERE case_number = 'CASE-002' LIMIT 1), 'SMS_SENT', 'COMMUNICATION', 'SMS Sent', 'Payment reminder SMS sent', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM recovery_cases WHERE case_number = 'CASE-004' LIMIT 1), 'CASE_CREATED', 'SYSTEM', 'Case Created', 'Recovery case created for loan LOAN-004', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM recovery_cases WHERE case_number = 'CASE-004' LIMIT 1), 'ESCALATED', 'STATUS', 'Case Escalated', 'Case escalated due to high DPD', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP);

-- =============================================
-- 10. Seed Tasks
-- =============================================
INSERT INTO tasks (id, tenant_id, task_number, task_type, title, description, related_entity_type, related_entity_id, assigned_to, assigned_by, due_date, priority, status, created_at, updated_at) VALUES
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'TASK-001', 'CALL', 'Follow-up Call - Rahul Sharma', 'Make follow-up call to customer regarding payment', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-001' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_DATE + INTERVAL '2 days', 'MEDIUM', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'TASK-002', 'VISIT', 'Field Visit - Vikram Singh', 'Conduct field visit to customer address', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-004' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_DATE + INTERVAL '1 day', 'HIGH', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'TASK-003', 'EMAIL', 'Send Payment Reminder - Priya Patel', 'Send payment reminder email to customer', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-002' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_DATE, 'MEDIUM', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'TASK-004', 'DOCUMENT_COLLECTION', 'Collect Income Proof - Amit Kumar', 'Collect updated income proof documents', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-003' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_DATE + INTERVAL '3 days', 'LOW', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'TASK-005', 'FOLLOW_UP', 'PTP Follow-up - Sneha Reddy', 'Follow up on promise to pay', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-005' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_DATE + INTERVAL '1 day', 'MEDIUM', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- 11. Seed Activities
-- =============================================
INSERT INTO activities (id, tenant_id, activity_number, activity_type, related_entity_type, related_entity_id, performed_by, performed_at, outcome, direction, subject, content) VALUES
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'ACT-001', 'CALL', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-001' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP, 'SUCCESSFUL', 'OUTBOUND', 'Payment Reminder Call', 'Called customer to remind about payment. Customer promised to pay by 15th.'),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'ACT-002', 'SMS', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-002' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP, 'SUCCESSFUL', 'OUTBOUND', 'Payment Reminder SMS', 'Sent payment reminder SMS to customer.'),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'ACT-003', 'EMAIL', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-003' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP, 'SUCCESSFUL', 'OUTBOUND', 'Payment Reminder Email', 'Sent detailed payment reminder email with payment link.'),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'ACT-004', 'VISIT', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-004' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP, 'UNSUCCESSFUL', 'OUTBOUND', 'Field Visit', 'Visited customer address but customer was not available. Left notice.'),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'ACT-005', 'WHATSAPP', 'CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-005' LIMIT 1), (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP, 'SUCCESSFUL', 'OUTBOUND', 'WhatsApp Message', 'Sent payment reminder via WhatsApp. Customer responded positively.');

-- =============================================
-- 12. Seed Promise to Pay
-- =============================================
INSERT INTO promise_to_pay (id, tenant_id, ptp_number, case_id, loan_id, customer_id, amount, promise_date, status, created_by, created_at) VALUES
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PTP-001', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-001' LIMIT 1), (SELECT id FROM loans WHERE loan_number = 'LOAN-001' LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 50000.00, CURRENT_DATE + INTERVAL '7 days', 'PENDING', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PTP-002', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-002' LIMIT 1), (SELECT id FROM loans WHERE loan_number = 'LOAN-002' LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-002' LIMIT 1), 80000.00, CURRENT_DATE + INTERVAL '5 days', 'PENDING', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
(uuid_generate_v4(), (SELECT id FROM tenants LIMIT 1), 'PTP-003', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-005' LIMIT 1), (SELECT id FROM loans WHERE loan_number = 'LOAN-005' LIMIT 1), (SELECT id FROM customers WHERE customer_code = 'CUST-005' LIMIT 1), 35000.00, CURRENT_DATE - INTERVAL '3 days', 'KEPT', (SELECT id FROM users WHERE email = 'agent@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP - INTERVAL '5 days');

-- =============================================
-- 13. Seed Audit Logs
-- =============================================
INSERT INTO audit_logs (tenant_id, entity_type, entity_id, action, performed_by, performed_at) VALUES
((SELECT id FROM tenants LIMIT 1), 'CUSTOMER', (SELECT id FROM customers WHERE customer_code = 'CUST-001' LIMIT 1), 'CREATED', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM tenants LIMIT 1), 'LOAN', (SELECT id FROM loans WHERE loan_number = 'LOAN-001' LIMIT 1), 'CREATED', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM tenants LIMIT 1), 'RECOVERY_CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-001' LIMIT 1), 'CREATED', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP),
((SELECT id FROM tenants LIMIT 1), 'RECOVERY_CASE', (SELECT id FROM recovery_cases WHERE case_number = 'CASE-001' LIMIT 1), 'ASSIGNED', (SELECT id FROM users WHERE email = 'admin@recoverflow.com' LIMIT 1), CURRENT_TIMESTAMP);

-- =============================================
-- End of Sprint 7 Seed Data
-- =============================================
