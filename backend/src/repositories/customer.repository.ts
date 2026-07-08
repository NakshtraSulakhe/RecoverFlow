import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class CustomerRepository {
  constructor(private pool: Pool) {}

  async create(customer: any) {
    const query = `
      INSERT INTO customers (
        tenant_id, customer_code, customer_type, title, first_name, last_name,
        display_name, legal_name, date_of_birth, gender, nationality, id_type,
        id_number, id_expiry_date, tax_id, pan_number, aadhaar_number, primary_phone,
        primary_email, secondary_phone, secondary_email, preferred_contact_method,
        preferred_contact_time, employment_status, occupation, employer_name,
        annual_income, net_income, credit_score, credit_score_date, risk_score,
        risk_level, customer_segment, source, referred_by, relationship_manager_id,
        status, is_blacklisted, blacklist_reason, notes, preferences, custom_fields,
        metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44
      ) RETURNING *
    `;

    const values = [
      customer.tenant_id,
      customer.customer_code,
      customer.customer_type || 'individual',
      customer.title,
      customer.first_name,
      customer.last_name,
      customer.display_name,
      customer.legal_name,
      customer.date_of_birth,
      customer.gender,
      customer.nationality,
      customer.id_type,
      customer.id_number,
      customer.id_expiry_date,
      customer.tax_id,
      customer.pan_number,
      customer.aadhaar_number,
      customer.primary_phone,
      customer.primary_email,
      customer.secondary_phone,
      customer.secondary_email,
      customer.preferred_contact_method,
      customer.preferred_contact_time,
      customer.employment_status,
      customer.occupation,
      customer.employer_name,
      customer.annual_income,
      customer.net_income,
      customer.credit_score,
      customer.credit_score_date,
      customer.risk_score,
      customer.risk_level,
      customer.customer_segment,
      customer.source,
      customer.referred_by,
      customer.relationship_manager_id,
      customer.status || 'active',
      customer.is_blacklisted || false,
      customer.blacklist_reason,
      customer.notes,
      customer.preferences,
      customer.custom_fields,
      customer.metadata,
      customer.created_by,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Customer created', { customerId: result.rows[0].id });
    return result.rows[0];
  }

  async findAll(tenantId: string, filters: any = {}) {
    let query = `
      SELECT * FROM customers
      WHERE tenant_id = $1 AND is_deleted = false
    `;
    const values: any[] = [tenantId];
    let paramCount = 1;

    if (filters.search) {
      paramCount++;
      query += ` AND (
        display_name ILIKE $${paramCount} OR
        primary_phone ILIKE $${paramCount} OR
        primary_email ILIKE $${paramCount} OR
        customer_code ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
    }

    if (filters.status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
    }

    if (filters.risk_level) {
      paramCount++;
      query += ` AND risk_level = $${paramCount}`;
      values.push(filters.risk_level);
    }

    if (filters.customer_segment) {
      paramCount++;
      query += ` AND customer_segment = $${paramCount}`;
      values.push(filters.customer_segment);
    }

    query += ` ORDER BY created_at DESC`;

    if (filters.limitoffset) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async findById(id: string, tenantId: string) {
    const query = `
      SELECT * FROM customers
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = false
    `;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0];
  }

  async findByCustomerCode(customerCode: string, tenantId: string) {
    const query = `
      SELECT * FROM customers
      WHERE customer_code = $1 AND tenant_id = $2 AND is_deleted = false
    `;
    const result = await this.pool.query(query, [customerCode, tenantId]);
    return result.rows[0];
  }

  async findByPhone(phone: string, tenantId: string) {
    const query = `
      SELECT * FROM customers
      WHERE primary_phone = $1 AND tenant_id = $2 AND is_deleted = false
    `;
    const result = await this.pool.query(query, [phone, tenantId]);
    return result.rows[0];
  }

  async findByEmail(email: string, tenantId: string) {
    const query = `
      SELECT * FROM customers
      WHERE primary_email = $1 AND tenant_id = $2 AND is_deleted = false
    `;
    const result = await this.pool.query(query, [email, tenantId]);
    return result.rows[0];
  }

  async update(id: string, customer: any, tenantId: string) {
    const query = `
      UPDATE customers SET
        customer_type = COALESCE($2, customer_type),
        title = COALESCE($3, title),
        first_name = COALESCE($4, first_name),
        last_name = COALESCE($5, last_name),
        display_name = COALESCE($6, display_name),
        legal_name = COALESCE($7, legal_name),
        date_of_birth = COALESCE($8, date_of_birth),
        gender = COALESCE($9, gender),
        nationality = COALESCE($10, nationality),
        id_type = COALESCE($11, id_type),
        id_number = COALESCE($12, id_number),
        id_expiry_date = COALESCE($13, id_expiry_date),
        tax_id = COALESCE($14, tax_id),
        pan_number = COALESCE($15, pan_number),
        aadhaar_number = COALESCE($16, aadhaar_number),
        primary_phone = COALESCE($17, primary_phone),
        primary_email = COALESCE($18, primary_email),
        secondary_phone = COALESCE($19, secondary_phone),
        secondary_email = COALESCE($20, secondary_email),
        preferred_contact_method = COALESCE($21, preferred_contact_method),
        preferred_contact_time = COALESCE($22, preferred_contact_time),
        employment_status = COALESCE($23, employment_status),
        occupation = COALESCE($24, occupation),
        employer_name = COALESCE($25, employer_name),
        annual_income = COALESCE($26, annual_income),
        net_income = COALESCE($27, net_income),
        credit_score = COALESCE($28, credit_score),
        credit_score_date = COALESCE($29, credit_score_date),
        risk_score = COALESCE($30, risk_score),
        risk_level = COALESCE($31, risk_level),
        customer_segment = COALESCE($32, customer_segment),
        relationship_manager_id = COALESCE($33, relationship_manager_id),
        status = COALESCE($34, status),
        is_blacklisted = COALESCE($35, is_blacklisted),
        blacklist_reason = COALESCE($36, blacklist_reason),
        notes = COALESCE($37, notes),
        preferences = COALESCE($38, preferences),
        custom_fields = COALESCE($39, custom_fields),
        metadata = COALESCE($40, metadata),
        updated_by = $41,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND tenant_id = $42 AND is_deleted = false
      RETURNING *
    `;

    const values = [
      id,
      customer.customer_type,
      customer.title,
      customer.first_name,
      customer.last_name,
      customer.display_name,
      customer.legal_name,
      customer.date_of_birth,
      customer.gender,
      customer.nationality,
      customer.id_type,
      customer.id_number,
      customer.id_expiry_date,
      customer.tax_id,
      customer.pan_number,
      customer.aadhaar_number,
      customer.primary_phone,
      customer.primary_email,
      customer.secondary_phone,
      customer.secondary_email,
      customer.preferred_contact_method,
      customer.preferred_contact_time,
      customer.employment_status,
      customer.occupation,
      customer.employer_name,
      customer.annual_income,
      customer.net_income,
      customer.credit_score,
      customer.credit_score_date,
      customer.risk_score,
      customer.risk_level,
      customer.customer_segment,
      customer.relationship_manager_id,
      customer.status,
      customer.is_blacklisted,
      customer.blacklist_reason,
      customer.notes,
      customer.preferences,
      customer.custom_fields,
      customer.metadata,
      customer.updated_by,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Customer updated', { customerId: id });
    return result.rows[0];
  }

  async softDelete(id: string, tenantId: string, deletedBy: string) {
    const query = `
      UPDATE customers SET
        is_deleted = true,
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = $1
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = false
      RETURNING *
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);
    logger.info('Customer soft deleted', { customerId: id });
    return result.rows[0];
  }

  async restore(id: string, tenantId: string) {
    const query = `
      UPDATE customers SET
        is_deleted = false,
        deleted_at = NULL,
        deleted_by = NULL
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = true
      RETURNING *
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    logger.info('Customer restored', { customerId: id });
    return result.rows[0];
  }

  async count(tenantId: string, filters: any = {}) {
    let query = `
      SELECT COUNT(*) FROM customers
      WHERE tenant_id = $1 AND is_deleted = false
    `;
    const values: any[] = [tenantId];

    if (filters.status) {
      query += ` AND status = $2`;
      values.push(filters.status);
    }

    if (filters.risk_level) {
      query += ` AND risk_level = $${values.length + 1}`;
      values.push(filters.risk_level);
    }

    const result = await this.pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Customer Addresses
  async addAddress(customerId: string, address: any) {
    const query = `
      INSERT INTO customer_addresses (
        customer_id, address_type, address_line1, address_line2, address_line3,
        city, state, postal_code, country_code, is_primary, is_verified,
        from_date, to_date, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ) RETURNING *
    `;

    const values = [
      customerId,
      address.address_type,
      address.address_line1,
      address.address_line2,
      address.address_line3,
      address.city,
      address.state,
      address.postal_code,
      address.country_code,
      address.is_primary || false,
      address.is_verified || false,
      address.from_date || new Date(),
      address.to_date,
      address.metadata,
      address.created_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getAddresses(customerId: string) {
    const query = `
      SELECT * FROM customer_addresses
      WHERE customer_id = $1
      ORDER BY is_primary DESC, from_date DESC
    `;
    const result = await this.pool.query(query, [customerId]);
    return result.rows;
  }

  // Customer Contacts
  async addContact(customerId: string, contact: any) {
    const query = `
      INSERT INTO customer_contacts (
        customer_id, contact_type, contact_value, is_primary, is_verified,
        preferred, do_not_contact, dnc_reason, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *
    `;

    const values = [
      customerId,
      contact.contact_type,
      contact.contact_value,
      contact.is_primary || false,
      contact.is_verified || false,
      contact.preferred || false,
      contact.do_not_contact || false,
      contact.dnc_reason,
      contact.metadata,
      contact.created_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getContacts(customerId: string) {
    const query = `
      SELECT * FROM customer_contacts
      WHERE customer_id = $1
      ORDER BY is_primary DESC, preferred DESC
    `;
    const result = await this.pool.query(query, [customerId]);
    return result.rows;
  }

  // Customer Employment
  async addEmployment(customerId: string, employment: any) {
    const query = `
      INSERT INTO customer_employment (
        customer_id, employer_name, employment_type, job_title, department,
        employment_status, employment_start_date, employment_end_date, monthly_income,
        work_address_line1, work_address_line2, work_city, work_state,
        work_postal_code, work_country_code, work_phone, work_email,
        industry, company_size, is_current_employment, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22
      ) RETURNING *
    `;

    const values = [
      customerId,
      employment.employer_name,
      employment.employment_type,
      employment.job_title,
      employment.department,
      employment.employment_status,
      employment.employment_start_date,
      employment.employment_end_date,
      employment.monthly_income,
      employment.work_address_line1,
      employment.work_address_line2,
      employment.work_city,
      employment.work_state,
      employment.work_postal_code,
      employment.work_country_code,
      employment.work_phone,
      employment.work_email,
      employment.industry,
      employment.company_size,
      employment.is_current_employment !== undefined ? employment.is_current_employment : true,
      employment.metadata,
      employment.created_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getEmployment(customerId: string) {
    const query = `
      SELECT * FROM customer_employment
      WHERE customer_id = $1
      ORDER BY is_current_employment DESC, employment_start_date DESC
    `;
    const result = await this.pool.query(query, [customerId]);
    return result.rows;
  }

  // Customer Documents
  async addDocument(customerId: string, document: any) {
    const query = `
      INSERT INTO customer_documents (
        customer_id, document_type, document_name, document_number, issue_date,
        expiry_date, issuing_authority, file_url, file_name, file_size,
        file_mime_type, is_verified, verification_notes, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ) RETURNING *
    `;

    const values = [
      customerId,
      document.document_type,
      document.document_name,
      document.document_number,
      document.issue_date,
      document.expiry_date,
      document.issuing_authority,
      document.file_url,
      document.file_name,
      document.file_size,
      document.file_mime_type,
      document.is_verified || false,
      document.verification_notes,
      document.metadata,
      document.created_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getDocuments(customerId: string) {
    const query = `
      SELECT * FROM customer_documents
      WHERE customer_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [customerId]);
    return result.rows;
  }

  // Customer Notes
  async addNote(customerId: string, note: any) {
    const query = `
      INSERT INTO customer_notes (
        customer_id, note_type, title, content, is_private, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;

    const values = [
      customerId,
      note.note_type || 'general',
      note.title,
      note.content,
      note.is_private || false,
      note.created_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getNotes(customerId: string) {
    const query = `
      SELECT * FROM customer_notes
      WHERE customer_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [customerId]);
    return result.rows;
  }

  // Customer Tags
  async addTag(customerId: string, tag: any) {
    const query = `
      INSERT INTO customer_tags (customer_id, tag_name, tag_color, created_by)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (customer_id, tag_name) DO NOTHING
      RETURNING *
    `;

    const values = [customerId, tag.tag_name, tag.tag_color, tag.created_by];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getTags(customerId: string) {
    const query = `
      SELECT * FROM customer_tags
      WHERE customer_id = $1
    `;
    const result = await this.pool.query(query, [customerId]);
    return result.rows;
  }

  async removeTag(customerId: string, tagName: string) {
    const query = `
      DELETE FROM customer_tags
      WHERE customer_id = $1 AND tag_name = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [customerId, tagName]);
    return result.rows[0];
  }
}
