import { Request, Response } from 'express';
import { AccountService } from '../services/account.service';
import { AppError } from '../utils/app-error';
import { asyncHandler } from '../utils/async-handler';
import { ApiResponse } from '../types';

export class AccountController {
  constructor(private accountService: AccountService) {}

  createAccount = asyncHandler(async (req: Request, res: Response) => {
    const { customer_id, account_type, account_name, product_id, branch_id, opened_date, credit_limit, currency, interest_rate, account_holder_name, joint_account_holders, nominee_name, nominee_relationship, is_primary_account, notes, metadata } = req.body;

    if (!customer_id || !account_type || !account_name || !opened_date) {
      throw new AppError('Missing required fields: customer_id, account_type, account_name, opened_date', 400);
    }

    const account = await this.accountService.createAccount({
      customer_id,
      account_type,
      account_name,
      product_id,
      branch_id,
      opened_date,
      credit_limit,
      currency,
      interest_rate,
      account_holder_name,
      joint_account_holders,
      nominee_name,
      nominee_relationship,
      is_primary_account,
      notes,
      metadata,
    }, req.tenantId!, req.userId!);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account,
    } as ApiResponse);
  });

  getAccounts = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      customer_id: req.query.customer_id as string,
      account_type: req.query.account_type as string,
      status: req.query.status as string,
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const accounts = await this.accountService.getAccounts(req.tenantId!, filters);

    res.json({
      success: true,
      data: accounts,
    } as ApiResponse);
  });

  getAccountById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await this.accountService.getAccountById(id, req.tenantId!);

    res.json({
      success: true,
      data: account,
    } as ApiResponse);
  });

  getAccountByNumber = asyncHandler(async (req: Request, res: Response) => {
    const { accountNumber } = req.params;
    const account = await this.accountService.getAccountByNumber(accountNumber, req.tenantId!);

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    res.json({
      success: true,
      data: account,
    } as ApiResponse);
  });

  getAccountsByCustomerId = asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const accounts = await this.accountService.getAccountsByCustomerId(customerId, req.tenantId!);

    res.json({
      success: true,
      data: accounts,
    } as ApiResponse);
  });

  updateAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const accountData = req.body;

    const account = await this.accountService.updateAccount(id, accountData, req.tenantId!, req.userId!);

    res.json({
      success: true,
      message: 'Account updated successfully',
      data: account,
    } as ApiResponse);
  });

  softDeleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await this.accountService.softDeleteAccount(id, req.tenantId!, req.userId!);

    res.json({
      success: true,
      message: 'Account deleted successfully',
      data: account,
    } as ApiResponse);
  });

  restoreAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await this.accountService.restoreAccount(id, req.tenantId!);

    res.json({
      success: true,
      message: 'Account restored successfully',
      data: account,
    } as ApiResponse);
  });

  getAccountCount = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      customer_id: req.query.customer_id as string,
      status: req.query.status as string,
    };

    const count = await this.accountService.getAccountCount(req.tenantId!, filters);

    res.json({
      success: true,
      data: { count },
    } as ApiResponse);
  });
}
