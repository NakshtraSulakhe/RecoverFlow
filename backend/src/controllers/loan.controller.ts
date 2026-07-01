import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, Loan } from '../types';
import { logger } from '../utils/logger';

class LoanController {
  createLoan = asyncHandler(async (req: Request, res: Response) => {
    const { customer_id, principal_amount, interest_rate, tenure_months, emi_amount, due_date } = req.body;

    if (!customer_id || !principal_amount || !interest_rate || !tenure_months) {
      throw new AppError('Missing required fields', 400);
    }

    const loan: Loan = {
      id: uuidv4(),
      tenant_id: req.tenantId || uuidv4(),
      customer_id,
      loan_code: `LOAN-${Date.now()}`,
      loan_type_id: uuidv4(),
      principal_amount,
      outstanding_amount: principal_amount,
      interest_rate,
      tenure_months,
      emi_amount: emi_amount || 0,
      disbursement_date: new Date(),
      due_date: due_date ? new Date(due_date) : new Date(),
      status: 'active',
      dpd_days: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    logger.info('Loan created successfully', { loanId: loan.id, tenantId: loan.tenant_id });

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      data: loan,
    } as ApiResponse);
  });

  getAllLoans = asyncHandler(async (_req: Request, res: Response) => {
    const loans: Loan[] = [];

    res.status(200).json({
      success: true,
      message: 'Loans retrieved successfully',
      data: loans,
      meta: { total: 0, page: 1, limit: 10, total_pages: 0 },
    } as ApiResponse);
  });

  getLoanById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const loan: Loan = {
      id,
      tenant_id: req.tenantId || uuidv4(),
      customer_id: uuidv4(),
      loan_code: 'LOAN-001',
      loan_type_id: uuidv4(),
      principal_amount: 100000,
      outstanding_amount: 75000,
      interest_rate: 12,
      tenure_months: 12,
      emi_amount: 8885,
      disbursement_date: new Date(),
      due_date: new Date(),
      status: 'active',
      dpd_days: 30,
      created_at: new Date(),
      updated_at: new Date(),
    };

    res.status(200).json({
      success: true,
      message: 'Loan retrieved successfully',
      data: loan,
    } as ApiResponse);
  });
}

export const loanController = new LoanController();
