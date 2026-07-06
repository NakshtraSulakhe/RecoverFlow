const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function fixTenantAdminPassword() {
  const client = await pool.connect();
  try {
    console.log('Updating tenant admin users to not require password change...');
    
    await client.query(`
      UPDATE users
      SET must_change_password = false
      WHERE user_type = 'tenant_admin' AND must_change_password = true
    `);
    
    const result = await client.query(`
      SELECT email, first_name, last_name, must_change_password
      FROM users
      WHERE user_type = 'tenant_admin'
    `);
    
    console.log('✅ Updated successfully!');
    console.log('\nTenant admin users:');
    result.rows.forEach(user => {
      console.log(`- ${user.email} (${user.first_name} ${user.last_name}) - must_change_password: ${user.must_change_password}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixTenantAdminPassword();
