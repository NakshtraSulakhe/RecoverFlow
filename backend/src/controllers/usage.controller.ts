import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class UsageController {
  recordUsage = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id, metric_name, metric_value, period_start, period_end, unit, metadata } = req.body;

    if (!tenant_id || !metric_name || !metric_value || !period_start || !period_end) {
      throw new AppError('Missing required fields', 400);
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO usage_tracking (
          id, tenant_id, metric_name, metric_value, period_start, period_end, unit, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (tenant_id, metric_name, period_start, period_end)
        DO UPDATE SET metric_value = usage_tracking.metric_value + $4,
                        metadata = $8,
                        updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      const values = [
        uuidv4(),
        tenant_id,
        metric_name,
        metric_value,
        period_start,
        period_end,
        unit || 'count',
        metadata || {},
      ];

      const result = await client.query(query, values);
      const usage = result.rows[0];

      logger.info('Usage recorded successfully', { usageId: usage.id, tenant_id, metric_name });

      res.status(201).json({
        success: true,
        message: 'Usage recorded successfully',
        data: usage,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getTenantUsage = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id } = req.params;
    const { period_start, period_end, metric_name } = req.query;

    const client = await pool.connect();
    try {
      const conditions: string[] = ['tenant_id = $1'];
      const params: any[] = [tenant_id];
      let paramIndex = 2;

      if (period_start) {
        conditions.push(`period_start >= $${paramIndex++}`);
        params.push(period_start);
      }

      if (period_end) {
        conditions.push(`period_end <= $${paramIndex++}`);
        params.push(period_end);
      }

      if (metric_name) {
        conditions.push(`metric_name = $${paramIndex++}`);
        params.push(metric_name);
      }

      const whereClause = conditions.join(' AND ');

      const query = `
        SELECT * FROM usage_tracking
        WHERE ${whereClause}
        ORDER BY period_start DESC, metric_name
      `;

      const result = await client.query(query, params);
      const usageData = result.rows;

      res.status(200).json({
        success: true,
        message: 'Usage data retrieved successfully',
        data: usageData,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getUsageSummary = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id } = req.params;
    const { period_start, period_end } = req.query;

    const client = await pool.connect();
    try {
      const conditions: string[] = ['tenant_id = $1'];
      const params: any[] = [tenant_id];
      let paramIndex = 2;

      if (period_start) {
        conditions.push(`period_start >= $${paramIndex++}`);
        params.push(period_start);
      }

      if (period_end) {
        conditions.push(`period_end <= $${paramIndex++}`);
        params.push(period_end);
      }

      const whereClause = conditions.join(' AND ');

      const query = `
        SELECT 
          metric_name,
          SUM(metric_value) as total_value,
          unit,
          MIN(period_start) as period_start,
          MAX(period_end) as period_end
        FROM usage_tracking
        WHERE ${whereClause}
        GROUP BY metric_name, unit
        ORDER BY metric_name
      `;

      const result = await client.query(query, params);
      const summary = result.rows;

      res.status(200).json({
        success: true,
        message: 'Usage summary retrieved successfully',
        data: summary,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getUsageDashboard = asyncHandler(async (req: Request, res: Response) => {
    const { tenant_id } = req.params;

    const client = await pool.connect();
    try {
      // Get current month usage
      const currentMonthStart = new Date();
      currentMonthStart.setDate(1);
      currentMonthStart.setHours(0, 0, 0, 0);

      const currentMonthEnd = new Date();
      currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
      currentMonthEnd.setDate(0);
      currentMonthEnd.setHours(23, 59, 59, 999);

      const query = `
        SELECT 
          metric_name,
          SUM(metric_value) as total_value,
          unit
        FROM usage_tracking
        WHERE tenant_id = $1 
          AND period_start >= $2 
          AND period_end <= $3
        GROUP BY metric_name, unit
        ORDER BY metric_name
      `;

      const result = await client.query(query, [tenant_id, currentMonthStart, currentMonthEnd]);
      const currentUsage = result.rows;

      // Get tenant stats
      const userCountQuery = 'SELECT COUNT(*) FROM users WHERE tenant_id = $1 AND is_active = true';
      const userCountResult = await client.query(userCountQuery, [tenant_id]);

      const customerCountQuery = 'SELECT COUNT(*) FROM customers WHERE tenant_id = $1';
      const customerCountResult = await client.query(customerCountQuery, [tenant_id]);

      const loanCountQuery = 'SELECT COUNT(*) FROM loans WHERE tenant_id = $1';
      const loanCountResult = await client.query(loanCountQuery, [tenant_id]);

      const caseCountQuery = 'SELECT COUNT(*) FROM recovery_cases WHERE tenant_id = $1';
      const caseCountResult = await client.query(caseCountQuery, [tenant_id]);

      const dashboard = {
        current_month_usage: currentUsage,
        active_users: parseInt(userCountResult.rows[0].count),
        total_customers: parseInt(customerCountResult.rows[0].count),
        total_loans: parseInt(loanCountResult.rows[0].count),
        total_cases: parseInt(caseCountResult.rows[0].count),
        period: {
          start: currentMonthStart,
          end: currentMonthEnd,
        },
      };

      res.status(200).json({
        success: true,
        message: 'Usage dashboard retrieved successfully',
        data: dashboard,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const usageController = new UsageController();
