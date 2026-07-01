import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireAgent } from '../middleware/roleMiddleware';
import { aiController } from '../controllers/ai.controller';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

/**
 * @swagger
 * /api/v1/ai/assistant:
 *   post:
 *     summary: Get AI recovery assistant response
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               case_id:
 *                 type: string
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI response generated successfully
 */
router.post('/assistant', requireAgent, aiController.getAssistantResponse);

/**
 * @swagger
 * /api/v1/ai/priority-score:
 *   post:
 *     summary: Calculate AI priority score for a case
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               case_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Priority score calculated successfully
 */
router.post('/priority-score', requireAgent, aiController.calculatePriorityScore);

/**
 * @swagger
 * /api/v1/ai/risk-score:
 *   post:
 *     summary: Calculate AI risk score for a customer
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Risk score calculated successfully
 */
router.post('/risk-score', requireAgent, aiController.calculateRiskScore);

/**
 * @swagger
 * /api/v1/ai/summary:
 *   post:
 *     summary: Generate AI summary for a case
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               case_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Summary generated successfully
 */
router.post('/summary', requireAgent, aiController.generateSummary);

export { router as aiRoutes };
