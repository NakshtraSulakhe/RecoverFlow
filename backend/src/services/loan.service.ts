import { LoanRepository } from '../repositories/loan.repository';
import { logger } from '../utils/logger';

export class LoanService {
  constructor(private loanRepository: LoanRepository) {}

  async createLoan(loanData: any, tenantId: string, userId: string) {
    // Generate loan number
    const loanNumber = await this.generateLoanNumber(tenantId);

    const loan = {
      ...loanData,
      tenant_id: tenantId,
      loan_number: loanNumber,
      created_by: userId,
      updated_by: userId,
    };

    const createdLoan = await this.loanRepository.create(loan);

    // Add audit log
    await this.logAudit('LOAN', createdLoan.id, 'CREATED', null, loan, userId, tenantId);

    return createdLoan;
  }

  async getLoans(tenantId: string, filters: any = {}) {
    return await this.loanRepository.findAll(tenantId, filters);
  }

  async getLoanById(id: string, tenantId: string) {
    const loan = await this.loanRepository.findById(id, tenantId);
    if (!loan) {
      throw new Error('Loan not found');
    }
    return loan;
  }

  async getLoanByNumber(loanNumber: string, tenantId: string) {
    return await this.loanRepository.findByLoanNumber(loanNumber, tenantId);
  }

  async getLoansByCustomerId(customerId: string, tenantId: string) {
    return await this.loanRepository.findByCustomerId(customerId, tenantId);
  }

  async updateLoan(id: string, loanData: any, tenantId: string, userId: string) {
    const existingLoan = await this.loanRepository.findById(id, tenantId);
    if (!existingLoan) {
      throw new Error('Loan not found');
    }

    const updatedLoan = await this.loanRepository.update(id, {
      ...loanData,
      updated_by: userId,
    }, tenantId);

    // Add audit log
    await this.logAudit('LOAN', id, 'UPDATED', existingLoan, updatedLoan, userId, tenantId);

    return updatedLoan;
  }

  async softDeleteLoan(id: string, tenantId: string, userId: string) {
    const existingLoan = await this.loanRepository.findById(id, tenantId);
    if (!existingLoan) {
      throw new Error('Loan not found');
    }

    const deletedLoan = await this.loanRepository.softDelete(id, tenantId, userId);

    // Add audit log
    await this.logAudit('LOAN', id, 'DELETED', existingLoan, null, userId, tenantId);

    return deletedLoan;
  }

  async restoreLoan(id: string, tenantId: string) {
    return await this.loanRepository.restore(id, tenantId);
  }

  async getLoanCount(tenantId: string, filters: any = {}) {
    return await this.loanRepository.count(tenantId, filters);
  }

  // Collateral Management
  async addLoanCollateral(loanId: string, collateralData: any, userId: string, tenantId: string) {
    const loan = await this.loanRepository.findById(loanId, tenantId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    const collateral = await this.loanRepository.addCollateral(loanId, {
      ...collateralData,
      created_by: userId,
    });

    return collateral;
  }

  async getLoanCollaterals(loanId: string, tenantId: string) {
    const loan = await this.loanRepository.findById(loanId, tenantId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    return await this.loanRepository.getCollaterals(loanId);
  }

  // Guarantor Management
  async addLoanGuarantor(loanId: string, guarantorData: any, userId: string, tenantId: string) {
    const loan = await this.loanRepository.findById(loanId, tenantId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    const guarantor = await this.loanRepository.addGuarantor(loanId, {
      ...guarantorData,
      created_by: userId,
    });

    return guarantor;
  }

  async getLoanGuarantors(loanId: string, tenantId: string) {
    const loan = await this.loanRepository.findById(loanId, tenantId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    return await this.loanRepository.getGuarantors(loanId);
  }

  private async generateLoanNumber(tenantId: string): Promise<string> {
    // Generate a unique loan number
    // Format: LOAN-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `LOAN-${dateStr}-${random}`;
  }

  private async logAudit(entityType: string, entityId: string, action: string, oldValue: any, newValue: any, userId: string, tenantId: string) {
    // TODO: Implement audit logging
    logger.info('Audit log', { entityType, entityId, action, userId });
  }
}
