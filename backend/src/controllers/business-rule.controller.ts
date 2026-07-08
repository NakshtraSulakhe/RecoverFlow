import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class BusinessRuleController {
    // Get all business rules for tenant
    getAllBusinessRules = asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM business_rules 
                 WHERE tenant_id = $1 
                 AND is_active = true 
                 ORDER BY rule_type ASC, priority DESC`,
                [tenantId]
            );
            
            res.status(200).json({
                success: true,
                message: 'Business rules retrieved successfully',
                data: result.rows
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    // Get business rule by ID
    getBusinessRuleById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM business_rules 
                 WHERE id = $1 
                 AND tenant_id = $2 
                 AND is_active = true`,
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Business rule not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Business rule retrieved successfully',
                data: result.rows[0]
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    // Create business rule
    createBusinessRule = asyncHandler(async (req: Request, res: Response) => {
        const {
            rule_code,
            rule_name,
            rule_type,
            description,
            conditions,
            actions,
            priority,
            is_active
        } = req.body;
        
        const tenantId = req.user?.tenantId;
        
        if (!rule_code || !rule_name || !rule_type) {
            throw new AppError('Rule code, name, and type are required', 400);
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const result = await client.query(
                `INSERT INTO business_rules (
                    id, tenant_id, rule_code, rule_name, rule_type, description,
                    conditions, actions, priority, is_active
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 RETURNING *`,
                [
                    uuidv4(),
                    tenantId,
                    rule_code,
                    rule_name,
                    rule_type,
                    description,
                    conditions || '{}',
                    actions || '[]',
                    priority || 0,
                    is_active !== undefined ? is_active : true
                ]
            );
            
            await client.query('COMMIT');
            
            logger.info('Business rule created successfully', { 
                ruleId: result.rows[0].id, 
                ruleCode: rule_code 
            });
            
            res.status(201).json({
                success: true,
                message: 'Business rule created successfully',
                data: result.rows[0]
            } as ApiResponse);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    });

    // Update business rule
    updateBusinessRule = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        const {
            rule_name,
            description,
            conditions,
            actions,
            priority,
            is_active
        } = req.body;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM business_rules WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Business rule not found', 404);
            }
            
            const existingRule = existingResult.rows[0];
            
            const fields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;
            
            if (rule_name !== undefined) {
                fields.push(`rule_name = $${paramIndex++}`);
                values.push(rule_name);
            }
            if (description !== undefined) {
                fields.push(`description = $${paramIndex++}`);
                values.push(description);
            }
            if (conditions !== undefined) {
                fields.push(`conditions = $${paramIndex++}`);
                values.push(conditions);
            }
            if (actions !== undefined) {
                fields.push(`actions = $${paramIndex++}`);
                values.push(actions);
            }
            if (priority !== undefined) {
                fields.push(`priority = $${paramIndex++}`);
                values.push(priority);
            }
            if (is_active !== undefined) {
                fields.push(`is_active = $${paramIndex++}`);
                values.push(is_active);
            }
            
            if (fields.length > 0) {
                fields.push(`updated_at = CURRENT_TIMESTAMP`);
                values.push(id);
                
                const result = await client.query(
                    `UPDATE business_rules 
                     SET ${fields.join(', ')} 
                     WHERE id = $${paramIndex} 
                     AND tenant_id = $${paramIndex + 1}
                     RETURNING *`,
                    [...values, tenantId]
                );
                
                logger.info('Business rule updated successfully', { ruleId: id });
                
                res.status(200).json({
                    success: true,
                    message: 'Business rule updated successfully',
                    data: result.rows[0]
                } as ApiResponse);
            } else {
                res.status(200).json({
                    success: true,
                    message: 'No changes made',
                    data: existingRule
                } as ApiResponse);
            }
        } finally {
            client.release();
        }
    });

    // Delete business rule
    deleteBusinessRule = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                'DELETE FROM business_rules WHERE id = $1 AND tenant_id = $2 RETURNING *',
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Business rule not found', 404);
            }
            
            logger.info('Business rule deleted successfully', { ruleId: id });
            
            res.status(200).json({
                success: true,
                message: 'Business rule deleted successfully'
            } as ApiResponse);
        } finally {
            client.release();
        }
    });
}

export const businessRuleController = new BusinessRuleController();
