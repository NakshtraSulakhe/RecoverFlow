import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { config } from '../config';
import { JwtPayload } from '../types';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userType?: string;
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Store user info in request
    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    req.userType = decoded.user_type;
    
    // Store full user object for tenant middleware
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      user_type: decoded.user_type,
      tenant_id: decoded.tenant_id,
      tenantId: decoded.tenant_id,
    };
    req.tenantId = decoded.tenant_id;

    logger.debug('Auth middleware passed', { userId: req.userId, userType: req.userType, tenantId: decoded.tenant_id });
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    req.userType = decoded.user_type;

    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
};
