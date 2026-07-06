/**
 * Role Configuration
 * This file defines system roles and their default behaviors
 * Used for role management and permission assignment
 */

export interface RoleConfig {
  code: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  defaultPermissions?: string[];
  dashboardConfig?: string;
}

export const ROLES_CONFIG: RoleConfig[] = [
  {
    code: 'platform_owner',
    name: 'Platform Owner',
    description: 'Full access to platform features',
    isSystemRole: true,
  },
  {
    code: 'tenant_admin',
    name: 'Tenant Admin',
    description: 'Full access to tenant features',
    isSystemRole: true,
  },
  {
    code: 'recovery_manager',
    name: 'Recovery Manager',
    description: 'Manages recovery operations',
    isSystemRole: true,
  },
  {
    code: 'team_leader',
    name: 'Team Leader',
    description: 'Leads a recovery team',
    isSystemRole: true,
  },
  {
    code: 'recovery_agent',
    name: 'Recovery Agent',
    description: 'Performs recovery activities',
    isSystemRole: true,
  },
  {
    code: 'legal_officer',
    name: 'Legal Officer',
    description: 'Handles legal aspects',
    isSystemRole: true,
  },
  {
    code: 'qa',
    name: 'QA',
    description: 'Quality assurance',
    isSystemRole: true,
  },
  {
    code: 'auditor',
    name: 'Auditor',
    description: 'Audit operations',
    isSystemRole: true,
  },
  {
    code: 'read_only',
    name: 'Read Only',
    description: 'Read-only access',
    isSystemRole: true,
  },
];

/**
 * Get role by code
 */
export function getRoleByCode(code: string): RoleConfig | undefined {
  return ROLES_CONFIG.find(r => r.code === code);
}

/**
 * Get system roles
 */
export function getSystemRoles(): RoleConfig[] {
  return ROLES_CONFIG.filter(r => r.isSystemRole);
}

/**
 * Get custom roles (non-system)
 */
export function getCustomRoles(): RoleConfig[] {
  return ROLES_CONFIG.filter(r => !r.isSystemRole);
}
