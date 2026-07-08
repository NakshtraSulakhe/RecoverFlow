import { Request, Response } from 'express';
import { RecoveryCaseService } from '../services/recovery-case.service';
import { AppError } from '../utils/app-error';
import { asyncHandler } from '../utils/async-handler';
import { ApiResponse } from '../types';

export class RecoveryCaseController {
  constructor(private recoveryCaseService: RecoveryCaseService) {}

  createRecoveryCase = asyncHandler(async (req: Request, res: Response) => {
    const { loan_id, customer_id, case_type_id, case_type, case_priority, case_status, workflow_template_id, assigned_business_unit_id, assigned_team_id, assigned_user_id, expected_resolution_date, total_outstanding, risk_score, recovery_probability, sla_breach_date, notes, custom_fields, metadata } = req.body;

    if (!loan_id || !customer_id || !case_type || !case_priority || !case_status || !total_outstanding) {
      throw new AppError('Missing required fields: loan_id, customer_id, case_type, case_priority, case_status, total_outstanding', 400);
    }

    const recoveryCase = await this.recoveryCaseService.createRecoveryCase({
      loan_id,
      customer_id,
      case_type_id,
      case_type,
      case_priority,
      case_status,
      workflow_template_id,
      assigned_business_unit_id,
      assigned_team_id,
      assigned_user_id,
      expected_resolution_date,
      total_outstanding,
      risk_score,
      recovery_probability,
      sla_breach_date,
      notes,
      custom_fields,
      metadata,
    }, req.tenantId!, req.userId!);

    res.status(201).json({
      success: true,
      message: 'Recovery case created successfully',
      data: recoveryCase,
    } as ApiResponse);
  });

  getRecoveryCases = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      customer_id: req.query.customer_id as string,
      loan_id: req.query.loan_id as string,
      case_type: req.query.case_type as string,
      case_priority: req.query.case_priority as string,
      case_status: req.query.case_status as string,
      assigned_user_id: req.query.assigned_user_id as string,
      assigned_team_id: req.query.assigned_team_id as string,
      assigned_business_unit_id: req.query.assigned_business_unit_id as string,
      sla_status: req.query.sla_status as string,
      ptp_status: req.query.ptp_status as string,
      risk_min: req.query.risk_min ? parseFloat(req.query.risk_min as string) : undefined,
      risk_max: req.query.risk_max ? parseFloat(req.query.risk_max as string) : undefined,
      next_follow_up_from: req.query.next_follow_up_from as string,
      next_follow_up_to: req.query.next_follow_up_to as string,
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const recoveryCases = await this.recoveryCaseService.getRecoveryCases(req.tenantId!, filters);

    res.json({
      success: true,
      data: recoveryCases,
    } as ApiResponse);
  });

  getRecoveryCaseById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const recoveryCase = await this.recoveryCaseService.getRecoveryCaseById(id, req.tenantId!);

    res.json({
      success: true,
      data: recoveryCase,
    } as ApiResponse);
  });

  getRecoveryCaseByNumber = asyncHandler(async (req: Request, res: Response) => {
    const { caseNumber } = req.params;
    const recoveryCase = await this.recoveryCaseService.getRecoveryCaseByNumber(caseNumber, req.tenantId!);

    if (!recoveryCase) {
      throw new AppError('Recovery case not found', 404);
    }

    res.json({
      success: true,
      data: recoveryCase,
    } as ApiResponse);
  });

  getRecoveryCasesByLoanId = asyncHandler(async (req: Request, res: Response) => {
    const { loanId } = req.params;
    const recoveryCases = await this.recoveryCaseService.getRecoveryCasesByLoanId(loanId, req.tenantId!);

    res.json({
      success: true,
      data: recoveryCases,
    } as ApiResponse);
  });

  getRecoveryCasesByCustomerId = asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const recoveryCases = await this.recoveryCaseService.getRecoveryCasesByCustomerId(customerId, req.tenantId!);

    res.json({
      success: true,
      data: recoveryCases,
    } as ApiResponse);
  });

  updateRecoveryCase = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const caseData = req.body;

    const recoveryCase = await this.recoveryCaseService.updateRecoveryCase(id, caseData, req.tenantId!, req.userId!);

    res.json({
      success: true,
      message: 'Recovery case updated successfully',
      data: recoveryCase,
    } as ApiResponse);
  });

  softDeleteRecoveryCase = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const recoveryCase = await this.recoveryCaseService.softDeleteRecoveryCase(id, req.tenantId!, req.userId!);

    res.json({
      success: true,
      message: 'Recovery case deleted successfully',
      data: recoveryCase,
    } as ApiResponse);
  });

  restoreRecoveryCase = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const recoveryCase = await this.recoveryCaseService.restoreRecoveryCase(id, req.tenantId!);

    res.json({
      success: true,
      message: 'Recovery case restored successfully',
      data: recoveryCase,
    } as ApiResponse);
  });

  getRecoveryCaseCount = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      case_status: req.query.case_status as string,
      assigned_user_id: req.query.assigned_user_id as string,
      sla_status: req.query.sla_status as string,
    };

    const count = await this.recoveryCaseService.getRecoveryCaseCount(req.tenantId!, filters);

    res.json({
      success: true,
      data: { count },
    } as ApiResponse);
  });

  // Assignment Management
  assignCase = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { assigned_to_user_id, assigned_to_team_id, assigned_to_business_unit_id, assignment_type, assignment_reason } = req.body;

    if (!assigned_to_user_id && !assigned_to_team_id && !assigned_to_business_unit_id) {
      throw new AppError('At least one of assigned_to_user_id, assigned_to_team_id, or assigned_to_business_unit_id is required', 400);
    }

    const recoveryCase = await this.recoveryCaseService.assignCase(id, {
      assigned_to_user_id,
      assigned_to_team_id,
      assigned_to_business_unit_id,
      assignment_type,
      assignment_reason,
    }, req.tenantId!, req.userId!);

    res.json({
      success: true,
      message: 'Case assigned successfully',
      data: recoveryCase,
    } as ApiResponse);
  });

  getCaseAssignments = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const assignments = await this.recoveryCaseService.getCaseAssignments(id, req.tenantId!);

    res.json({
      success: true,
      data: assignments,
    } as ApiResponse);
  });

  // Timeline/History Management
  getCaseHistory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const history = await this.recoveryCaseService.getCaseHistory(id, req.tenantId!);

    res.json({
      success: true,
      data: history,
    } as ApiResponse);
  });

  addCaseHistoryEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { event_type, event_category, event_title, event_description, old_value, new_value, metadata } = req.body;

    if (!event_type || !event_category || !event_title) {
      throw new AppError('Missing required fields: event_type, event_category, event_title', 400);
    }

    const historyEvent = await this.recoveryCaseService.addCaseHistoryEvent(id, {
      event_type,
      event_category,
      event_title,
      event_description,
      old_value,
      new_value,
      metadata,
    }, req.tenantId!, req.userId!);

    res.status(201).json({
      success: true,
      message: 'History event added successfully',
      data: historyEvent,
    } as ApiResponse);
  });

  // Tags Management
  addCaseTag = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tag_name, tag_color } = req.body;

    if (!tag_name) {
      throw new AppError('Missing required field: tag_name', 400);
    }

    const tag = await this.recoveryCaseService.addCaseTag(id, {
      tag_name,
      tag_color,
    }, req.userId!, req.tenantId!);

    res.status(201).json({
      success: true,
      message: 'Tag added successfully',
      data: tag,
    } as ApiResponse);
  });

  getCaseTags = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tags = await this.recoveryCaseService.getCaseTags(id, req.tenantId!);

    res.json({
      success: true,
      data: tags,
    } as ApiResponse);
  });

  removeCaseTag = asyncHandler(async (req: Request, res: Response) => {
    const { id, tagName } = req.params;
    const tag = await this.recoveryCaseService.removeCaseTag(id, tagName, req.tenantId!);

    res.json({
      success: true,
      message: 'Tag removed successfully',
      data: tag,
    } as ApiResponse);
  });

  // Notes Management
  addCaseNote = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { note_type, title, content, is_private } = req.body;

    if (!content) {
      throw new AppError('Missing required field: content', 400);
    }

    const note = await this.recoveryCaseService.addCaseNote(id, {
      note_type,
      title,
      content,
      is_private,
    }, req.userId, req.tenantId);

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: note,
    } as ApiResponse);
  });

  getCaseNotes = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const notes = await this.recoveryCaseService.getCaseNotes(id, req.tenantId!);

    res.json({
      success: true,
      data: notes,
    } as ApiResponse);
  });

  // Dashboard Statistics
  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.recoveryCaseService.getDashboardStats(req.tenantId!, req.userId!);

    res.json({
      success: true,
      data: stats,
    } as ApiResponse);
  });
}
