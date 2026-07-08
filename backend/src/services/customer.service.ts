import { CustomerRepository } from '../repositories/customer.repository';
import { logger } from '../utils/logger';

export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async createCustomer(customerData: any, tenantId: string, userId: string) {
    // Generate customer code
    const customerCode = await this.generateCustomerCode(tenantId);

    const customer = {
      ...customerData,
      tenant_id: tenantId,
      customer_code: customerCode,
      display_name: customerData.display_name || 
                    `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim(),
      created_by: userId,
      updated_by: userId,
    };

    const createdCustomer = await this.customerRepository.create(customer);

    // Add audit log
    await this.logAudit('CUSTOMER', createdCustomer.id, 'CREATED', null, customer, userId, tenantId);

    return createdCustomer;
  }

  async getCustomers(tenantId: string, filters: any = {}) {
    return await this.customerRepository.findAll(tenantId, filters);
  }

  async getCustomerById(id: string, tenantId: string) {
    const customer = await this.customerRepository.findById(id, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async getCustomerByCode(customerCode: string, tenantId: string) {
    return await this.customerRepository.findByCustomerCode(customerCode, tenantId);
  }

  async searchCustomers(tenantId: string, searchTerm: string) {
    return await this.customerRepository.findAll(tenantId, { search: searchTerm });
  }

  async updateCustomer(id: string, customerData: any, tenantId: string, userId: string) {
    const existingCustomer = await this.customerRepository.findById(id, tenantId);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    const updatedCustomer = await this.customerRepository.update(id, {
      ...customerData,
      updated_by: userId,
    }, tenantId);

    // Add audit log
    await this.logAudit('CUSTOMER', id, 'UPDATED', existingCustomer, updatedCustomer, userId, tenantId);

    return updatedCustomer;
  }

  async softDeleteCustomer(id: string, tenantId: string, userId: string) {
    const existingCustomer = await this.customerRepository.findById(id, tenantId);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    const deletedCustomer = await this.customerRepository.softDelete(id, tenantId, userId);

    // Add audit log
    await this.logAudit('CUSTOMER', id, 'DELETED', existingCustomer, null, userId, tenantId);

    return deletedCustomer;
  }

  async restoreCustomer(id: string, tenantId: string) {
    return await this.customerRepository.restore(id, tenantId);
  }

  async getCustomerCount(tenantId: string, filters: any = {}) {
    return await this.customerRepository.count(tenantId, filters);
  }

  // Address Management
  async addCustomerAddress(customerId: string, addressData: any, userId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // If this is set as primary, unset other primary addresses of same type
    if (addressData.is_primary) {
      // TODO: Update other addresses to is_primary = false
    }

    const address = await this.customerRepository.addAddress(customerId, {
      ...addressData,
      created_by: userId,
    });

    return address;
  }

  async getCustomerAddresses(customerId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return await this.customerRepository.getAddresses(customerId);
  }

  // Contact Management
  async addCustomerContact(customerId: string, contactData: any, userId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const contact = await this.customerRepository.addContact(customerId, {
      ...contactData,
      created_by: userId,
    });

    return contact;
  }

  async getCustomerContacts(customerId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return await this.customerRepository.getContacts(customerId);
  }

  // Employment Management
  async addCustomerEmployment(customerId: string, employmentData: any, userId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const employment = await this.customerRepository.addEmployment(customerId, {
      ...employmentData,
      created_by: userId,
    });

    return employment;
  }

  async getCustomerEmployment(customerId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return await this.customerRepository.getEmployment(customerId);
  }

  // Document Management
  async addCustomerDocument(customerId: string, documentData: any, userId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const document = await this.customerRepository.addDocument(customerId, {
      ...documentData,
      created_by: userId,
    });

    return document;
  }

  async getCustomerDocuments(customerId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return await this.customerRepository.getDocuments(customerId);
  }

  // Notes Management
  async addCustomerNote(customerId: string, noteData: any, userId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const note = await this.customerRepository.addNote(customerId, {
      ...noteData,
      created_by: userId,
    });

    return note;
  }

  async getCustomerNotes(customerId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return await this.customerRepository.getNotes(customerId);
  }

  // Tags Management
  async addCustomerTag(customerId: string, tagData: any, userId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const tag = await this.customerRepository.addTag(customerId, {
      ...tagData,
      created_by: userId,
    });

    return tag;
  }

  async getCustomerTags(customerId: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return await this.customerRepository.getTags(customerId);
  }

  async removeCustomerTag(customerId: string, tagName: string, tenantId: string) {
    const customer = await this.customerRepository.findById(customerId, tenantId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return await this.customerRepository.removeTag(customerId, tagName);
  }

  // Duplicate Detection
  async findPotentialDuplicates(customerData: any, tenantId: string) {
    const duplicates = [];

    // Check by phone
    if (customerData.primary_phone) {
      const phoneMatch = await this.customerRepository.findByPhone(customerData.primary_phone, tenantId);
      if (phoneMatch) {
        duplicates.push({ field: 'phone', customer: phoneMatch });
      }
    }

    // Check by email
    if (customerData.primary_email) {
      const emailMatch = await this.customerRepository.findByEmail(customerData.primary_email, tenantId);
      if (emailMatch) {
        duplicates.push({ field: 'email', customer: emailMatch });
      }
    }

    // Check by ID number
    if (customerData.id_number) {
      const idMatch = await this.customerRepository.findAll(tenantId, { id_number: customerData.id_number });
      if (idMatch.length > 0) {
        duplicates.push({ field: 'id_number', customers: idMatch });
      }
    }

    return duplicates;
  }

  // Merge Customers
  async mergeCustomers(primaryCustomerId: string, secondaryCustomerIds: string[], tenantId: string, userId: string) {
    // This is a complex operation that needs to:
    // 1. Move all accounts from secondary to primary
    // 2. Move all loans from secondary to primary
    // 3. Move all recovery cases from secondary to primary
    // 4. Merge contacts, addresses, documents
    // 5. Soft delete secondary customers
    // TODO: Implement merge logic
    throw new Error('Merge functionality not yet implemented');
  }

  private async generateCustomerCode(tenantId: string): Promise<string> {
    // Generate a unique customer code
    // Format: CUST-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `CUST-${dateStr}-${random}`;
  }

  private async logAudit(entityType: string, entityId: string, action: string, oldValue: any, newValue: any, userId: string, tenantId: string) {
    // TODO: Implement audit logging
    logger.info('Audit log', { entityType, entityId, action, userId });
  }
}
