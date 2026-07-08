const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function testQuery() {
  const client = await pool.connect();
  try {
    console.log('Testing getUsers query...');
    // Let's test with a dummy tenant ID (we can get one from tenants table)
    const tenants = await client.query('SELECT id FROM tenants LIMIT 1');
    if (tenants.rows.length === 0) {
      console.log('No tenants found, let\'s insert one');
    } else {
      const tenantId = tenants.rows[0].id;
      console.log('Using tenant ID:', tenantId);

      const countQuery = `
        SELECT COUNT(DISTINCT u.id)
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        WHERE u.tenant_id = $1 AND u.deleted_at IS NULL
      `;
      const countResult = await client.query(countQuery, [tenantId]);
      console.log('Count result:', countResult.rows);

      const dataQuery = `
        SELECT DISTINCT ON (u.id)
          u.id, u.first_name, u.last_name, u.email, u.user_type, u.status,
          u.department_id, u.team_id, u.last_login_at, u.created_at,
          d.name as department_name,
          t.name as team_name,
          r.name as role_name, r.code as role_code, r.id as role_id
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN teams t ON u.team_id = t.id
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.tenant_id = $1 AND u.deleted_at IS NULL
        ORDER BY u.id, u.created_at DESC
        LIMIT 10 OFFSET 0
      `;
      const dataResult = await client.query(dataQuery, [tenantId]);
      console.log('Data result:', dataResult.rows);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

testQuery();
