const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function createSuperadmin() {
  const email = 'superadmin@recoverflow.com';
  const password = 'SuperAdmin123!';
  const firstName = 'Super';
  const lastName = 'Admin';

  try {
    // Check if superadmin already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('Superadmin user already exists with email:', email);
      await pool.end();
      return;
    }

    // Generate bcrypt hash
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert superadmin (platform_owner with NULL tenant_id)
    const result = await pool.query(
      `INSERT INTO users (tenant_id, first_name, last_name, email, password_hash, user_type, is_active, email_verified)
       VALUES (NULL, $1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, user_type`,
      [firstName, lastName, email, passwordHash, 'platform_owner', true, true]
    );

    console.log('✅ Superadmin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Role: platform_owner`);
    console.log(`User ID: ${result.rows[0].id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please save these credentials securely!');
    console.log('⚠️  Change the password after first login in production.');

  } catch (error) {
    console.error('❌ Error creating superadmin:', error.message);
  } finally {
    await pool.end();
  }
}

createSuperadmin();
