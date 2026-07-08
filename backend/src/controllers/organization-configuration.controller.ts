import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { pool } from '../config/database';

const getTenantId = (req: Request) => req.tenantId || req.user?.tenantId || req.user?.tenant_id;

const toCamelConfig = (row: any) => row ? ({
  ...row,
  tenantId: row.tenant_id,
  logoUrl: row.logo_url,
  businessName: row.business_name,
  industryCode: row.industry_code,
  businessHours: row.business_hours,
  workingDays: row.working_days,
  holidayCalendar: row.holiday_calendar,
  approvalHierarchy: row.approval_hierarchy,
  slaConfig: row.sla_config,
  defaultLanguage: row.default_language,
  organizationSetupCompleted: row.organization_setup_completed,
  setupCurrentStep: row.setup_current_step,
  appliedDomainPackId: row.applied_domain_pack_id,
  appliedWorkflowTemplateId: row.applied_workflow_template_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
}) : row;

const updateFieldMap: Record<string, string> = {
  logo_url: 'logo_url', logoUrl: 'logo_url',
  business_name: 'business_name', businessName: 'business_name',
  industry_code: 'industry_code', industryCode: 'industry_code',
  country: 'country', timezone: 'timezone', currency: 'currency',
  business_hours: 'business_hours', businessHours: 'business_hours',
  working_days: 'working_days', workingDays: 'working_days',
  holiday_calendar: 'holiday_calendar', holidayCalendar: 'holiday_calendar',
  approval_hierarchy: 'approval_hierarchy', approvalHierarchy: 'approval_hierarchy',
  sla_config: 'sla_config', slaConfig: 'sla_config',
  default_language: 'default_language', defaultLanguage: 'default_language',
  organization_setup_completed: 'organization_setup_completed', organizationSetupCompleted: 'organization_setup_completed',
  setup_current_step: 'setup_current_step', setupCurrentStep: 'setup_current_step',
  applied_domain_pack_id: 'applied_domain_pack_id', appliedDomainPackId: 'applied_domain_pack_id',
  applied_workflow_template_id: 'applied_workflow_template_id', appliedWorkflowTemplateId: 'applied_workflow_template_id',
};

class OrganizationConfigurationController {
  getConfiguration = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    if (!tenantId) throw new AppError('Tenant ID is required', 400);

    const client = await pool.connect();
    try {
      let result = await client.query('SELECT * FROM organization_configuration WHERE tenant_id = $1', [tenantId]);
      if (result.rows.length === 0) {
        result = await client.query(`INSERT INTO organization_configuration (id, tenant_id) VALUES ($1, $2) RETURNING *`, [uuidv4(), tenantId]);
      }
      res.status(200).json({ success: true, message: 'Configuration retrieved successfully', data: toCamelConfig(result.rows[0]) } as ApiResponse);
    } finally {
      client.release();
    }
  });

  updateConfiguration = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    if (!tenantId) throw new AppError('Tenant ID is required', 400);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let configResult = await client.query('SELECT * FROM organization_configuration WHERE tenant_id = $1', [tenantId]);
      if (configResult.rows.length === 0) {
        configResult = await client.query(`INSERT INTO organization_configuration (id, tenant_id) VALUES ($1, $2) RETURNING *`, [uuidv4(), tenantId]);
      }

      const fields: string[] = [];
      const values: any[] = [];
      const seen = new Set<string>();
      let paramIndex = 1;

      for (const [incoming, column] of Object.entries(updateFieldMap)) {
        if (req.body[incoming] !== undefined && !seen.has(column)) {
          fields.push(`${column} = $${paramIndex++}`);
          values.push(req.body[incoming]);
          seen.add(column);
        }
      }

      let config = configResult.rows[0];
      if (fields.length > 0) {
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(tenantId);
        const updateResult = await client.query(
          `UPDATE organization_configuration SET ${fields.join(', ')} WHERE tenant_id = $${paramIndex} RETURNING *`,
          values
        );
        config = updateResult.rows[0];
      }

      await client.query('COMMIT');
      logger.info('Organization configuration updated', { tenantId });
      res.status(200).json({ success: true, message: 'Configuration updated successfully', data: toCamelConfig(config) } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  completeSetup = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    if (!tenantId) throw new AppError('Tenant ID is required', 400);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO organization_configuration (id, tenant_id, organization_setup_completed, setup_current_step)
         VALUES ($1, $2, true, 7)
         ON CONFLICT (tenant_id) DO UPDATE SET
           organization_setup_completed = true,
           setup_current_step = 7,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [uuidv4(), tenantId]
      );
      await client.query('COMMIT');
      logger.info('Organization setup completed', { tenantId });
      res.status(200).json({ success: true, message: 'Organization setup completed successfully', data: toCamelConfig(result.rows[0]) } as ApiResponse);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });
}

export const organizationConfigurationController = new OrganizationConfigurationController();
