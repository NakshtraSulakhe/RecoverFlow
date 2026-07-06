
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, Role } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class RoleController {
  createRole = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { name, code, description } = req.body;

    if (!name || !code) {
      throw new AppError('Name and code are required', 400);
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO roles (id, tenant_id, name, code, description, is_system_role, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [uuidv4(), tenantId, name, code, description, false, true];
      const result = await client.query(query, values);
      const role = result.rows[0];

      logger.info('Role created successfully', { roleId: role.id, tenantId });

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: role,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getAllRoles = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { page = 1, limit = 10, search, is_active } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = ['(tenant_id = $1 OR tenant_id IS NULL)'];
    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (is_active !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(is_active === 'true');
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex++} OR code ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    conditions.push('deleted_at IS NULL');

    const client = await pool.connect();
    try {
      const countQuery = `SELECT COUNT(*) FROM roles WHERE ${conditions.join(' AND ')}`;
      const countResult = await client.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const dataQuery = `
        SELECT r.*
        FROM roles r
        WHERE ${conditions.join(' AND ')}
        ORDER BY r.is_system_role DESC, r.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(Number(limit), offset);
      const dataResult = await client.query(dataQuery, params);

      res.status(200).json({
        success: true,
        message: 'Roles retrieved successfully',
        data: dataResult.rows,
        meta: { total, page: Number(page), limit: Number(limit), total_pages: Math.ceil(total / Number(limit)) },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getRoleById = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const roleQuery = `
        SELECT r.*
        FROM roles r
        WHERE r.id = $1 AND (r.tenant_id = $2 OR r.tenant_id IS NULL) AND r.deleted_at IS NULL
      `;
      const roleResult = await client.query(roleQuery, [id, tenantId]);

      if (roleResult.rows.length === 0) {
        throw new AppError('Role not found', 404);
      }

      // Get permissions from the new permission matrix
      const permissionsQuery = `
        SELECT pm.*
        FROM permission_matrix pm
        JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id
        WHERE rpm.role_id = $1
        ORDER BY pm.module_code, pm.action_code
      `;
      const permissionsResult = await client.query(permissionsQuery, [id]);

      const role = {
        ...roleResult.rows[0],
        permissions: permissionsResult.rows,
      };

      res.status(200).json({
        success: true,
        message: 'Role retrieved successfully',
        data: role,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const updates = req.body;

    const client = await pool.connect();
    try {
      // Check if it's a system role
      const checkQuery = 'SELECT is_system_role FROM roles WHERE id = $1';
      const checkResult = await client.query(checkQuery, [id]);
      if (checkResult.rows[0]?.is_system_role) {
        throw new AppError('Cannot update system roles', 403);
      }

      const fields = Object.keys(updates)
        .filter(key => !['id', 'tenant_id', 'created_at', 'is_system_role'].includes(key))
        .map((key, index) => `${key} = $${index + 3}`)
        .join(', ');

      const values = [id, tenantId, ...Object.values(updates).filter((_, index) => {
        const key = Object.keys(updates)[index];
        return !['id', 'tenant_id', 'created_at', 'is_system_role'].includes(key);
      })];

      const query = `
        UPDATE roles
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new AppError('Role not found', 404);
      }

      logger.info('Role updated successfully', { roleId: id, tenantId });

      res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  assignPermissionsToRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { permission_matrix_ids } = req.body;

    const client = await pool.connect();
    try {
      // Check if it's a system role
      const checkQuery = 'SELECT is_system_role FROM roles WHERE id = $1';
      const checkResult = await client.query(checkQuery, [id]);
      if (checkResult.rows[0]?.is_system_role) {
        throw new AppError('Cannot modify system role permissions', 403);
      }

      // Remove existing permissions from matrix
      await client.query('DELETE FROM role_permission_matrix WHERE role_id = $1', [id]);

      // Add new permissions from matrix
      if (permission_matrix_ids && permission_matrix_ids.length > 0) {
        const placeholders = permission_matrix_ids.map((_: unknown, i: number) => `($1, $${i + 2})`).join(',');
        const values = [id, ...permission_matrix_ids];
        const insertQuery = `
          INSERT INTO role_permission_matrix (role_id, permission_matrix_id)
          VALUES ${placeholders}
          ON CONFLICT DO NOTHING
        `;
        await client.query(insertQuery, values);
      }

      // Get updated role with permissions
      const roleQuery = `SELECT * FROM roles WHERE id = $1`;
      const roleResult = await client.query(roleQuery, [id]);
      const permissionsQuery = `
        SELECT pm.*
        FROM permission_matrix pm
        JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id
        WHERE rpm.role_id = $1
        ORDER BY pm.module_code, pm.action_code
      `;
      const permissionsResult = await client.query(permissionsQuery, [id]);

      res.status(200).json({
        success: true,
        message: 'Permissions assigned successfully',
        data: { ...roleResult.rows[0], permissions: permissionsResult.rows },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  cloneRole = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const { name, code, description } = req.body;

    if (!name || !code) {
      throw new AppError('Name and code are required', 400);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get original role and permissions
      const originalRoleQuery = `SELECT * FROM roles WHERE id = $1`;
      const originalRoleResult = await client.query(originalRoleQuery, [id]);

      if (originalRoleResult.rows.length === 0) {
        await client.query('ROLLBACK');
        throw new AppError('Role not found', 404);
      }

      // Get permissions from the new permission matrix
      const originalPermissionsQuery = `SELECT permission_matrix_id FROM role_permission_matrix WHERE role_id = $1`;
      const originalPermissionsResult = await client.query(originalPermissionsQuery, [id]);
      const permissionMatrixIds = originalPermissionsResult.rows.map(r => r.permission_matrix_id);

      // Create new role
      const newRoleId = uuidv4();
      const newRoleQuery = `
        INSERT INTO roles (id, tenant_id, name, code, description, is_system_role, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const newRoleResult = await client.query(newRoleQuery, [
        newRoleId,
        tenantId,
        name,
        code,
        description || originalRoleResult.rows[0].description,
        false,
        true,
      ]);

      // Copy permissions from matrix
      if (permissionMatrixIds.length > 0) {
        const placeholders = permissionMatrixIds.map((_, i) => `($1, $${i + 2})`).join(',');
        const values = [newRoleId, ...permissionMatrixIds];
        const insertPermissionsQuery = `
          INSERT INTO role_permission_matrix (role_id, permission_matrix_id)
          VALUES ${placeholders}
        `;
        await client.query(insertPermissionsQuery, values);
      }

      await client.query('COMMIT');

      logger.info('Role cloned successfully', { originalRoleId: id, newRoleId, tenantId });

      res.status(201).json({
        success: true,
        message: 'Role cloned successfully',
        data: newRoleResult.rows[0],
      } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      // Check if it's a system role
      const checkQuery = 'SELECT is_system_role FROM roles WHERE id = $1';
      const checkResult = await client.query(checkQuery, [id]);
      if (checkResult.rows[0]?.is_system_role) {
        throw new AppError('Cannot delete system roles', 403);
      }

      const query = `
        UPDATE roles
        SET deleted_at = CURRENT_TIMESTAMP, is_active = false
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('Role not found', 404);
      }

      logger.info('Role deleted successfully', { roleId: id, tenantId });

      res.status(200).json({ success: true, message: 'Role deleted successfully' } as ApiResponse);
    } finally {
      client.release();
    }
  });

  // Permission Matrix Management
  getPermissionMatrix = asyncHandler(async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
      const query = `
        SELECT pm.*, pa.action_name
        FROM permission_matrix pm
        JOIN permission_actions pa ON pm.action_code = pa.action_code
        WHERE pm.is_active = true
        ORDER BY pm.module_code, pa.sort_order
      `;
      const result = await client.query(query);

      // Group by module
      const grouped = result.rows.reduce((acc: any, row: any) => {
        if (!acc[row.module_code]) {
          acc[row.module_code] = {
            module_code: row.module_code,
            permissions: []
          };
        }
        acc[row.module_code].permissions.push(row);
        return acc;
      }, {});

      const modules = Object.values(grouped);

      res.status(200).json({
        success: true,
        message: 'Permission matrix retrieved successfully',
        data: modules,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getRolePermissionsMatrix = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      const query = `
        SELECT pm.*, pa.action_name, rpm.id as role_permission_id
        FROM permission_matrix pm
        JOIN permission_actions pa ON pm.action_code = pa.action_code
        LEFT JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id AND rpm.role_id = $1
        WHERE pm.is_active = true
        ORDER BY pm.module_code, pa.sort_order
      `;
      const result = await client.query(query, [id]);

      // Group by module
      const grouped = result.rows.reduce((acc: any, row: any) => {
        if (!acc[row.module_code]) {
          acc[row.module_code] = {
            module_code: row.module_code,
            permissions: []
          };
        }
        acc[row.module_code].permissions.push({
          ...row,
          granted: row.role_permission_id !== null
        });
        return acc;
      }, {});

      const modules = Object.values(grouped);

      res.status(200).json({
        success: true,
        message: 'Role permissions matrix retrieved successfully',
        data: modules,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deactivateRole = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      // Check if it's a system role
      const checkQuery = 'SELECT is_system_role FROM roles WHERE id = $1';
      const checkResult = await client.query(checkQuery, [id]);
      if (checkResult.rows[0]?.is_system_role) {
        throw new AppError('Cannot deactivate system roles', 403);
      }

      const query = `
        UPDATE roles
        SET is_active = false
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('Role not found', 404);
      }

      logger.info('Role deactivated successfully', { roleId: id, tenantId });

      res.status(200).json({
        success: true,
        message: 'Role deactivated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  activateRole = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const query = `
        UPDATE roles
        SET is_active = true
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('Role not found', 404);
      }

      logger.info('Role activated successfully', { roleId: id, tenantId });

      res.status(200).json({
        success: true,
        message: 'Role activated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const roleController = new RoleController();
