import { Router } from 'express';
import { businessRuleController } from '../controllers/business-rule.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all business rules
router.get('/', tenantMiddleware, businessRuleController.getAllBusinessRules);

// Get business rule by ID
router.get('/:id', tenantMiddleware, businessRuleController.getBusinessRuleById);

// Create business rule
router.post('/', tenantMiddleware, requireTenantAdmin, businessRuleController.createBusinessRule);

// Update business rule
router.put('/:id', tenantMiddleware, requireTenantAdmin, businessRuleController.updateBusinessRule);

// Delete business rule
router.delete('/:id', tenantMiddleware, requireTenantAdmin, businessRuleController.deleteBusinessRule);

export default router;
