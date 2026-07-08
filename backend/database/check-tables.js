
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function checkTables() {
  const client = await pool.connect();
  try {
    console.log('Checking users table columns...');
    const usersCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    console.log('Users table columns:');
    usersCols.rows.forEach(col => console.log(`- ${col.column_name} (${col.data_type})`));

    console.log('\nChecking teams table columns...');
    const teamsCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'teams' 
      ORDER BY ordinal_position
    `);
    console.log('Teams table columns:');
    teamsCols.rows.forEach(col => console.log(`- ${col.column_name} (${col.data_type})`));

    console.log('\nChecking departments table columns...');
    const deptsCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'departments' 
      ORDER BY ordinal_position
    `);
    console.log('Departments table columns:');
    deptsCols.rows.forEach(col => console.log(`- ${col.column_name} (${col.data_type})`));

  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTables();
