import { Router } from 'express';
import { caseStatusController } from '../controllers/case-status.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', tenantMiddleware, caseStatusController.getAllCaseStatuses);
router.get('/:id', tenantMiddleware, caseStatusController.getCaseStatusById);
router.post('/', tenantMiddleware, requireTenantAdmin, caseStatusController.createCaseStatus);
router.put('/:id', tenantMiddleware, requireTenantAdmin, caseStatusController.updateCaseStatus);
router.delete('/:id', tenantMiddleware, requireTenantAdmin, caseStatusController.deleteCaseStatus);

export default router;
