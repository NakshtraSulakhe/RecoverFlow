const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function addMissingColumns() {
  const client = await pool.connect();
  try {
    console.log('Adding missing columns to users table...');

    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP,
      ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
    `);

    console.log('✅ All missing columns added successfully!');
  } catch (error) {
    console.error('❌ Error adding missing columns:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addMissingColumns();
