import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { teamController } from '../controllers/team.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Team created successfully
 */
router.post('/', authMiddleware, tenantMiddleware, teamController.createTeam);

/**
 * @swagger
 * /api/v1/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 */
router.get('/', authMiddleware, tenantMiddleware, teamController.getAllTeams);

/**
 * @swagger
 * /api/v1/teams/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team retrieved successfully
 */
router.get('/:id', authMiddleware, tenantMiddleware, teamController.getTeamById);

/**
 * @swagger
 * /api/v1/teams/{id}:
 *   put:
 *     summary: Update team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team updated successfully
 */
router.put('/:id', authMiddleware, tenantMiddleware, teamController.updateTeam);

/**
 * @swagger
 * /api/v1/teams/{id}:
 *   delete:
 *     summary: Delete team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team deleted successfully
 */
router.delete('/:id', authMiddleware, tenantMiddleware, teamController.deleteTeam);

export { router as teamRoutes };
