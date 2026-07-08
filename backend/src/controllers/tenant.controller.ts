import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';
import { generateTemporaryPassword } from '../utils/password';
import { sendWelcomeEmail } from '../utils/email';

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
      admin_first_name,
      admin_last_name,
      admin_email,
      admin_password,
      subscription_tier,
    } = req.body;

    if (!tenant_code || !tenant_name || !legal_name || !business_type || !contact_email) {
      throw new AppError('Missing required fields', 400);
    }

    if (!admin_first_name || !admin_last_name || !admin_email) {
      throw new AppError('Admin credentials are required', 400);
    }

    const planCode = subscription_tier || 'starter';
    const temporaryPassword = admin_password || generateTemporaryPassword();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create tenant
      const tenantQuery = `
        INSERT INTO tenants (
          id, tenant_code, tenant_name, legal_name, business_type, contact_email,
          contact_person, phone, address, city, state, country, postal_code,
          subdomain, industry, timezone, currency, gst_number, pan_number,
          logo_url, brand_color, subscription_tier, subscription_status, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        RETURNING *
      `;

      const tenantValues = [
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
        planCode,
        'active',
        true,
      ];

      const tenantResult = await client.query(tenantQuery, tenantValues);
      const tenant = tenantResult.rows[0];

      // Create subscription record
      const planResult = await client.query(
        'SELECT plan_code, plan_name, price_monthly, modules FROM subscription_plans WHERE plan_code = $1',
        [planCode]
      );
      const plan = planResult.rows[0] || {
        plan_code: planCode,
        plan_name: planCode.charAt(0).toUpperCase() + planCode.slice(1),
        price_monthly: 99,
        modules: {},
      };

      const subscriptionId = uuidv4();
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      await client.query(
        `INSERT INTO subscriptions (
          id, subscription_code, tenant_id, plan_code, plan_name, billing_cycle,
          amount, currency, status, start_date, end_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          subscriptionId,
          `SUB-${tenant_code}-${Date.now()}`,
          tenant.id,
          plan.plan_code,
          plan.plan_name,
          'yearly',
          plan.price_monthly ? plan.price_monthly * 12 : 990,
          currency || 'USD',
          'active',
          startDate,
          endDate,
        ]
      );

      // Enable modules based on subscription plan
      const planModules = plan.modules || {};
      const enabledModuleCodes = Object.keys(planModules).filter((key) => planModules[key]);

      const coreModulesResult = await client.query(
        `SELECT id, module_code FROM modules
         WHERE status = 'active'
         AND (module_code = ANY($1) OR is_core_module = true)`,
        [enabledModuleCodes.length > 0 ? enabledModuleCodes : ['dashboard', 'users', 'settings']]
      );

      for (const mod of coreModulesResult.rows) {
        await client.query(
          `INSERT INTO tenant_modules (id, tenant_id, module_id, module_code, is_enabled, is_custom, overrides_subscription)
           VALUES ($1, $2, $3, $4, true, false, false)
           ON CONFLICT (tenant_id, module_id) DO NOTHING`,
          [uuidv4(), tenant.id, mod.id, mod.module_code]
        );
      }

      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      // Create tenant admin user
      const adminQuery = `
        INSERT INTO users (
          id, tenant_id, first_name, last_name, email, password_hash,
          user_type, is_active, email_verified, must_change_password
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, first_name, last_name, email, user_type
      `;

      const adminValues = [
        uuidv4(),
        tenant.id,
        admin_first_name,
        admin_last_name,
        admin_email,
        hashedPassword,
        'tenant_admin',
        true,
        true,
        false,
      ];

      const adminResult = await client.query(adminQuery, adminValues);
      const adminUser = adminResult.rows[0];

      // Also assign the tenant_admin role to the user
      const roleQuery = `
        SELECT id FROM roles WHERE code = 'tenant_admin' AND tenant_id IS NULL
      `;
      const roleResult = await client.query(roleQuery);
      
      if (roleResult.rows.length > 0) {
        const roleId = roleResult.rows[0].id;
        const userRoleQuery = `
          INSERT INTO user_roles (id, user_id, role_id, assigned_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        `;
        await client.query(userRoleQuery, [uuidv4(), adminUser.id, roleId]);
      }

      await client.query('COMMIT');

      // Send welcome email (non-blocking, don't await to avoid slowing down response)
      sendWelcomeEmail({
        to: admin_email,
        firstName: admin_first_name,
        tenantName: tenant_name,
        loginUrl: process.env.FRONTEND_URL || 'http://localhost:5173/login',
        temporaryPassword,
      }).catch((error) => {
        logger.error('Failed to send welcome email', { error, email: admin_email });
      });

      logger.info('Tenant and admin created successfully', { 
        tenantId: tenant.id, 
        tenant_code,
        adminId: adminUser.id,
        subscriptionId,
      });

      res.status(201).json({
        success: true,
        message: 'Tenant created successfully',
        data: {
          tenant,
          admin: adminUser,
          subscription: { id: subscriptionId, plan_code: plan.plan_code },
          temporary_password: temporaryPassword,
        },
      } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
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

    const allowedFields = [
      'tenant_code', 'tenant_name', 'legal_name', 'business_type', 'contact_email',
      'contact_person', 'phone', 'address', 'city', 'state', 'country', 'postal_code',
      'subdomain', 'industry', 'timezone', 'currency', 'gst_number', 'pan_number',
      'logo_url', 'brand_color', 'subscription_tier', 'subscription_status', 'is_active',
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const client = await pool.connect();
    try {
      let tenant;
      if (Object.keys(updates).length > 0) {
        const fields = Object.keys(updates)
          .map((key, index) => `${key} = $${index + 2}`)
          .join(', ');

        const values = [id, ...Object.values(updates)];

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

        tenant = result.rows[0];
        logger.info('Tenant updated successfully', { tenantId: id });
      } else {
        // No fields to update, just fetch existing tenant
        const result = await client.query(
          'SELECT * FROM tenants WHERE id = $1 AND deleted_at IS NULL',
          [id]
        );
        if (result.rows.length === 0) {
          throw new AppError('Tenant not found', 404);
        }
        tenant = result.rows[0];
      }

      res.status(200).json({
        success: true,
        message: Object.keys(updates).length > 0 ? 'Tenant updated successfully' : 'No changes made',
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
