const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function checkTenantsColumns() {
  const client = await pool.connect();
  try {
    console.log('Checking tenants table columns...');
    
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tenants' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nCurrent columns in tenants table:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });
    
    const requiredColumns = [
      'id', 'tenant_code', 'tenant_name', 'legal_name', 'business_type', 'contact_email',
      'contact_person', 'phone', 'address', 'city', 'state', 'country', 'postal_code',
      'subdomain', 'industry', 'timezone', 'currency', 'gst_number', 'pan_number',
      'logo_url', 'brand_color', 'subscription_tier', 'subscription_status', 'is_active'
    ];
    
    const existingColumns = result.rows.map(r => r.column_name);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('\n❌ Missing columns:', missingColumns);
    } else {
      console.log('\n✅ All required columns exist');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTenantsColumns();
