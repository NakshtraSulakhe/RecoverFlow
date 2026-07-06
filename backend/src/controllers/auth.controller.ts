import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, AuthResponse, JwtPayload } from '../types';
import { logger } from '../utils/logger';
import { query } from '../config/database';

async function getTenantContext(tenantId: string) {
  const tenantResult = await query(
    `SELECT id, tenant_name, tenant_code, subscription_tier, subscription_status, features
     FROM tenants WHERE id = $1 AND deleted_at IS NULL`,
    [tenantId]
  );

  if (tenantResult.rows.length === 0) return null;

  const tenant = tenantResult.rows[0];

  const modulesResult = await query(
    `SELECT m.module_code
     FROM tenant_modules tm
     JOIN modules m ON tm.module_id = m.id
     WHERE tm.tenant_id = $1 AND tm.is_enabled = true
     ORDER BY m.sort_order ASC`,
    [tenantId]
  );

  const subscriptionResult = await query(
    `SELECT id, plan_code, plan_name, status, billing_cycle, amount, currency, start_date, end_date
     FROM subscriptions
     WHERE tenant_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [tenantId]
  );

  return {
    ...tenant,
    enabled_modules: modulesResult.rows.map((row: { module_code: string }) => row.module_code),
    subscription: subscriptionResult.rows[0] || null,
  };
}

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, first_name, last_name, tenant_id } = req.body;

    // Validation
    if (!email || !password || !first_name || !last_name) {
      throw new AppError('Missing required fields', 400);
    }

    // TODO: Check if user already exists
    // const existingUser = await userRepository.findByEmail(email);
    // if (existingUser) {
    //   throw new AppError('User already exists', 409);
    // }

    // Hash password
    await bcrypt.hash(password, 10);

    // TODO: Create user in database
    // const user = await userRepository.create({
    //   id: uuidv4(),
    //   tenant_id,
    //   email,
    //   password_hash,
    //   first_name,
    //   last_name,
    //   user_type: 'recovery_agent',
    //   status: 'active',
    // });

    // Mock user for now
    const user = {
      id: uuidv4(),
      tenant_id: tenant_id || uuidv4(),
      email,
      first_name,
      last_name,
      user_type: 'recovery_agent',
      status: 'active',
    };

    // Generate tokens
    const access_token = this.generateAccessToken(user);
    const refresh_token = this.generateRefreshToken(user);

    logger.info('User registered successfully', { userId: user.id, email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        tenant: { id: user.tenant_id, tenant_name: 'Demo Tenant' },
        access_token,
        refresh_token,
        expires_in: 900, // 15 minutes
      },
    } as AuthResponse);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Find user by email
    const userResult = await query(
      `SELECT id, tenant_id, first_name, last_name, email, password_hash, user_type, is_active,
              must_change_password, password_changed_at
       FROM users WHERE email = $1 AND is_active = true`,
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Fetch user roles
    const rolesResult = await query(
      'SELECT r.* FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1',
      [user.id]
    );
    const roles = rolesResult.rows;

    // Fetch user permissions
    const permissionsResult = await query(
      'SELECT DISTINCT p.permission_code FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id JOIN user_roles ur ON rp.role_id = ur.role_id WHERE ur.user_id = $1',
      [user.id]
    );
    const permissions = permissionsResult.rows.map((p: any) => p.permission_code);

    const userData = {
      id: user.id,
      tenant_id: user.tenant_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      status: user.is_active ? 'active' : 'inactive' as const,
      must_change_password: user.must_change_password ?? false,
      password_changed_at: user.password_changed_at,
      roles: roles,
      permissions: permissions,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let tenant = null;
    if (user.tenant_id && user.user_type !== 'platform_owner') {
      tenant = await getTenantContext(user.tenant_id);
    }

    const access_token = this.generateAccessToken(userData);
    const refresh_token = this.generateRefreshToken(userData);

    logger.info('User logged in successfully', { userId: user.id, email, userType: user.user_type });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        tenant: tenant,
        access_token,
        refresh_token,
        expires_in: 900,
      },
    } as AuthResponse);
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new AppError('Refresh token is required', 400);
    }

    try {
      const decoded = jwt.verify(refresh_token, config.jwt.refreshSecret) as JwtPayload;

      // TODO: Verify user still exists and is active
      // const user = await userRepository.findById(decoded.sub);
      // if (!user || user.status !== 'active') {
      //   throw new AppError('User not found or inactive', 401);
      // }

      const user = {
        id: decoded.sub,
        tenant_id: decoded.tenant_id,
        email: decoded.email,
        user_type: decoded.user_type,
      };

      const new_access_token = this.generateAccessToken(user);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          access_token: new_access_token,
          expires_in: 900,
        },
      } as ApiResponse);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    // TODO: Add token to blacklist in Redis
    // await redis.set(`blacklist:${req.headers.authorization}`, '1', 900);

    logger.info('User logged out', { userId: req.userId });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    } as ApiResponse);
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userResult = await query(
      `SELECT id, tenant_id, first_name, last_name, email, user_type, is_active,
              must_change_password, password_changed_at
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = userResult.rows[0];

    // Fetch user roles
    const rolesResult = await query(
      'SELECT r.* FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1',
      [user.id]
    );
    const roles = rolesResult.rows;

    // Fetch user permissions
    const permissionsResult = await query(
      'SELECT DISTINCT p.permission_code FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id JOIN user_roles ur ON rp.role_id = ur.role_id WHERE ur.user_id = $1',
      [user.id]
    );
    const permissions = permissionsResult.rows.map((p: any) => p.permission_code);

    let tenant = null;
    if (user.tenant_id && user.user_type !== 'platform_owner') {
      tenant = await getTenantContext(user.tenant_id);
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        ...user,
        status: user.is_active ? 'active' : 'inactive',
        roles,
        permissions,
        tenant,
        enabled_modules: tenant?.enabled_modules || [],
      },
    } as ApiResponse);
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      throw new AppError('Current password and new password are required', 400);
    }

    if (new_password.length < 8) {
      throw new AppError('New password must be at least 8 characters', 400);
    }

    const userResult = await query(
      'SELECT id, password_hash, must_change_password FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = userResult.rows[0];
    const isValidPassword = await bcrypt.compare(current_password, user.password_hash);

    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400);
    }

    const password_hash = await bcrypt.hash(new_password, 10);

    await query(
      `UPDATE users
       SET password_hash = $1, must_change_password = false,
           password_changed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [password_hash, req.userId]
    );

    logger.info('Password changed successfully', { userId: req.userId });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    } as ApiResponse);
  });

  private generateAccessToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      tenant_id: user.tenant_id,
      email: user.email,
      user_type: user.user_type,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
    };

    return jwt.sign(payload, config.jwt.secret);
  }

  private generateRefreshToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      tenant_id: user.tenant_id,
      email: user.email,
      user_type: user.user_type,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };

    return jwt.sign(payload, config.jwt.refreshSecret);
  }

  getAccessibleModules = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const tenantId = (req as any).user?.tenant_id;

    if (!userId || !tenantId) {
      throw new AppError('Unauthorized', 401);
    }

    // Get user's role
    const roleResult = await query(
      `SELECT r.id, r.code
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1 AND r.is_active = true
       LIMIT 1`,
      [userId]
    );

    if (roleResult.rows.length === 0) {
      // No role assigned - return empty
      return res.status(200).json({
        success: true,
        data: [],
      } as ApiResponse);
    }

    const roleId = roleResult.rows[0].id;

    // Get user's permissions from permission matrix
    const permissionsResult = await query(
      `SELECT DISTINCT pm.module_code
       FROM permission_matrix pm
       JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id
       WHERE rpm.role_id = $1 AND pm.action_code = 'view' AND pm.is_active = true`,
      [roleId]
    );

    // Get enabled modules for tenant
    const tenantModulesResult = await query(
      `SELECT m.module_code
       FROM tenant_modules tm
       JOIN modules m ON tm.module_id = m.id
       WHERE tm.tenant_id = $1 AND tm.is_enabled = true`,
      [tenantId]
    );

    // Filter: user must have view permission AND module must be enabled for tenant
    const accessibleCodes = permissionsResult.rows
      .map((row: { module_code: string }) => row.module_code)
      .filter(code => tenantModulesResult.rows.some((tm: any) => tm.module_code === code));

    return res.status(200).json({
      success: true,
      data: accessibleCodes.map(code => ({ module_code: code })),
    } as ApiResponse);
  });

  checkPermission = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const tenantId = (req as any).user?.tenant_id;
    const { module, action } = req.query;

    if (!userId || !tenantId || !module || !action) {
      throw new AppError('Missing required parameters', 400);
    }

    // Get user's role
    const roleResult = await query(
      `SELECT r.id
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1 AND r.is_active = true
       LIMIT 1`,
      [userId]
    );

    if (roleResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: { hasPermission: false },
      } as ApiResponse);
    }

    const roleId = roleResult.rows[0].id;

    // Check if module is enabled for tenant
    const moduleEnabledResult = await query(
      `SELECT tm.id
       FROM tenant_modules tm
       JOIN modules m ON tm.module_id = m.id
       WHERE tm.tenant_id = $1 AND m.module_code = $2 AND tm.is_enabled = true`,
      [tenantId, module]
    );

    if (moduleEnabledResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: { hasPermission: false },
      } as ApiResponse);
    }

    // Check specific permission
    const permissionResult = await query(
      `SELECT pm.id
       FROM permission_matrix pm
       JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id
       WHERE rpm.role_id = $1 AND pm.module_code = $2 AND pm.action_code = $3 AND pm.is_active = true`,
      [roleId, module, action]
    );

    const hasPermission = permissionResult.rows.length > 0;

    return res.status(200).json({
      success: true,
      data: { hasPermission },
    } as ApiResponse);
  });
}

export const authController = new AuthController();
