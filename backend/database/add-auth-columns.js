const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function addAuthColumns() {
  const client = await pool.connect();
  try {
    console.log('Connecting to database...');
    
    await client.query('BEGIN');
    
    console.log('Adding must_change_password and password_changed_at columns...');
    
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE
    `);
    
    await client.query('COMMIT');
    console.log('✅ Auth columns added successfully!');
    
    // Verify columns were added
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nUsers table columns:');
    columns.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding columns:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addAuthColumns();
