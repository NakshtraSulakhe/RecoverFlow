import { NavigationModule } from '../../types/navigation.types';

export const MODULE_ACCESS_MATRIX: Record<string, string[]> = {
  platform_owner: ['overview', 'recovery', 'customers', 'communication', 'finance', 'analytics', 'ai', 'administration'],
  tenant_admin: ['overview', 'recovery', 'customers', 'communication', 'finance', 'analytics', 'ai', 'administration'],
  recovery_manager: ['overview', 'recovery', 'customers', 'communication', 'finance', 'analytics', 'ai'],
  team_leader: ['overview', 'recovery', 'customers', 'communication', 'analytics', 'ai'],
  recovery_agent: ['overview', 'recovery', 'customers', 'communication', 'ai'],
  legal_officer: ['overview', 'recovery', 'communication', 'analytics'],
  qa: ['overview', 'recovery', 'analytics'],
  auditor: ['overview', 'recovery', 'customers', 'finance', 'analytics', 'administration'],
  read_only: ['overview', 'recovery', 'customers', 'analytics'],
};

export const getAccessibleModules = (role: string): string[] => {
  return MODULE_ACCESS_MATRIX[role] || [];
};

export const hasModuleAccess = (role: string, moduleId: string): boolean => {
  const accessibleModules = getAccessibleModules(role);
  return accessibleModules.includes(moduleId);
};
