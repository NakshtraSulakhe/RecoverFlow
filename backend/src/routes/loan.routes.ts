import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireAgent } from '../middleware/roleMiddleware';
import { loanController } from '../controllers/loan.controller';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

/**
 * @swagger
 * /api/v1/loans:
 *   post:
 *     summary: Create a new loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Loan created successfully
 */
router.post('/', requireAgent, loanController.createLoan);

/**
 * @swagger
 * /api/v1/loans:
 *   get:
 *     summary: Get all loans
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loans retrieved successfully
 */
router.get('/', requireAgent, loanController.getAllLoans);

/**
 * @swagger
 * /api/v1/loans/{id}:
 *   get:
 *     summary: Get loan by ID
 *     tags: [Loans]
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
 *         description: Loan retrieved successfully
 */
router.get('/:id', requireAgent, loanController.getLoanById);

export { router as loanRoutes };
