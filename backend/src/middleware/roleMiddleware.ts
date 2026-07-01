import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      userType?: string;
    }
  }
}

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.userType) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!allowedRoles.includes(req.userType)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

export const requirePlatformOwner = requireRole('platform_owner');
export const requireTenantAdmin = requireRole('platform_owner', 'tenant_admin');
export const requireRecoveryManager = requireRole('platform_owner', 'tenant_admin', 'recovery_manager');
export const requireTeamLeader = requireRole('platform_owner', 'tenant_admin', 'recovery_manager', 'team_leader');
export const requireAgent = requireRole('platform_owner', 'tenant_admin', 'recovery_manager', 'team_leader', 'recovery_agent');
