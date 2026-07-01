-- RecoverFlow Seed Data
-- Run this after schema.sql to populate test data

\c recoverflow_dev;

-- Insert test tenant
INSERT INTO tenants (tenant_name, tenant_code, contact_email, subscription_tier, subscription_status, features) 
VALUES (
    'Test Organization',
    'TESTORG',
    'admin@testorg.com',
    'enterprise',
    'active',
    '{"dashboard": true, "customers": true, "loans": true, "recovery": true, "ai_assistant": true, "payments": true, "reports": true, "workflows": true, "communication": true, "legal": true, "settings": true}'::jsonb
) ON CONFLICT (tenant_code) DO NOTHING;

-- Get the tenant ID
DO $$
DECLARE
    v_tenant_id UUID;
BEGIN
    SELECT id INTO v_tenant_id FROM tenants WHERE tenant_code = 'TESTORG';
    
    -- Insert test users (passwords are hashed with bcrypt)
    -- Default password for all test users: "password123"
    -- Hash generated with bcrypt.hash("password123", 10)
    INSERT INTO users (tenant_id, first_name, last_name, email, password_hash, user_type, is_active, email_verified) VALUES
    (v_tenant_id, 'Admin', 'User', 'admin@testorg.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'tenant_admin', true, true),
    (v_tenant_id, 'John', 'Manager', 'manager@testorg.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'recovery_manager', true, true),
    (v_tenant_id, 'Jane', 'Agent', 'agent@testorg.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'recovery_agent', true, true)
    ON CONFLICT (email) DO NOTHING;
END $$;

-- Note: The password hashes above are placeholders. In production, use actual bcrypt hashes.
-- For testing, you can generate a real hash using: bcrypt.hash("password123", 10)
