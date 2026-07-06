import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { permissionController } from '../controllers/permission.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 */
router.get('/', authMiddleware, permissionController.getAllPermissions);

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permission retrieved successfully
 */
router.get('/:id', authMiddleware, permissionController.getPermissionById);

export { router as permissionRoutes };
