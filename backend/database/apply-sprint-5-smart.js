const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.development') });

async function executeSprint5Migration() {
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

    // Read Sprint 5 schema
    const schemaPath = path.join(__dirname, 'sprint-5-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Parse into statement groups
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && !s.startsWith('\\'));

    // Categorize statements
    const createTableStmts = [];
    const createIndexStmts = [];
    const alterTableStmts = [];
    const otherStmts = [];

    for (const stmt of statements) {
      if (stmt.match(/^\s*CREATE TABLE/i)) {
        createTableStmts.push(stmt);
      } else if (stmt.match(/^\s*CREATE INDEX/i)) {
        createIndexStmts.push(stmt);
      } else if (stmt.match(/^\s*ALTER TABLE/i)) {
        alterTableStmts.push(stmt);
      } else {
        otherStmts.push(stmt);
      }
    }

    console.log('\n📊 Statement breakdown:');
    console.log(`  • CREATE TABLE: ${createTableStmts.length}`);
    console.log(`  • CREATE INDEX: ${createIndexStmts.length}`);
    console.log(`  • ALTER TABLE: ${alterTableStmts.length}`);
    console.log(`  • Other: ${otherStmts.length}`);

    // Execute in order
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    const categories = [
      { name: 'CREATE TABLE statements', stmts: createTableStmts },
      { name: 'CREATE INDEX statements', stmts: createIndexStmts },
      { name: 'ALTER TABLE statements', stmts: alterTableStmts },
      { name: 'Other statements', stmts: otherStmts },
    ];

    for (const category of categories) {
      console.log(`\n📝 Executing ${category.name}...`);
      let catSuccess = 0, catSkip = 0, catError = 0;

      for (const stmt of category.stmts) {
        try {
          await client.query(stmt);
          catSuccess++;
          process.stdout.write('.');
        } catch (err) {
          const msg = err.message;
          if (msg.includes('already exists') || 
              msg.includes('duplicate key') ||
              msg.includes('UNIQUE constraint')) {
            catSkip++;
          } else {
            catError++;
            if (catError <= 2) {
              console.error(`\n  ⚠️  ${msg.split('\n')[0]}`);
            }
          }
        }
      }

      console.log(`\n  ✓ Success: ${catSuccess}, Skipped: ${catSkip}, Errors: ${catError}`);
      successCount += catSuccess;
      skipCount += catSkip;
      errorCount += catError;
    }

    // Final verification
    console.log('\n📊 Verifying key Sprint 5 tables...');
    const tables = ['business_units', 'organization_configuration', 'workflow_templates', 'domain_packs', 'business_rules'];
    
    for (const tableName of tables) {
      const result = await client.query(
        `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=$1)`,
        [tableName]
      );
      const exists = result.rows[0].exists ? '✅' : '❌';
      console.log(`  ${exists} ${tableName}`);
    }

    console.log(`\n📈 Total Results - Success: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n✅ Sprint 5 migration completed successfully!');
    } else {
      console.log('\n⚠️  Migration completed with some errors. See details above.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

executeSprint5Migration();
