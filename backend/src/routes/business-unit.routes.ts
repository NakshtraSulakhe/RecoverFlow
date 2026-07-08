import { Router } from 'express';
import { businessUnitController } from '../controllers/business-unit.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all business units (tree structure)
router.get('/', tenantMiddleware, businessUnitController.getAllBusinessUnits);

// Get business unit by ID
router.get('/:id', tenantMiddleware, businessUnitController.getBusinessUnitById);

// Create business unit
router.post('/', tenantMiddleware, requireTenantAdmin, businessUnitController.createBusinessUnit);

// Update business unit
router.put('/:id', tenantMiddleware, requireTenantAdmin, businessUnitController.updateBusinessUnit);

// Delete business unit (soft delete)
router.delete('/:id', tenantMiddleware, requireTenantAdmin, businessUnitController.deleteBusinessUnit);

// Move business unit in hierarchy
router.post('/:id/move', tenantMiddleware, requireTenantAdmin, businessUnitController.moveBusinessUnit);

export default router;
