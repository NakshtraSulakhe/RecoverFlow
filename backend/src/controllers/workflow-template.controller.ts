import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

const getTenantId = (req: Request) => req.tenantId || req.user?.tenantId || req.user?.tenant_id;
const getUserType = (req: Request) => req.userType || req.user?.user_type || req.user?.userType;
const asArray = (value: any): any[] => Array.isArray(value) ? value : [];
const firstValue = (...values: any[]) => values.find(value => value !== undefined && value !== null && value !== '');

async function syncWorkflowStages(client: any, workflowTemplateId: string, stages: any[]) {
  for (const stage of stages) {
    const stageCode = firstValue(stage.code, stage.stage_code, stage.stageCode);
    const stageName = firstValue(stage.name, stage.stage_name, stage.stageName);
    if (!stageCode || !stageName) continue;

    await client.query(
      `INSERT INTO workflow_stages (
        id, workflow_template_id, stage_code, stage_name, description, order_index,
        color, icon, is_initial, is_final, allowed_next_stage_ids,
        auto_actions, permissions, sla_hours, notifications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, '{}', $11, $12, $13, $14)
      ON CONFLICT (workflow_template_id, stage_code) DO UPDATE SET
        stage_name = EXCLUDED.stage_name,
        description = EXCLUDED.description,
        order_index = EXCLUDED.order_index,
        color = EXCLUDED.color,
        icon = EXCLUDED.icon,
        is_initial = EXCLUDED.is_initial,
        is_final = EXCLUDED.is_final,
        auto_actions = EXCLUDED.auto_actions,
        permissions = EXCLUDED.permissions,
        sla_hours = EXCLUDED.sla_hours,
        notifications = EXCLUDED.notifications,
        updated_at = CURRENT_TIMESTAMP`,
      [
        uuidv4(), workflowTemplateId, stageCode, stageName, stage.description || null,
        firstValue(stage.order, stage.order_index, stage.orderIndex, 0),
        stage.color || '#6366F1', stage.icon || null,
        !!firstValue(stage.is_initial, stage.isInitial, false),
        !!firstValue(stage.is_final, stage.isFinal, false),
        stage.auto_actions || stage.autoActions || [],
        stage.permissions || {},
        firstValue(stage.sla_hours, stage.slaHours, null),
        stage.notifications || [],
      ]
    );
  }
}

class WorkflowTemplateController {
  getAllWorkflowTemplates = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT wt.*,
          COALESCE(json_agg(ws.* ORDER BY ws.order_index ASC) FILTER (WHERE ws.id IS NOT NULL), '[]') AS stage_rows
         FROM workflow_templates wt
         LEFT JOIN workflow_stages ws ON ws.workflow_template_id = wt.id
         WHERE (wt.tenant_id IS NULL OR wt.tenant_id = $1)
         AND wt.is_active = true
         GROUP BY wt.id
         ORDER BY wt.is_system_template DESC, wt.template_name ASC`,
        [tenantId]
      );

      const data = result.rows.map(row => ({
        ...row,
        stages: Array.isArray(row.stages) && row.stages.length > 0 ? row.stages : row.stage_rows,
      }));

      res.status(200).json({ success: true, message: 'Workflow templates retrieved successfully', data } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getWorkflowTemplateById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = getTenantId(req);
    const client = await pool.connect();
    try {
      const templateResult = await client.query(
        `SELECT * FROM workflow_templates WHERE id = $1 AND (tenant_id IS NULL OR tenant_id = $2) AND is_active = true`,
        [id, tenantId]
      );
      if (templateResult.rows.length === 0) throw new AppError('Workflow template not found', 404);

      const stagesResult = await client.query(`SELECT * FROM workflow_stages WHERE workflow_template_id = $1 ORDER BY order_index ASC`, [id]);
      const template = templateResult.rows[0];
      template.stages = Array.isArray(template.stages) && template.stages.length > 0 ? template.stages : stagesResult.rows;

      res.status(200).json({ success: true, message: 'Workflow template retrieved successfully', data: template } as ApiResponse);
    } finally {
      client.release();
    }
  });

  createWorkflowTemplate = asyncHandler(async (req: Request, res: Response) => {
    const templateCode = firstValue(req.body.template_code, req.body.templateCode);
    const templateName = firstValue(req.body.template_name, req.body.templateName);
    const stages = asArray(req.body.stages);
    const tenantId = getUserType(req) === 'platform_owner' ? null : getTenantId(req);

    if (!templateCode || !templateName) throw new AppError('Template code and name are required', 400);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const templateId = uuidv4();
      const result = await client.query(
        `INSERT INTO workflow_templates (
          id, tenant_id, template_code, template_name, description, industry_code,
          is_system_template, is_active, stages, transitions, sla_config
        ) VALUES ($1, $2, $3, $4, $5, $6, false, true, $7, $8, $9)
        RETURNING *`,
        [templateId, tenantId, templateCode, templateName, req.body.description, firstValue(req.body.industry_code, req.body.industryCode, null), stages, req.body.transitions || [], firstValue(req.body.sla_config, req.body.slaConfig, {})]
      );

      await syncWorkflowStages(client, templateId, stages);
      await client.query('COMMIT');

      logger.info('Workflow template created successfully', { templateId, templateCode });
      res.status(201).json({ success: true, message: 'Workflow template created successfully', data: result.rows[0] } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  updateWorkflowTemplate = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = getTenantId(req);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const existingResult = await client.query('SELECT * FROM workflow_templates WHERE id = $1', [id]);
      if (existingResult.rows.length === 0) throw new AppError('Workflow template not found', 404);
      const existingTemplate = existingResult.rows[0];
      if (existingTemplate.is_system_template && getUserType(req) !== 'platform_owner') throw new AppError('Cannot modify system workflow templates', 403);
      if (existingTemplate.tenant_id && existingTemplate.tenant_id !== tenantId) throw new AppError('Workflow template not found', 404);

      const fieldMap: Record<string, string> = {
        template_name: 'template_name', templateName: 'template_name', description: 'description',
        industry_code: 'industry_code', industryCode: 'industry_code', stages: 'stages', transitions: 'transitions',
        sla_config: 'sla_config', slaConfig: 'sla_config', is_active: 'is_active', isActive: 'is_active',
      };
      const fields: string[] = [];
      const values: any[] = [];
      const seen = new Set<string>();
      let paramIndex = 1;

      for (const [incoming, column] of Object.entries(fieldMap)) {
        if (req.body[incoming] !== undefined && !seen.has(column)) {
          fields.push(`${column} = $${paramIndex++}`);
          values.push(req.body[incoming]);
          seen.add(column);
        }
      }

      let updated = existingTemplate;
      if (fields.length > 0) {
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const result = await client.query(`UPDATE workflow_templates SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`, values);
        updated = result.rows[0];
      }

      if (req.body.stages !== undefined) await syncWorkflowStages(client, id, asArray(req.body.stages));

      await client.query('COMMIT');
      res.status(200).json({ success: true, message: 'Workflow template updated successfully', data: updated } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  applyWorkflowTemplate = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = getTenantId(req);
    if (!tenantId) throw new AppError('Tenant ID is required', 400);
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO organization_configuration (id, tenant_id, applied_workflow_template_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (tenant_id) DO UPDATE SET applied_workflow_template_id = EXCLUDED.applied_workflow_template_id, updated_at = CURRENT_TIMESTAMP`,
        [uuidv4(), tenantId, id]
      );
      await client.query('UPDATE tenants SET workflow_template_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [id, tenantId]);
      res.status(200).json({ success: true, message: 'Workflow template applied successfully' } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteWorkflowTemplate = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = getTenantId(req);
    const client = await pool.connect();
    try {
      const existingResult = await client.query('SELECT * FROM workflow_templates WHERE id = $1', [id]);
      if (existingResult.rows.length === 0) throw new AppError('Workflow template not found', 404);
      const existingTemplate = existingResult.rows[0];
      if (existingTemplate.is_system_template) throw new AppError('Cannot delete system workflow templates', 403);
      if (existingTemplate.tenant_id && existingTemplate.tenant_id !== tenantId) throw new AppError('Workflow template not found', 404);
      await client.query('DELETE FROM workflow_templates WHERE id = $1', [id]);
      res.status(200).json({ success: true, message: 'Workflow template deleted successfully' } as ApiResponse);
    } finally {
      client.release();
    }
  });
}

export const workflowTemplateController = new WorkflowTemplateController();
