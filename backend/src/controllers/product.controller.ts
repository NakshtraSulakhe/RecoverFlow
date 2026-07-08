import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { AppError } from '../utils/app-error';
import { asyncHandler } from '../utils/async-handler';
import { ApiResponse } from '../types';

export class ProductController {
  constructor(private productService: ProductService) {}

  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { product_code, product_name, description, product_category, product_type, min_amount, max_amount, min_tenure_months, max_tenure_months, interest_rate_min, interest_rate_max, processing_fee_percent, prepayment_allowed, prepayment_penalty_percent, collateral_required, guarantor_required, insurance_required, document_requirements, eligibility_criteria, terms_conditions, is_active, metadata } = req.body;

    if (!product_name || !product_category || !product_type) {
      throw new AppError('Missing required fields: product_name, product_category, product_type', 400);
    }

    const product = await this.productService.createProduct({
      product_code,
      product_name,
      description,
      product_category,
      product_type,
      min_amount,
      max_amount,
      min_tenure_months,
      max_tenure_months,
      interest_rate_min,
      interest_rate_max,
      processing_fee_percent,
      prepayment_allowed,
      prepayment_penalty_percent,
      collateral_required,
      guarantor_required,
      insurance_required,
      document_requirements,
      eligibility_criteria,
      terms_conditions,
      is_active,
      metadata,
    }, req.tenantId!, req.userId!);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    } as ApiResponse);
  });

  getProducts = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      product_category: req.query.product_category as string,
      product_type: req.query.product_type as string,
      is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const products = await this.productService.getProducts(req.tenantId!, filters);

    res.json({
      success: true,
      data: products,
    } as ApiResponse);
  });

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(id, req.tenantId!);

    res.json({
      success: true,
      data: product,
    } as ApiResponse);
  });

  getProductByCode = asyncHandler(async (req: Request, res: Response) => {
    const { productCode } = req.params;
    const product = await this.productService.getProductByCode(productCode, req.tenantId!);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    console.log(product);
    res.json({
      success: true,
      data: product,
    } as ApiResponse);
  });

  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const productData = req.body;

    const product = await this.productService.updateProduct(id, productData, req.tenantId!, req.userId!);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    } as ApiResponse);
  });

  softDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.softDeleteProduct(id, req.tenantId!, req.userId!);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    } as ApiResponse);
  });

  restoreProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.restoreProduct(id, req.tenantId!);

    res.json({
      success: true,
      message: 'Product restored successfully',
      data: product,
    } as ApiResponse);
  });

  getProductCount = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      product_category: req.query.product_category as string,
      is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
    };

    const count = await this.productService.getProductCount(req.tenantId!, filters);

    res.json({
      success: true,
      data: { count },
    } as ApiResponse);
  });
}
