import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

const getTenantId = (req: Request) => req.tenantId || req.user?.tenantId || req.user?.tenant_id;

class DashboardWidgetController {
  getWidgetsForCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const userId = req.userId || req.user?.id;
    if (!tenantId) throw new AppError('Tenant ID is required', 400);

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT dwc.*
         FROM dashboard_widget_configs dwc
         WHERE dwc.tenant_id = $1
         AND dwc.is_active = true
         AND (
           dwc.is_default = true
           OR dwc.role_id IN (SELECT role_id FROM user_roles WHERE user_id = $2)
         )
         ORDER BY dwc.position_y ASC, dwc.position_x ASC`,
        [tenantId, userId]
      );

      res.status(200).json({
        success: true,
        message: 'Dashboard widgets retrieved successfully',
        data: result.rows,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getWidgetsByRole = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const { roleId } = req.params;
    if (!tenantId) throw new AppError('Tenant ID is required', 400);

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM dashboard_widget_configs
         WHERE tenant_id = $1 AND role_id = $2 AND is_active = true
         ORDER BY position_y ASC, position_x ASC`,
        [tenantId, roleId]
      );

      res.status(200).json({
        success: true,
        message: 'Role dashboard widgets retrieved successfully',
        data: result.rows,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  createWidget = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    if (!tenantId) throw new AppError('Tenant ID is required', 400);

    const {
      role_id,
      widget_type,
      widget_config,
      position_x,
      position_y,
      width,
      height,
      is_default,
      is_active,
    } = req.body;

    if (!role_id || !widget_type) {
      throw new AppError('Role ID and widget type are required', 400);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO dashboard_widget_configs (
          id, tenant_id, role_id, widget_type, widget_config,
          position_x, position_y, width, height, is_default, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          uuidv4(), tenantId, role_id, widget_type, widget_config || {},
          position_x || 0, position_y || 0, width || 4, height || 2,
          is_default || false, is_active !== undefined ? is_active : true,
        ]
      );

      logger.info('Dashboard widget created', { tenantId, widgetId: result.rows[0].id });

      res.status(201).json({
        success: true,
        message: 'Dashboard widget created successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateWidget = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    if (!tenantId) throw new AppError('Tenant ID is required', 400);

    const allowedFields = [
      'widget_type', 'widget_config', 'position_x', 'position_y',
      'width', 'height', 'is_default', 'is_active'
    ];
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(req.body[field]);
      }
    }

    if (fields.length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    values.push(id, tenantId);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE dashboard_widget_configs
         SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        throw new AppError('Dashboard widget not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Dashboard widget updated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteWidget = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    if (!tenantId) throw new AppError('Tenant ID is required', 400);

    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE dashboard_widget_configs
         SET is_active = false, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND tenant_id = $2
         RETURNING *`,
        [id, tenantId]
      );

      if (result.rows.length === 0) {
        throw new AppError('Dashboard widget not found', 404);
      }

      res.status(200).json({ success: true, message: 'Dashboard widget deleted successfully' } as ApiResponse);
    } finally {
      client.release();
    }
  });

  resetWidgets = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const { role_id } = req.body;
    if (!tenantId) throw new AppError('Tenant ID is required', 400);
    if (!role_id) throw new AppError('Role ID is required', 400);

    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE dashboard_widget_configs
         SET is_active = false, updated_at = CURRENT_TIMESTAMP
         WHERE tenant_id = $1 AND role_id = $2 AND is_default = false`,
        [tenantId, role_id]
      );

      const result = await client.query(
        `SELECT * FROM dashboard_widget_configs
         WHERE tenant_id = $1 AND role_id = $2 AND is_active = true
         ORDER BY position_y ASC, position_x ASC`,
        [tenantId, role_id]
      );

      res.status(200).json({
        success: true,
        message: 'Dashboard widgets reset successfully',
        data: result.rows,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const dashboardWidgetController = new DashboardWidgetController();
