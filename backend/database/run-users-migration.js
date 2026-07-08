
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Connecting to database...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-users-missing-columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running users missing columns migration...');
    
    await client.query('BEGIN');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (err) {
          // Ignore errors for IF NOT EXISTS statements
          if (!err.message.includes('already exists') && !err.message.includes('duplicate key')) {
            console.error('Error in statement:', err.message);
            console.error('Statement:', statement.substring(0, 100) + '...');
          }
        }
      }
    }
    
    await client.query('COMMIT');
    console.log('✅ Users missing columns migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error running migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
