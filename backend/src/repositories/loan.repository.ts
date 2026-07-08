import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class LoanRepository {
  constructor(private pool: Pool) {}

  async create(loan: any) {
    const query = `
      INSERT INTO loans (
        tenant_id, customer_id, account_id, loan_number, product_id, loan_type_id,
        loan_purpose, principal_amount, interest_rate, interest_type, tenure_months,
        emi_amount, start_date, end_date, first_emi_date, disbursement_date,
        disbursement_amount, outstanding_principal, outstanding_interest,
        total_outstanding, overdue_amount, overdue_days, dpd_days, last_payment_date,
        next_payment_date, payment_frequency, payment_day, processing_fee,
        insurance_amount, collateral_type, collateral_value, collateral_description,
        guarantor_required, guarantor_count, loan_status, recovery_status,
        recovery_bucket_id, assigned_to, relationship_manager_id, branch_id,
        settlement_amount, settlement_date, notes, terms_conditions,
        custom_fields, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44,
        $45, $46, $47, $48, $49, $50, $51
      ) RETURNING *
    `;

    const values = [
      loan.tenant_id,
      loan.customer_id,
      loan.account_id,
      loan.loan_number,
      loan.product_id,
      loan.loan_type_id,
      loan.loan_purpose,
      loan.principal_amount,
      loan.interest_rate,
      loan.interest_type,
      loan.tenure_months,
      loan.emi_amount,
      loan.start_date,
      loan.end_date,
      loan.first_emi_date,
      loan.disbursement_date,
      loan.disbursement_amount,
      loan.outstanding_principal || loan.principal_amount,
      loan.outstanding_interest || 0,
      loan.total_outstanding || loan.principal_amount,
      loan.overdue_amount || 0,
      loan.overdue_days || 0,
      loan.dpd_days || 0,
      loan.last_payment_date,
      loan.next_payment_date,
      loan.payment_frequency,
      loan.payment_day,
      loan.processing_fee,
      loan.insurance_amount,
      loan.collateral_type,
      loan.collateral_value,
      loan.collateral_description,
      loan.guarantor_required || false,
      loan.guarantor_count || 0,
      loan.loan_status || 'active',
      loan.recovery_status,
      loan.recovery_bucket_id,
      loan.assigned_to,
      loan.relationship_manager_id,
      loan.branch_id,
      loan.settlement_amount,
      loan.settlement_date,
      loan.notes,
      loan.terms_conditions,
      loan.custom_fields,
      loan.metadata,
      loan.created_by,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Loan created', { loanId: result.rows[0].id });
    return result.rows[0];
  }

  async findAll(tenantId: string, filters: any = {}) {
    let query = `
      SELECT l.*, c.display_name as customer_name, c.customer_code, c.primary_phone,
             p.product_name, p.product_type
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN products p ON l.product_id = p.id
      WHERE l.tenant_id = $1 AND l.is_deleted = false
    `;
    const values: any[] = [tenantId];
    let paramCount = 1;

    if (filters.customer_id) {
      paramCount++;
      query += ` AND l.customer_id = $${paramCount}`;
      values.push(filters.customer_id);
    }

    if (filters.account_id) {
      paramCount++;
      query += ` AND l.account_id = $${paramCount}`;
      values.push(filters.account_id);
    }

    if (filters.product_id) {
      paramCount++;
      query += ` AND l.product_id = $${paramCount}`;
      values.push(filters.product_id);
    }

    if (filters.loan_status) {
      paramCount++;
      query += ` AND l.loan_status = $${paramCount}`;
      values.push(filters.loan_status);
    }

    if (filters.recovery_status) {
      paramCount++;
      query += ` AND l.recovery_status = $${paramCount}`;
      values.push(filters.recovery_status);
    }

    if (filters.assigned_to) {
      paramCount++;
      query += ` AND l.assigned_to = $${paramCount}`;
      values.push(filters.assigned_to);
    }

    if (filters.dpd_min !== undefined) {
      paramCount++;
      query += ` AND l.dpd_days >= $${paramCount}`;
      values.push(filters.dpd_min);
    }

    if (filters.dpd_max !== undefined) {
      paramCount++;
      query += ` AND l.dpd_days <= $${paramCount}`;
      values.push(filters.dpd_max);
    }

    if (filters.search) {
      paramCount++;
      query += ` AND (
        l.loan_number ILIKE $${paramCount} OR
        c.display_name ILIKE $${paramCount} OR
        c.primary_phone ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
    }

    query += ` ORDER BY l.created_at DESC`;

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
      SELECT l.*, c.display_name as customer_name, c.customer_code, c.primary_phone,
             c.primary_email, p.product_name, p.product_type
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN products p ON l.product_id = p.id
      WHERE l.id = $1 AND l.tenant_id = $2 AND l.is_deleted = false
    `;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0];
  }

  async findByLoanNumber(loanNumber: string, tenantId: string) {
    const query = `
      SELECT l.*, c.display_name as customer_name, c.customer_code, c.primary_phone,
             p.product_name, p.product_type
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN products p ON l.product_id = p.id
      WHERE l.loan_number = $1 AND l.tenant_id = $2 AND l.is_deleted = false
    `;
    const result = await this.pool.query(query, [loanNumber, tenantId]);
    return result.rows[0];
  }

  async findByCustomerId(customerId: string, tenantId: string) {
    const query = `
      SELECT l.*, p.product_name, p.product_type
      FROM loans l
      LEFT JOIN products p ON l.product_id = p.id
      WHERE l.customer_id = $1 AND l.tenant_id = $2 AND l.is_deleted = false
      ORDER BY l.created_at DESC
    `;
    const result = await this.pool.query(query, [customerId, tenantId]);
    return result.rows;
  }

  async update(id: string, loan: any, tenantId: string) {
    const query = `
      UPDATE loans SET
        loan_purpose = COALESCE($2, loan_purpose),
        principal_amount = COALESCE($3, principal_amount),
        interest_rate = COALESCE($4, interest_rate),
        interest_type = COALESCE($5, interest_type),
        tenure_months = COALESCE($6, tenure_months),
        emi_amount = COALESCE($7, emi_amount),
        end_date = COALESCE($8, end_date),
        first_emi_date = COALESCE($9, first_emi_date),
        disbursement_date = COALESCE($10, disbursement_date),
        disbursement_amount = COALESCE($11, disbursement_amount),
        outstanding_principal = COALESCE($12, outstanding_principal),
        outstanding_interest = COALESCE($13, outstanding_interest),
        total_outstanding = COALESCE($14, total_outstanding),
        overdue_amount = COALESCE($15, overdue_amount),
        overdue_days = COALESCE($16, overdue_days),
        dpd_days = COALESCE($17, dpd_days),
        last_payment_date = COALESCE($18, last_payment_date),
        next_payment_date = COALESCE($19, next_payment_date),
        processing_fee = COALESCE($20, processing_fee),
        insurance_amount = COALESCE($21, insurance_amount),
        collateral_type = COALESCE($22, collateral_type),
        collateral_value = COALESCE($23, collateral_value),
        collateral_description = COALESCE($24, collateral_description),
        guarantor_required = COALESCE($25, guarantor_required),
        guarantor_count = COALESCE($26, guarantor_count),
        loan_status = COALESCE($27, loan_status),
        recovery_status = COALESCE($28, recovery_status),
        recovery_bucket_id = COALESCE($29, recovery_bucket_id),
        assigned_to = COALESCE($30, assigned_to),
        relationship_manager_id = COALESCE($31, relationship_manager_id),
        branch_id = COALESCE($32, branch_id),
        settlement_amount = COALESCE($33, settlement_amount),
        settlement_date = COALESCE($34, settlement_date),
        notes = COALESCE($35, notes),
        custom_fields = COALESCE($36, custom_fields),
        metadata = COALESCE($37, metadata),
        updated_by = $38,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND tenant_id = $39 AND is_deleted = false
      RETURNING *
    `;

    const values = [
      id,
      loan.loan_purpose,
      loan.principal_amount,
      loan.interest_rate,
      loan.interest_type,
      loan.tenure_months,
      loan.emi_amount,
      loan.end_date,
      loan.first_emi_date,
      loan.disbursement_date,
      loan.disbursement_amount,
      loan.outstanding_principal,
      loan.outstanding_interest,
      loan.total_outstanding,
      loan.overdue_amount,
      loan.overdue_days,
      loan.dpd_days,
      loan.last_payment_date,
      loan.next_payment_date,
      loan.processing_fee,
      loan.insurance_amount,
      loan.collateral_type,
      loan.collateral_value,
      loan.collateral_description,
      loan.guarantor_required,
      loan.guarantor_count,
      loan.loan_status,
      loan.recovery_status,
      loan.recovery_bucket_id,
      loan.assigned_to,
      loan.relationship_manager_id,
      loan.branch_id,
      loan.settlement_amount,
      loan.settlement_date,
      loan.notes,
      loan.custom_fields,
      loan.metadata,
      loan.updated_by,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Loan updated', { loanId: id });
    return result.rows[0];
  }

  async softDelete(id: string, tenantId: string, deletedBy: string) {
    const query = `
      UPDATE loans SET
        is_deleted = true,
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = $1
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = false
      RETURNING *
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);
    logger.info('Loan soft deleted', { loanId: id });
    return result.rows[0];
  }

  async restore(id: string, tenantId: string) {
    const query = `
      UPDATE loans SET
        is_deleted = false,
        deleted_at = NULL,
        deleted_by = NULL
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = true
      RETURNING *
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    logger.info('Loan restored', { loanId: id });
    return result.rows[0];
  }

  async count(tenantId: string, filters: any = {}) {
    let query = `
      SELECT COUNT(*) FROM loans
      WHERE tenant_id = $1 AND is_deleted = false
    `;
    const values: any[] = [tenantId];

    if (filters.customer_id) {
      query += ` AND customer_id = $2`;
      values.push(filters.customer_id);
    }

    if (filters.loan_status) {
      query += ` AND loan_status = $${values.length + 1}`;
      values.push(filters.loan_status);
    }

    if (filters.recovery_status) {
      query += ` AND recovery_status = $${values.length + 1}`;
      values.push(filters.recovery_status);
    }

    const result = await this.pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Loan Collateral
  async addCollateral(loanId: string, collateral: any) {
    const query = `
      INSERT INTO loan_collateral (
        loan_id, collateral_type, collateral_name, description, value,
        valuation_date, ownership_type, ownership_details, location_address,
        location_city, location_state, location_postal_code, location_country_code,
        documents, is_insured, insurance_policy_number, insurance_expiry_date,
        is_released, released_date, notes, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22
      ) RETURNING *
    `;

    const values = [
      loanId,
      collateral.collateral_type,
      collateral.collateral_name,
      collateral.description,
      collateral.value,
      collateral.valuation_date,
      collateral.ownership_type,
      collateral.ownership_details,
      collateral.location_address,
      collateral.location_city,
      collateral.location_state,
      collateral.location_postal_code,
      collateral.location_country_code,
      collateral.documents,
      collateral.is_insured || false,
      collateral.insurance_policy_number,
      collateral.insurance_expiry_date,
      collateral.is_released || false,
      collateral.released_date,
      collateral.notes,
      collateral.metadata,
      collateral.created_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getCollaterals(loanId: string) {
    const query = `
      SELECT * FROM loan_collateral
      WHERE loan_id = $1
      ORDER BY is_released ASC, valuation_date DESC
    `;
    const result = await this.pool.query(query, [loanId]);
    return result.rows;
  }

  // Loan Guarantors
  async addGuarantor(loanId: string, guarantor: any) {
    const query = `
      INSERT INTO loan_guarantors (
        loan_id, guarantor_id, guarantor_name, relationship, guarantee_type,
        guarantee_amount, guarantee_percentage, is_primary_guarantor, id_type,
        id_number, phone, email, address, income, occupation, is_active,
        notes, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19
      ) RETURNING *
    `;

    const values = [
      loanId,
      guarantor.guarantor_id,
      guarantor.guarantor_name,
      guarantor.relationship,
      guarantor.guarantee_type,
      guarantor.guarantee_amount,
      guarantor.guarantee_percentage,
      guarantor.is_primary_guarantor || false,
      guarantor.id_type,
      guarantor.id_number,
      guarantor.phone,
      guarantor.email,
      guarantor.address,
      guarantor.income,
      guarantor.occupation,
      guarantor.is_active !== undefined ? guarantor.is_active : true,
      guarantor.notes,
      guarantor.metadata,
      guarantor.created_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getGuarantors(loanId: string) {
    const query = `
      SELECT * FROM loan_guarantors
      WHERE loan_id = $1
      ORDER BY is_primary_guarantor DESC, is_active DESC
    `;
    const result = await this.pool.query(query, [loanId]);
    return result.rows;
  }
}
