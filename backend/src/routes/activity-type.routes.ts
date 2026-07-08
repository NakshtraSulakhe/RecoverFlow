import { Router } from 'express';
import { activityTypeController } from '../controllers/activity-type.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', tenantMiddleware, activityTypeController.getAllActivityTypes);
router.get('/:id', tenantMiddleware, activityTypeController.getActivityTypeById);
router.post('/', tenantMiddleware, requireTenantAdmin, activityTypeController.createActivityType);
router.put('/:id', tenantMiddleware, requireTenantAdmin, activityTypeController.updateActivityType);
router.delete('/:id', tenantMiddleware, requireTenantAdmin, activityTypeController.deleteActivityType);

export default router;
