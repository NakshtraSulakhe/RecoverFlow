import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class AccountRepository {
  constructor(private pool: Pool) {}

  async create(account: any) {
    const query = `
      INSERT INTO accounts (
        tenant_id, customer_id, account_number, account_type, account_name,
        product_id, branch_id, status, opened_date, closed_date, credit_limit,
        current_balance, available_balance, currency, interest_rate,
        account_holder_name, joint_account_holders, nominee_name,
        nominee_relationship, is_primary_account, notes, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23
      ) RETURNING *
    `;

    const values = [
      account.tenant_id,
      account.customer_id,
      account.account_number,
      account.account_type,
      account.account_name,
      account.product_id,
      account.branch_id,
      account.status || 'active',
      account.opened_date,
      account.closed_date,
      account.credit_limit,
      account.current_balance || 0,
      account.available_balance || 0,
      account.currency || 'INR',
      account.interest_rate,
      account.account_holder_name,
      account.joint_account_holders,
      account.nominee_name,
      account.nominee_relationship,
      account.is_primary_account || false,
      account.notes,
      account.metadata,
      account.created_by,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Account created', { accountId: result.rows[0].id });
    return result.rows[0];
  }

  async findAll(tenantId: string, filters: any = {}) {
    let query = `
      SELECT a.*, c.display_name as customer_name, c.customer_code
      FROM accounts a
      LEFT JOIN customers c ON a.customer_id = c.id
      WHERE a.tenant_id = $1 AND a.is_deleted = false
    `;
    const values: any[] = [tenantId];
    let paramCount = 1;

    if (filters.customer_id) {
      paramCount++;
      query += ` AND a.customer_id = $${paramCount}`;
      values.push(filters.customer_id);
    }

    if (filters.account_type) {
      paramCount++;
      query += ` AND a.account_type = $${paramCount}`;
      values.push(filters.account_type);
    }

    if (filters.status) {
      paramCount++;
      query += ` AND a.status = $${paramCount}`;
      values.push(filters.status);
    }

    if (filters.search) {
      paramCount++;
      query += ` AND (
        a.account_number ILIKE $${paramCount} OR
        a.account_name ILIKE $${paramCount} OR
        c.display_name ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
    }

    query += ` ORDER BY a.opened_date DESC`;

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset || 0);
    }

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async findById(id: string, tenantId: string) {
    const query = `
      SELECT a.*, c.display_name as customer_name, c.customer_code
      FROM accounts a
      LEFT JOIN customers c ON a.customer_id = c.id
      WHERE a.id = $1 AND a.tenant_id = $2 AND a.is_deleted = false
    `;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0];
  }

  async findByAccountNumber(accountNumber: string, tenantId: string) {
    const query = `
      SELECT a.*, c.display_name as customer_name, c.customer_code
      FROM accounts a
      LEFT JOIN customers c ON a.customer_id = c.id
      WHERE a.account_number = $1 AND a.tenant_id = $2 AND a.is_deleted = false
    `;
    const result = await this.pool.query(query, [accountNumber, tenantId]);
    return result.rows[0];
  }

  async findByCustomerId(customerId: string, tenantId: string) {
    const query = `
      SELECT * FROM accounts
      WHERE customer_id = $1 AND tenant_id = $2 AND is_deleted = false
      ORDER BY opened_date DESC
    `;
    const result = await this.pool.query(query, [customerId, tenantId]);
    return result.rows;
  }

  async update(id: string, account: any, tenantId: string) {
    const query = `
      UPDATE accounts SET
        account_type = COALESCE($2, account_type),
        account_name = COALESCE($3, account_name),
        product_id = COALESCE($4, product_id),
        branch_id = COALESCE($5, branch_id),
        status = COALESCE($6, status),
        closed_date = COALESCE($7, closed_date),
        credit_limit = COALESCE($8, credit_limit),
        current_balance = COALESCE($9, current_balance),
        available_balance = COALESCE($10, available_balance),
        currency = COALESCE($11, currency),
        interest_rate = COALESCE($12, interest_rate),
        account_holder_name = COALESCE($13, account_holder_name),
        joint_account_holders = COALESCE($14, joint_account_holders),
        nominee_name = COALESCE($15, nominee_name),
        nominee_relationship = COALESCE($16, nominee_relationship),
        is_primary_account = COALESCE($17, is_primary_account),
        notes = COALESCE($18, notes),
        metadata = COALESCE($19, metadata),
        updated_by = $20,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND tenant_id = $21 AND is_deleted = false
      RETURNING *
    `;

    const values = [
      id,
      account.account_type,
      account.account_name,
      account.product_id,
      account.branch_id,
      account.status,
      account.closed_date,
      account.credit_limit,
      account.current_balance,
      account.available_balance,
      account.currency,
      account.interest_rate,
      account.account_holder_name,
      account.joint_account_holders,
      account.nominee_name,
      account.nominee_relationship,
      account.is_primary_account,
      account.notes,
      account.metadata,
      account.updated_by,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Account updated', { accountId: id });
    return result.rows[0];
  }

  async softDelete(id: string, tenantId: string, deletedBy: string) {
    const query = `
      UPDATE accounts SET
        is_deleted = true,
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = $1
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = false
      RETURNING *
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);
    logger.info('Account soft deleted', { accountId: id });
    return result.rows[0];
  }

  async restore(id: string, tenantId: string) {
    const query = `
      UPDATE accounts SET
        is_deleted = false,
        deleted_at = NULL,
        deleted_by = NULL
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = true
      RETURNING *
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    logger.info('Account restored', { accountId: id });
    return result.rows[0];
  }

  async count(tenantId: string, filters: any = {}) {
    let query = `
      SELECT COUNT(*) FROM accounts
      WHERE tenant_id = $1 AND is_deleted = false
    `;
    const values: any[] = [tenantId];

    if (filters.customer_id) {
      query += ` AND customer_id = $2`;
      values.push(filters.customer_id);
    }

    if (filters.status) {
      query += ` AND status = $${values.length + 1}`;
      values.push(filters.status);
    }

    const result = await this.pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}
