import { Router } from 'express';
import { dashboardWidgetController } from '../controllers/dashboard-widget.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', tenantMiddleware, dashboardWidgetController.getWidgetsForCurrentUser);
router.get('/role/:roleId', tenantMiddleware, dashboardWidgetController.getWidgetsByRole);
router.post('/', tenantMiddleware, requireTenantAdmin, dashboardWidgetController.createWidget);
router.put('/:id', tenantMiddleware, requireTenantAdmin, dashboardWidgetController.updateWidget);
router.delete('/:id', tenantMiddleware, requireTenantAdmin, dashboardWidgetController.deleteWidget);
router.post('/reset', tenantMiddleware, requireTenantAdmin, dashboardWidgetController.resetWidgets);

export default router;
