const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function runSeed() {
  const client = await pool.connect();
  try {
    console.log('Connecting to database...');
    
    await client.query('BEGIN');
    
    // Insert test tenant
    const tenantId = uuidv4();
    console.log('Inserting test tenant...');
    await client.query(
      `INSERT INTO tenants (id, tenant_name, tenant_code, contact_email, subscription_tier, subscription_status, features) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (tenant_code) DO UPDATE SET 
         tenant_name = EXCLUDED.tenant_name,
         contact_email = EXCLUDED.contact_email`,
      [
        tenantId,
        'Test Organization',
        'TESTORG',
        'admin@testorg.com',
        'enterprise',
        'active',
        JSON.stringify({
          dashboard: true, customers: true, loans: true, recovery: true,
          ai_assistant: true, payments: true, reports: true, workflows: true,
          communication: true, legal: true, settings: true
        })
      ]
    );
    
    // Get tenant ID
    const tenantResult = await client.query('SELECT id FROM tenants WHERE tenant_code = $1', ['TESTORG']);
    const finalTenantId = tenantResult.rows[0].id;
    console.log('Tenant ID:', finalTenantId);
    
    // Insert test users with real bcrypt hash for "password123"
    const passwordHash = '$2b$10$NtzmUQm.isOlTv0gxdNZiu6lYXyU9S.JdsyjSchyhXZVP9VWoC5OG';
    
    console.log('Inserting test users...');
    await client.query(
      `INSERT INTO users (tenant_id, first_name, last_name, email, password_hash, user_type, is_active, email_verified) VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8),
       ($1, $9, $10, $11, $5, $12, $7, $8),
       ($1, $13, $14, $15, $5, $16, $7, $8)
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash`,
      [
        finalTenantId,
        'Admin', 'User', 'admin@testorg.com', passwordHash, 'tenant_admin', true, true,
        'John', 'Manager', 'manager@testorg.com', 'recovery_manager',
        'Jane', 'Agent', 'agent@testorg.com', 'recovery_agent'
      ]
    );
    
    await client.query('COMMIT');
    console.log('Seed data inserted successfully!');
    
    // Verify users were created
    const result = await client.query('SELECT email, first_name, last_name, user_type FROM users');
    console.log('\nUsers in database:');
    result.rows.forEach(user => {
      console.log(`- ${user.email} (${user.first_name} ${user.last_name}) - ${user.user_type}`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error running seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
