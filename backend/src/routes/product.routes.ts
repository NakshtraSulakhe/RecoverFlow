import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireAgent } from '../middleware/roleMiddleware';

export function productRoutes(productController: ProductController): Router {
  const router = Router();

  // All product routes require authentication and tenant context
  router.use(authMiddleware);
  router.use(tenantMiddleware);

  // Create product - requires agent role
  router.post('/', requireAgent, (req, res, next) => productController.createProduct(req, res, next));

  // Get all products - requires agent role
  router.get('/', requireAgent, (req, res, next) => productController.getProducts(req, res, next));

  // Get product count - requires agent role
  router.get('/count', requireAgent, (req, res, next) => productController.getProductCount(req, res, next));

  // Get product by ID - requires agent role
  router.get('/:id', requireAgent, (req, res, next) => productController.getProductById(req, res, next));

  // Get product by code - requires agent role
  router.get('/code/:productCode', requireAgent, (req, res, next) => productController.getProductByCode(req, res, next));

  // Update product - requires agent role
  router.put('/:id', requireAgent, (req, res, next) => productController.updateProduct(req, res, next));

  // Soft delete product - requires agent role
  router.delete('/:id', requireAgent, (req, res, next) => productController.softDeleteProduct(req, res, next));

  // Restore product - requires agent role
  router.post('/:id/restore', requireAgent, (req, res, next) => productController.restoreProduct(req, res, next));

  return router;
}
