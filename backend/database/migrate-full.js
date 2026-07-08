const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.development') });

async function applyMigration() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'recoverflow_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    await client.connect();
    console.log('✓ Connected to database:', process.env.DB_NAME);

    // List of schema files to apply in order
    const schemas = [
      { name: 'Base Schema', file: 'schema.sql' },
      { name: 'Sprint 5 Schema', file: 'sprint-5-schema.sql' },
    ];

    for (const schema of schemas) {
      console.log(`\n📝 Applying ${schema.name}...`);
      const schemaPath = path.join(__dirname, schema.file);
      
      if (!fs.existsSync(schemaPath)) {
        console.warn(`⚠️  File not found: ${schemaPath}`);
        continue;
      }

      const content = fs.readFileSync(schemaPath, 'utf8');

      // Split by statements and execute each
      const statements = content
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--') && !s.startsWith('\\'));

      let successCount = 0;
      let skipCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        try {
          await client.query(statements[i]);
          successCount++;
          process.stdout.write('.');
        } catch (err) {
          const msg = err.message;
          if (msg.includes('already exists') || 
              msg.includes('duplicate key') ||
              msg.includes('UNIQUE constraint') ||
              msg.includes('is not a valid statement')) {
            skipCount++;
          } else {
            errorCount++;
            if (errorCount <= 3) {
              console.error(`\n  ❌ [${schema.name}] ${msg.split('\n')[0]}`);
            }
          }
        }
      }
      
      console.log(`\n  ✓ Success: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
    }

    // Verify key tables
    console.log('\n📊 Verifying critical tables...');
    const criticalTables = [
      'tenants', 'users', 'roles', 'organization_configuration', 'business_units'
    ];
    
    for (const tableName of criticalTables) {
      const result = await client.query(
        `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=$1)`,
        [tableName]
      );
      const exists = result.rows[0].exists ? '✅' : '❌';
      console.log(`  ${exists} ${tableName}`);
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
