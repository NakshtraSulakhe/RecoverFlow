import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requirePlatformOwner } from '../middleware/roleMiddleware';
import { tenantModuleController } from '../controllers/tenant-module.controller';

const router = Router();

router.get('/tenant/:tenant_id', authMiddleware, tenantModuleController.getTenantModules);
router.get('/tenant/:tenant_id/with-inherited', authMiddleware, tenantModuleController.getTenantModulesWithInherited);
router.put('/tenant/:tenant_id/module/:module_id', authMiddleware, requirePlatformOwner, tenantModuleController.updateTenantModule);
router.post('/tenant/:tenant_id/module/:module_id/enable', authMiddleware, requirePlatformOwner, tenantModuleController.enableTenantModule);
router.post('/tenant/:tenant_id/module/:module_id/disable', authMiddleware, requirePlatformOwner, tenantModuleController.disableTenantModule);

export { router as tenantModuleRoutes };
