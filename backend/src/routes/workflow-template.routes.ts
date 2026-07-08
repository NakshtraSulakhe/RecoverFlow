import { Router } from 'express';
import { workflowTemplateController } from '../controllers/workflow-template.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all workflow templates (system + tenant custom)
router.get('/', tenantMiddleware, workflowTemplateController.getAllWorkflowTemplates);

// Get workflow template by ID
router.get('/:id', tenantMiddleware, workflowTemplateController.getWorkflowTemplateById);

// Create custom workflow template
router.post('/', tenantMiddleware, requireRole('tenant_admin', 'platform_owner'), workflowTemplateController.createWorkflowTemplate);

// Update workflow template
router.put('/:id', tenantMiddleware, requireRole('tenant_admin', 'platform_owner'), workflowTemplateController.updateWorkflowTemplate);

// Apply workflow template to tenant
router.post('/:id/apply', tenantMiddleware, requireRole('tenant_admin', 'platform_owner'), workflowTemplateController.applyWorkflowTemplate);

// Delete workflow template
router.delete('/:id', tenantMiddleware, requireRole('tenant_admin', 'platform_owner'), workflowTemplateController.deleteWorkflowTemplate);

export default router;

