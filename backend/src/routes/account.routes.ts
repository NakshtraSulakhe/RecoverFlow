import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireAgent } from '../middleware/roleMiddleware';

export function accountRoutes(accountController: AccountController): Router {
  const router = Router();

  // All account routes require authentication and tenant context
  router.use(authMiddleware);
  router.use(tenantMiddleware);

  // Create account - requires agent role
  router.post('/', requireAgent, (req, res, next) => accountController.createAccount(req, res, next));

  // Get all accounts - requires agent role
  router.get('/', requireAgent, (req, res, next) => accountController.getAccounts(req, res, next));

  // Get account count - requires agent role
  router.get('/count', requireAgent, (req, res, next) => accountController.getAccountCount(req, res, next));

  // Get account by ID - requires agent role
  router.get('/:id', requireAgent, (req, res, next) => accountController.getAccountById(req, res, next));

  // Get account by number - requires agent role
  router.get('/number/:accountNumber', requireAgent, (req, res, next) => accountController.getAccountByNumber(req, res, next));

  // Get accounts by customer ID - requires agent role
  router.get('/customer/:customerId', requireAgent, (req, res, next) => accountController.getAccountsByCustomerId(req, res, next));

  // Update account - requires agent role
  router.put('/:id', requireAgent, (req, res, next) => accountController.updateAccount(req, res, next));

  // Soft delete account - requires agent role
  router.delete('/:id', requireAgent, (req, res, next) => accountController.softDeleteAccount(req, res, next));

  // Restore account - requires agent role
  router.post('/:id/restore', requireAgent, (req, res, next) => accountController.restoreAccount(req, res, next));

  return router;
}
