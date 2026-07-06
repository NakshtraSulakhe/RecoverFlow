const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function assignSuperadminRole() {
  const client = await pool.connect();
  try {
    console.log('Connecting to database...');
    
    await client.query('BEGIN');
    
    // Get the superadmin user
    const userResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['superadmin@recoverflow.com']
    );
    
    if (userResult.rows.length === 0) {
      console.log('❌ Superadmin user not found');
      return;
    }
    
    const userId = userResult.rows[0].id;
    console.log('Found superadmin user:', userId);
    
    // Get the platform_owner role
    const roleResult = await client.query(
      "SELECT id FROM roles WHERE code = 'platform_owner'"
    );
    
    if (roleResult.rows.length === 0) {
      console.log('❌ Platform owner role not found');
      return;
    }
    
    const roleId = roleResult.rows[0].id;
    console.log('Found platform_owner role:', roleId);
    
    // Assign the role to the user
    await client.query(
      `INSERT INTO user_roles (user_id, role_id, assigned_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, role_id) DO NOTHING`,
      [userId, roleId]
    );
    
    await client.query('COMMIT');
    console.log('✅ Platform owner role assigned to superadmin successfully!');
    
    // Verify the assignment
    const verifyResult = await client.query(`
      SELECT u.email, r.code, r.name 
      FROM users u 
      JOIN user_roles ur ON u.id = ur.user_id 
      JOIN roles r ON ur.role_id = r.id 
      WHERE u.email = $1
    `, ['superadmin@recoverflow.com']);
    
    console.log('\nSuperadmin roles:');
    verifyResult.rows.forEach(row => {
      console.log(`- ${row.name} (${row.code})`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error assigning role:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

assignSuperadminRole();
