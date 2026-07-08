import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';
import { generateTemporaryPassword } from '../utils/password';
import { sendWelcomeEmail } from '../utils/email';

class UserProvisioningController {
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const userId = (req as any).user?.id;
    
    logger.info('Create user request', { tenantId, userId, body: req.body });

    if (!tenantId) {
      throw new AppError('Tenant ID is required', 400);
    }

    const {
      first_name,
      last_name,
      email,
      department_id,
      team_id,
      role_id,
      status = 'active',
      send_welcome_email = false,
    } = req.body;

    // Convert empty strings to null
    const deptId = department_id === '' ? null : department_id;
    const tmId = team_id === '' ? null : team_id;

    if (!first_name || !last_name || !email || !role_id) {
      throw new AppError('First name, last name, email, and role are required', 400);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if email already exists in tenant
      const emailCheckQuery = 'SELECT id FROM users WHERE email = $1 AND tenant_id = $2';
      const emailCheckResult = await client.query(emailCheckQuery, [email, tenantId]);
      if (emailCheckResult.rows.length > 0) {
        await client.query('ROLLBACK');
        throw new AppError('Email already exists in this organization', 400);
      }

      // Validate department belongs to tenant
      if (deptId) {
        const deptCheckQuery = 'SELECT id FROM departments WHERE id = $1 AND tenant_id = $2';
        const deptCheckResult = await client.query(deptCheckQuery, [deptId, tenantId]);
        if (deptCheckResult.rows.length === 0) {
          await client.query('ROLLBACK');
          throw new AppError('Invalid department', 400);
        }
      }

      // Validate team belongs to tenant
      if (tmId) {
        const teamCheckQuery = 'SELECT id FROM teams WHERE id = $1 AND tenant_id = $2';
        const teamCheckResult = await client.query(teamCheckQuery, [tmId, tenantId]);
        if (teamCheckResult.rows.length === 0) {
          await client.query('ROLLBACK');
          throw new AppError('Invalid team', 400);
        }
      }

      // Validate role belongs to tenant or is system role
      const roleCheckQuery = 'SELECT id FROM roles WHERE id = $1 AND (tenant_id = $2 OR tenant_id IS NULL)';
      const roleCheckResult = await client.query(roleCheckQuery, [role_id, tenantId]);
      if (roleCheckResult.rows.length === 0) {
        await client.query('ROLLBACK');
        throw new AppError('Invalid role', 400);
      }

      // Generate temporary password
      const temporaryPassword = generateTemporaryPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      // Create user
      const userQuery = `
        INSERT INTO users (
          id, tenant_id, first_name, last_name, email, password_hash,
          user_type, is_active, email_verified, must_change_password,
          department_id, team_id, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, first_name, last_name, email, user_type, department_id, team_id, status
      `;
      const userValues = [
        uuidv4(),
        tenantId,
        first_name,
        last_name,
        email,
        hashedPassword,
        'staff',
        true,
        false,
        true,
        deptId,
        tmId,
        status,
      ];
      const userResult = await client.query(userQuery, userValues);
      const newUser = userResult.rows[0];

      // Assign role to user
      const userRoleQuery = `
        INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
      `;
      await client.query(userRoleQuery, [uuidv4(), newUser.id, role_id, userId]);

      await client.query('COMMIT');

      logger.info('User created successfully', { userId: newUser.id, tenantId, createdBy: userId });

      // Send welcome email if requested
      if (send_welcome_email) {
        sendWelcomeEmail({
          to: email,
          firstName: first_name,
          tenantName: (req as any).user?.tenant_name || 'your organization',
          loginUrl: process.env.FRONTEND_URL || 'http://localhost:5173/login',
          temporaryPassword,
        }).catch((error) => {
          logger.error('Failed to send welcome email', { error, email });
        });
      }

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          ...newUser,
          temporary_password: send_welcome_email ? temporaryPassword : undefined,
        },
      } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      department_id,
      team_id,
      role_id,
      status,
    } = req.body;

    // Convert empty strings to null
    const deptId = department_id === '' ? null : department_id;
    const tmId = team_id === '' ? null : team_id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if user exists and belongs to tenant
      const userCheckQuery = 'SELECT id FROM users WHERE id = $1 AND tenant_id = $2';
      const userCheckResult = await client.query(userCheckQuery, [id, tenantId]);
      if (userCheckResult.rows.length === 0) {
        await client.query('ROLLBACK');
        throw new AppError('User not found', 404);
      }

      // Validate department
      if (deptId) {
        const deptCheckQuery = 'SELECT id FROM departments WHERE id = $1 AND tenant_id = $2';
        const deptCheckResult = await client.query(deptCheckQuery, [deptId, tenantId]);
        if (deptCheckResult.rows.length === 0) {
          await client.query('ROLLBACK');
          throw new AppError('Invalid department', 400);
        }
      }

      // Validate team
      if (tmId) {
        const teamCheckQuery = 'SELECT id FROM teams WHERE id = $1 AND tenant_id = $2';
        const teamCheckResult = await client.query(teamCheckQuery, [tmId, tenantId]);
        if (teamCheckResult.rows.length === 0) {
          await client.query('ROLLBACK');
          throw new AppError('Invalid team', 400);
        }
      }

      // Validate role
      if (role_id) {
        const roleCheckQuery = 'SELECT id FROM roles WHERE id = $1 AND (tenant_id = $2 OR tenant_id IS NULL)';
        const roleCheckResult = await client.query(roleCheckQuery, [role_id, tenantId]);
        if (roleCheckResult.rows.length === 0) {
          await client.query('ROLLBACK');
          throw new AppError('Invalid role', 400);
        }

        // Update user role
        const updateRoleQuery = `
          UPDATE user_roles
          SET role_id = $1
          WHERE user_id = $2
        `;
        await client.query(updateRoleQuery, [role_id, id]);
      }

      // Update user
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (first_name) {
        fields.push(`first_name = $${paramIndex++}`);
        values.push(first_name);
      }
      if (last_name) {
        fields.push(`last_name = $${paramIndex++}`);
        values.push(last_name);
      }
      if (email) {
        // Check if email is already used by another user
        const emailCheckQuery = 'SELECT id FROM users WHERE email = $1 AND id != $2 AND tenant_id = $3';
        const emailCheckResult = await client.query(emailCheckQuery, [email, id, tenantId]);
        if (emailCheckResult.rows.length > 0) {
          await client.query('ROLLBACK');
          throw new AppError('Email already in use', 400);
        }
        fields.push(`email = $${paramIndex++}`);
        values.push(email);
      }
      if (department_id !== undefined) {
        fields.push(`department_id = $${paramIndex++}`);
        values.push(deptId);
      }
      if (team_id !== undefined) {
        fields.push(`team_id = $${paramIndex++}`);
        values.push(tmId);
      }
      if (status) {
        fields.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      if (fields.length > 0) {
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id, tenantId);
        const updateQuery = `
          UPDATE users
          SET ${fields.join(', ')}
          WHERE id = $${paramIndex++} AND tenant_id = $${paramIndex++}
          RETURNING id, first_name, last_name, email, department_id, team_id, status
        `;
        const result = await client.query(updateQuery, values);

        await client.query('COMMIT');

        logger.info('User updated successfully', { userId: id, tenantId });

        res.status(200).json({
          success: true,
          message: 'User updated successfully',
          data: result.rows[0],
        } as ApiResponse);
      } else {
        await client.query('ROLLBACK');
        throw new AppError('No fields to update', 400);
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { page = 1, limit = 10, search, department_id, team_id, role_id, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = ['u.tenant_id = $1', 'u.deleted_at IS NULL'];
    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (search) {
      conditions.push(`(u.first_name ILIKE $${paramIndex++} OR u.last_name ILIKE $${paramIndex++} OR u.email ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (department_id) {
      conditions.push(`u.department_id = $${paramIndex++}`);
      params.push(department_id);
    }

    if (team_id) {
      conditions.push(`u.team_id = $${paramIndex++}`);
      params.push(team_id);
    }

    if (role_id) {
      conditions.push(`ur.role_id = $${paramIndex++}`);
      params.push(role_id);
    }

    if (status) {
      conditions.push(`u.status = $${paramIndex++}`);
      params.push(status);
    }

    const client = await pool.connect();
    try {
      const countQuery = `
        SELECT COUNT(DISTINCT u.id)
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        WHERE ${conditions.join(' AND ')}
      `;
      const countResult = await client.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const dataQuery = `
        SELECT DISTINCT ON (u.id)
          u.id, u.first_name, u.last_name, u.email, u.user_type, u.status,
          u.department_id, u.team_id, u.last_login_at, u.created_at,
          d.name as department_name,
          t.name as team_name,
          r.name as role_name, r.code as role_code, r.id as role_id
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN teams t ON u.team_id = t.id
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE ${conditions.join(' AND ')}
        ORDER BY u.id, u.created_at DESC
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
      const query = `
        SELECT DISTINCT ON (u.id)
          u.id, u.first_name, u.last_name, u.email, u.user_type, u.status,
          u.department_id, u.team_id, u.last_login_at, u.created_at,
          d.name as department_name,
          t.name as team_name,
          r.id as role_id, r.name as role_name, r.code as role_code
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN teams t ON u.team_id = t.id
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.id = $1 AND u.tenant_id = $2 AND u.deleted_at IS NULL
        ORDER BY u.id
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      // Prevent deleting yourself
      const currentUserId = (req as any).user?.id;
      if (id === currentUserId) {
        throw new AppError('Cannot delete your own account', 403);
      }

      const query = `
        UPDATE users
        SET deleted_at = CURRENT_TIMESTAMP, status = 'inactive'
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('User not found', 404);
      }

      logger.info('User deleted successfully', { userId: id, tenantId });

      res.status(200).json({ success: true, message: 'User deleted successfully' } as ApiResponse);
    } finally {
      client.release();
    }
  });

  resetUserPassword = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const { send_email = false } = req.body;

    const client = await pool.connect();
    try {
      // Check if user exists
      const userQuery = 'SELECT email, first_name FROM users WHERE id = $1 AND tenant_id = $2';
      const userResult = await client.query(userQuery, [id, tenantId]);
      if (userResult.rows.length === 0) {
        throw new AppError('User not found', 404);
      }

      const user = userResult.rows[0];
      const temporaryPassword = generateTemporaryPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      // Update password
      const updateQuery = `
        UPDATE users
        SET password_hash = $1, must_change_password = true, password_changed_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      await client.query(updateQuery, [hashedPassword, id]);

      logger.info('User password reset successfully', { userId: id, tenantId });

      // Send email if requested
      if (send_email) {
        sendWelcomeEmail({
          to: user.email,
          firstName: user.first_name,
          tenantName: (req as any).user?.tenant_name || 'your organization',
          loginUrl: process.env.FRONTEND_URL || 'http://localhost:5173/login',
          temporaryPassword,
        }).catch((error) => {
          logger.error('Failed to send password reset email', { error, email: user.email });
        });
      }

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
        data: {
          temporary_password: send_email ? temporaryPassword : undefined,
        },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  lockUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      // Prevent locking yourself
      const currentUserId = (req as any).user?.id;
      if (id === currentUserId) {
        throw new AppError('Cannot lock your own account', 403);
      }

      const query = `
        UPDATE users
        SET status = 'locked', locked_until = NULL
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('User not found', 404);
      }

      logger.info('User locked successfully', { userId: id, tenantId });

      res.status(200).json({
        success: true,
        message: 'User locked successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  unlockUser = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const query = `
        UPDATE users
        SET status = 'active', locked_until = NULL, failed_login_attempts = 0
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('User not found', 404);
      }

      logger.info('User unlocked successfully', { userId: id, tenantId });

      res.status(200).json({
        success: true,
        message: 'User unlocked successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const userProvisioningController = new UserProvisioningController();
