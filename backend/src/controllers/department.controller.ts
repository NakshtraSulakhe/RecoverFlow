
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, Department } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class DepartmentController {
  createDepartment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { name, code, description } = req.body;

    if (!name || !code) {
      throw new AppError('Name and code are required', 400);
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO departments (id, tenant_id, name, code, description, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [uuidv4(), tenantId, name, code, description, true];
      const result = await client.query(query, values);
      const department = result.rows[0];

      logger.info('Department created successfully', { departmentId: department.id, tenantId });

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: department,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { page = 1, limit = 10, search, is_active } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = ['tenant_id = $1'];
    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (is_active !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(is_active === 'true');
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex++} OR code ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    conditions.push('deleted_at IS NULL');

    const client = await pool.connect();
    try {
      const countQuery = `SELECT COUNT(*) FROM departments WHERE ${conditions.join(' AND ')}`;
      const countResult = await client.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const dataQuery = `
        SELECT * FROM departments
        WHERE ${conditions.join(' AND ')}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(Number(limit), offset);
      const dataResult = await client.query(dataQuery, params);

      res.status(200).json({
        success: true,
        message: 'Departments retrieved successfully',
        data: dataResult.rows,
        meta: { total, page: Number(page), limit: Number(limit), total_pages: Math.ceil(total / Number(limit)) },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const query = 'SELECT * FROM departments WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL';
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('Department not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Department retrieved successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateDepartment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const updates = req.body;

    const client = await pool.connect();
    try {
      const fields = Object.keys(updates)
        .filter(key => !['id', 'tenant_id', 'created_at'].includes(key))
        .map((key, index) => `${key} = $${index + 3}`)
        .join(', ');

      const values = [id, tenantId, ...Object.values(updates).filter((_, index) => {
        const key = Object.keys(updates)[index];
        return !['id', 'tenant_id', 'created_at'].includes(key);
      })];

      const query = `
        UPDATE departments
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new AppError('Department not found', 404);
      }

      logger.info('Department updated successfully', { departmentId: id, tenantId });

      res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const query = `
        UPDATE departments
        SET deleted_at = CURRENT_TIMESTAMP, is_active = false
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('Department not found', 404);
      }

      logger.info('Department deleted successfully', { departmentId: id, tenantId });

      res.status(200).json({ success: true, message: 'Department deleted successfully' } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const departmentController = new DepartmentController();
