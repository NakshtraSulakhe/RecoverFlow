import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, RecoveryCase, PromiseToPay } from '../types';
import { logger } from '../utils/logger';

class RecoveryController {
  createCase = asyncHandler(async (req: Request, res: Response) => {
    const { loan_id, customer_id, priority } = req.body;

    if (!loan_id || !customer_id) {
      throw new AppError('Missing required fields', 400);
    }

    const recoveryCase: RecoveryCase = {
      id: uuidv4(),
      tenant_id: req.tenantId || uuidv4(),
      loan_id,
      customer_id,
      case_code: `CASE-${Date.now()}`,
      stage: 'new',
      priority: priority || 'medium',
      recovery_score: 75,
      risk_score: 50,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    logger.info('Recovery case created successfully', { caseId: recoveryCase.id, tenantId: recoveryCase.tenant_id });

    res.status(201).json({
      success: true,
      message: 'Recovery case created successfully',
      data: recoveryCase,
    } as ApiResponse);
  });

  getAllCases = asyncHandler(async (_req: Request, res: Response) => {
    const cases: RecoveryCase[] = [];

    res.status(200).json({
      success: true,
      message: 'Recovery cases retrieved successfully',
      data: cases,
      meta: { total: 0, page: 1, limit: 10, total_pages: 0 },
    } as ApiResponse);
  });

  getCaseById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const recoveryCase: RecoveryCase = {
      id,
      tenant_id: req.tenantId || uuidv4(),
      loan_id: uuidv4(),
      customer_id: uuidv4(),
      case_code: 'CASE-001',
      stage: 'negotiation',
      priority: 'high',
      recovery_score: 75,
      risk_score: 50,
      assigned_agent_id: uuidv4(),
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    res.status(200).json({
      success: true,
      message: 'Recovery case retrieved successfully',
      data: recoveryCase,
    } as ApiResponse);
  });

  createPTP = asyncHandler(async (req: Request, res: Response) => {
    const { recovery_case_id, amount, promise_date, notes } = req.body;

    if (!recovery_case_id || !amount || !promise_date) {
      throw new AppError('Missing required fields', 400);
    }

    const ptp: PromiseToPay = {
      id: uuidv4(),
      tenant_id: req.tenantId || uuidv4(),
      recovery_case_id,
      amount,
      promise_date: new Date(promise_date),
      status: 'pending',
      notes,
      created_at: new Date(),
      updated_at: new Date(),
    };

    logger.info('PTP created successfully', { ptpId: ptp.id, tenantId: ptp.tenant_id });

    res.status(201).json({
      success: true,
      message: 'PTP created successfully',
      data: ptp,
    } as ApiResponse);
  });

  getPTPById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const ptp: PromiseToPay = {
      id,
      tenant_id: req.tenantId || uuidv4(),
      recovery_case_id: uuidv4(),
      amount: 5000,
      promise_date: new Date(),
      status: 'pending',
      notes: 'Customer promised to pay on 15th',
      created_at: new Date(),
      updated_at: new Date(),
    };

    res.status(200).json({
      success: true,
      message: 'PTP retrieved successfully',
      data: ptp,
    } as ApiResponse);
  });
}

export const recoveryController = new RecoveryController();
