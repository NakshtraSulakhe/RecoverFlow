import { RecoveryCaseRepository } from '../repositories/recovery-case.repository';
import { logger } from '../utils/logger';

export class RecoveryCaseService {
  constructor(private recoveryCaseRepository: RecoveryCaseRepository) {}

  async createRecoveryCase(caseData: any, tenantId: string, userId: string) {
    // Generate case number
    const caseNumber = await this.generateCaseNumber(tenantId);

    const recoveryCase = {
      ...caseData,
      tenant_id: tenantId,
      case_number: caseNumber,
      assigned_date: caseData.assigned_date || new Date(),
      created_by: userId,
      updated_by: userId,
    };

    const createdCase = await this.recoveryCaseRepository.create(recoveryCase);

    // Add case history
    await this.recoveryCaseRepository.addHistory(createdCase.id, {
      event_type: 'CASE_CREATED',
      event_category: 'SYSTEM',
      event_title: 'Case Created',
      event_description: `Recovery case ${caseNumber} created for loan`,
      performed_by: userId,
    });

    // Add audit log
    await this.logAudit('RECOVERY_CASE', createdCase.id, 'CREATED', null, recoveryCase, userId, tenantId);

    return createdCase;
  }

  async getRecoveryCases(tenantId: string, filters: any = {}) {
    return await this.recoveryCaseRepository.findAll(tenantId, filters);
  }

  async getRecoveryCaseById(id: string, tenantId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(id, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }
    return recoveryCase;
  }

  async getRecoveryCaseByNumber(caseNumber: string, tenantId: string) {
    return await this.recoveryCaseRepository.findByCaseNumber(caseNumber, tenantId);
  }

  async getRecoveryCasesByLoanId(loanId: string, tenantId: string) {
    return await this.recoveryCaseRepository.findByLoanId(loanId, tenantId);
  }

  async getRecoveryCasesByCustomerId(customerId: string, tenantId: string) {
    return await this.recoveryCaseRepository.findByCustomerId(customerId, tenantId);
  }

  async updateRecoveryCase(id: string, caseData: any, tenantId: string, userId: string) {
    const existingCase = await this.recoveryCaseRepository.findById(id, tenantId);
    if (!existingCase) {
      throw new Error('Recovery case not found');
    }

    const updatedCase = await this.recoveryCaseRepository.update(id, {
      ...caseData,
      updated_by: userId,
    }, tenantId);

    // Add case history for status changes
    if (caseData.case_status && caseData.case_status !== existingCase.case_status) {
      await this.recoveryCaseRepository.addHistory(id, {
        event_type: 'STATUS_CHANGED',
        event_category: 'STATUS',
        event_title: 'Status Changed',
        event_description: `Case status changed from ${existingCase.case_status} to ${caseData.case_status}`,
        old_value: { case_status: existingCase.case_status },
        new_value: { case_status: caseData.case_status },
        performed_by: userId,
      });
    }

    // Add audit log
    await this.logAudit('RECOVERY_CASE', id, 'UPDATED', existingCase, updatedCase, userId, tenantId);

    return updatedCase;
  }

  async softDeleteRecoveryCase(id: string, tenantId: string, userId: string) {
    const existingCase = await this.recoveryCaseRepository.findById(id, tenantId);
    if (!existingCase) {
      throw new Error('Recovery case not found');
    }

    const deletedCase = await this.recoveryCaseRepository.softDelete(id, tenantId, userId);

    // Add audit log
    await this.logAudit('RECOVERY_CASE', id, 'DELETED', existingCase, null, userId, tenantId);

    return deletedCase;
  }

  async restoreRecoveryCase(id: string, tenantId: string) {
    return await this.recoveryCaseRepository.restore(id, tenantId);
  }

  async getRecoveryCaseCount(tenantId: string, filters: any = {}) {
    return await this.recoveryCaseRepository.count(tenantId, filters);
  }

  // Assignment Management
  async assignCase(caseId: string, assignmentData: any, tenantId: string, userId: string) {
    const existingCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!existingCase) {
      throw new Error('Recovery case not found');
    }

    // Update case assignment
    const updatedCase = await this.recoveryCaseRepository.update(caseId, {
      assigned_user_id: assignmentData.assigned_to_user_id,
      assigned_team_id: assignmentData.assigned_to_team_id,
      assigned_business_unit_id: assignmentData.assigned_to_business_unit_id,
      updated_by: userId,
    }, tenantId);

    // Add assignment record
    await this.recoveryCaseRepository.addAssignment({
      case_id: caseId,
      assigned_from_user_id: existingCase.assigned_user_id,
      assigned_to_user_id: assignmentData.assigned_to_user_id,
      assigned_from_team_id: existingCase.assigned_team_id,
      assigned_to_team_id: assignmentData.assigned_to_team_id,
      assigned_from_business_unit_id: existingCase.assigned_business_unit_id,
      assigned_to_business_unit_id: assignmentData.assigned_to_business_unit_id,
      assignment_type: assignmentData.assignment_type || 'MANUAL',
      assignment_reason: assignmentData.assignment_reason,
      assigned_by: userId,
    });

    // Add case history
    await this.recoveryCaseRepository.addHistory(caseId, {
      event_type: 'ASSIGNED',
      event_category: 'ASSIGNMENT',
      event_title: 'Case Assigned',
      event_description: `Case assigned to user/team`,
      old_value: { 
        assigned_user_id: existingCase.assigned_user_id,
        assigned_team_id: existingCase.assigned_team_id,
      },
      new_value: {
        assigned_user_id: assignmentData.assigned_to_user_id,
        assigned_team_id: assignmentData.assigned_to_team_id,
      },
      performed_by: userId,
    });

    return updatedCase;
  }

  async getCaseAssignments(caseId: string, tenantId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }

    return await this.recoveryCaseRepository.getAssignments(caseId);
  }

  // Timeline/History Management
  async getCaseHistory(caseId: string, tenantId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }

    return await this.recoveryCaseRepository.getHistory(caseId);
  }

  async addCaseHistoryEvent(caseId: string, historyData: any, tenantId: string, userId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }

    return await this.recoveryCaseRepository.addHistory(caseId, {
      ...historyData,
      performed_by: userId,
    });
  }

  // Tags Management
  async addCaseTag(caseId: string, tagData: any, userId: string, tenantId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }

    const tag = await this.recoveryCaseRepository.addTag(caseId, {
      ...tagData,
      created_by: userId,
    });

    return tag;
  }

  async getCaseTags(caseId: string, tenantId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }

    return await this.recoveryCaseRepository.getTags(caseId);
  }

  async removeCaseTag(caseId: string, tagName: string, tenantId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }

    return await this.recoveryCaseRepository.removeTag(caseId, tagName);
  }

  // Notes Management
  async addCaseNote(caseId: string, noteData: any, userId: string, tenantId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }

    const note = await this.recoveryCaseRepository.addNote(caseId, {
      ...noteData,
      created_by: userId,
    });

    return note;
  }

  async getCaseNotes(caseId: string, tenantId: string) {
    const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
    if (!recoveryCase) {
      throw new Error('Recovery case not found');
    }

    return await this.recoveryCaseRepository.getNotes(caseId);
  }

  // Dashboard Statistics
  async getDashboardStats(tenantId: string, userId?: string) {
    return await this.recoveryCaseRepository.getDashboardStats(tenantId, userId);
  }

  private async generateCaseNumber(tenantId: string): Promise<string> {
    // Generate a unique case number
    // Format: CASE-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `CASE-${dateStr}-${random}`;
  }

  private async logAudit(entityType: string, entityId: string, action: string, oldValue: any, newValue: any, userId: string, tenantId: string) {
    // TODO: Implement audit logging
    logger.info('Audit log', { entityType, entityId, action, userId });
  }
}
