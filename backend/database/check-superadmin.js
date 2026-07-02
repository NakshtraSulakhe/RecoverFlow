const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function checkSuperadmin() {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, user_type, is_active, password_hash FROM users WHERE user_type = $1',
      ['platform_owner']
    );
    
    if (result.rows.length === 0) {
      console.log('No superadmin user found');
    } else {
      console.log('Superadmin user:');
      result.rows.forEach(user => {
        console.log(`- Email: ${user.email}`);
        console.log(`  Name: ${user.first_name} ${user.last_name}`);
        console.log(`  Type: ${user.user_type}`);
        console.log(`  Active: ${user.is_active}`);
        console.log(`  Password Hash: ${user.password_hash}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkSuperadmin();
