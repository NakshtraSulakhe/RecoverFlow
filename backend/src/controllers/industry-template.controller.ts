import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

const tenantIdFromRequest = (req: Request) => req.tenantId || req.user?.tenantId || req.user?.tenant_id;

class IndustryTemplateController {
  getAllIndustryTemplates = asyncHandler(async (_req: Request, res: Response) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM industry_templates WHERE is_active = true ORDER BY industry_name ASC`
      );

      res.status(200).json({
        success: true,
        message: 'Industry templates retrieved successfully',
        data: result.rows,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getIndustryTemplateByCode = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM industry_templates WHERE industry_code = $1 AND is_active = true`,
        [code]
      );

      if (result.rows.length === 0) {
        throw new AppError('Industry template not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Industry template retrieved successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  createIndustryTemplate = asyncHandler(async (req: Request, res: Response) => {
    if (req.userType !== 'platform_owner') {
      throw new AppError('Only platform owners can create industry templates', 403);
    }

    const {
      industry_code,
      industry_name,
      description,
      logo_url,
      default_business_units,
      default_workflows,
      default_modules,
      is_active,
    } = req.body;

    if (!industry_code || !industry_name) {
      throw new AppError('Industry code and name are required', 400);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO industry_templates (
          id, industry_code, industry_name, description, logo_url,
          default_business_units, default_workflows, default_modules, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          uuidv4(),
          industry_code,
          industry_name,
          description,
          logo_url,
          default_business_units || [],
          default_workflows || [],
          default_modules || [],
          is_active !== undefined ? is_active : true,
        ]
      );

      logger.info('Industry template created', { industryCode: industry_code, tenantId: tenantIdFromRequest(req) });

      res.status(201).json({
        success: true,
        message: 'Industry template created successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateIndustryTemplate = asyncHandler(async (req: Request, res: Response) => {
    if (req.userType !== 'platform_owner') {
      throw new AppError('Only platform owners can update industry templates', 403);
    }

    const { code } = req.params;
    const allowedFields = [
      'industry_name', 'description', 'logo_url', 'default_business_units',
      'default_workflows', 'default_modules', 'is_active'
    ];
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(req.body[field]);
      }
    }

    if (fields.length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    values.push(code);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE industry_templates
         SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE industry_code = $${paramIndex}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        throw new AppError('Industry template not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Industry template updated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteIndustryTemplate = asyncHandler(async (req: Request, res: Response) => {
    if (req.userType !== 'platform_owner') {
      throw new AppError('Only platform owners can delete industry templates', 403);
    }

    const { code } = req.params;
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE industry_templates
         SET is_active = false, updated_at = CURRENT_TIMESTAMP
         WHERE industry_code = $1
         RETURNING *`,
        [code]
      );

      if (result.rows.length === 0) {
        throw new AppError('Industry template not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Industry template deleted successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const industryTemplateController = new IndustryTemplateController();
