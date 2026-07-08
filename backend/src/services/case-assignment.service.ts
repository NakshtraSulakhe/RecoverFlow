import { Pool } from 'pg';
import { logger } from '../utils/logger';
import { RecoveryCaseRepository } from '../repositories/recovery-case.repository';

export interface AssignmentRule {
  id: string;
  tenant_id: string;
  rule_name: string;
  rule_type: 'AUTO_ASSIGN' | 'LOAD_BALANCE' | 'PRIORITY_BASED' | 'SKILL_BASED' | 'GEOGRAPHIC' | 'ROUND_ROBIN';
  priority: number;
  conditions: AssignmentCondition[];
  actions: AssignmentAction[];
  is_active: boolean;
}

export interface AssignmentCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN' | 'BETWEEN';
  value: any;
}

export interface AssignmentAction {
  type: 'ASSIGN_TO_USER' | 'ASSIGN_TO_TEAM' | 'ASSIGN_TO_BUSINESS_UNIT' | 'SET_PRIORITY' | 'SET_SLA';
  value: any;
}

export interface AssignmentResult {
  case_id: string;
  assigned_to_user_id?: string;
  assigned_to_team_id?: string;
  assigned_to_business_unit_id?: string;
  assignment_type: string;
  rule_applied?: string;
  success: boolean;
  message: string;
}

export class CaseAssignmentService {
  constructor(
    private pool: Pool,
    private recoveryCaseRepository: RecoveryCaseRepository
  ) {}

  /**
   * Auto-assign a recovery case based on business rules
   */
  async autoAssignCase(caseId: string, tenantId: string): Promise<AssignmentResult> {
    try {
      // Get the recovery case with related data
      const recoveryCase = await this.recoveryCaseRepository.findById(caseId, tenantId);
      if (!recoveryCase) {
        return {
          case_id: caseId,
          success: false,
          message: 'Recovery case not found',
          assignment_type: 'AUTO_ASSIGN',
        };
      }

      // Get active assignment rules for the tenant
      const rules = await this.getActiveAssignmentRules(tenantId);
      
      // Evaluate rules in priority order
      for (const rule of rules) {
        if (await this.evaluateRule(rule, recoveryCase)) {
          const result = await this.applyRuleActions(rule, recoveryCase, tenantId);
          return result;
        }
      }

      // If no rules matched, use default round-robin assignment
      return await this.defaultRoundRobinAssignment(recoveryCase, tenantId);

    } catch (error) {
      logger.error('Error in auto-assign case', { caseId, tenantId, error });
      return {
        case_id: caseId,
        success: false,
        message: 'Error during assignment',
        assignment_type: 'AUTO_ASSIGN',
      };
    }
  }

  /**
   * Get active assignment rules for a tenant
   */
  private async getActiveAssignmentRules(tenantId: string): Promise<AssignmentRule[]> {
    const query = `
      SELECT * FROM assignment_rules
      WHERE tenant_id = $1 AND is_active = true
      ORDER BY priority ASC
    `;
    const result = await this.pool.query(query, [tenantId]);
    return result.rows.map(row => ({
      id: row.id,
      tenant_id: row.tenant_id,
      rule_name: row.rule_name,
      rule_type: row.rule_type,
      priority: row.priority,
      conditions: row.conditions,
      actions: row.actions,
      is_active: row.is_active,
    }));
  }

  /**
   * Evaluate if a rule matches the given case
   */
  private async evaluateRule(rule: AssignmentRule, recoveryCase: any): Promise<boolean> {
    for (const condition of rule.conditions) {
      const fieldValue = this.getFieldValue(recoveryCase, condition.field);
      
      if (!this.evaluateCondition(fieldValue, condition.operator, condition.value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get field value from recovery case or related entities
   */
  private getFieldValue(recoveryCase: any, field: string): any {
    // Handle nested field access (e.g., loan.dpd_days, customer.risk_level)
    const parts = field.split('.');
    let value = recoveryCase;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(fieldValue: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case 'EQUALS':
        return fieldValue === conditionValue;
      case 'NOT_EQUALS':
        return fieldValue !== conditionValue;
      case 'GREATER_THAN':
        return fieldValue > conditionValue;
      case 'LESS_THAN':
        return fieldValue < conditionValue;
      case 'IN':
        return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
      case 'NOT_IN':
        return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
      case 'BETWEEN':
        return Array.isArray(conditionValue) && 
               fieldValue >= conditionValue[0] && 
               fieldValue <= conditionValue[1];
      default:
        return false;
    }
  }

  /**
   * Apply rule actions to assign the case
   */
  private async applyRuleActions(rule: AssignmentRule, recoveryCase: any, tenantId: string): Promise<AssignmentResult> {
    let assignedToUserId: string | undefined;
    let assignedToTeamId: string | undefined;
    let assignedToBusinessUnitId: string | undefined;

    for (const action of rule.actions) {
      switch (action.type) {
        case 'ASSIGN_TO_USER':
          assignedToUserId = action.value;
          break;
        case 'ASSIGN_TO_TEAM':
          assignedToTeamId = action.value;
          // If team is specified but no user, get least loaded user from team
          if (!assignedToUserId) {
            assignedToUserId = await this.getLeastLoadedUserFromTeam(action.value, tenantId);
          }
          break;
        case 'ASSIGN_TO_BUSINESS_UNIT':
          assignedToBusinessUnitId = action.value;
          // If business unit is specified but no team, get least loaded team from BU
          if (!assignedToTeamId) {
            assignedToTeamId = await this.getLeastLoadedTeamFromBusinessUnit(action.value, tenantId);
            if (assignedToTeamId && !assignedToUserId) {
              assignedToUserId = await this.getLeastLoadedUserFromTeam(assignedToTeamId, tenantId);
            }
          }
          break;
        case 'SET_PRIORITY':
          // Priority is set separately
          break;
        case 'SET_SLA':
          // SLA is set separately
          break;
      }
    }

    // Update the recovery case with the assignment
    await this.recoveryCaseRepository.update(recoveryCase.id, {
      assigned_user_id: assignedToUserId,
      assigned_team_id: assignedToTeamId,
      assigned_business_unit_id: assignedToBusinessUnitId,
    }, tenantId);

    // Add assignment history
    await this.recoveryCaseRepository.addAssignment({
      case_id: recoveryCase.id,
      assigned_to_user_id: assignedToUserId,
      assigned_to_team_id: assignedToTeamId,
      assigned_to_business_unit_id: assignedToBusinessUnitId,
      assignment_type: 'AUTOMATIC',
      assignment_reason: `Auto-assigned by rule: ${rule.rule_name}`,
      assigned_by: 'SYSTEM',
    });

    // Add case history
    await this.recoveryCaseRepository.addHistory(recoveryCase.id, {
      event_type: 'ASSIGNED',
      event_category: 'ASSIGNMENT',
      event_title: 'Case Auto-Assigned',
      event_description: `Case auto-assigned by rule: ${rule.rule_name}`,
      new_value: {
        assigned_user_id: assignedToUserId,
        assigned_team_id: assignedToTeamId,
        assigned_to_business_unit_id: assignedToBusinessUnitId,
      },
      performed_by: 'SYSTEM',
    });

    return {
      case_id: recoveryCase.id,
      assigned_to_user_id: assignedToUserId,
      assigned_to_team_id: assignedToTeamId,
      assigned_to_business_unit_id: assignedToBusinessUnitId,
      assignment_type: 'AUTOMATIC',
      rule_applied: rule.rule_name,
      success: true,
      message: `Case auto-assigned by rule: ${rule.rule_name}`,
    };
  }

  /**
   * Default round-robin assignment when no rules match
   */
  private async defaultRoundRobinAssignment(recoveryCase: any, tenantId: string): Promise<AssignmentResult> {
    // Get all active agents in the tenant
    const query = `
      SELECT u.id, u.display_name, COUNT(rc.id) as active_cases
      FROM users u
      LEFT JOIN recovery_cases rc ON u.id = rc.assigned_user_id 
        AND rc.case_status NOT IN ('CLOSED', 'RESOLVED')
        AND rc.is_deleted = false
      WHERE u.tenant_id = $1 
        AND u.status = 'active'
        AND u.is_deleted = false
      GROUP BY u.id, u.display_name
      ORDER BY active_cases ASC
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [tenantId]);
    
    if (result.rows.length === 0) {
      return {
        case_id: recoveryCase.id,
        success: false,
        message: 'No active agents available for assignment',
        assignment_type: 'ROUND_ROBIN',
      };
    }

    const agent = result.rows[0];

    // Update the recovery case
    await this.recoveryCaseRepository.update(recoveryCase.id, {
      assigned_user_id: agent.id,
    }, tenantId);

    // Add assignment history
    await this.recoveryCaseRepository.addAssignment({
      case_id: recoveryCase.id,
      assigned_to_user_id: agent.id,
      assignment_type: 'ROUND_ROBIN',
      assignment_reason: 'Default round-robin assignment',
      assigned_by: 'SYSTEM',
    });

    // Add case history
    await this.recoveryCaseRepository.addHistory(recoveryCase.id, {
      event_type: 'ASSIGNED',
      event_category: 'ASSIGNMENT',
      event_title: 'Case Assigned (Round-Robin)',
      event_description: `Case assigned to ${agent.display_name} via round-robin`,
      new_value: { assigned_user_id: agent.id },
      performed_by: 'SYSTEM',
    });

    return {
      case_id: recoveryCase.id,
      assigned_to_user_id: agent.id,
      assignment_type: 'ROUND_ROBIN',
      success: true,
      message: `Case assigned to ${agent.display_name} via round-robin`,
    };
  }

  /**
   * Get least loaded user from a team
   */
  private async getLeastLoadedUserFromTeam(teamId: string, tenantId: string): Promise<string | undefined> {
    const query = `
      SELECT u.id
      FROM users u
      LEFT JOIN team_members tm ON u.id = tm.user_id
      LEFT JOIN recovery_cases rc ON u.id = rc.assigned_user_id 
        AND rc.case_status NOT IN ('CLOSED', 'RESOLVED')
        AND rc.is_deleted = false
      WHERE u.tenant_id = $1 
        AND tm.team_id = $2
        AND u.status = 'active'
        AND u.is_deleted = false
      GROUP BY u.id
      ORDER BY COUNT(rc.id) ASC
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [tenantId, teamId]);
    return result.rows[0]?.id;
  }

  /**
   * Get least loaded team from a business unit
   */
  private async getLeastLoadedTeamFromBusinessUnit(businessUnitId: string, tenantId: string): Promise<string | undefined> {
    const query = `
      SELECT t.id
      FROM teams t
      LEFT JOIN recovery_cases rc ON t.id = rc.assigned_team_id 
        AND rc.case_status NOT IN ('CLOSED', 'RESOLVED')
        AND rc.is_deleted = false
      WHERE t.tenant_id = $1 
        AND t.business_unit_id = $2
        AND t.is_active = true
        AND t.is_deleted = false
      GROUP BY t.id
      ORDER BY COUNT(rc.id) ASC
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [tenantId, businessUnitId]);
    return result.rows[0]?.id;
  }

  /**
   * Bulk assign cases based on business rules
   */
  async bulkAssignCases(caseIds: string[], tenantId: string): Promise<AssignmentResult[]> {
    const results: AssignmentResult[] = [];

    for (const caseId of caseIds) {
      const result = await this.autoAssignCase(caseId, tenantId);
      results.push(result);
    }

    return results;
  }

  /**
   * Reassign cases from one user to another
   */
  async reassignCases(
    fromUserId: string,
    toUserId: string,
    tenantId: string,
    reason: string
  ): Promise<number> {
    const query = `
      UPDATE recovery_cases
      SET assigned_user_id = $1,
          updated_by = 'SYSTEM',
          updated_at = CURRENT_TIMESTAMP
      WHERE assigned_user_id = $2
        AND tenant_id = $3
        AND is_deleted = false
        AND case_status NOT IN ('CLOSED', 'RESOLVED')
      RETURNING id
    `;

    const result = await this.pool.query(query, [toUserId, fromUserId, tenantId]);
    const reassignedCaseIds = result.rows.map(row => row.id);

    // Add assignment history for each case
    for (const caseId of reassignedCaseIds) {
      await this.recoveryCaseRepository.addAssignment({
        case_id: caseId,
        assigned_from_user_id: fromUserId,
        assigned_to_user_id: toUserId,
        assignment_type: 'REASSIGNMENT',
        assignment_reason: reason,
        assigned_by: 'SYSTEM',
      });

      await this.recoveryCaseRepository.addHistory(caseId, {
        event_type: 'ASSIGNED',
        event_category: 'ASSIGNMENT',
        event_title: 'Case Reassigned',
        event_description: `Case reassigned from user ${fromUserId} to user ${toUserId}: ${reason}`,
        old_value: { assigned_user_id: fromUserId },
        new_value: { assigned_user_id: toUserId },
        performed_by: 'SYSTEM',
      });
    }

    logger.info('Cases reassigned', { 
      fromUserId, 
      toUserId, 
      tenantId, 
      count: reassignedCaseIds.length 
    });

    return reassignedCaseIds.length;
  }

  /**
   * Create or update an assignment rule
   */
  async createAssignmentRule(rule: AssignmentRule): Promise<AssignmentRule> {
    const query = `
      INSERT INTO assignment_rules (
        tenant_id, rule_name, rule_type, priority, conditions, actions, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        rule_name = EXCLUDED.rule_name,
        rule_type = EXCLUDED.rule_type,
        priority = EXCLUDED.priority,
        conditions = EXCLUDED.conditions,
        actions = EXCLUDED.actions,
        is_active = EXCLUDED.is_active
      RETURNING *
    `;

    const values = [
      rule.tenant_id,
      rule.rule_name,
      rule.rule_type,
      rule.priority,
      JSON.stringify(rule.conditions),
      JSON.stringify(rule.actions),
      rule.is_active,
    ];

    const result = await this.pool.query(query, values);
    logger.info('Assignment rule created/updated', { ruleId: result.rows[0].id });
    return result.rows[0];
  }

  /**
   * Get assignment statistics for a tenant
   */
  async getAssignmentStats(tenantId: string): Promise<any> {
    const query = `
      SELECT
        COUNT(*) FILTER (WHERE assigned_user_id IS NOT NULL) as assigned_cases,
        COUNT(*) FILTER (WHERE assigned_user_id IS NULL) as unassigned_cases,
        COUNT(*) FILTER (WHERE case_status NOT IN ('CLOSED', 'RESOLVED')) as active_cases,
        COUNT(*) FILTER (WHERE case_status IN ('CLOSED', 'RESOLVED')) as closed_cases,
        AVG(CASE WHEN assigned_user_id IS NOT NULL THEN 1 ELSE 0 END) as assignment_rate
      FROM recovery_cases
      WHERE tenant_id = $1 AND is_deleted = false
    `;

    const result = await this.pool.query(query, [tenantId]);
    return result.rows[0];
  }
}
