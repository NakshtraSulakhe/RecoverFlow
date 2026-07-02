import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requirePlatformOwner } from '../middleware/roleMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { tenantController } from '../controllers/tenant.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/tenants:
 *   post:
 *     summary: Create a new tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenant_code:
 *                 type: string
 *               tenant_name:
 *                 type: string
 *               legal_name:
 *                 type: string
 *               business_type:
 *                 type: string
 *               contact_email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tenant created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authMiddleware, requirePlatformOwner, tenantController.createTenant);

/**
 * @swagger
 * /api/v1/tenants:
 *   get:
 *     summary: Get all tenants
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tenants retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, requirePlatformOwner, tenantController.getAllTenants);

/**
 * @swagger
 * /api/v1/tenants/{id}:
 *   get:
 *     summary: Get tenant by ID
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.get('/:id', authMiddleware, tenantMiddleware, tenantController.getTenantById);

/**
 * @swagger
 * /api/v1/tenants/{id}:
 *   put:
 *     summary: Update tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tenant updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.put('/:id', authMiddleware, tenantMiddleware, tenantController.updateTenant);

/**
 * @swagger
 * /api/v1/tenants/{id}:
 *   delete:
 *     summary: Delete tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.delete('/:id', authMiddleware, requirePlatformOwner, tenantController.deleteTenant);

/**
 * @swagger
 * /api/v1/tenants/{id}/suspend:
 *   post:
 *     summary: Suspend tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant suspended successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.post('/:id/suspend', authMiddleware, requirePlatformOwner, tenantController.suspendTenant);

/**
 * @swagger
 * /api/v1/tenants/{id}/activate:
 *   post:
 *     summary: Activate tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant activated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.post('/:id/activate', authMiddleware, requirePlatformOwner, tenantController.activateTenant);

/**
 * @swagger
 * /api/v1/tenants/{id}/archive:
 *   post:
 *     summary: Archive tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant archived successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.post('/:id/archive', authMiddleware, requirePlatformOwner, tenantController.archiveTenant);

/**
 * @swagger
 * /api/v1/tenants/{id}/stats:
 *   get:
 *     summary: Get tenant statistics
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant stats retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.get('/:id/stats', authMiddleware, tenantMiddleware, tenantController.getTenantStats);

export { router as tenantRoutes };
