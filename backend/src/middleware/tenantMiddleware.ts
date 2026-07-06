import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenantCode?: string;
      user?: any;
    }
  }
}

export const tenantMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get tenant ID from header, query parameter, or user object (from JWT)
    let tenantId = req.headers['x-tenant-id'] as string || 
                   req.query.tenant_id as string ||
                   req.user?.tenant_id;
    
    if (!tenantId) {
      throw new AppError('Tenant ID is required', 400);
    }

    // Validate tenant ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId)) {
      throw new AppError('Invalid tenant ID format', 400);
    }

    // Store tenant ID in request
    req.tenantId = tenantId;
    
    // Also set it on user object for controllers that expect it there
    if (!req.user) {
      req.user = {};
    }
    req.user.tenant_id = tenantId;

    // TODO: Add tenant validation from database
    // const tenant = await getTenantById(tenantId);
    // if (!tenant || tenant.status !== 'active') {
    //   throw new AppError('Tenant not found or inactive', 403);
    // }
    // req.tenantCode = tenant.tenant_code;

    logger.debug('Tenant middleware passed', { tenantId });
    next();
  } catch (error) {
    next(error);
  }
};
