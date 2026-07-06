import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, Subscription } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

interface FilterParams {
  search?: string;
  status?: string;
}

class SubscriptionController {
  getAllSubscriptions = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, sort_by = 'created_at', sort_order = 'desc', search, status } = req.query as PaginationParams & FilterParams;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = ['deleted_at IS NULL'];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (search) {
      conditions.push(`(subscription_code ILIKE $${paramIndex++} OR tenant_name ILIKE $${paramIndex++})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const client = await pool.connect();
    try {
      const countQuery = `SELECT COUNT(*) FROM subscriptions ${whereClause}`;
      const countResult = await client.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      const dataQuery = `
        SELECT 
          s.*,
          t.tenant_name,
          t.tenant_code
        FROM subscriptions s
        LEFT JOIN tenants t ON s.tenant_id = t.id
        ${whereClause}
        ORDER BY ${sort_by} ${sort_order}
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(Number(limit), offset);

      const dataResult = await client.query(dataQuery, params);
      const subscriptions = dataResult.rows;

      res.status(200).json({
        success: true,
        message: 'Subscriptions retrieved successfully',
        data: subscriptions,
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

  getSubscriptionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          s.*,
          t.tenant_name,
          t.tenant_code
        FROM subscriptions s
        LEFT JOIN tenants t ON s.tenant_id = t.id
        WHERE s.id = $1 AND s.deleted_at IS NULL
      `;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Subscription not found', 404);
      }

      const subscription = result.rows[0];

      res.status(200).json({
        success: true,
        message: 'Subscription retrieved successfully',
        data: subscription,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  createSubscription = asyncHandler(async (req: Request, res: Response) => {
    const {
      tenant_id,
      plan_code,
      plan_name,
      billing_cycle = 'monthly',
      amount,
      currency = 'USD',
      start_date,
      end_date,
    } = req.body;

    if (!tenant_id || !plan_code || !plan_name || !amount) {
      throw new AppError('Missing required fields', 400);
    }

    const client = await pool.connect();
    try {
      const subscription_code = `SUB-${uuidv4().split('-')[0].toUpperCase()}`;
      const now = new Date();
      const subscription_start = start_date ? new Date(start_date) : now;
      let subscription_end = end_date ? new Date(end_date) : new Date(subscription_start);
      
      if (!end_date) {
        if (billing_cycle === 'monthly') {
          subscription_end.setMonth(subscription_end.getMonth() + 1);
        } else if (billing_cycle === 'quarterly') {
          subscription_end.setMonth(subscription_end.getMonth() + 3);
        } else if (billing_cycle === 'yearly') {
          subscription_end.setFullYear(subscription_end.getFullYear() + 1);
        }
      }

      const query = `
        INSERT INTO subscriptions (
          id, subscription_code, tenant_id, plan_code, plan_name, billing_cycle,
          amount, currency, status, start_date, end_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const values = [
        uuidv4(),
        subscription_code,
        tenant_id,
        plan_code,
        plan_name,
        billing_cycle,
        amount,
        currency,
        'active',
        subscription_start,
        subscription_end,
      ];

      const result = await client.query(query, values);
      const subscription = result.rows[0];

      logger.info('Subscription created successfully', { subscriptionId: subscription.id, tenant_id });

      res.status(201).json({
        success: true,
        message: 'Subscription created successfully',
        data: subscription,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateSubscription = asyncHandler(async (req: Request, res: Response) => {
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
        UPDATE subscriptions
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new AppError('Subscription not found', 404);
      }

      const subscription = result.rows[0];

      logger.info('Subscription updated successfully', { subscriptionId: id });

      res.status(200).json({
        success: true,
        message: 'Subscription updated successfully',
        data: subscription,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  upgradeSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { plan_id, plan_code, plan_name, amount } = req.body;

    const client = await pool.connect();
    try {
      const query = `
        UPDATE subscriptions
        SET 
          plan_code = $2,
          plan_name = $3,
          amount = $4,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id, plan_code, plan_name, amount]);

      if (result.rows.length === 0) {
        throw new AppError('Subscription not found', 404);
      }

      const subscription = result.rows[0];

      logger.info('Subscription upgraded successfully', { subscriptionId: id });

      res.status(200).json({
        success: true,
        message: 'Subscription upgraded successfully',
        data: subscription,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  suspendSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        UPDATE subscriptions
        SET status = 'suspended', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Subscription not found', 404);
      }

      const subscription = result.rows[0];

      logger.info('Subscription suspended successfully', { subscriptionId: id });

      res.status(200).json({
        success: true,
        message: 'Subscription suspended successfully',
        data: subscription,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  activateSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        UPDATE subscriptions
        SET status = 'active', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Subscription not found', 404);
      }

      const subscription = result.rows[0];

      logger.info('Subscription activated successfully', { subscriptionId: id });

      res.status(200).json({
        success: true,
        message: 'Subscription activated successfully',
        data: subscription,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const query = `
        UPDATE subscriptions
        SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new AppError('Subscription not found', 404);
      }

      const subscription = result.rows[0];

      logger.info('Subscription cancelled successfully', { subscriptionId: id });

      res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully',
        data: subscription,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  renewSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
      const getCurrent = await client.query('SELECT * FROM subscriptions WHERE id = $1 AND deleted_at IS NULL', [id]);
      if (getCurrent.rows.length === 0) {
        throw new AppError('Subscription not found', 404);
      }
      const current = getCurrent.rows[0];

      let newEndDate = new Date(current.end_date);
      if (current.billing_cycle === 'monthly') {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      } else if (current.billing_cycle === 'quarterly') {
        newEndDate.setMonth(newEndDate.getMonth() + 3);
      } else if (current.billing_cycle === 'yearly') {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      }

      const query = `
        UPDATE subscriptions
        SET 
          status = 'active',
          end_date = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await client.query(query, [id, newEndDate]);

      const subscription = result.rows[0];

      logger.info('Subscription renewed successfully', { subscriptionId: id });

      res.status(200).json({
        success: true,
        message: 'Subscription renewed successfully',
        data: subscription,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const subscriptionController = new SubscriptionController();
