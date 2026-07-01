import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireAgent } from '../middleware/roleMiddleware';
import { recoveryController } from '../controllers/recovery.controller';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

/**
 * @swagger
 * /api/v1/recovery/cases:
 *   post:
 *     summary: Create a new recovery case
 *     tags: [Recovery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Recovery case created successfully
 */
router.post('/cases', requireAgent, recoveryController.createCase);

/**
 * @swagger
 * /api/v1/recovery/cases:
 *   get:
 *     summary: Get all recovery cases
 *     tags: [Recovery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recovery cases retrieved successfully
 */
router.get('/cases', requireAgent, recoveryController.getAllCases);

/**
 * @swagger
 * /api/v1/recovery/cases/{id}:
 *   get:
 *     summary: Get recovery case by ID
 *     tags: [Recovery]
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
 *         description: Recovery case retrieved successfully
 */
router.get('/cases/:id', requireAgent, recoveryController.getCaseById);

/**
 * @swagger
 * /api/v1/recovery/ptp:
 *   post:
 *     summary: Create promise to pay
 *     tags: [Recovery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: PTP created successfully
 */
router.post('/ptp', requireAgent, recoveryController.createPTP);

/**
 * @swagger
 * /api/v1/recovery/ptp/{id}:
 *   get:
 *     summary: Get PTP by ID
 *     tags: [Recovery]
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
 *         description: PTP retrieved successfully
 */
router.get('/ptp/:id', requireAgent, recoveryController.getPTPById);

export { router as recoveryRoutes };
