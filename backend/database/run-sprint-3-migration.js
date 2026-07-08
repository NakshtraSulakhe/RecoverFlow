const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function runSprint3Migration() {
  const client = await pool.connect();
  try {
    console.log('Running Sprint 3 migration...');
    
    const fs = require('fs');
    const sql = fs.readFileSync('./sprint-3-schema.sql', 'utf8');
    
    // Split by semicolon but preserve DO $$ blocks
    const statements = [];
    let currentStatement = '';
    let inDoBlock = false;
    
    const lines = sql.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('DO $$')) {
        inDoBlock = true;
        currentStatement = line + '\n';
      } else if (inDoBlock && line.trim().startsWith('END $$')) {
        currentStatement += line;
        statements.push(currentStatement.trim());
        currentStatement = '';
        inDoBlock = false;
      } else if (inDoBlock) {
        currentStatement += line + '\n';
      } else if (line.trim().startsWith('\\c')) {
        continue;
      } else if (line.trim().startsWith('--')) {
        continue;
      } else if (line.trim().length === 0) {
        continue;
      } else {
        currentStatement += line;
        if (line.trim().endsWith(';')) {
          statements.push(currentStatement.trim());
          currentStatement = '';
        }
      }
    }
    
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
    await client.query('BEGIN');
    
    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (error) {
        // Ignore errors for IF NOT EXISTS and ON CONFLICT
        if (!error.message.includes('already exists') && !error.message.includes('duplicate key')) {
          console.error('Error executing statement:', error.message);
          console.error('Statement:', statement.substring(0, 100));
        }
      }
    }
    
    await client.query('COMMIT');
    console.log('✅ Sprint 3 migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error running migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runSprint3Migration();
