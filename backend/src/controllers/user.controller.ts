import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, User } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class UserController {
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const {
      email,
      first_name,
      last_name,
      phone,
      user_type,
      department_id,
      team_id,
      role_ids,
      password,
    } = req.body;

    if (!email || !first_name || !last_name) {
      throw new AppError('Missing required fields', 400);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if email exists
      const checkQuery = 'SELECT id FROM users WHERE email = $1';
      const checkResult = await client.query(checkQuery, [email]);
      if (checkResult.rows.length > 0) {
        await client.query('ROLLBACK');
        throw new AppError('Email already in use', 409);
      }

      // Hash password if provided
      let password_hash = null;
      if (password) {
        password_hash = await bcrypt.hash(password, 10);
      }

      // Create user
      const insertQuery = `
        INSERT INTO users (
          id, tenant_id, email, first_name, last_name, phone, user_type,
          department_id, team_id, status, password_hash
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      const insertValues = [
        uuidv4(),
        tenantId,
        email,
        first_name,
        last_name,
        phone,
        user_type || 'recovery_agent',
        department_id,
        team_id,
        'active',
        password_hash,
      ];
      const insertResult = await client.query(insertQuery, insertValues);
      const user = insertResult.rows[0];

      // Assign roles if provided
      if (role_ids && role_ids.length > 0) {
        const rolePlaceholders = role_ids.map((_: unknown, i: number) => `($1, $${i + 2})`).join(',');
        const roleValues = [user.id, ...role_ids];
        const roleInsertQuery = `
          INSERT INTO user_roles (user_id, role_id)
          VALUES ${rolePlaceholders}
          ON CONFLICT DO NOTHING
        `;
        await client.query(roleInsertQuery, roleValues);
      }

      await client.query('COMMIT');

      logger.info('User created successfully', { userId: user.id, tenantId });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { page = 1, limit = 10, search, status, department_id, team_id, user_type } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = ['u.tenant_id = $1'];
    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (status) {
      conditions.push(`u.status = $${paramIndex++}`);
      params.push(status);
    }

    if (department_id) {
      conditions.push(`u.department_id = $${paramIndex++}`);
      params.push(department_id);
    }

    if (team_id) {
      conditions.push(`u.team_id = $${paramIndex++}`);
      params.push(team_id);
    }

    if (user_type) {
      conditions.push(`u.user_type = $${paramIndex++}`);
      params.push(user_type);
    }

    if (search) {
      conditions.push(`(u.first_name ILIKE $${paramIndex++} OR u.last_name ILIKE $${paramIndex++} OR u.email ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const client = await pool.connect();
    try {
      const countQuery = `SELECT COUNT(*) FROM users u WHERE ${conditions.join(' AND ')}`;
      const countResult = await client.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const dataQuery = `
        SELECT u.*, d.name as department_name, t.name as team_name
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN teams t ON u.team_id = t.id
        WHERE ${conditions.join(' AND ')}
        ORDER BY u.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(Number(limit), offset);
      const dataResult = await client.query(dataQuery, params);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: dataResult.rows,
        meta: { total, page: Number(page), limit: Number(limit), total_pages: Math.ceil(total / Number(limit)) },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const userQuery = `
        SELECT u.*, d.name as department_name, t.name as team_name
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN teams t ON u.team_id = t.id
        WHERE u.id = $1 AND u.tenant_id = $2
      `;
      const userResult = await client.query(userQuery, [id, tenantId]);

      if (userResult.rows.length === 0) {
        throw new AppError('User not found', 404);
      }

      // Get user roles and permissions
      const rolesQuery = `
        SELECT r.*
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `;
      const rolesResult = await client.query(rolesQuery, [id]);

      const permissionsQuery = `
        SELECT DISTINCT p.*
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = $1
      `;
      const permissionsResult = await client.query(permissionsQuery, [id]);

      const user = {
        ...userResult.rows[0],
        roles: rolesResult.rows,
        permissions: permissionsResult.rows.map((p: any) => p.permission_code),
      };

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const { role_ids, ...userUpdates } = req.body;
    const currentUserId = (req as any).user?.id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update user table
      const fields = Object.keys(userUpdates)
        .filter(key => !['id', 'tenant_id', 'created_at', 'password_hash'].includes(key))
        .map((key, index) => `${key} = $${index + 3}`)
        .join(', ');

      const values = [id, tenantId, ...Object.values(userUpdates).filter((_, index) => {
        const key = Object.keys(userUpdates)[index];
        return !['id', 'tenant_id', 'created_at', 'password_hash'].includes(key);
      })];

      const query = `
        UPDATE users
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND tenant_id = $2
        RETURNING *
      `;
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        throw new AppError('User not found', 404);
      }

      // Update roles if provided
      if (role_ids !== undefined) {
        await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);

        if (role_ids.length > 0) {
          const placeholders = role_ids.map((_: unknown, i: number) => `($1, $${i + 2})`).join(',');
          const roleValues = [id, ...role_ids];
          await client.query(`INSERT INTO user_roles (user_id, role_id) VALUES ${placeholders} ON CONFLICT DO NOTHING`, roleValues);
        }
      }

      await client.query('COMMIT');

      logger.info('User updated successfully', { userId: id, updatedBy: currentUserId });

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const client = await pool.connect();
    try {
      const query = `
        UPDATE users
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND tenant_id = $3
        RETURNING *
      `;
      const result = await client.query(query, [status, id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('User not found', 404);
      }

      logger.info('User status updated', { userId: id, newStatus: status });

      res.status(200).json({
        success: true,
        message: `User ${status} successfully`,
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  resetUserPassword = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new AppError('Password is required', 400);
    }

    const client = await pool.connect();
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const query = `
        UPDATE users
        SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND tenant_id = $3
        RETURNING *
      `;
      const result = await client.query(query, [passwordHash, id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('User not found', 404);
      }

      logger.info('User password reset', { userId: id });

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  assignRolesToUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const { role_ids } = req.body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Remove existing roles
      await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);

      // Assign new roles
      if (role_ids && role_ids.length > 0) {
        const placeholders = role_ids.map((_: unknown, i: number) => `($1, $${i + 2})`).join(',');
        const values = [id, ...role_ids];
        await client.query(`INSERT INTO user_roles (user_id, role_id) VALUES ${placeholders} ON CONFLICT DO NOTHING`, values);
      }

      await client.query('COMMIT');

      logger.info('Roles assigned to user', { userId: id, roleIds: role_ids });

      res.status(200).json({
        success: true,
        message: 'Roles assigned successfully',
      } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });
}

export const userController = new UserController();
