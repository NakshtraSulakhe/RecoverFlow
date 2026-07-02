import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requirePlatformOwner } from '../middleware/roleMiddleware';
import { moduleController } from '../controllers/module.controller';

const router = Router();

router.get('/', authMiddleware, requirePlatformOwner, moduleController.getAllModules);
router.post('/', authMiddleware, requirePlatformOwner, moduleController.createModule);
router.get('/:id', authMiddleware, requirePlatformOwner, moduleController.getModuleById);
router.put('/:id', authMiddleware, requirePlatformOwner, moduleController.updateModule);
router.delete('/:id', authMiddleware, requirePlatformOwner, moduleController.deleteModule);

export { router as moduleRoutes };
