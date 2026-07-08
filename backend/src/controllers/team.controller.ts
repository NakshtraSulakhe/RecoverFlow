
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class TeamController {
  createTeam = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { name, code, description, department_id, manager_id } = req.body;

    if (!name || !code) {
      throw new AppError('Name and code are required', 400);
    }

    // Convert empty strings to null
    const deptId = department_id === '' ? null : department_id;
    const mgrId = manager_id === '' ? null : manager_id;

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO teams (id, tenant_id, name, code, description, department_id, manager_id, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [uuidv4(), tenantId, name, code, description, deptId, mgrId, true];
      const result = await client.query(query, values);
      const team = result.rows[0];

      logger.info('Team created successfully', { teamId: team.id, tenantId });

      res.status(201).json({
        success: true,
        message: 'Team created successfully',
        data: team,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getAllTeams = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { page = 1, limit = 10, search, is_active, department_id } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = ['t.tenant_id = $1'];
    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (is_active !== undefined) {
      conditions.push(`t.is_active = $${paramIndex++}`);
      params.push(is_active === 'true');
    }

    if (department_id) {
      conditions.push(`t.department_id = $${paramIndex++}`);
      params.push(department_id);
    }

    if (search) {
      conditions.push(`(t.name ILIKE $${paramIndex++} OR t.code ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    conditions.push('t.deleted_at IS NULL');

    const client = await pool.connect();
    try {
      const countQuery = `SELECT COUNT(*) FROM teams t WHERE ${conditions.join(' AND ')}`;
      const countResult = await client.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const dataQuery = `
        SELECT t.*, d.name as department_name, u.first_name as manager_first_name, u.last_name as manager_last_name
        FROM teams t
        LEFT JOIN departments d ON t.department_id = d.id
        LEFT JOIN users u ON t.manager_id = u.id
        WHERE ${conditions.join(' AND ')}
        ORDER BY t.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(Number(limit), offset);
      const dataResult = await client.query(dataQuery, params);

      res.status(200).json({
        success: true,
        message: 'Teams retrieved successfully',
        data: dataResult.rows,
        meta: { total, page: Number(page), limit: Number(limit), total_pages: Math.ceil(total / Number(limit)) },
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getTeamById = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const query = `
        SELECT t.*, d.name as department_name, u.first_name as manager_first_name, u.last_name as manager_last_name
        FROM teams t
        LEFT JOIN departments d ON t.department_id = d.id
        LEFT JOIN users u ON t.manager_id = u.id
        WHERE t.id = $1 AND t.tenant_id = $2 AND t.deleted_at IS NULL
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('Team not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Team retrieved successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateTeam = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const updates = req.body;

    // Process updates to convert empty strings to null for UUID fields
    const processedUpdates = { ...updates };
    if (processedUpdates.department_id === '') processedUpdates.department_id = null;
    if (processedUpdates.manager_id === '') processedUpdates.manager_id = null;

    const client = await pool.connect();
    try {
      const fields = Object.keys(processedUpdates)
        .filter(key => !['id', 'tenant_id', 'created_at'].includes(key))
        .map((key, index) => `${key} = $${index + 3}`)
        .join(', ');

      const values = [id, tenantId, ...Object.values(processedUpdates).filter((_, index) => {
        const key = Object.keys(processedUpdates)[index];
        return !['id', 'tenant_id', 'created_at'].includes(key);
      })];

      const query = `
        UPDATE teams
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new AppError('Team not found', 404);
      }

      logger.info('Team updated successfully', { teamId: id, tenantId });

      res.status(200).json({
        success: true,
        message: 'Team updated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteTeam = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user?.tenant_id;
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const query = `
        UPDATE teams
        SET deleted_at = CURRENT_TIMESTAMP, is_active = false
        WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await client.query(query, [id, tenantId]);

      if (result.rows.length === 0) {
        throw new AppError('Team not found', 404);
      }

      logger.info('Team deleted successfully', { teamId: id, tenantId });

      res.status(200).json({ success: true, message: 'Team deleted successfully' } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const teamController = new TeamController();
