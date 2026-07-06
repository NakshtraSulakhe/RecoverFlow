const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function testTenantCreation() {
  const client = await pool.connect();
  try {
    console.log('Testing tenant creation...');
    
    await client.query('BEGIN');
    
    const tenantId = uuidv4();
    const tenant_code = 'TESTTENANT2';
    const tenant_name = 'Test Tenant Company';
    const legal_name = 'Test Tenant Company LLC';
    const business_type = 'LLC';
    const contact_email = 'admin@testtenant2.com';
    const contact_person = 'John Doe';
    const phone = '+1234567890';
    const address = '123 Test St';
    const city = 'Test City';
    const state = 'TS';
    const country = 'US';
    const postal_code = '12345';
    const subdomain = 'testtenant2';
    const industry = 'Finance';
    const timezone = 'UTC';
    const currency = 'USD';
    const gst_number = null;
    const pan_number = null;
    const logo_url = null;
    const brand_color = null;
    const planCode = 'starter';
    
    console.log('Creating tenant...');
    const tenantQuery = `
      INSERT INTO tenants (
        id, tenant_code, tenant_name, legal_name, business_type, contact_email,
        contact_person, phone, address, city, state, country, postal_code,
        subdomain, industry, timezone, currency, gst_number, pan_number,
        logo_url, brand_color, subscription_tier, subscription_status, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING *
    `;

    const tenantValues = [
      tenantId,
      tenant_code,
      tenant_name,
      legal_name,
      business_type,
      contact_email,
      contact_person,
      phone,
      address,
      city,
      state,
      country,
      postal_code,
      subdomain,
      industry,
      timezone,
      currency,
      gst_number,
      pan_number,
      logo_url,
      brand_color,
      planCode,
      'active',
      true,
    ];

    const tenantResult = await client.query(tenantQuery, tenantValues);
    console.log('✅ Tenant created:', tenantResult.rows[0].tenant_name);
    
    await client.query('ROLLBACK');
    console.log('Test completed successfully (rolled back)');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

testTenantCreation();
