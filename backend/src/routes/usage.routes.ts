import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requirePlatformOwner } from '../middleware/roleMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { usageController } from '../controllers/usage.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/usage:
 *   post:
 *     summary: Record usage
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenant_id:
 *                 type: string
 *               metric_name:
 *                 type: string
 *               metric_value:
 *                 type: integer
 *               period_start:
 *                 type: string
 *                 format: date-time
 *               period_end:
 *                 type: string
 *                 format: date-time
 *               unit:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Usage recorded successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, usageController.recordUsage);

/**
 * @swagger
 * /api/v1/usage/tenant/{tenant_id}:
 *   get:
 *     summary: Get tenant usage
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenant_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: period_start
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: period_end
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: metric_name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usage data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/tenant/:tenant_id', authMiddleware, tenantMiddleware, usageController.getTenantUsage);

/**
 * @swagger
 * /api/v1/usage/tenant/{tenant_id}/summary:
 *   get:
 *     summary: Get usage summary
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenant_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: period_start
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: period_end
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Usage summary retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/tenant/:tenant_id/summary', authMiddleware, tenantMiddleware, usageController.getUsageSummary);

/**
 * @swagger
 * /api/v1/usage/tenant/{tenant_id}/dashboard:
 *   get:
 *     summary: Get usage dashboard
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenant_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usage dashboard retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/tenant/:tenant_id/dashboard', authMiddleware, tenantMiddleware, usageController.getUsageDashboard);

export { router as usageRoutes };
