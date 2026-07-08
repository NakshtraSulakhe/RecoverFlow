const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function checkUserRoles() {
  const client = await pool.connect();
  try {
    console.log('Checking user_roles table...');
    const result = await client.query('SELECT * FROM user_roles');
    console.log('User roles:', result.rows);
    
    console.log('\nChecking users table...');
    const usersResult = await client.query('SELECT id, first_name, last_name, email FROM users LIMIT 10');
    console.log('Users:', usersResult.rows);
    
    console.log('\nChecking roles table...');
    const rolesResult = await client.query('SELECT * FROM roles');
    console.log('Roles:', rolesResult.rows);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUserRoles();
