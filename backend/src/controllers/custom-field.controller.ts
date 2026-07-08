import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class CustomFieldController {
    getAllCustomFields = asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM custom_fields 
                 WHERE tenant_id = $1 AND is_active = true 
                 ORDER BY field_name ASC`,
                [tenantId]
            );
            
            res.status(200).json({
                success: true,
                message: 'Custom fields retrieved successfully',
                data: result.rows
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    getCustomFieldById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM custom_fields 
                 WHERE id = $1 AND tenant_id = $2 AND is_active = true`,
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Custom field not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Custom field retrieved successfully',
                data: result.rows[0]
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    createCustomField = asyncHandler(async (req: Request, res: Response) => {
        const {
            field_code,
            field_name,
            description,
            field_type,
            is_required,
            field_config
        } = req.body;
        
        const tenantId = req.user?.tenantId;
        
        if (!field_code || !field_name || !field_type) {
            throw new AppError('Field code, name, and type are required', 400);
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const result = await client.query(
                `INSERT INTO custom_fields (
                    id, tenant_id, field_code, field_name, description, 
                    field_type, is_required, field_config, is_active
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING *`,
                [
                    uuidv4(),
                    tenantId,
                    field_code,
                    field_name,
                    description,
                    field_type,
                    is_required || false,
                    field_config || '{}',
                    true
                ]
            );
            
            await client.query('COMMIT');
            
            logger.info('Custom field created successfully', {
                fieldId: result.rows[0].id,
                fieldCode: field_code
            });
            
            res.status(201).json({
                success: true,
                message: 'Custom field created successfully',
                data: result.rows[0]
            } as ApiResponse);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    });

    updateCustomField = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        const {
            field_name,
            description,
            is_required,
            field_config,
            is_active
        } = req.body;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM custom_fields WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Custom field not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot modify system custom fields', 403);
            }
            
            const fields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;
            
            if (field_name !== undefined) {
                fields.push(`field_name = $${paramIndex++}`);
                values.push(field_name);
            }
            if (description !== undefined) {
                fields.push(`description = $${paramIndex++}`);
                values.push(description);
            }
            if (is_required !== undefined) {
                fields.push(`is_required = $${paramIndex++}`);
                values.push(is_required);
            }
            if (field_config !== undefined) {
                fields.push(`field_config = $${paramIndex++}`);
                values.push(field_config);
            }
            if (is_active !== undefined) {
                fields.push(`is_active = $${paramIndex++}`);
                values.push(is_active);
            }
            
            if (fields.length > 0) {
                fields.push(`updated_at = CURRENT_TIMESTAMP`);
                values.push(id);
                
                const result = await client.query(
                    `UPDATE custom_fields 
                     SET ${fields.join(', ')} 
                     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
                     RETURNING *`,
                    [...values, tenantId]
                );
                
                logger.info('Custom field updated successfully', { fieldId: id });
                
                res.status(200).json({
                    success: true,
                    message: 'Custom field updated successfully',
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

    deleteCustomField = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM custom_fields WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Custom field not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot delete system custom fields', 403);
            }
            
            await client.query(
                'UPDATE custom_fields SET is_active = false WHERE id = $1',
                [id]
            );
            
            logger.info('Custom field deactivated successfully', { fieldId: id });
            
            res.status(200).json({
                success: true,
                message: 'Custom field deactivated successfully'
            } as ApiResponse);
        } finally {
            client.release();
        }
    });
}

export const customFieldController = new CustomFieldController();
