import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, Tenant } from '../types';
import { logger } from '../utils/logger';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface TenantFilters {
  status?: string;
  industry?: string;
  subscription_tier?: string;
  search?: string;
}

interface TenantListQuery {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

class TenantController {
  createTenant = asyncHandler(async (req: Request, res: Response) => {
    const {
      tenant_code,
      tenant_name,
      legal_name,
      business_type,
      contact_email,
      contact_person,
      phone,
      address,
      city,
      state,
      country,
      postal_code,
      subdomain,
      industry,
      timezone,
      currency,
      gst_number,
      pan_number,
      logo_url,
      brand_color,
    } = req.body;

    if (!tenant_code || !tenant_name || !legal_name || !business_type || !contact_email) {
      throw new AppError('Missing required fields', 400);
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO tenants (
          id, tenant_code, tenant_name, legal_name, business_type, contact_email,
          contact_person, phone, address, city, state, country, postal_code,
          subdomain, industry, timezone, currency, gst_number, pan_number,
          logo_url, brand_color, subscription_tier, subscription_status, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        RETURNING *
      `;

      const values = [
        uuidv4(),
        tenant_code,
        tenant_name,
        legal_name,
        business_type,
        contact_email,
        contact_person,
        phone,
        address,
        city,
        state,
        country,
        postal_code,
        subdomain,
        industry,
        timezone || 'UTC',
        currency || 'USD',
        gst_number,
        pan_number,
        logo_url,
        brand_color,
        'starter',
        'active',
        true,
      ];

      const result = await client.query(query, values);
      const tenant = result.rows[0];

      logger.info('Tenant created successfully', { tenantId: tenant.id, tenant_code });

      res.status(201).json({
        success: true,
        message: 'Tenant created successfully',
        data: tenant,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getAllTenants = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, sort_by = 'created_at', sort_order = 'desc', status, industry, subscription_tier, search } = req.query as TenantListQuery & TenantFilters;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(status === 'active');
    }

    if (industry) {
      conditions.push(`industry = $${paramIndex++}`);
      params.push(industry);
    }

    if (subscription_tier) {
      conditions.push(`subscription_tier = $${paramIndex++}`);
      params.push(subscription_tier);
    }

    if (search) {
      conditions.push(`(tenant_name ILIKE $${paramIndex++} OR tenant_code ILIKE $${paramIndex++} OR contact_email ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    conditions.push(`deleted_at IS NULL`);

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const client = await pool.connect();
    try {
      const countQuery = `SELECT COUNT(*) FROM tenants ${whereClause}`;
      const countResult = await client.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const dataQuery = `
        SELECT * FROM tenants
        ${whereClause}
        ORDER BY ${sort_by} ${sort_order}
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(Number(limit), offset);

      const dataResult = await client.query(dataQuery, params);
      const tenants = dataResult.rows;

      res.status(200).json({
        success: true,
        message: 'Tenants retrieved successfully',
        data: tenants,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          total_pages: Math.ceil(total / Number(limit)),
        },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getTenantById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM tenants WHERE id = $1 AND deleted_at IS NULL';
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Tenant not found', 404);
      }

      const tenant = result.rows[0];

      res.status(200).json({
        success: true,
        message: 'Tenant retrieved successfully',
        data: tenant,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateTenant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const client = await pool.connect();
    try {
      const fields = Object.keys(updates)
        .filter(key => key !== 'id' && key !== 'created_at')
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

      const values = [id, ...Object.values(updates).filter((_, index) => {
        const key = Object.keys(updates)[index];
        return key !== 'id' && key !== 'created_at';
      })];

      const query = `
        UPDATE tenants
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new AppError('Tenant not found', 404);
      }

      const tenant = result.rows[0];

      logger.info('Tenant updated successfully', { tenantId: id });

      res.status(200).json({
        success: true,
        message: 'Tenant updated successfully',
        data: tenant,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteTenant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        UPDATE tenants
        SET deleted_at = CURRENT_TIMESTAMP, is_active = false
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Tenant not found', 404);
      }

      logger.info('Tenant deleted successfully', { tenantId: id });

      res.status(200).json({
        success: true,
        message: 'Tenant deleted successfully',
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  suspendTenant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        UPDATE tenants
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Tenant not found', 404);
      }

      logger.info('Tenant suspended successfully', { tenantId: id });

      res.status(200).json({
        success: true,
        message: 'Tenant suspended successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  activateTenant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        UPDATE tenants
        SET is_active = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Tenant not found', 404);
      }

      logger.info('Tenant activated successfully', { tenantId: id });

      res.status(200).json({
        success: true,
        message: 'Tenant activated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  archiveTenant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        UPDATE tenants
        SET archived_at = CURRENT_TIMESTAMP, is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Tenant not found', 404);
      }

      logger.info('Tenant archived successfully', { tenantId: id });

      res.status(200).json({
        success: true,
        message: 'Tenant archived successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getTenantStats = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const tenantQuery = 'SELECT * FROM tenants WHERE id = $1 AND deleted_at IS NULL';
      const tenantResult = await client.query(tenantQuery, [id]);

      if (tenantResult.rows.length === 0) {
        throw new AppError('Tenant not found', 404);
      }

      const userCountQuery = 'SELECT COUNT(*) FROM users WHERE tenant_id = $1';
      const userCountResult = await client.query(userCountQuery, [id]);

      const customerCountQuery = 'SELECT COUNT(*) FROM customers WHERE tenant_id = $1';
      const customerCountResult = await client.query(customerCountQuery, [id]);

      const loanCountQuery = 'SELECT COUNT(*) FROM loans WHERE tenant_id = $1';
      const loanCountResult = await client.query(loanCountQuery, [id]);

      const caseCountQuery = 'SELECT COUNT(*) FROM recovery_cases WHERE tenant_id = $1';
      const caseCountResult = await client.query(caseCountQuery, [id]);

      const stats = {
        users: parseInt(userCountResult.rows[0].count),
        customers: parseInt(customerCountResult.rows[0].count),
        loans: parseInt(loanCountResult.rows[0].count),
        cases: parseInt(caseCountResult.rows[0].count),
      };

      res.status(200).json({
        success: true,
        message: 'Tenant stats retrieved successfully',
        data: stats,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const tenantController = new TenantController();
