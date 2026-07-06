import { useMemo } from 'react';
import { useAppSelector } from '../redux/store';
import { TENANT_NAV_GROUPS, TenantNavGroup, TenantNavItem } from '../modules/tenant/constants/navigation';
import { platformNavGroups } from '../modules/platform/constants/navigation';
import { hasModuleAccess, isPlatformRole } from '../utils/roles';

function matchesPermission(permissions: string[], required?: string, role?: string): boolean {
  if (!required) return true;
  if (permissions.includes('*')) return true;
  if (permissions.includes(required)) return true;
  if (role === 'tenant_admin') return true;
  const modulePrefix = required.split('.')[0];
  return permissions.some(
    (p) => p.startsWith(`${modulePrefix}.`) || p === `${modulePrefix}.manage`
  );
}

function filterNavItem(
  item: TenantNavItem,
  role: string,
  permissions: string[],
  subscriptionTier: string,
  enabledModules: string[]
): boolean {
  if (item.requiredRoles?.length && !item.requiredRoles.includes(role)) {
    return false;
  }

  if (!matchesPermission(permissions, item.permission, role)) {
    return false;
  }

  if (item.requiredSubscriptions?.length && !item.requiredSubscriptions.includes(subscriptionTier)) {
    return false;
  }

  if (item.moduleCode && !hasModuleAccess(enabledModules, item.moduleCode, item.isCore)) {
    return false;
  }

  return true;
}

export function useTenantNavigation(isPlatform = false) {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || 'read_only';
  const permissions = user?.permissions || [];
  const subscriptionTier = user?.subscriptionTier || 'starter';
  const enabledModules = user?.enabledModules || ['dashboard', 'users', 'settings', 'reports'];

  const navigationGroups = useMemo((): TenantNavGroup[] => {
    if (isPlatform || isPlatformRole(role)) return [];

    return TENANT_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        filterNavItem(item, role, permissions, subscriptionTier, enabledModules)
      ),
    })).filter((group) => group.items.length > 0);
  }, [isPlatform, role, permissions, subscriptionTier, enabledModules]);

  const platformGroups = useMemo(() => {
    if (!isPlatform || !isPlatformRole(role)) return [];
    return platformNavGroups;
  }, [isPlatform, role]);

  return {
    navigationGroups: isPlatform ? platformGroups : navigationGroups,
    role,
    permissions,
    subscriptionTier,
    enabledModules,
    isPlatform,
  };
}
