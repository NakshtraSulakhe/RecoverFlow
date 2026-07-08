const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function addStatusColumn() {
  const client = await pool.connect();
  try {
    console.log('Adding status column to users table...');

    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
    `);

    console.log('✅ Status column added successfully!');
  } catch (error) {
    console.error('❌ Error adding status column:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addStatusColumn();
