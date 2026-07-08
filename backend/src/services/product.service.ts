import { ProductRepository } from '../repositories/product.repository';
import { logger } from '../utils/logger';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct(productData: any, tenantId: string, userId: string) {
    // Generate product code if not provided
    const productCode = productData.product_code || await this.generateProductCode(tenantId);

    const product = {
      ...productData,
      tenant_id: tenantId,
      product_code: productCode,
      created_by: userId,
      updated_by: userId,
    };

    const createdProduct = await this.productRepository.create(product);

    // Add audit log
    await this.logAudit('PRODUCT', createdProduct.id, 'CREATED', null, product, userId, tenantId);

    return createdProduct;
  }

  async getProducts(tenantId: string, filters: any = {}) {
    return await this.productRepository.findAll(tenantId, filters);
  }

  async getProductById(id: string, tenantId: string) {
    const product = await this.productRepository.findById(id, tenantId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getProductByCode(productCode: string, tenantId: string) {
    return await this.productRepository.findByProductCode(productCode, tenantId);
  }

  async updateProduct(id: string, productData: any, tenantId: string, userId: string) {
    const existingProduct = await this.productRepository.findById(id, tenantId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const updatedProduct = await this.productRepository.update(id, {
      ...productData,
      updated_by: userId,
    }, tenantId);

    // Add audit log
    await this.logAudit('PRODUCT', id, 'UPDATED', existingProduct, updatedProduct, userId, tenantId);

    return updatedProduct;
  }

  async softDeleteProduct(id: string, tenantId: string, userId: string) {
    const existingProduct = await this.productRepository.findById(id, tenantId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const deletedProduct = await this.productRepository.softDelete(id, tenantId, userId);

    // Add audit log
    await this.logAudit('PRODUCT', id, 'DELETED', existingProduct, null, userId, tenantId);

    return deletedProduct;
  }

  async restoreProduct(id: string, tenantId: string) {
    return await this.productRepository.restore(id, tenantId);
  }

  async getProductCount(tenantId: string, filters: any = {}) {
    return await this.productRepository.count(tenantId, filters);
  }

  private async generateProductCode(tenantId: string): Promise<string> {
    // Generate a unique product code
    // Format: PROD-XXXXX
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `PROD-${random}`;
  }

  private async logAudit(entityType: string, entityId: string, action: string, oldValue: any, newValue: any, userId: string, tenantId: string) {
    // TODO: Implement audit logging
    logger.info('Audit log', { entityType, entityId, action, userId });
  }
}
