import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { query } from '../config/database';

/**
 * Permission middleware factory
 * Creates middleware that checks if user has required permission for a module and action
 */
export const requirePermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const tenantId = (req as any).user?.tenant_id;

      if (!userId || !tenantId) {
        throw new AppError('Unauthorized', 401);
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
        throw new AppError('No role assigned', 403);
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
        throw new AppError('Module not enabled for tenant', 403);
      }

      // Check specific permission
      const permissionResult = await query(
        `SELECT pm.id
         FROM permission_matrix pm
         JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id
         WHERE rpm.role_id = $1 AND pm.module_code = $2 AND pm.action_code = $3 AND pm.is_active = true`,
        [roleId, module, action]
      );

      if (permissionResult.rows.length === 0) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user has any of the specified permissions (OR logic)
 */
export const requireAnyPermission = (permissions: Array<{ module: string; action: string }>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const tenantId = (req as any).user?.tenant_id;

      if (!userId || !tenantId) {
        throw new AppError('Unauthorized', 401);
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
        throw new AppError('No role assigned', 403);
      }

      const roleId = roleResult.rows[0].id;

      // Check if any of the permissions are granted
      for (const perm of permissions) {
        // Check if module is enabled for tenant
        const moduleEnabledResult = await query(
          `SELECT tm.id
           FROM tenant_modules tm
           JOIN modules m ON tm.module_id = m.id
           WHERE tm.tenant_id = $1 AND m.module_code = $2 AND tm.is_enabled = true`,
          [tenantId, perm.module]
        );

        if (moduleEnabledResult.rows.length === 0) {
          continue;
        }

        // Check specific permission
        const permissionResult = await query(
          `SELECT pm.id
           FROM permission_matrix pm
           JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id
           WHERE rpm.role_id = $1 AND pm.module_code = $2 AND pm.action_code = $3 AND pm.is_active = true`,
          [roleId, perm.module, perm.action]
        );

        if (permissionResult.rows.length > 0) {
          // Permission granted
          return next();
        }
      }

      throw new AppError('Insufficient permissions', 403);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user has all specified permissions (AND logic)
 */
export const requireAllPermissions = (permissions: Array<{ module: string; action: string }>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const tenantId = (req as any).user?.tenant_id;

      if (!userId || !tenantId) {
        throw new AppError('Unauthorized', 401);
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
        throw new AppError('No role assigned', 403);
      }

      const roleId = roleResult.rows[0].id;

      // Check all permissions
      for (const perm of permissions) {
        // Check if module is enabled for tenant
        const moduleEnabledResult = await query(
          `SELECT tm.id
           FROM tenant_modules tm
           JOIN modules m ON tm.module_id = m.id
           WHERE tm.tenant_id = $1 AND m.module_code = $2 AND tm.is_enabled = true`,
          [tenantId, perm.module]
        );

        if (moduleEnabledResult.rows.length === 0) {
          throw new AppError(`Module ${perm.module} not enabled`, 403);
        }

        // Check specific permission
        const permissionResult = await query(
          `SELECT pm.id
           FROM permission_matrix pm
           JOIN role_permission_matrix rpm ON pm.id = rpm.permission_matrix_id
           WHERE rpm.role_id = $1 AND pm.module_code = $2 AND pm.action_code = $3 AND pm.is_active = true`,
          [roleId, perm.module, perm.action]
        );

        if (permissionResult.rows.length === 0) {
          throw new AppError(`Missing permission: ${perm.module}.${perm.action}`, 403);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
