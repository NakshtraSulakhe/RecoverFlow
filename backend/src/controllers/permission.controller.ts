
import { Request, Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, Permission } from '../types';
import { pool } from '../config/database';

class PermissionController {
  getAllPermissions = asyncHandler(async (req: Request, res: Response) => {
    const { module_code, permission_type, search } = req.query;
    const conditions: string[] = ['is_active = true'];
    const params: any[] = [];
    let paramIndex = 1;

    if (module_code) {
      conditions.push(`module_code = $${paramIndex++}`);
      params.push(module_code);
    }

    if (permission_type) {
      conditions.push(`permission_type = $${paramIndex++}`);
      params.push(permission_type);
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++} OR permission_code ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM permissions
        ${whereClause}
        ORDER BY module_code, permission_code
      `;
      const result = await client.query(query, params);

      // Group by module
      const grouped = result.rows.reduce((acc: Record<string, Permission[]>, perm) => {
        if (!acc[perm.module_code]) {
          acc[perm.module_code] = [];
        }
        acc[perm.module_code].push(perm);
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        message: 'Permissions retrieved successfully',
        data: {
          list: result.rows,
          grouped,
        },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getPermissionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const query = 'SELECT * FROM permissions WHERE id = $1';
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Permission not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Permission retrieved successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const permissionController = new PermissionController();
