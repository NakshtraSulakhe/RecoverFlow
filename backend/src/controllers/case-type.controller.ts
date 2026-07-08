import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class CaseTypeController {
    getAllCaseTypes = asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM case_types 
                 WHERE tenant_id = $1 AND is_active = true 
                 ORDER BY case_type_name ASC`,
                [tenantId]
            );
            
            res.status(200).json({
                success: true,
                message: 'Case types retrieved successfully',
                data: result.rows
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    getCaseTypeById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM case_types 
                 WHERE id = $1 AND tenant_id = $2 AND is_active = true`,
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Case type not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Case type retrieved successfully',
                data: result.rows[0]
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    createCaseType = asyncHandler(async (req: Request, res: Response) => {
        const {
            case_type_code,
            case_type_name,
            description,
            icon,
            color,
            workflow_template_id,
            assignment_rule_id,
            priority_rule_id,
            default_status_id,
            required_documents,
            communication_templates,
            sla_config,
            custom_fields
        } = req.body;
        
        const tenantId = req.user?.tenantId;
        
        if (!case_type_code || !case_type_name) {
            throw new AppError('Case type code and name are required', 400);
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const result = await client.query(
                `INSERT INTO case_types (
                    id, tenant_id, case_type_code, case_type_name, description, 
                    icon, color, workflow_template_id, assignment_rule_id, 
                    priority_rule_id, default_status_id, required_documents, 
                    communication_templates, sla_config, custom_fields, is_active
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                 RETURNING *`,
                [
                    uuidv4(),
                    tenantId,
                    case_type_code,
                    case_type_name,
                    description,
                    icon,
                    color || '#6366F1',
                    workflow_template_id,
                    assignment_rule_id,
                    priority_rule_id,
                    default_status_id,
                    required_documents || '[]',
                    communication_templates || '[]',
                    sla_config || '{}',
                    custom_fields || '[]',
                    true
                ]
            );
            
            await client.query('COMMIT');
            
            logger.info('Case type created successfully', {
                caseTypeId: result.rows[0].id,
                caseTypeCode: case_type_code
            });
            
            res.status(201).json({
                success: true,
                message: 'Case type created successfully',
                data: result.rows[0]
            } as ApiResponse);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    });

    updateCaseType = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        const {
            case_type_name,
            description,
            icon,
            color,
            workflow_template_id,
            assignment_rule_id,
            priority_rule_id,
            default_status_id,
            required_documents,
            communication_templates,
            sla_config,
            custom_fields,
            is_active
        } = req.body;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM case_types WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Case type not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot modify system case types', 403);
            }
            
            const fields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;
            
            if (case_type_name !== undefined) {
                fields.push(`case_type_name = $${paramIndex++}`);
                values.push(case_type_name);
            }
            if (description !== undefined) {
                fields.push(`description = $${paramIndex++}`);
                values.push(description);
            }
            if (icon !== undefined) {
                fields.push(`icon = $${paramIndex++}`);
                values.push(icon);
            }
            if (color !== undefined) {
                fields.push(`color = $${paramIndex++}`);
                values.push(color);
            }
            if (workflow_template_id !== undefined) {
                fields.push(`workflow_template_id = $${paramIndex++}`);
                values.push(workflow_template_id);
            }
            if (assignment_rule_id !== undefined) {
                fields.push(`assignment_rule_id = $${paramIndex++}`);
                values.push(assignment_rule_id);
            }
            if (priority_rule_id !== undefined) {
                fields.push(`priority_rule_id = $${paramIndex++}`);
                values.push(priority_rule_id);
            }
            if (default_status_id !== undefined) {
                fields.push(`default_status_id = $${paramIndex++}`);
                values.push(default_status_id);
            }
            if (required_documents !== undefined) {
                fields.push(`required_documents = $${paramIndex++}`);
                values.push(required_documents);
            }
            if (communication_templates !== undefined) {
                fields.push(`communication_templates = $${paramIndex++}`);
                values.push(communication_templates);
            }
            if (sla_config !== undefined) {
                fields.push(`sla_config = $${paramIndex++}`);
                values.push(sla_config);
            }
            if (custom_fields !== undefined) {
                fields.push(`custom_fields = $${paramIndex++}`);
                values.push(custom_fields);
            }
            if (is_active !== undefined) {
                fields.push(`is_active = $${paramIndex++}`);
                values.push(is_active);
            }
            
            if (fields.length > 0) {
                fields.push(`updated_at = CURRENT_TIMESTAMP`);
                values.push(id);
                
                const result = await client.query(
                    `UPDATE case_types 
                     SET ${fields.join(', ')} 
                     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
                     RETURNING *`,
                    [...values, tenantId]
                );
                
                logger.info('Case type updated successfully', { caseTypeId: id });
                
                res.status(200).json({
                    success: true,
                    message: 'Case type updated successfully',
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

    deleteCaseType = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.user?.tenantId;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM case_types WHERE id = $1 AND tenant_id = $2',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Case type not found', 404);
            }
            
            if (existingResult.rows[0].is_system) {
                throw new AppError('Cannot delete system case types', 403);
            }
            
            await client.query(
                'UPDATE case_types SET is_active = false WHERE id = $1',
                [id]
            );
            
            logger.info('Case type deactivated successfully', { caseTypeId: id });
            
            res.status(200).json({
                success: true,
                message: 'Case type deactivated successfully'
            } as ApiResponse);
        } finally {
            client.release();
        }
    });
}

export const caseTypeController = new CaseTypeController();
