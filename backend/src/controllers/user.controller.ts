import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, User } from '../types';
import { logger } from '../utils/logger';

class UserController {
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, first_name, last_name, user_type } = req.body;

    if (!email || !first_name || !last_name) {
      throw new AppError('Missing required fields', 400);
    }

    const user: User = {
      id: uuidv4(),
      tenant_id: req.tenantId || uuidv4(),
      email,
      first_name,
      last_name,
      user_type: user_type || 'recovery_agent',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    logger.info('User created successfully', { userId: user.id, tenantId: user.tenant_id });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    } as ApiResponse);
  });

  getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users: User[] = [];

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      meta: { total: 0, page: 1, limit: 10, total_pages: 0 },
    } as ApiResponse);
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user: User = {
      id,
      tenant_id: req.tenantId || uuidv4(),
      email: 'user@example.com',
      first_name: 'Demo',
      last_name: 'User',
      user_type: 'recovery_agent',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    } as ApiResponse);
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user: User = {
      id,
      tenant_id: req.tenantId || uuidv4(),
      email: req.body.email || 'user@example.com',
      first_name: req.body.first_name || 'Demo',
      last_name: req.body.last_name || 'User',
      user_type: req.body.user_type || 'recovery_agent',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    logger.info('User updated successfully', { userId: id });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    } as ApiResponse);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    logger.info('User deleted successfully', { userId: id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    } as ApiResponse);
  });
}

export const userController = new UserController();
