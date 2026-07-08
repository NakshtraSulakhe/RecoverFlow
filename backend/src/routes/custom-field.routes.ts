import { Router } from 'express';
import { customFieldController } from '../controllers/custom-field.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', tenantMiddleware, customFieldController.getAllCustomFields);
router.get('/:id', tenantMiddleware, customFieldController.getCustomFieldById);
router.post('/', tenantMiddleware, requireTenantAdmin, customFieldController.createCustomField);
router.put('/:id', tenantMiddleware, requireTenantAdmin, customFieldController.updateCustomField);
router.delete('/:id', tenantMiddleware, requireTenantAdmin, customFieldController.deleteCustomField);

export default router;
