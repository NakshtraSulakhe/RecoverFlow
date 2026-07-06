export const PLATFORM_ROLES = ['platform_owner'] as const;

export const TENANT_ROLES = [
  'tenant_admin',
  'recovery_manager',
  'team_leader',
  'recovery_agent',
  'legal_officer',
  'qa',
  'auditor',
  'read_only',
] as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[number];
export type TenantRole = (typeof TENANT_ROLES)[number];

export function isPlatformRole(role?: string | null): boolean {
  return role === 'platform_owner';
}

export function isTenantRole(role?: string | null): boolean {
  return !!role && TENANT_ROLES.includes(role as TenantRole);
}

export function getRoleDashboardPath(role?: string | null): string {
  return isPlatformRole(role) ? '/platform/dashboard' : '/app/dashboard';
}

export function hasPermission(permissions: string[], required?: string): boolean {
  if (!required) return true;
  return permissions.includes('*') || permissions.includes(required);
}

export function hasAnyPermission(permissions: string[], required: string[]): boolean {
  if (permissions.includes('*')) return true;
  return required.some((p) => permissions.includes(p));
}

export function hasModuleAccess(
  enabledModules: string[],
  moduleCode?: string,
  isCore = false
): boolean {
  if (!moduleCode) return true;
  if (isCore) return true;
  return enabledModules.includes(moduleCode);
}
