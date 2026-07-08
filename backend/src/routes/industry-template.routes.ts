import { Router } from 'express';
import { industryTemplateController } from '../controllers/industry-template.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', industryTemplateController.getAllIndustryTemplates);
router.get('/:code', industryTemplateController.getIndustryTemplateByCode);
router.post('/', industryTemplateController.createIndustryTemplate);
router.put('/:code', industryTemplateController.updateIndustryTemplate);
router.delete('/:code', industryTemplateController.deleteIndustryTemplate);

export default router;
