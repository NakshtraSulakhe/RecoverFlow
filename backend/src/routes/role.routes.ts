import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { roleController } from '../controllers/role.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Role created successfully
 */
router.post('/', authMiddleware, tenantMiddleware, roleController.createRole);

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 */
router.get('/', authMiddleware, tenantMiddleware, roleController.getAllRoles);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 */
router.get('/:id', authMiddleware, tenantMiddleware, roleController.getRoleById);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.put('/:id', authMiddleware, tenantMiddleware, roleController.updateRole);

/**
 * @swagger
 * /api/v1/roles/{id}/permissions:
 *   put:
 *     summary: Assign permissions to role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 */
router.put('/:id/permissions', authMiddleware, tenantMiddleware, roleController.assignPermissionsToRole);

/**
 * @swagger
 * /api/v1/roles/{id}/clone:
 *   post:
 *     summary: Clone role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Role cloned successfully
 */
router.post('/:id/clone', authMiddleware, tenantMiddleware, roleController.cloneRole);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role deleted successfully
 */
router.delete('/:id', authMiddleware, tenantMiddleware, roleController.deleteRole);

/**
 * @swagger
 * /api/v1/roles/permission-matrix:
 *   get:
 *     summary: Get permission matrix
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permission matrix retrieved successfully
 */
router.get('/permission-matrix', authMiddleware, tenantMiddleware, roleController.getPermissionMatrix);

/**
 * @swagger
 * /api/v1/roles/{id}/permission-matrix:
 *   get:
 *     summary: Get role permissions matrix
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role permissions matrix retrieved successfully
 */
router.get('/:id/permission-matrix', authMiddleware, tenantMiddleware, roleController.getRolePermissionsMatrix);

/**
 * @swagger
 * /api/v1/roles/{id}/deactivate:
 *   patch:
 *     summary: Deactivate role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role deactivated successfully
 */
router.patch('/:id/deactivate', authMiddleware, tenantMiddleware, roleController.deactivateRole);

/**
 * @swagger
 * /api/v1/roles/{id}/activate:
 *   patch:
 *     summary: Activate role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role activated successfully
 */
router.patch('/:id/activate', authMiddleware, tenantMiddleware, roleController.activateRole);

export { router as roleRoutes };
