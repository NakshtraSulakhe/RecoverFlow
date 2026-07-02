import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, AuthResponse, JwtPayload } from '../types';
import { logger } from '../utils/logger';
import { query } from '../config/database';

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
      'SELECT id, tenant_id, first_name, last_name, email, password_hash, user_type, is_active FROM users WHERE email = $1 AND is_active = true',
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

    const userData = {
      id: user.id,
      tenant_id: user.tenant_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      status: user.is_active ? 'active' : 'inactive' as const,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Handle platform_owner (super admin) - no tenant
    let tenant = null;
    if (user.tenant_id && user.user_type !== 'platform_owner') {
      const tenantResult = await query(
        'SELECT id, tenant_name, tenant_code, subscription_tier, features FROM tenants WHERE id = $1',
        [user.tenant_id]
      );

      tenant = tenantResult.rows[0] || {
        id: user.tenant_id,
        tenant_name: 'Default Tenant',
        tenant_code: 'DEFAULT',
        subscription_tier: 'basic',
        features: {},
      };
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
      'SELECT id, tenant_id, first_name, last_name, email, user_type, is_active FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = userResult.rows[0];

    // Include tenant info if not platform_owner
    let tenant = null;
    if (user.tenant_id && user.user_type !== 'platform_owner') {
      const tenantResult = await query(
        'SELECT id, tenant_name, tenant_code, subscription_tier, features FROM tenants WHERE id = $1',
        [user.tenant_id]
      );
      tenant = tenantResult.rows[0] || null;
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: { ...user, tenant },
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
}

export const authController = new AuthController();
