const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function updateSuperadminPassword() {
  try {
    const newPassword = 'SuperAdmin123!';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [passwordHash, 'superadmin@recoverflow.com']
    );

    console.log('✅ Superadmin password updated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: superadmin@recoverflow.com`);
    console.log(`New Password: ${newPassword}`);
    console.log(`Affected rows: ${result.rowCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

updateSuperadminPassword();
