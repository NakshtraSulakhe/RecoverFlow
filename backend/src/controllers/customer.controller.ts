import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, Customer } from '../types';
import { logger } from '../utils/logger';

class CustomerController {
  createCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { first_name, last_name, phone, email } = req.body;

    if (!first_name || !last_name || !phone) {
      throw new AppError('Missing required fields', 400);
    }

    const customer: Customer = {
      id: uuidv4(),
      tenant_id: req.tenantId || uuidv4(),
      customer_code: `CUST-${Date.now()}`,
      first_name,
      last_name,
      email,
      phone,
      country_code: 'IN',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    logger.info('Customer created successfully', { customerId: customer.id, tenantId: customer.tenant_id });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    } as ApiResponse);
  });

  getAllCustomers = asyncHandler(async (_req: Request, res: Response) => {
    const customers: Customer[] = [];

    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers,
      meta: { total: 0, page: 1, limit: 10, total_pages: 0 },
    } as ApiResponse);
  });

  getCustomerById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer: Customer = {
      id,
      tenant_id: req.tenantId || uuidv4(),
      customer_code: 'CUST-001',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+919876543210',
      country_code: 'IN',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    res.status(200).json({
      success: true,
      message: 'Customer retrieved successfully',
      data: customer,
    } as ApiResponse);
  });

  updateCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer: Customer = {
      id,
      tenant_id: req.tenantId || uuidv4(),
      customer_code: 'CUST-001',
      first_name: req.body.first_name || 'John',
      last_name: req.body.last_name || 'Doe',
      email: req.body.email || 'john@example.com',
      phone: req.body.phone || '+919876543210',
      country_code: 'IN',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    logger.info('Customer updated successfully', { customerId: id });

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    } as ApiResponse);
  });
}

export const customerController = new CustomerController();
