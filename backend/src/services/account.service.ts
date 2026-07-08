import { AccountRepository } from '../repositories/account.repository';
import { logger } from '../utils/logger';

export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async createAccount(accountData: any, tenantId: string, userId: string) {
    // Generate account code
    const accountNumber = await this.generateAccountNumber(tenantId);

    const account = {
      ...accountData,
      tenant_id: tenantId,
      account_number: accountNumber,
      created_by: userId,
      updated_by: userId,
    };

    const createdAccount = await this.accountRepository.create(account);

    // Add audit log
    await this.logAudit('ACCOUNT', createdAccount.id, 'CREATED', null, account, userId, tenantId);

    return createdAccount;
  }

  async getAccounts(tenantId: string, filters: any = {}) {
    return await this.accountRepository.findAll(tenantId, filters);
  }

  async getAccountById(id: string, tenantId: string) {
    const account = await this.accountRepository.findById(id, tenantId);
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }

  async getAccountByNumber(accountNumber: string, tenantId: string) {
    return await this.accountRepository.findByAccountNumber(accountNumber, tenantId);
  }

  async getAccountsByCustomerId(customerId: string, tenantId: string) {
    return await this.accountRepository.findByCustomerId(customerId, tenantId);
  }

  async updateAccount(id: string, accountData: any, tenantId: string, userId: string) {
    const existingAccount = await this.accountRepository.findById(id, tenantId);
    if (!existingAccount) {
      throw new Error('Account not found');
    }

    const updatedAccount = await this.accountRepository.update(id, {
      ...accountData,
      updated_by: userId,
    }, tenantId);

    // Add audit log
    await this.logAudit('ACCOUNT', id, 'UPDATED', existingAccount, updatedAccount, userId, tenantId);

    return updatedAccount;
  }

  async softDeleteAccount(id: string, tenantId: string, userId: string) {
    const existingAccount = await this.accountRepository.findById(id, tenantId);
    if (!existingAccount) {
      throw new Error('Account not found');
    }

    const deletedAccount = await this.accountRepository.softDelete(id, tenantId, userId);

    // Add audit log
    await this.logAudit('ACCOUNT', id, 'DELETED', existingAccount, null, userId, tenantId);

    return deletedAccount;
  }

  async restoreAccount(id: string, tenantId: string) {
    return await this.accountRepository.restore(id, tenantId);
  }

  async getAccountCount(tenantId: string, filters: any = {}) {
    return await this.accountRepository.count(tenantId, filters);
  }

  private async generateAccountNumber(tenantId: string): Promise<string> {
    // Generate a unique account number
    // Format: ACC-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `ACC-${dateStr}-${random}`;
  }

  private async logAudit(entityType: string, entityId: string, action: string, oldValue: any, newValue: any, userId: string, tenantId: string) {
    // TODO: Implement audit logging
    logger.info('Audit log', { entityType, entityId, action, userId });
  }
}
