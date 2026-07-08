import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class ActivityTypeController {
    getAllActivityTypes = asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM activity_types 
                 WHERE tenant_id = $1 AND is_active = true 
                 ORDER BY activity_name ASC`,
                [tenantId]
            );
            
            res.status(200).json({
                success: true,
                message: 'Activity types retrieved successfully',
                data: result.rows
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    getActivityTypeById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM activity_types 
                 WHERE id = $1 AND tenant_id = $2 AND is_active = true`,
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Activity type not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Activity type retrieved successfully',
                data: result.rows[0]
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    createActivityType = asyncHandler(async (req: Request, res: Response) => {
        const {
            activity_code,
            activity_name,
            description,
            icon,
            category
        } = req.body;
        
        const tenantId = req.user?.tenantId;
        
        if (!activity_code || !activity_name) {
            throw new AppError('Activity code and name are required', 400);
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const result = await client.query(
                `INSERT INTO activity_types (
                    id, tenant_id, activity_code, activity_name, description, 
                    icon, category, is_active
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING *`,
                [
                    uuidv4(),
                    tenantId,
                    activity_code,
                    activity_name,
                    description,
                    icon,
                    category,
                    true
                ]
            );
            
            await client.query('COMMIT');
            
            logger.info('Activity type created successfully', {
                activityId: result.rows[0].id,
                activityCode: activity_code
            });
            
            res.status(201).json({
                success: true,
                message: 'Activity type created successfully',
                data: result.rows[0]
            } as ApiResponse);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    });

    updateActivityType = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        const {
            activity_name,
            description,
            icon,
            category,
            is_active
        } = req.body;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM activity_types WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Activity type not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot modify system activity types', 403);
            }
            
            const fields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;
            
            if (activity_name !== undefined) {
                fields.push(`activity_name = $${paramIndex++}`);
                values.push(activity_name);
            }
            if (description !== undefined) {
                fields.push(`description = $${paramIndex++}`);
                values.push(description);
            }
            if (icon !== undefined) {
                fields.push(`icon = $${paramIndex++}`);
                values.push(icon);
            }
            if (category !== undefined) {
                fields.push(`category = $${paramIndex++}`);
                values.push(category);
            }
            if (is_active !== undefined) {
                fields.push(`is_active = $${paramIndex++}`);
                values.push(is_active);
            }
            
            if (fields.length > 0) {
                fields.push(`updated_at = CURRENT_TIMESTAMP`);
                values.push(id);
                
                const result = await client.query(
                    `UPDATE activity_types 
                     SET ${fields.join(', ')} 
                     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
                     RETURNING *`,
                    [...values, tenantId]
                );
                
                logger.info('Activity type updated successfully', { activityId: id });
                
                res.status(200).json({
                    success: true,
                    message: 'Activity type updated successfully',
                    data: result.rows[0]
                } as ApiResponse);
            } else {
                res.status(200).json({
                    success: true,
                    message: 'No changes made',
                    data: existingResult.rows[0]
                } as ApiResponse);
            }
        } finally {
            client.release();
        }
    });

    deleteActivityType = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM activity_types WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Activity type not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot delete system activity types', 403);
            }
            
            await client.query(
                'UPDATE activity_types SET is_active = false WHERE id = $1',
                [id]
            );
            
            logger.info('Activity type deactivated successfully', { activityId: id });
            
            res.status(200).json({
                success: true,
                message: 'Activity type deactivated successfully'
            } as ApiResponse);
        } finally {
            client.release();
        }
    });
}

export const activityTypeController = new ActivityTypeController();
