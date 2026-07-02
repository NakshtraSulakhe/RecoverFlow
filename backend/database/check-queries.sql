-- Database Connection and Data Verification Queries
-- Run these queries to verify the database setup and troubleshoot login issues

-- 1. Check database connection and version
SELECT version();

-- 2. List all databases
\l

-- 3. Connect to recoverflow_dev database
\c recoverflow_dev

-- 4. List all tables in the database
\dt

-- 5. Check if tenants table exists and has data
SELECT COUNT(*) as tenant_count FROM tenants;

-- 6. View all tenants
SELECT * FROM tenants;

-- 7. Check if users table exists and has data
SELECT COUNT(*) as user_count FROM users;

-- 8. View all users with their tenant information
SELECT 
    u.id,
    u.tenant_id,
    u.email,
    u.first_name,
    u.last_name,
    u.user_type,
    u.is_active,
    u.email_verified,
    t.tenant_name,
    t.tenant_code
FROM users u
LEFT JOIN tenants t ON u.tenant_id = t.id;

-- 9. Check specific test user
SELECT * FROM users WHERE email = 'admin@testorg.com';

-- 10. Verify password hash exists for test user
SELECT 
    email,
    password_hash,
    LENGTH(password_hash) as hash_length,
    is_active,
    email_verified
FROM users 
WHERE email = 'admin@testorg.com';

-- 11. Test password verification (replace 'password123' with actual password)
-- This will return true if the password matches the hash
SELECT 
    email,
    password_hash,
    -- This is a placeholder - actual bcrypt verification happens in application
    'password123' as test_password
FROM users 
WHERE email = 'admin@testorg.com';

-- 12. Check tenant features for the test tenant
SELECT 
    t.id,
    t.tenant_name,
    t.tenant_code,
    t.subscription_tier,
    t.features
FROM tenants t
WHERE t.tenant_code = 'TESTORG';

-- 13. Verify database indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE tablename IN ('users', 'tenants', 'customers', 'loans', 'recovery_cases')
ORDER BY tablename, indexname;

-- 14. Check database size
SELECT 
    pg_size_pretty(pg_database_size('recoverflow_dev')) as database_size;

-- 15. Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 16. Test a simple query to ensure connection works
SELECT NOW() as current_time;
