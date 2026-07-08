import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class CommunicationTemplateController {
    getAllCommunicationTemplates = asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM communication_templates 
                 WHERE tenant_id = $1 AND is_active = true 
                 ORDER BY template_name ASC`,
                [tenantId]
            );
            
            res.status(200).json({
                success: true,
                message: 'Communication templates retrieved successfully',
                data: result.rows
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    getCommunicationTemplateById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM communication_templates 
                 WHERE id = $1 AND tenant_id = $2 AND is_active = true`,
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Communication template not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Communication template retrieved successfully',
                data: result.rows[0]
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    createCommunicationTemplate = asyncHandler(async (req: Request, res: Response) => {
        const {
            template_code,
            template_name,
            description,
            channel,
            subject,
            content,
            template_variables
        } = req.body;
        
        const tenantId = req.user?.tenantId;
        
        if (!template_code || !template_name || !channel || !content) {
            throw new AppError('Template code, name, channel, and content are required', 400);
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const result = await client.query(
                `INSERT INTO communication_templates (
                    id, tenant_id, template_code, template_name, description, 
                    channel, subject, content, template_variables, is_active
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 RETURNING *`,
                [
                    uuidv4(),
                    tenantId,
                    template_code,
                    template_name,
                    description,
                    channel,
                    subject,
                    content,
                    template_variables || '[]',
                    true
                ]
            );
            
            await client.query('COMMIT');
            
            logger.info('Communication template created successfully', {
                templateId: result.rows[0].id,
                templateCode: template_code
            });
            
            res.status(201).json({
                success: true,
                message: 'Communication template created successfully',
                data: result.rows[0]
            } as ApiResponse);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    });

    updateCommunicationTemplate = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        const {
            template_name,
            description,
            subject,
            content,
            template_variables,
            is_active
        } = req.body;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM communication_templates WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Communication template not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot modify system communication templates', 403);
            }
            
            const fields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;
            
            if (template_name !== undefined) {
                fields.push(`template_name = $${paramIndex++}`);
                values.push(template_name);
            }
            if (description !== undefined) {
                fields.push(`description = $${paramIndex++}`);
                values.push(description);
            }
            if (subject !== undefined) {
                fields.push(`subject = $${paramIndex++}`);
                values.push(subject);
            }
            if (content !== undefined) {
                fields.push(`content = $${paramIndex++}`);
                values.push(content);
            }
            if (template_variables !== undefined) {
                fields.push(`template_variables = $${paramIndex++}`);
                values.push(template_variables);
            }
            if (is_active !== undefined) {
                fields.push(`is_active = $${paramIndex++}`);
                values.push(is_active);
            }
            
            if (fields.length > 0) {
                fields.push(`updated_at = CURRENT_TIMESTAMP`);
                values.push(id);
                
                const result = await client.query(
                    `UPDATE communication_templates 
                     SET ${fields.join(', ')} 
                     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
                     RETURNING *`,
                    [...values, tenantId]
                );
                
                logger.info('Communication template updated successfully', { templateId: id });
                
                res.status(200).json({
                    success: true,
                    message: 'Communication template updated successfully',
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

    deleteCommunicationTemplate = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM communication_templates WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Communication template not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot delete system communication templates', 403);
            }
            
            await client.query(
                'UPDATE communication_templates SET is_active = false WHERE id = $1',
                [id]
            );
            
            logger.info('Communication template deactivated successfully', { templateId: id });
            
            res.status(200).json({
                success: true,
                message: 'Communication template deactivated successfully'
            } as ApiResponse);
        } finally {
            client.release();
        }
    });
}

export const communicationTemplateController = new CommunicationTemplateController();
