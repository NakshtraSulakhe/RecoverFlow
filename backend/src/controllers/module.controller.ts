import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, Module } from '../types';
import { logger } from '../utils/logger';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface ModuleFilters {
  status?: string;
  category?: string;
  search?: string;
}

interface ModuleListQuery {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

class ModuleController {
  createModule = asyncHandler(async (req: Request, res: Response) => {
    const {
      module_code,
      module_name,
      category,
      description,
      icon,
      route,
      sort_order,
      status,
      is_core_module,
      is_add_on,
      requires_subscription_tier,
    } = req.body;

    if (!module_code || !module_name || !category) {
      throw new AppError('Missing required fields', 400);
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO modules (
          id, module_code, module_name, category, description,
          icon, route, sort_order, status, is_core_module,
          is_add_on, requires_subscription_tier
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

      const values = [
        uuidv4(),
        module_code,
        module_name,
        category,
        description,
        icon,
        route,
        sort_order || 0,
        status || 'active',
        is_core_module || false,
        is_add_on || false,
        requires_subscription_tier,
      ];

      const result = await client.query(query, values);
      const module = result.rows[0];

      logger.info('Module created successfully', { moduleId: module.id, module_code });

      res.status(201).json({
        success: true,
        message: 'Module created successfully',
        data: module,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getAllModules = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, sort_by = 'sort_order', sort_order = 'asc', status, category, search } = req.query as ModuleListQuery & ModuleFilters;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    if (search) {
      conditions.push(`(module_name ILIKE $${paramIndex++} OR module_code ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const client = await pool.connect();
    try {
      const countQuery = `SELECT COUNT(*) FROM modules ${whereClause}`;
      const countResult = await client.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const dataQuery = `
        SELECT * FROM modules
        ${whereClause}
        ORDER BY ${sort_by} ${sort_order}
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(Number(limit), offset);

      const dataResult = await client.query(dataQuery, params);
      const modules = dataResult.rows;

      res.status(200).json({
        success: true,
        message: 'Modules retrieved successfully',
        data: modules,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          total_pages: Math.ceil(total / Number(limit)),
        },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getModuleById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM modules WHERE id = $1';
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Module not found', 404);
      }

      const module = result.rows[0];

      res.status(200).json({
        success: true,
        message: 'Module retrieved successfully',
        data: module,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateModule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const client = await pool.connect();
    try {
      const fields = Object.keys(updates)
        .filter(key => key !== 'id' && key !== 'created_at')
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

      const values = [id, ...Object.values(updates).filter((_, index) => {
        const key = Object.keys(updates)[index];
        return key !== 'id' && key !== 'created_at';
      })];

      const query = `
        UPDATE modules
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new AppError('Module not found', 404);
      }

      const module = result.rows[0];

      logger.info('Module updated successfully', { moduleId: id });

      res.status(200).json({
        success: true,
        message: 'Module updated successfully',
        data: module,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteModule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = 'DELETE FROM modules WHERE id = $1 RETURNING *';
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Module not found', 404);
      }

      logger.info('Module deleted successfully', { moduleId: id });

      res.status(200).json({
        success: true,
        message: 'Module deleted successfully',
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const moduleController = new ModuleController();
