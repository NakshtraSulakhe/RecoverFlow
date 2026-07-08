import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class RecoveryCaseRepository {
  constructor(private pool: Pool) {}

  async create(recoveryCase: any) {
    const query = `
      INSERT INTO recovery_cases (
        tenant_id, case_number, loan_id, customer_id, case_type_id, case_status_id,
        case_type, case_priority, case_status, workflow_template_id, workflow_stage,
        assigned_business_unit_id, assigned_team_id, assigned_user_id, assigned_date,
        expected_resolution_date, escalation_level, escalated_to, escalated_at,
        escalation_reason, total_outstanding, recovered_amount, recovery_percentage,
        risk_score, recovery_probability, sla_breach_date, sla_status,
        communication_summary, last_activity, last_activity_date, next_follow_up_date,
        next_follow_up_type, ptp_amount, ptp_date, ptp_status, communication_count,
        visit_count, payment_count, legal_action_count, ai_recommendations, notes,
        resolution_summary, custom_fields, metadata, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44,
        $45, $46, $47
      ) RETURNING *
    `;

    const values = [
      recoveryCase.tenant_id,
      recoveryCase.case_number,
      recoveryCase.loan_id,
      recoveryCase.customer_id,
      recoveryCase.case_type_id,
      recoveryCase.case_status_id,
      recoveryCase.case_type,
      recoveryCase.case_priority,
      recoveryCase.case_status,
      recoveryCase.workflow_template_id,
      recoveryCase.workflow_stage,
      recoveryCase.assigned_business_unit_id,
      recoveryCase.assigned_team_id,
      recoveryCase.assigned_user_id,
      recoveryCase.assigned_date,
      recoveryCase.expected_resolution_date,
      recoveryCase.escalation_level || 0,
      recoveryCase.escalated_to,
      recoveryCase.escalated_at,
      recoveryCase.escalation_reason,
      recoveryCase.total_outstanding,
      recoveryCase.recovered_amount || 0,
      recoveryCase.recovery_percentage,
      recoveryCase.risk_score,
      recoveryCase.recovery_probability,
      recoveryCase.sla_breach_date,
      recoveryCase.sla_status,
      recoveryCase.communication_summary,
      recoveryCase.last_activity,
      recoveryCase.last_activity_date,
      recoveryCase.next_follow_up_date,
      recoveryCase.next_follow_up_type,
      recoveryCase.ptp_amount,
      recoveryCase.ptp_date,
      recoveryCase.ptp_status || 'NONE',
      recoveryCase.communication_count || 0,
      recoveryCase.visit_count || 0,
      recoveryCase.payment_count || 0,
      recoveryCase.legal_action_count || 0,
      recoveryCase.ai_recommendations,
      recoveryCase.notes,
      recoveryCase.resolution_summary,
      recoveryCase.custom_fields,
      recoveryCase.metadata,
      recoveryCase.created_by,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Recovery case created', { caseId: result.rows[0].id });
    return result.rows[0];
  }

  async findAll(tenantId: string, filters: any = {}) {
    let query = `
      SELECT rc.*, c.display_name as customer_name, c.customer_code, c.primary_phone,
             l.loan_number, l.loan_status, l.dpd_days, l.total_outstanding as loan_outstanding,
             u.display_name as assigned_user_name, t.team_name as assigned_team_name,
             cs.status_name as case_status_name, cs.color as case_status_color,
             ct.case_type_name
      FROM recovery_cases rc
      LEFT JOIN customers c ON rc.customer_id = c.id
      LEFT JOIN loans l ON rc.loan_id = l.id
      LEFT JOIN users u ON rc.assigned_user_id = u.id
      LEFT JOIN teams t ON rc.assigned_team_id = t.id
      LEFT JOIN case_statuses cs ON rc.case_status_id = cs.id
      LEFT JOIN case_types ct ON rc.case_type_id = ct.id
      WHERE rc.tenant_id = $1 AND rc.is_deleted = false
    `;
    const values: any[] = [tenantId];
    let paramCount = 1;

    if (filters.customer_id) {
      paramCount++;
      query += ` AND rc.customer_id = $${paramCount}`;
      values.push(filters.customer_id);
    }

    if (filters.loan_id) {
      paramCount++;
      query += ` AND rc.loan_id = $${paramCount}`;
      values.push(filters.loan_id);
    }

    if (filters.case_type) {
      paramCount++;
      query += ` AND rc.case_type = $${paramCount}`;
      values.push(filters.case_type);
    }

    if (filters.case_priority) {
      paramCount++;
      query += ` AND rc.case_priority = $${paramCount}`;
      values.push(filters.case_priority);
    }

    if (filters.case_status) {
      paramCount++;
      query += ` AND rc.case_status = $${paramCount}`;
      values.push(filters.case_status);
    }

    if (filters.assigned_user_id) {
      paramCount++;
      query += ` AND rc.assigned_user_id = $${paramCount}`;
      values.push(filters.assigned_user_id);
    }

    if (filters.assigned_team_id) {
      paramCount++;
      query += ` AND rc.assigned_team_id = $${paramCount}`;
      values.push(filters.assigned_team_id);
    }

    if (filters.assigned_business_unit_id) {
      paramCount++;
      query += ` AND rc.assigned_business_unit_id = $${paramCount}`;
      values.push(filters.assigned_business_unit_id);
    }

    if (filters.sla_status) {
      paramCount++;
      query += ` AND rc.sla_status = $${paramCount}`;
      values.push(filters.sla_status);
    }

    if (filters.ptp_status) {
      paramCount++;
      query += ` AND rc.ptp_status = $${paramCount}`;
      values.push(filters.ptp_status);
    }

    if (filters.risk_min !== undefined) {
      paramCount++;
      query += ` AND rc.risk_score >= $${paramCount}`;
      values.push(filters.risk_min);
    }

    if (filters.risk_max !== undefined) {
      paramCount++;
      query += ` AND rc.risk_score <= $${paramCount}`;
      values.push(filters.risk_max);
    }

    if (filters.next_follow_up_from) {
      paramCount++;
      query += ` AND rc.next_follow_up_date >= $${paramCount}`;
      values.push(filters.next_follow_up_from);
    }

    if (filters.next_follow_up_to) {
      paramCount++;
      query += ` AND rc.next_follow_up_date <= $${paramCount}`;
      values.push(filters.next_follow_up_to);
    }

    if (filters.search) {
      paramCount++;
      query += ` AND (
        rc.case_number ILIKE $${paramCount} OR
        c.display_name ILIKE $${paramCount} OR
        c.primary_phone ILIKE $${paramCount} OR
        l.loan_number ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
    }

    query += ` ORDER BY rc.created_at DESC`;

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset || 0);
    }

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async findById(id: string, tenantId: string) {
    const query = `
      SELECT rc.*, c.display_name as customer_name, c.customer_code, c.primary_phone,
             c.primary_email, l.loan_number, l.loan_status, l.dpd_days, l.total_outstanding,
             u.display_name as assigned_user_name, u.email as assigned_user_email,
             t.team_name as assigned_team_name, bu.name as assigned_business_unit_name,
             cs.status_name as case_status_name, cs.color as case_status_color,
             ct.case_type_name
      FROM recovery_cases rc
      LEFT JOIN customers c ON rc.customer_id = c.id
      LEFT JOIN loans l ON rc.loan_id = l.id
      LEFT JOIN users u ON rc.assigned_user_id = u.id
      LEFT JOIN teams t ON rc.assigned_team_id = t.id
      LEFT JOIN business_units bu ON rc.assigned_business_unit_id = bu.id
      LEFT JOIN case_statuses cs ON rc.case_status_id = cs.id
      LEFT JOIN case_types ct ON rc.case_type_id = ct.id
      WHERE rc.id = $1 AND rc.tenant_id = $2 AND rc.is_deleted = false
    `;
    const result = await this.pool.query(query, [id, tenantId]);
    return result.rows[0];
  }

  async findByCaseNumber(caseNumber: string, tenantId: string) {
    const query = `
      SELECT rc.*, c.display_name as customer_name, c.customer_code, c.primary_phone,
             l.loan_number, l.loan_status, l.dpd_days
      FROM recovery_cases rc
      LEFT JOIN customers c ON rc.customer_id = c.id
      LEFT JOIN loans l ON rc.loan_id = l.id
      WHERE rc.case_number = $1 AND rc.tenant_id = $2 AND rc.is_deleted = false
    `;
    const result = await this.pool.query(query, [caseNumber, tenantId]);
    return result.rows[0];
  }

  async findByLoanId(loanId: string, tenantId: string) {
    const query = `
      SELECT * FROM recovery_cases
      WHERE loan_id = $1 AND tenant_id = $2 AND is_deleted = false
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [loanId, tenantId]);
    return result.rows;
  }

  async findByCustomerId(customerId: string, tenantId: string) {
    const query = `
      SELECT rc.*, l.loan_number, l.loan_status, l.dpd_days
      FROM recovery_cases rc
      LEFT JOIN loans l ON rc.loan_id = l.id
      WHERE rc.customer_id = $1 AND rc.tenant_id = $2 AND rc.is_deleted = false
      ORDER BY rc.created_at DESC
    `;
    const result = await this.pool.query(query, [customerId, tenantId]);
    return result.rows;
  }

  async update(id: string, recoveryCase: any, tenantId: string) {
    const query = `
      UPDATE recovery_cases SET
        case_type_id = COALESCE($2, case_type_id),
        case_status_id = COALESCE($3, case_status_id),
        case_type = COALESCE($4, case_type),
        case_priority = COALESCE($5, case_priority),
        case_status = COALESCE($6, case_status),
        workflow_template_id = COALESCE($7, workflow_template_id),
        workflow_stage = COALESCE($8, workflow_stage),
        assigned_business_unit_id = COALESCE($9, assigned_business_unit_id),
        assigned_team_id = COALESCE($10, assigned_team_id),
        assigned_user_id = COALESCE($11, assigned_user_id),
        expected_resolution_date = COALESCE($12, expected_resolution_date),
        actual_resolution_date = COALESCE($13, actual_resolution_date),
        escalation_level = COALESCE($14, escalation_level),
        escalated_to = COALESCE($15, escalated_to),
        escalated_at = COALESCE($16, escalated_at),
        escalation_reason = COALESCE($17, escalation_reason),
        total_outstanding = COALESCE($18, total_outstanding),
        recovered_amount = COALESCE($19, recovered_amount),
        recovery_percentage = COALESCE($20, recovery_percentage),
        risk_score = COALESCE($21, risk_score),
        recovery_probability = COALESCE($22, recovery_probability),
        sla_breach_date = COALESCE($23, sla_breach_date),
        sla_status = COALESCE($24, sla_status),
        communication_summary = COALESCE($25, communication_summary),
        last_activity = COALESCE($26, last_activity),
        last_activity_date = COALESCE($27, last_activity_date),
        next_follow_up_date = COALESCE($28, next_follow_up_date),
        next_follow_up_type = COALESCE($29, next_follow_up_type),
        ptp_amount = COALESCE($30, ptp_amount),
        ptp_date = COALESCE($31, ptp_date),
        ptp_status = COALESCE($32, ptp_status),
        communication_count = COALESCE($33, communication_count),
        visit_count = COALESCE($34, visit_count),
        payment_count = COALESCE($35, payment_count),
        legal_action_count = COALESCE($36, legal_action_count),
        ai_recommendations = COALESCE($37, ai_recommendations),
        notes = COALESCE($38, notes),
        resolution_summary = COALESCE($39, resolution_summary),
        custom_fields = COALESCE($40, custom_fields),
        metadata = COALESCE($41, metadata),
        updated_by = $42,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND tenant_id = $43 AND is_deleted = false
      RETURNING *
    `;

    const values = [
      id,
      recoveryCase.case_type_id,
      recoveryCase.case_status_id,
      recoveryCase.case_type,
      recoveryCase.case_priority,
      recoveryCase.case_status,
      recoveryCase.workflow_template_id,
      recoveryCase.workflow_stage,
      recoveryCase.assigned_business_unit_id,
      recoveryCase.assigned_team_id,
      recoveryCase.assigned_user_id,
      recoveryCase.expected_resolution_date,
      recoveryCase.actual_resolution_date,
      recoveryCase.escalation_level,
      recoveryCase.escalated_to,
      recoveryCase.escalated_at,
      recoveryCase.escalation_reason,
      recoveryCase.total_outstanding,
      recoveryCase.recovered_amount,
      recoveryCase.recovery_percentage,
      recoveryCase.risk_score,
      recoveryCase.recovery_probability,
      recoveryCase.sla_breach_date,
      recoveryCase.sla_status,
      recoveryCase.communication_summary,
      recoveryCase.last_activity,
      recoveryCase.last_activity_date,
      recoveryCase.next_follow_up_date,
      recoveryCase.next_follow_up_type,
      recoveryCase.ptp_amount,
      recoveryCase.ptp_date,
      recoveryCase.ptp_status,
      recoveryCase.communication_count,
      recoveryCase.visit_count,
      recoveryCase.payment_count,
      recoveryCase.legal_action_count,
      recoveryCase.ai_recommendations,
      recoveryCase.notes,
      recoveryCase.resolution_summary,
      recoveryCase.custom_fields,
      recoveryCase.metadata,
      recoveryCase.updated_by,
      tenantId,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Recovery case updated', { caseId: id });
    return result.rows[0];
  }

  async softDelete(id: string, tenantId: string, deletedBy: string) {
    const query = `
      UPDATE recovery_cases SET
        is_deleted = true,
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = $1
      WHERE id = $2 AND tenant_id = $3 AND is_deleted = false
      RETURNING *
    `;

    const result = await this.pool.query(query, [deletedBy, id, tenantId]);
    logger.info('Recovery case soft deleted', { caseId: id });
    return result.rows[0];
  }

  async restore(id: string, tenantId: string) {
    const query = `
      UPDATE recovery_cases SET
        is_deleted = false,
        deleted_at = NULL,
        deleted_by = NULL
      WHERE id = $1 AND tenant_id = $2 AND is_deleted = true
      RETURNING *
    `;

    const result = await this.pool.query(query, [id, tenantId]);
    logger.info('Recovery case restored', { caseId: id });
    return result.rows[0];
  }

  async count(tenantId: string, filters: any = {}) {
    let query = `
      SELECT COUNT(*) FROM recovery_cases
      WHERE tenant_id = $1 AND is_deleted = false
    `;
    const values: any[] = [tenantId];

    if (filters.case_status) {
      query += ` AND case_status = $2`;
      values.push(filters.case_status);
    }

    if (filters.assigned_user_id) {
      query += ` AND assigned_user_id = $${values.length + 1}`;
      values.push(filters.assigned_user_id);
    }

    if (filters.sla_status) {
      query += ` AND sla_status = $${values.length + 1}`;
      values.push(filters.sla_status);
    }

    const result = await this.pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Case History (Timeline)
  async addHistory(caseId: string, history: any) {
    const query = `
      INSERT INTO case_history (
        case_id, event_type, event_category, event_title, event_description,
        old_value, new_value, performed_by, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `;

    const values = [
      caseId,
      history.event_type,
      history.event_category,
      history.event_title,
      history.event_description,
      history.old_value,
      history.new_value,
      history.performed_by,
      history.metadata,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getHistory(caseId: string) {
    const query = `
      SELECT ch.*, u.display_name as performed_by_name
      FROM case_history ch
      LEFT JOIN users u ON ch.performed_by = u.id
      WHERE ch.case_id = $1
      ORDER BY ch.performed_at DESC
    `;
    const result = await this.pool.query(query, [caseId]);
    return result.rows;
  }

  // Case Assignments
  async addAssignment(assignment: any) {
    const query = `
      INSERT INTO case_assignments (
        case_id, assigned_from_user_id, assigned_to_user_id, assigned_from_team_id,
        assigned_to_team_id, assigned_from_business_unit_id, assigned_to_business_unit_id,
        assignment_type, assignment_reason, assigned_by, is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *
    `;

    const values = [
      assignment.case_id,
      assignment.assigned_from_user_id,
      assignment.assigned_to_user_id,
      assignment.assigned_from_team_id,
      assignment.assigned_to_team_id,
      assignment.assigned_from_business_unit_id,
      assignment.assigned_to_business_unit_id,
      assignment.assignment_type,
      assignment.assignment_reason,
      assignment.assigned_by,
      assignment.is_active !== undefined ? assignment.is_active : true,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getAssignments(caseId: string) {
    const query = `
      SELECT ca.*, 
             u_from.display_name as assigned_from_user_name,
             u_to.display_name as assigned_to_user_name,
             t_from.team_name as assigned_from_team_name,
             t_to.team_name as assigned_to_team_name,
             bu_from.name as assigned_from_business_unit_name,
             bu_to.name as assigned_to_business_unit_name
      FROM case_assignments ca
      LEFT JOIN users u_from ON ca.assigned_from_user_id = u_from.id
      LEFT JOIN users u_to ON ca.assigned_to_user_id = u_to.id
      LEFT JOIN teams t_from ON ca.assigned_from_team_id = t_from.id
      LEFT JOIN teams t_to ON ca.assigned_to_team_id = t_to.id
      LEFT JOIN business_units bu_from ON ca.assigned_from_business_unit_id = bu_from.id
      LEFT JOIN business_units bu_to ON ca.assigned_to_business_unit_id = bu_to.id
      WHERE ca.case_id = $1
      ORDER BY ca.assigned_at DESC
    `;
    const result = await this.pool.query(query, [caseId]);
    return result.rows;
  }

  // Case Tags
  async addTag(caseId: string, tag: any) {
    const query = `
      INSERT INTO case_tags (case_id, tag_name, tag_color, created_by)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (case_id, tag_name) DO NOTHING
      RETURNING *
    `;

    const values = [caseId, tag.tag_name, tag.tag_color, tag.created_by];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getTags(caseId: string) {
    const query = `
      SELECT * FROM case_tags
      WHERE case_id = $1
    `;
    const result = await this.pool.query(query, [caseId]);
    return result.rows;
  }

  async removeTag(caseId: string, tagName: string) {
    const query = `
      DELETE FROM case_tags
      WHERE case_id = $1 AND tag_name = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [caseId, tagName]);
    return result.rows[0];
  }

  // Case Notes
  async addNote(caseId: string, note: any) {
    const query = `
      INSERT INTO case_notes (
        case_id, note_type, title, content, is_private, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;

    const values = [
      caseId,
      note.note_type || 'general',
      note.title,
      note.content,
      note.is_private || false,
      note.created_by,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getNotes(caseId: string) {
    const query = `
      SELECT cn.*, u.display_name as created_by_name
      FROM case_notes cn
      LEFT JOIN users u ON cn.created_by = u.id
      WHERE cn.case_id = $1
      ORDER BY cn.created_at DESC
    `;
    const result = await this.pool.query(query, [caseId]);
    return result.rows;
  }

  // Dashboard Statistics
  async getDashboardStats(tenantId: string, userId?: string) {
    let whereClause = `WHERE rc.tenant_id = $1 AND rc.is_deleted = false`;
    const values: any[] = [tenantId];

    if (userId) {
      whereClause += ` AND rc.assigned_user_id = $2`;
      values.push(userId);
    }

    const query = `
      SELECT
        COUNT(*) FILTER (WHERE rc.created_at >= CURRENT_DATE) as today_new_cases,
        COUNT(*) FILTER (WHERE rc.assigned_user_id = $${userId ? 2 : 1}) as assigned_cases,
        COUNT(*) FILTER (WHERE rc.case_status NOT IN ('CLOSED', 'RESOLVED')) as open_cases,
        COUNT(*) FILTER (WHERE rc.case_priority = 'CRITICAL') as high_risk_cases,
        COUNT(*) FILTER (WHERE rc.ptp_status = 'PENDING' AND rc.ptp_date <= CURRENT_DATE + INTERVAL '3 days') as ptp_due,
        COUNT(*) FILTER (WHERE rc.ptp_status = 'BROKEN') as broken_ptp,
        COUNT(*) FILTER (WHERE rc.case_status IN ('CLOSED', 'RESOLVED')) as closed_cases
      FROM recovery_cases rc
      ${whereClause}
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
