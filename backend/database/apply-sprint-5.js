const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.development') });

function stripSqlComments(sql) {
  return sql
    .split(/\r?\n/)
    .map(line => line.replace(/--.*$/, '').trimEnd())
    .filter(line => line.trim() && !line.trim().startsWith('\\'))
    .join('\n');
}

function splitSqlStatements(sql) {
  return stripSqlComments(sql)
    .split(';')
    .map(statement => statement.trim())
    .filter(Boolean);
}

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
    console.log('✓ Connected to database:', process.env.DB_NAME || 'recoverflow_dev');

    const checkQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_name IN ('organization_configuration', 'business_units')
      ORDER BY table_name
    `;

    const checkResult = await client.query(checkQuery);
    console.log('\n📊 Current tables:', checkResult.rows.map(r => r.table_name).join(', ') || 'None found');

    const schemaPath = path.join(__dirname, 'sprint-5-schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('\n📝 Applying Sprint 5 schema...');

    const statements = splitSqlStatements(schema);
    const orderedStatements = [
      ...statements.filter(statement => /^CREATE EXTENSION/i.test(statement)),
      ...statements.filter(statement => /^CREATE TABLE/i.test(statement)),
      ...statements.filter(statement => /^ALTER TABLE/i.test(statement)),
      ...statements.filter(statement => /^CREATE (UNIQUE )?INDEX/i.test(statement)),
      ...statements.filter(statement => !/^(CREATE EXTENSION|CREATE TABLE|CREATE (UNIQUE )?INDEX|ALTER TABLE)/i.test(statement)),
    ];

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < orderedStatements.length; i++) {
      try {
        await client.query(orderedStatements[i]);
        successCount++;
        process.stdout.write('.');
      } catch (err) {
        const message = err.message.split('\n')[0];
        if (message.includes('already exists') || message.includes('duplicate key')) {
          skipCount++;
        } else {
          errorCount++;
          console.error(`\n❌ Error in statement ${i + 1}:`, message);
        }
      }
    }
    console.log(`\n✓ Schema application completed: ${successCount} applied, ${skipCount} skipped, ${errorCount} failed`);


    const seedPath = path.join(__dirname, 'sprint-5-seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('\n📝 Applying Sprint 5 seed data...');
      const seedSql = fs.readFileSync(seedPath, 'utf8')
        .split(/\r?\n/)
        .filter(line => !line.trim().startsWith('\\'))
        .join('\n');
      await client.query(seedSql);
      console.log('✓ Seed data application completed');
    }
    const verifyResult = await client.query(checkQuery);
    console.log('\n✅ Final tables:', verifyResult.rows.map(r => r.table_name).join(', '));

    if (verifyResult.rows.length >= 2 && errorCount === 0) {
      console.log('\n🎉 Sprint 5 migration successful!');
    } else {
      console.log('\n⚠️  Some tables may not have been created. Check the output above.');
      process.exitCode = 1;
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();


