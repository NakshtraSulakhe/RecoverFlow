import { Router } from 'express';
import { communicationTemplateController } from '../controllers/communication-template.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireTenantAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', tenantMiddleware, communicationTemplateController.getAllCommunicationTemplates);
router.get('/:id', tenantMiddleware, communicationTemplateController.getCommunicationTemplateById);
router.post('/', tenantMiddleware, requireTenantAdmin, communicationTemplateController.createCommunicationTemplate);
router.put('/:id', tenantMiddleware, requireTenantAdmin, communicationTemplateController.updateCommunicationTemplate);
router.delete('/:id', tenantMiddleware, requireTenantAdmin, communicationTemplateController.deleteCommunicationTemplate);

export default router;
