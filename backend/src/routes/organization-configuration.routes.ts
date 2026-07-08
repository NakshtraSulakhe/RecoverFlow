import { Router } from 'express';
import { organizationConfigurationController } from '../controllers/organization-configuration.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get organization config
router.get('/', tenantMiddleware, organizationConfigurationController.getConfiguration);

// Update organization config
router.put('/', tenantMiddleware, requireTenantAdmin, organizationConfigurationController.updateConfiguration);

// Complete organization setup
router.post('/complete-setup', tenantMiddleware, requireTenantAdmin, organizationConfigurationController.completeSetup);

export default router;
