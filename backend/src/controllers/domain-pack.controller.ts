import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

const getTenantId = (req: Request) => req.tenantId || req.user?.tenantId || req.user?.tenant_id;
const getUserType = (req: Request) => req.userType || req.user?.user_type || req.user?.userType;

const asArray = (value: any): any[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const firstValue = (...values: any[]) => values.find(value => value !== undefined && value !== null && value !== '');

class DomainPackController {
  getAllDomainPacks = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM domain_packs
         WHERE (tenant_id IS NULL OR tenant_id = $1)
         AND is_active = true
         ORDER BY is_system_pack DESC, pack_name ASC`,
        [tenantId]
      );

      res.status(200).json({
        success: true,
        message: 'Domain packs retrieved successfully',
        data: result.rows,
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  getDomainPackById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = getTenantId(req);
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM domain_packs
         WHERE id = $1
         AND (tenant_id IS NULL OR tenant_id = $2)
         AND is_active = true`,
        [id, tenantId]
      );

      if (result.rows.length === 0) throw new AppError('Domain pack not found', 404);

      res.status(200).json({
        success: true,
        message: 'Domain pack retrieved successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  createDomainPack = asyncHandler(async (req: Request, res: Response) => {
    const {
      industry_code, pack_code, pack_name, description,
      default_modules, default_business_units, default_workflows, default_roles,
      default_dashboard, default_reports, default_business_rules, default_communication_templates,
    } = req.body;
    const tenantId = getUserType(req) === 'platform_owner' ? null : getTenantId(req);

    if (!pack_code || !pack_name) throw new AppError('Pack code and name are required', 400);

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO domain_packs (
          id, tenant_id, industry_code, pack_code, pack_name, description,
          is_system_pack, is_active, default_modules, default_business_units,
          default_workflows, default_roles, default_dashboard, default_reports,
          default_business_rules, default_communication_templates
        ) VALUES ($1, $2, $3, $4, $5, $6, false, true, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          uuidv4(), tenantId, industry_code, pack_code, pack_name, description,
          default_modules || [], default_business_units || [], default_workflows || [],
          default_roles || [], default_dashboard || [], default_reports || [],
          default_business_rules || [], default_communication_templates || [],
        ]
      );

      logger.info('Custom domain pack created successfully', { packId: result.rows[0].id, packCode: pack_code });

      res.status(201).json({
        success: true,
        message: 'Domain pack created successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateDomainPack = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = getTenantId(req);
    const client = await pool.connect();
    try {
      const existingResult = await client.query('SELECT * FROM domain_packs WHERE id = $1', [id]);
      if (existingResult.rows.length === 0) throw new AppError('Domain pack not found', 404);

      const existingPack = existingResult.rows[0];
      if (existingPack.is_system_pack && getUserType(req) !== 'platform_owner') {
        throw new AppError('Cannot modify system domain packs', 403);
      }
      if (existingPack.tenant_id && existingPack.tenant_id !== tenantId) {
        throw new AppError('Domain pack not found', 404);
      }

      const allowedFields = [
        'industry_code', 'pack_name', 'description', 'default_modules', 'default_business_units',
        'default_workflows', 'default_roles', 'default_dashboard', 'default_reports',
        'default_business_rules', 'default_communication_templates', 'is_active',
      ];
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          fields.push(`${field} = $${paramIndex++}`);
          values.push(req.body[field]);
        }
      }

      if (fields.length === 0) {
        res.status(200).json({ success: true, message: 'No changes made', data: existingPack } as ApiResponse);
        return;
      }

      values.push(id);
      const result = await client.query(
        `UPDATE domain_packs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      res.status(200).json({
        success: true,
        message: 'Domain pack updated successfully',
        data: result.rows[0],
      } as ApiResponse);
    } finally {
      client.release();
    }
  });

  deleteDomainPack = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = getTenantId(req);
    const client = await pool.connect();
    try {
      const existingResult = await client.query('SELECT * FROM domain_packs WHERE id = $1', [id]);
      if (existingResult.rows.length === 0) throw new AppError('Domain pack not found', 404);

      const existingPack = existingResult.rows[0];
      if (existingPack.is_system_pack) throw new AppError('Cannot delete system domain packs', 403);
      if (existingPack.tenant_id && existingPack.tenant_id !== tenantId) throw new AppError('Domain pack not found', 404);

      await client.query('DELETE FROM domain_packs WHERE id = $1', [id]);

      res.status(200).json({ success: true, message: 'Domain pack deleted successfully' } as ApiResponse);
    } finally {
      client.release();
    }
  });

  applyDomainPack = asyncHandler(async (req: Request, res: Response) => {
    const { packId } = req.body;
    const tenantId = getTenantId(req);
    if (!tenantId) throw new AppError('Tenant ID is required', 400);
    if (!packId) throw new AppError('Pack ID is required', 400);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const packResult = await client.query(
        `SELECT * FROM domain_packs
         WHERE id = $1 AND is_active = true AND (tenant_id IS NULL OR tenant_id = $2)`,
        [packId, tenantId]
      );
      if (packResult.rows.length === 0) throw new AppError('Domain pack not found', 404);
      const domainPack = packResult.rows[0];

      const created = {
        modules: 0,
        businessUnits: 0,
        roles: 0,
        workflowTemplates: 0,
        workflowStages: 0,
        dashboardWidgets: 0,
        businessRules: 0,
      };

      const businessUnitIdByCode = new Map<string, string>();
      for (const unit of asArray(domainPack.default_business_units)) {
        const code = firstValue(unit.code, unit.business_unit_code);
        const name = firstValue(unit.name, unit.business_unit_name);
        if (!code || !name) continue;

        const parentCode = firstValue(unit.parent_code, unit.parentCode);
        const parentId = parentCode ? businessUnitIdByCode.get(parentCode) || null : null;
        const id = uuidv4();
        const result = await client.query(
          `INSERT INTO business_units (
            id, tenant_id, business_unit_code, business_unit_name, business_unit_type,
            description, parent_id, address, city, state, country, postal_code
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (tenant_id, business_unit_code) DO UPDATE SET
            business_unit_name = EXCLUDED.business_unit_name,
            business_unit_type = EXCLUDED.business_unit_type,
            description = EXCLUDED.description,
            parent_id = COALESCE(EXCLUDED.parent_id, business_units.parent_id),
            is_active = true,
            deleted_at = NULL,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id`,
          [
            id, tenantId, code, name, firstValue(unit.type, unit.business_unit_type, 'DEPARTMENT'),
            unit.description || null, parentId, unit.address || null, unit.city || null,
            unit.state || null, unit.country || null, firstValue(unit.postal_code, unit.postalCode, null),
          ]
        );
        businessUnitIdByCode.set(code, result.rows[0].id);
        created.businessUnits++;
      }

      const roleIdByCode = new Map<string, string>();
      for (const role of asArray(domainPack.default_roles)) {
        const code = firstValue(role.code, role.role_code);
        const name = firstValue(role.name, role.role_name);
        if (!code || !name) continue;

        const id = uuidv4();
        const result = await client.query(
          `INSERT INTO roles (id, tenant_id, name, code, description, is_system_role, is_active, dashboard_layout, menu_items)
           VALUES ($1, $2, $3, $4, $5, false, true, $6, $7)
           ON CONFLICT (tenant_id, code) DO UPDATE SET
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             dashboard_layout = EXCLUDED.dashboard_layout,
             menu_items = EXCLUDED.menu_items,
             is_active = true,
             deleted_at = NULL,
             updated_at = CURRENT_TIMESTAMP
           RETURNING id`,
          [id, tenantId, name, code, role.description || null, role.dashboard_layout || role.dashboardLayout || [], role.menu_items || role.menuItems || []]
        );
        roleIdByCode.set(code, result.rows[0].id);
        created.roles++;
      }

      let appliedWorkflowTemplateId: string | null = null;
      for (const workflow of asArray(domainPack.default_workflows)) {
        const code = firstValue(workflow.code, workflow.template_code, workflow.templateCode);
        const name = firstValue(workflow.name, workflow.template_name, workflow.templateName);
        if (!code || !name) continue;

        const stages = asArray(workflow.stages);
        const workflowId = uuidv4();
        const workflowResult = await client.query(
          `INSERT INTO workflow_templates (
            id, tenant_id, template_code, template_name, description, industry_code,
            is_system_template, is_active, stages, transitions, sla_config
          ) VALUES ($1, $2, $3, $4, $5, $6, false, true, $7, $8, $9)
          ON CONFLICT (tenant_id, template_code) DO UPDATE SET
            template_name = EXCLUDED.template_name,
            description = EXCLUDED.description,
            industry_code = EXCLUDED.industry_code,
            stages = EXCLUDED.stages,
            transitions = EXCLUDED.transitions,
            sla_config = EXCLUDED.sla_config,
            is_active = true,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id`,
          [
            workflowId, tenantId, code, name, workflow.description || null, domainPack.industry_code,
            stages, workflow.transitions || [], workflow.sla_config || workflow.slaConfig || {},
          ]
        );
        const savedWorkflowId = workflowResult.rows[0].id;
        if (!appliedWorkflowTemplateId) appliedWorkflowTemplateId = savedWorkflowId;
        created.workflowTemplates++;

        for (const stage of stages) {
          const stageCode = firstValue(stage.code, stage.stage_code, stage.stageCode);
          const stageName = firstValue(stage.name, stage.stage_name, stage.stageName);
          if (!stageCode || !stageName) continue;

          await client.query(
            `INSERT INTO workflow_stages (
              id, workflow_template_id, stage_code, stage_name, description, order_index,
              color, icon, is_initial, is_final, auto_actions, permissions, sla_hours, notifications
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
              uuidv4(), savedWorkflowId, stageCode, stageName, stage.description || null,
              firstValue(stage.order, stage.order_index, stage.orderIndex, 0), stage.color || '#6366F1',
              stage.icon || null, !!stage.is_initial || !!stage.isInitial, !!stage.is_final || !!stage.isFinal,
              stage.auto_actions || stage.autoActions || [], stage.permissions || {}, stage.sla_hours || stage.slaHours || null,
              stage.notifications || [],
            ]
          );
          created.workflowStages++;
        }
      }

      for (const moduleCode of asArray(domainPack.default_modules)) {
        if (typeof moduleCode !== 'string') continue;
        const moduleResult = await client.query('SELECT id, module_code FROM modules WHERE module_code = $1', [moduleCode]);
        if (moduleResult.rows.length === 0) continue;
        const module = moduleResult.rows[0];
        await client.query(
          `INSERT INTO tenant_modules (id, tenant_id, module_id, module_code, is_enabled, is_custom, overrides_subscription)
           VALUES ($1, $2, $3, $4, true, false, false)
           ON CONFLICT (tenant_id, module_id) DO UPDATE SET is_enabled = true, updated_at = CURRENT_TIMESTAMP`,
          [uuidv4(), tenantId, module.id, module.module_code]
        );
        created.modules++;
      }

      for (const rule of asArray(domainPack.default_business_rules)) {
        const code = firstValue(rule.code, rule.rule_code, rule.ruleCode);
        const name = firstValue(rule.name, rule.rule_name, rule.ruleName);
        const type = firstValue(rule.rule_type, rule.ruleType, 'ASSIGNMENT');
        if (!code || !name) continue;
        await client.query(
          `INSERT INTO business_rules (id, tenant_id, rule_code, rule_name, rule_type, description, conditions, actions, priority, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
           ON CONFLICT (tenant_id, rule_code) DO UPDATE SET
             rule_name = EXCLUDED.rule_name,
             rule_type = EXCLUDED.rule_type,
             description = EXCLUDED.description,
             conditions = EXCLUDED.conditions,
             actions = EXCLUDED.actions,
             priority = EXCLUDED.priority,
             is_active = true,
             updated_at = CURRENT_TIMESTAMP`,
          [uuidv4(), tenantId, code, name, type, rule.description || null, rule.conditions || {}, rule.actions || [], rule.priority || 0]
        );
        created.businessRules++;
      }

      const dashboardDefaults = asArray(domainPack.default_dashboard);
      const rolesForDashboard = roleIdByCode.size > 0
        ? Array.from(roleIdByCode.values())
        : (await client.query('SELECT id FROM roles WHERE tenant_id = $1 AND deleted_at IS NULL', [tenantId])).rows.map(row => row.id);

      for (const roleId of rolesForDashboard) {
        for (let index = 0; index < dashboardDefaults.length; index++) {
          const widget = dashboardDefaults[index];
          const widgetType = firstValue(widget.type, widget.widget_type, widget.widgetType);
          if (!widgetType) continue;
          await client.query(
            `INSERT INTO dashboard_widget_configs (
              id, tenant_id, role_id, widget_type, widget_config, position_x, position_y, width, height, is_default, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, true)`,
            [
              uuidv4(), tenantId, roleId, widgetType,
              { title: widget.title || widgetType, ...(widget.config || {}) },
              firstValue(widget.position_x, widget.positionX, (index % 4) * 3),
              firstValue(widget.position_y, widget.positionY, Math.floor(index / 4) * 2),
              widget.width || 4, widget.height || 2,
            ]
          );
          created.dashboardWidgets++;
        }
      }

      await client.query(
        `INSERT INTO organization_configuration (
          id, tenant_id, industry_code, applied_domain_pack_id, applied_workflow_template_id, setup_current_step
        ) VALUES ($1, $2, $3, $4, $5, 2)
        ON CONFLICT (tenant_id) DO UPDATE SET
          industry_code = COALESCE(EXCLUDED.industry_code, organization_configuration.industry_code),
          applied_domain_pack_id = EXCLUDED.applied_domain_pack_id,
          applied_workflow_template_id = COALESCE(EXCLUDED.applied_workflow_template_id, organization_configuration.applied_workflow_template_id),
          updated_at = CURRENT_TIMESTAMP`,
        [uuidv4(), tenantId, domainPack.industry_code, domainPack.id, appliedWorkflowTemplateId]
      );

      if (appliedWorkflowTemplateId) {
        await client.query(
          `UPDATE tenants SET workflow_template_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
          [appliedWorkflowTemplateId, tenantId]
        );
      }

      await client.query('COMMIT');

      logger.info('Domain pack applied successfully', { tenantId, packId, created });

      res.status(200).json({
        success: true,
        message: 'Domain pack applied successfully',
        data: { domainPack, created },
      } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });
}

export const domainPackController = new DomainPackController();
