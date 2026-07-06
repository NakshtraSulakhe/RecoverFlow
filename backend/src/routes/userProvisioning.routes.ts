import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { userProvisioningController } from '../controllers/userProvisioning.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/users/provisioning:
 *   post:
 *     summary: Create a new user with role assignment
 *     tags: [User Provisioning]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               department_id:
 *                 type: string
 *               team_id:
 *                 type: string
 *               role_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, locked]
 *               send_welcome_email:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/provisioning', authMiddleware, tenantMiddleware, userProvisioningController.createUser);

/**
 * @swagger
 * /api/v1/users/provisioning:
 *   get:
 *     summary: Get all users with filtering
 *     tags: [User Provisioning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: department_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: team_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: role_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/provisioning', authMiddleware, tenantMiddleware, userProvisioningController.getUsers);

/**
 * @swagger
 * /api/v1/users/provisioning/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User Provisioning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 */
router.get('/provisioning/:id', authMiddleware, tenantMiddleware, userProvisioningController.getUserById);

/**
 * @swagger
 * /api/v1/users/provisioning/{id}:
 *   put:
 *     summary: Update user
 *     tags: [User Provisioning]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               department_id:
 *                 type: string
 *               team_id:
 *                 type: string
 *               role_id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/provisioning/:id', authMiddleware, tenantMiddleware, userProvisioningController.updateUser);

/**
 * @swagger
 * /api/v1/users/provisioning/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [User Provisioning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/provisioning/:id', authMiddleware, tenantMiddleware, userProvisioningController.deleteUser);

/**
 * @swagger
 * /api/v1/users/provisioning/{id}/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [User Provisioning]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               send_email:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/provisioning/:id/reset-password', authMiddleware, tenantMiddleware, userProvisioningController.resetUserPassword);

/**
 * @swagger
 * /api/v1/users/provisioning/{id}/lock:
 *   patch:
 *     summary: Lock user account
 *     tags: [User Provisioning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User locked successfully
 */
router.patch('/provisioning/:id/lock', authMiddleware, tenantMiddleware, userProvisioningController.lockUser);

/**
 * @swagger
 * /api/v1/users/provisioning/{id}/unlock:
 *   patch:
 *     summary: Unlock user account
 *     tags: [User Provisioning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User unlocked successfully
 */
router.patch('/provisioning/:id/unlock', authMiddleware, tenantMiddleware, userProvisioningController.unlockUser);

export { router as userProvisioningRoutes };
