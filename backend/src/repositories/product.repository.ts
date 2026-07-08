import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class ProductRepository {
  constructor(private pool: Pool) {}

  async create(product: any) {
    const query = `
      INSERT INTO products (
        tenant_id, product_code, product_name, description, product_category,
        product_type, min_amount, max_amount, min_tenure_months, max_tenure_months,
        interest_rate_min, interest_rate_max, processing_fee_percent,
        prepayment_allowed, prepayment_penalty_percent, collateral_required,
        guarantor_required, insurance_required, document_requirements,
        eligibility_criteria, terms_conditions, is_active, is_system_product,
        metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING *
    `;

    const values = [
      product.tenant_id,
      product.product_code,
      product.product_name,
      product.description,
      product.product_category,
      product.product_type,
      product.min_amount,
      product.max_amount,
      product.min_tenure_months,
      product.max_tenure_months,
      product.interest_rate_min,
      product.interest_rate_max,
      product.processing_fee_percent,
      product.prepayment_allowed !== undefined ? product.prepayment_allowed : true,
      product.prepayment_penalty_percent,
      product.collateral_required !== undefined ? product.collateral_required : false,
      product.guarantor_required !== undefined ? product.guarantor_required : false,
      product.insurance_required !== undefined ? product.insurance_required : false,
      product.document_requirements,
      product.eligibility_criteria,
      product.terms_conditions,
      product.is_active !== undefined ? product.is_active : true,
      product.is_system_product !== undefined ? product.is_system_product : false,
      product.metadata,
      product.created_by,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Product created', { productId: result.rows[0].id });
    return result.rows[0];
  }

  async findAll(tenantId: string, filters: any = {}) {
    let query = `
      SELECT * FROM products
      WHERE tenant_id = $1 AND is_deleted = false
    `;
    const values: any[] = [tenantId];
    let paramCount = 1;

    if (filters.product_category) {
      paramCount++;
      query += ` AND product_category = $${paramCount}`;
      values.push(filters.product_category);
    }

    if (filters.product_type) {
      paramCount++;
      query += ` AND product_type = $${paramCount}`;
      values.push(filters.product_type);
    }

    if (filters.is_active !== undefined) {
      paramCount++;
      query += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
    }

    if (filters.search) {
      paramCount++;
      query += ` AND (
        product_name ILIKE $${paramCount} OR
        product_code ILIKE $${paramCount} OR
        description ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
    }

    query += ` ORDER BY product_name ASC`;

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
      SELECT * FROM products
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = false
    `;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0];
  }

  async findByProductCode(productCode: string, tenantId: string) {
    const query = `
      SELECT * FROM products
      WHERE product_code = $1 AND tenant_id = $2 AND is_deleted = false
    `;
    const result = await this.pool.query(query, [productCode, tenantId]);
    return result.rows[0];
  }

  async update(id: string, product: any, tenantId: string) {
    const query = `
      UPDATE products SET
        product_name = COALESCE($2, product_name),
        description = COALESCE($3, description),
        product_category = COALESCE($4, product_category),
        product_type = COALESCE($5, product_type),
        min_amount = COALESCE($6, min_amount),
        max_amount = COALESCE($7, max_amount),
        min_tenure_months = COALESCE($8, min_tenure_months),
        max_tenure_months = COALESCE($9, max_tenure_months),
        interest_rate_min = COALESCE($10, interest_rate_min),
        interest_rate_max = COALESCE($11, interest_rate_max),
        processing_fee_percent = COALESCE($12, processing_fee_percent),
        prepayment_allowed = COALESCE($13, prepayment_allowed),
        prepayment_penalty_percent = COALESCE($14, prepayment_penalty_percent),
        collateral_required = COALESCE($15, collateral_required),
        guarantor_required = COALESCE($16, guarantor_required),
        insurance_required = COALESCE($17, insurance_required),
        document_requirements = COALESCE($18, document_requirements),
        eligibility_criteria = COALESCE($19, eligibility_criteria),
        terms_conditions = COALESCE($20, terms_conditions),
        is_active = COALESCE($21, is_active),
        metadata = COALESCE($22, metadata),
        updated_by = $23,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND tenant_id = $24 AND is_deleted = false
      RETURNING *
    `;

    const values = [
      id,
      product.product_name,
      product.description,
      product.product_category,
      product.product_type,
      product.min_amount,
      product.max_amount,
      product.min_tenure_months,
      product.max_tenure_months,
      product.interest_rate_min,
      product.interest_rate_max,
      product.processing_fee_percent,
      product.prepayment_allowed,
      product.prepayment_penalty_percent,
      product.collateral_required,
      product.guarantor_required,
      product.insurance_required,
      product.document_requirements,
      product.eligibility_criteria,
      product.terms_conditions,
      product.is_active,
      product.metadata,
      product.updated_by,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Product updated', { productId: id });
    return result.rows[0];
  }

  async softDelete(id: string, tenantId: string, deletedBy: string) {
    const query = `
      UPDATE products SET
        is_deleted = true,
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = $1
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = false
      RETURNING *
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);
    logger.info('Product soft deleted', { productId: id });
    return result.rows[0];
  }

  async restore(id: string, tenantId: string) {
    const query = `
      UPDATE products SET
        is_deleted = false,
        deleted_at = NULL,
        deleted_by = NULL
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = true
      RETURNING *
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    logger.info('Product restored', { productId: id });
    return result.rows[0];
  }

  async count(tenantId: string, filters: any = {}) {
    let query = `
      SELECT COUNT(*) FROM products
      WHERE tenant_id = $1 AND is_deleted = false
    `;
    const values: any[] = [tenantId];

    if (filters.product_category) {
      query += ` AND product_category = $2`;
      values.push(filters.product_category);
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${values.length + 1}`;
      values.push(filters.is_active);
    }

    const result = await this.pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}
