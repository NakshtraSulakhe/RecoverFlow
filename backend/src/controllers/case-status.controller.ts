import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class CaseStatusController {
    getAllCaseStatuses = asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM case_statuses 
                 WHERE tenant_id = $1 AND is_active = true 
                 ORDER BY order_index ASC, status_name ASC`,
                [tenantId]
            );
            
            res.status(200).json({
                success: true,
                message: 'Case statuses retrieved successfully',
                data: result.rows
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    getCaseStatusById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM case_statuses 
                 WHERE id = $1 AND tenant_id = $2 AND is_active = true`,
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Case status not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Case status retrieved successfully',
                data: result.rows[0]
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    createCaseStatus = asyncHandler(async (req: Request, res: Response) => {
        const {
            status_code,
            status_name,
            description,
            color,
            icon,
            order_index,
            category
        } = req.body;
        
        const tenantId = req.user?.tenantId;
        
        if (!status_code || !status_name) {
            throw new AppError('Status code and name are required', 400);
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const result = await client.query(
                `INSERT INTO case_statuses (
                    id, tenant_id, status_code, status_name, description, 
                    color, icon, order_index, category, is_active
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 RETURNING *`,
                [
                    uuidv4(),
                    tenantId,
                    status_code,
                    status_name,
                    description,
                    color || '#6366F1',
                    icon,
                    order_index || 0,
                    category,
                    true
                ]
            );
            
            await client.query('COMMIT');
            
            logger.info('Case status created successfully', {
                statusId: result.rows[0].id,
                statusCode: status_code
            });
            
            res.status(201).json({
                success: true,
                message: 'Case status created successfully',
                data: result.rows[0]
            } as ApiResponse);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    });

    updateCaseStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        const {
            status_name,
            description,
            color,
            icon,
            order_index,
            category,
            is_active
        } = req.body;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM case_statuses WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Case status not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot modify system case statuses', 403);
            }
            
            const fields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;
            
            if (status_name !== undefined) {
                fields.push(`status_name = $${paramIndex++}`);
                values.push(status_name);
            }
            if (description !== undefined) {
                fields.push(`description = $${paramIndex++}`);
                values.push(description);
            }
            if (color !== undefined) {
                fields.push(`color = $${paramIndex++}`);
                values.push(color);
            }
            if (icon !== undefined) {
                fields.push(`icon = $${paramIndex++}`);
                values.push(icon);
            }
            if (order_index !== undefined) {
                fields.push(`order_index = $${paramIndex++}`);
                values.push(order_index);
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
                    `UPDATE case_statuses 
                     SET ${fields.join(', ')} 
                     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
                     RETURNING *`,
                    [...values, tenantId]
                );
                
                logger.info('Case status updated successfully', { statusId: id });
                
                res.status(200).json({
                    success: true,
                    message: 'Case status updated successfully',
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

    deleteCaseStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM case_statuses WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Case status not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot delete system case statuses', 403);
            }
            
            await client.query(
                'UPDATE case_statuses SET is_active = false WHERE id = $1',
                [id]
            );
            
            logger.info('Case status deactivated successfully', { statusId: id });
            
            res.status(200).json({
                success: true,
                message: 'Case status deactivated successfully'
            } as ApiResponse);
        } finally {
            client.release();
        }
    });
}

export const caseStatusController = new CaseStatusController();
