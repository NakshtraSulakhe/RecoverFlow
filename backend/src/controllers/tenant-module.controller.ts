import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, TenantModule } from '../types';
import { logger } from '../utils/logger';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class TenantModuleController {
  getTenantModules = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        SELECT tm.*, m.module_name, m.category, m.description, m.icon, m.route,
               m.is_core_module, m.is_add_on, m.requires_subscription_tier
        FROM tenant_modules tm
        JOIN modules m ON tm.module_id = m.id
        WHERE tm.tenant_id = $1
        ORDER BY m.sort_order ASC
      `;

      const result = await client.query(query, [tenant_id]);
      const tenantModules = result.rows;

      res.status(200).json({
        success: true,
        message: 'Tenant modules retrieved successfully',
        data: tenantModules,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getTenantModulesWithInherited = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id } = req.params;

    const client = await pool.connect();
    try {
      const tenantQuery = `SELECT subscription_tier FROM tenants WHERE id = $1`;
      const tenantResult = await client.query(tenantQuery, [tenant_id]);
      if (tenantResult.rows.length === 0) {
        throw new AppError('Tenant not found', 404);
      }
      const tenant = tenantResult.rows[0];

      const modulesQuery = `
        SELECT m.*,
               CASE WHEN tm.id IS NOT NULL THEN true ELSE false END AS has_assignment,
               CASE WHEN tm.id IS NOT NULL THEN tm.is_enabled ELSE false END AS tenant_enabled,
               CASE WHEN tm.id IS NOT NULL THEN tm.is_custom ELSE false END AS is_custom,
               CASE WHEN tm.id IS NOT NULL THEN tm.overrides_subscription ELSE false END AS overrides_subscription
        FROM modules m
        LEFT JOIN tenant_modules tm ON m.id = tm.module_id AND tm.tenant_id = $1
        WHERE m.status = 'active'
        ORDER BY m.sort_order ASC
      `;

      const modulesResult = await client.query(modulesQuery, [tenant_id]);
      const modulesWithStatus = modulesResult.rows;

      res.status(200).json({
        success: true,
        message: 'Tenant modules with inheritance retrieved successfully',
        data: modulesWithStatus,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateTenantModule = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id, module_id } = req.params;
    const { is_enabled, is_custom, overrides_subscription } = req.body;

    const client = await pool.connect();
    try {
      const moduleQuery = 'SELECT module_code FROM modules WHERE id = $1';
      const moduleResult = await client.query(moduleQuery, [module_id]);
      if (moduleResult.rows.length === 0) {
        throw new AppError('Module not found', 404);
      }
      const module = moduleResult.rows[0];

      const existingQuery = `SELECT * FROM tenant_modules WHERE tenant_id = $1 AND module_id = $2`;
      const existingResult = await client.query(existingQuery, [tenant_id, module_id]);

      let tenantModule;

      if (existingResult.rows.length > 0) {
        const updateQuery = `
          UPDATE tenant_modules
          SET is_enabled = $3, is_custom = $4, overrides_subscription = $5, updated_at = CURRENT_TIMESTAMP
          WHERE tenant_id = $1 AND module_id = $2
          RETURNING *
        `;
        const updateValues = [tenant_id, module_id, is_enabled, is_custom, overrides_subscription];
        const updateResult = await client.query(updateQuery, updateValues);
        tenantModule = updateResult.rows[0];
      } else {
        const insertQuery = `
          INSERT INTO tenant_modules (id, tenant_id, module_id, module_code, is_enabled, is_custom, overrides_subscription)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
        const insertValues = [
          uuidv4(),
          tenant_id,
          module_id,
          module.module_code,
          is_enabled,
          is_custom,
          overrides_subscription,
        ];
        const insertResult = await client.query(insertQuery, insertValues);
        tenantModule = insertResult.rows[0];
      }

      logger.info('Tenant module updated successfully', { tenantId: tenant_id, moduleId: module_id });

      res.status(200).json({
        success: true,
        message: 'Tenant module updated successfully',
        data: tenantModule,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  enableTenantModule = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id, module_id } = req.params;

    const client = await pool.connect();
    try {
      const moduleQuery = 'SELECT module_code FROM modules WHERE id = $1';
      const moduleResult = await client.query(moduleQuery, [module_id]);
      if (moduleResult.rows.length === 0) {
        throw new AppError('Module not found', 404);
      }
      const module = moduleResult.rows[0];

      const existingQuery = `SELECT * FROM tenant_modules WHERE tenant_id = $1 AND module_id = $2`;
      const existingResult = await client.query(existingQuery, [tenant_id, module_id]);

      let tenantModule;

      if (existingResult.rows.length > 0) {
        const updateQuery = `
          UPDATE tenant_modules
          SET is_enabled = true, updated_at = CURRENT_TIMESTAMP
          WHERE tenant_id = $1 AND module_id = $2
          RETURNING *
        `;
        const updateResult = await client.query(updateQuery, [tenant_id, module_id]);
        tenantModule = updateResult.rows[0];
      } else {
        const insertQuery = `
          INSERT INTO tenant_modules (id, tenant_id, module_id, module_code, is_enabled, is_custom, overrides_subscription)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
        const insertValues = [
          uuidv4(),
          tenant_id,
          module_id,
          module.module_code,
          true,
          false,
          false,
        ];
        const insertResult = await client.query(insertQuery, insertValues);
        tenantModule = insertResult.rows[0];
      }

      logger.info('Tenant module enabled', { tenantId: tenant_id, moduleId: module_id });

      res.status(200).json({
        success: true,
        message: 'Tenant module enabled',
        data: tenantModule,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  disableTenantModule = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id, module_id } = req.params;

    const client = await pool.connect();
    try {
      const moduleQuery = 'SELECT module_code FROM modules WHERE id = $1';
      const moduleResult = await client.query(moduleQuery, [module_id]);
      if (moduleResult.rows.length === 0) {
        throw new AppError('Module not found', 404);
      }

      const existingQuery = `SELECT * FROM tenant_modules WHERE tenant_id = $1 AND module_id = $2`;
      const existingResult = await client.query(existingQuery, [tenant_id, module_id]);

      if (existingResult.rows.length === 0) {
        throw new AppError('Tenant module not found', 404);
      }

      const updateQuery = `
        UPDATE tenant_modules
        SET is_enabled = false, updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = $1 AND module_id = $2
        RETURNING *
      `;
      const updateResult = await client.query(updateQuery, [tenant_id, module_id]);

      logger.info('Tenant module disabled', { tenantId: tenant_id, moduleId: module_id });

      res.status(200).json({
        success: true,
        message: 'Tenant module disabled',
        data: updateResult.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const tenantModuleController = new TenantModuleController();
