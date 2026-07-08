import { Router } from 'express';
import { RecoveryCaseController } from '../controllers/recovery-case.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireAgent } from '../middleware/roleMiddleware';

export function recoveryCaseRoutes(recoveryCaseController: RecoveryCaseController): Router {
  const router = Router();

  // All recovery case routes require authentication and tenant context
  router.use(authMiddleware);
  router.use(tenantMiddleware);

  // Create recovery case - requires agent role
  router.post('/', requireAgent, (req, res, next) => recoveryCaseController.createRecoveryCase(req, res, next));

  // Get all recovery cases - requires agent role
  router.get('/', requireAgent, (req, res, next) => recoveryCaseController.getRecoveryCases(req, res, next));

  // Get recovery case count - requires agent role
  router.get('/count', requireAgent, (req, res, next) => recoveryCaseController.getRecoveryCaseCount(req, res, next));

  // Get recovery case by ID - requires agent role
  router.get('/:id', requireAgent, (req, res, next) => recoveryCaseController.getRecoveryCaseById(req, res, next));

  // Get recovery case by number - requires agent role
  router.get('/number/:caseNumber', requireAgent, (req, res, next) => recoveryCaseController.getRecoveryCaseByNumber(req, res, next));

  // Get recovery cases by loan ID - requires agent role
  router.get('/loan/:loanId', requireAgent, (req, res, next) => recoveryCaseController.getRecoveryCasesByLoanId(req, res, next));

  // Get recovery cases by customer ID - requires agent role
  router.get('/customer/:customerId', requireAgent, (req, res, next) => recoveryCaseController.getRecoveryCasesByCustomerId(req, res, next));

  // Update recovery case - requires agent role
  router.put('/:id', requireAgent, (req, res, next) => recoveryCaseController.updateRecoveryCase(req, res, next));

  // Soft delete recovery case - requires agent role
  router.delete('/:id', requireAgent, (req, res, next) => recoveryCaseController.softDeleteRecoveryCase(req, res, next));

  // Restore recovery case - requires agent role
  router.post('/:id/restore', requireAgent, (req, res, next) => recoveryCaseController.restoreRecoveryCase(req, res, next));

  // Assignment Management
  router.post('/:id/assign', requireAgent, (req, res, next) => recoveryCaseController.assignCase(req, res, next));
  router.get('/:id/assignments', requireAgent, (req, res, next) => recoveryCaseController.getCaseAssignments(req, res, next));

  // Timeline/History Management
  router.get('/:id/history', requireAgent, (req, res, next) => recoveryCaseController.getCaseHistory(req, res, next));
  router.post('/:id/history', requireAgent, (req, res, next) => recoveryCaseController.addCaseHistoryEvent(req, res, next));

  // Tags Management
  router.post('/:id/tags', requireAgent, (req, res, next) => recoveryCaseController.addCaseTag(req, res, next));
  router.get('/:id/tags', requireAgent, (req, res, next) => recoveryCaseController.getCaseTags(req, res, next));
  router.delete('/:id/tags/:tagName', requireAgent, (req, res, next) => recoveryCaseController.removeCaseTag(req, res, next));

  // Notes Management
  router.post('/:id/notes', requireAgent, (req, res, next) => recoveryCaseController.addCaseNote(req, res, next));
  router.get('/:id/notes', requireAgent, (req, res, next) => recoveryCaseController.getCaseNotes(req, res, next));

  // Dashboard Statistics
  router.get('/dashboard/stats', requireAgent, (req, res, next) => recoveryCaseController.getDashboardStats(req, res, next));

  return router;
}
