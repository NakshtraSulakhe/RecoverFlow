const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'recoverflow_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting Sprint 7 migration...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'sprint-7-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await client.query(schema);
    
    console.log('Sprint 7 migration completed successfully!');
    console.log('Created tables:');
    console.log('- products');
    console.log('- accounts');
    console.log('- customers (enhanced)');
    console.log('- customer_addresses');
    console.log('- customer_contacts');
    console.log('- customer_employment');
    console.log('- customer_references');
    console.log('- customer_documents');
    console.log('- customer_bank_details');
    console.log('- customer_notes');
    console.log('- customer_tags');
    console.log('- loans');
    console.log('- loan_collateral');
    console.log('- loan_guarantors');
    console.log('- recovery_cases');
    console.log('- case_assignments');
    console.log('- case_history');
    console.log('- case_tags');
    console.log('- case_notes');
    console.log('- audit_logs');
    console.log('- tasks');
    console.log('- activities');
    console.log('- promise_to_pay');
    console.log('- settlements');
    
  } catch (error) {
    console.error('Error running Sprint 7 migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('Migration process finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });
