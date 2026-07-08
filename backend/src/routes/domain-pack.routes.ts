import { Router } from 'express';
import { domainPackController } from '../controllers/domain-pack.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin, requireRole } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all domain packs (system + tenant custom)
router.get('/', tenantMiddleware, domainPackController.getAllDomainPacks);

// Get domain pack by ID
router.get('/:id', tenantMiddleware, domainPackController.getDomainPackById);

// Create custom domain pack
router.post('/', tenantMiddleware, requireRole('tenant_admin', 'platform_owner'), domainPackController.createDomainPack);

// Update domain pack
router.put('/:id', tenantMiddleware, requireRole('tenant_admin', 'platform_owner'), domainPackController.updateDomainPack);

// Delete domain pack
router.delete('/:id', tenantMiddleware, requireRole('tenant_admin', 'platform_owner'), domainPackController.deleteDomainPack);

// Apply domain pack to tenant
router.post('/apply', tenantMiddleware, requireTenantAdmin, domainPackController.applyDomainPack);

export default router;
