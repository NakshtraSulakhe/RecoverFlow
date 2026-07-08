import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

class BusinessUnitController {
    // Get all business units for tenant (tree structure)
    getAllBusinessUnits = asyncHandler(async (req: Request, res: Response) => {
        const tenantId = req.tenantId || req.user?.tenantId || req.user?.tenant_id;
        if (!tenantId) {
            throw new AppError('Tenant ID is required', 400);
        }
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM business_units 
                 WHERE tenant_id = $1 
                 AND deleted_at IS NULL 
                 ORDER BY parent_id NULLS FIRST, business_unit_name ASC`,
                [tenantId]
            );
            
            // Convert flat list to tree structure
            const buildTree = (units: any[], parentId: string | null = null): any[] => {
                return units
                    .filter(unit => unit.parent_id === parentId)
                    .map(unit => ({
                        ...unit,
                        children: buildTree(units, unit.id)
                    }));
            };
            
            const tree = buildTree(result.rows);
            
            res.status(200).json({
                success: true,
                message: 'Business units retrieved successfully',
                data: tree
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    // Get business unit by ID
    getBusinessUnitById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.tenantId || req.user?.tenantId || req.user?.tenant_id;
        if (!tenantId) {
            throw new AppError('Tenant ID is required', 400);
        }
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT * FROM business_units WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL',
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Business unit not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Business unit retrieved successfully',
                data: result.rows[0]
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    // Create business unit
    createBusinessUnit = asyncHandler(async (req: Request, res: Response) => {
        const {
            business_unit_code,
            business_unit_name,
            business_unit_type,
            description,
            parent_id,
            manager_id,
            address,
            city,
            state,
            country,
            postal_code
        } = req.body;
        
        const tenantId = req.tenantId || req.user?.tenantId || req.user?.tenant_id;
        if (!tenantId) {
            throw new AppError('Tenant ID is required', 400);
        }
        
        if (!business_unit_code || !business_unit_name) {
            throw new AppError('Business unit code and name are required', 400);
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Check if code already exists
            const existingResult = await client.query(
                'SELECT id FROM business_units WHERE tenant_id = $1 AND business_unit_code = $2 AND deleted_at IS NULL',
                [tenantId, business_unit_code]
            );
            
            if (existingResult.rows.length > 0) {
                throw new AppError('Business unit code already exists', 400);
            }
            
            const result = await client.query(
                `INSERT INTO business_units (
                    id, tenant_id, business_unit_code, business_unit_name, business_unit_type,
                    description, parent_id, manager_id, address, city, state, country, postal_code
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                 RETURNING *`,
                [
                    uuidv4(),
                    tenantId,
                    business_unit_code,
                    business_unit_name,
                    business_unit_type || 'DEPARTMENT',
                    description,
                    parent_id || null,
                    manager_id || null,
                    address,
                    city,
                    state,
                    country,
                    postal_code
                ]
            );
            
            await client.query('COMMIT');
            
            logger.info('Business unit created successfully', { 
                unitId: result.rows[0].id, 
                unitCode: business_unit_code 
            });
            
            res.status(201).json({
                success: true,
                message: 'Business unit created successfully',
                data: result.rows[0]
            } as ApiResponse);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    });

    // Update business unit
    updateBusinessUnit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.tenantId || req.user?.tenantId || req.user?.tenant_id;
        if (!tenantId) {
            throw new AppError('Tenant ID is required', 400);
        }
        const {
            business_unit_name,
            business_unit_type,
            description,
            parent_id,
            manager_id,
            address,
            city,
            state,
            country,
            postal_code,
            is_active
        } = req.body;
        
        const client = await pool.connect();
        try {
            const existingResult = await client.query(
                'SELECT * FROM business_units WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL',
                [id, tenantId]
            );
            
            if (existingResult.rows.length === 0) {
                throw new AppError('Business unit not found', 404);
            }
            
            const fields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;
            
            if (business_unit_name !== undefined) {
                fields.push(`business_unit_name = $${paramIndex++}`);
                values.push(business_unit_name);
            }
            if (business_unit_type !== undefined) {
                fields.push(`business_unit_type = $${paramIndex++}`);
                values.push(business_unit_type);
            }
            if (description !== undefined) {
                fields.push(`description = $${paramIndex++}`);
                values.push(description);
            }
            if (parent_id !== undefined) {
                fields.push(`parent_id = $${paramIndex++}`);
                values.push(parent_id || null);
            }
            if (manager_id !== undefined) {
                fields.push(`manager_id = $${paramIndex++}`);
                values.push(manager_id || null);
            }
            if (address !== undefined) {
                fields.push(`address = $${paramIndex++}`);
                values.push(address);
            }
            if (city !== undefined) {
                fields.push(`city = $${paramIndex++}`);
                values.push(city);
            }
            if (state !== undefined) {
                fields.push(`state = $${paramIndex++}`);
                values.push(state);
            }
            if (country !== undefined) {
                fields.push(`country = $${paramIndex++}`);
                values.push(country);
            }
            if (postal_code !== undefined) {
                fields.push(`postal_code = $${paramIndex++}`);
                values.push(postal_code);
            }
            if (is_active !== undefined) {
                fields.push(`is_active = $${paramIndex++}`);
                values.push(is_active);
            }
            
            if (fields.length > 0) {
                fields.push(`updated_at = CURRENT_TIMESTAMP`);
                values.push(id);
                values.push(tenantId);
                
                const result = await client.query(
                    `UPDATE business_units 
                     SET ${fields.join(', ')} 
                     WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1}
                     RETURNING *`,
                    values
                );
                
                logger.info('Business unit updated successfully', { unitId: id });
                
                res.status(200).json({
                    success: true,
                    message: 'Business unit updated successfully',
                    data: result.rows[0]
                } as ApiResponse);
            } else {
                // No updates, just return existing
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

    // Soft delete business unit
    deleteBusinessUnit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.tenantId || req.user?.tenantId || req.user?.tenant_id;
        if (!tenantId) {
            throw new AppError('Tenant ID is required', 400);
        }
        
        const client = await pool.connect();
        try {
            const result = await client.query(
                `UPDATE business_units 
                 SET deleted_at = CURRENT_TIMESTAMP, is_active = false
                 WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
                 RETURNING *`,
                [id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Business unit not found', 404);
            }
            
            logger.info('Business unit deleted successfully', { unitId: id });
            
            res.status(200).json({
                success: true,
                message: 'Business unit deleted successfully'
            } as ApiResponse);
        } finally {
            client.release();
        }
    });

    // Move business unit in hierarchy
    moveBusinessUnit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { new_parent_id } = req.body;
        const tenantId = req.tenantId || req.user?.tenantId || req.user?.tenant_id;
        if (!tenantId) {
            throw new AppError('Tenant ID is required', 400);
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Check if new parent exists and is valid
            if (new_parent_id) {
                const parentResult = await client.query(
                    'SELECT id FROM business_units WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL',
                    [new_parent_id, tenantId]
                );
                
                if (parentResult.rows.length === 0) {
                    throw new AppError('Invalid parent business unit', 400);
                }
                
                // Prevent circular reference
                let currentParentId: string | null = new_parent_id;
                let depth = 0;
                const maxDepth = 100; // Prevent infinite loops
                
                while (currentParentId && depth < maxDepth) {
                    if (currentParentId === id) {
                        throw new AppError('Cannot move unit under itself', 400);
                    }
                    
                    const parentCheck = await client.query(
                        'SELECT parent_id FROM business_units WHERE id = $1',
                        [currentParentId]
                    );
                    
                    currentParentId = parentCheck.rows[0]?.parent_id || null;
                    depth++;
                }
            }
            
            const result = await client.query(
                `UPDATE business_units 
                 SET parent_id = $1, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2 AND tenant_id = $3 AND deleted_at IS NULL
                 RETURNING *`,
                [new_parent_id || null, id, tenantId]
            );
            
            if (result.rows.length === 0) {
                throw new AppError('Business unit not found', 404);
            }
            
            await client.query('COMMIT');
            
            logger.info('Business unit moved successfully', { 
                unitId: id, 
                newParentId: new_parent_id 
            });
            
            res.status(200).json({
                success: true,
                message: 'Business unit moved successfully',
                data: result.rows[0]
            } as ApiResponse);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    });
}

export const businessUnitController = new BusinessUnitController();
