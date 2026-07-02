# Database Troubleshooting Guide

## Quick Connection Test

Run this command to test PostgreSQL connection:

```bash
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d recoverflow_dev -c "SELECT NOW();"
```

Expected output: Current timestamp

## Run Check Queries

Execute the check queries to verify database setup:

```bash
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d recoverflow_dev -f "c:\Users\Nakshtra\OneDrive\Desktop\recoverflow\backend\database\check-queries.sql"
```

## Common Issues and Solutions

### Issue 1: No users found in database

**Symptom:** Login fails with "Invalid credentials"

**Check:**
```sql
SELECT COUNT(*) FROM users WHERE email = 'admin@testorg.com';
```

**Solution:** If count is 0, re-run the seed data:
```bash
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d recoverflow_dev -f "c:\Users\Nakshtra\OneDrive\Desktop\recoverflow\backend\database\seed.sql"
```

### Issue 2: Password hash is incorrect

**Symptom:** Login fails with "Invalid credentials" even with correct password

**Check:**
```sql
SELECT email, password_hash, LENGTH(password_hash) FROM users WHERE email = 'admin@testorg.com';
```

**Expected:** Hash length should be 60 characters (bcrypt)

**Solution:** If hash is wrong, update it:
```sql
UPDATE users 
SET password_hash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'admin@testorg.com';
```

### Issue 3: User is not active

**Symptom:** Login fails with "Invalid credentials"

**Check:**
```sql
SELECT is_active, email_verified FROM users WHERE email = 'admin@testorg.com';
```

**Solution:** Activate the user:
```sql
UPDATE users 
SET is_active = true, email_verified = true
WHERE email = 'admin@testorg.com';
```

### Issue 4: Tenant not found

**Symptom:** Login succeeds but user has no tenant features

**Check:**
```sql
SELECT * FROM tenants WHERE tenant_code = 'TESTORG';
```

**Solution:** If tenant doesn't exist, re-run seed data

### Issue 5: Backend can't connect to database

**Symptom:** Backend shows connection errors

**Check .env.development:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=recoverflow_dev
DB_USER=postgres
DB_PASSWORD=postgres
```

**Test connection from backend:**
```bash
cd backend
npm run db:test
```

## Manual User Creation

If seed data fails, create user manually:

```sql
-- First, get or create tenant
INSERT INTO tenants (tenant_name, tenant_code, contact_email, subscription_tier, subscription_status, features) 
VALUES (
    'Test Organization',
    'TESTORG',
    'admin@testorg.com',
    'enterprise',
    'active',
    '{"dashboard": true, "customers": true, "loans": true, "recovery": true, "ai_assistant": true, "payments": true, "reports": true, "workflows": true, "communication": true, "legal": true, "settings": true}'::jsonb
)
ON CONFLICT (tenant_code) DO NOTHING;

-- Get tenant ID
DO $$
DECLARE
    v_tenant_id UUID;
BEGIN
    SELECT id INTO v_tenant_id FROM tenants WHERE tenant_code = 'TESTORG';
    
    -- Create user
    INSERT INTO users (tenant_id, first_name, last_name, email, password_hash, user_type, is_active, email_verified) 
    VALUES (
        v_tenant_id,
        'Admin',
        'User',
        'admin@testorg.com',
        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'tenant_admin',
        true,
        true
    )
    ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        is_active = EXCLUDED.is_active,
        email_verified = EXCLUDED.email_verified;
    
    RAISE NOTICE 'User created/updated with tenant ID: %', v_tenant_id;
END $$;
```

## Backend Logs Check

Check backend logs for specific errors:

```bash
# Backend should show logs like:
# 2026-07-02 [info]: User logged in successfully
# 2026-07-02 [error]: Invalid credentials
```

## Frontend Network Tab Check

1. Open browser DevTools (F12)
2. Go to Network tab
3. Attempt login
4. Check the `/api/v1/auth/login` request:
   - Status code (should be 200)
   - Response body
   - Request payload

## API Endpoint Test

Test the login endpoint directly:

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@testorg.com","password":"password123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "tenant": {...},
    "access_token": "...",
    "refresh_token": "...",
    "expires_in": 900
  }
}
```
