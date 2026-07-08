import { Router } from 'express';
import { caseTypeController } from '../controllers/case-type.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', tenantMiddleware, caseTypeController.getAllCaseTypes);
router.get('/:id', tenantMiddleware, caseTypeController.getCaseTypeById);
router.post('/', tenantMiddleware, requireTenantAdmin, caseTypeController.createCaseType);
router.put('/:id', tenantMiddleware, requireTenantAdmin, caseTypeController.updateCaseType);
router.delete('/:id', tenantMiddleware, requireTenantAdmin, caseTypeController.deleteCaseType);

export default router;
