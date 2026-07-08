import { useMemo } from 'react';
import { useAppSelector } from '../redux/store';
import { getAccessibleModules, hasModuleAccess } from '../config/navigation/moduleAccess';
import { isFeatureEnabled } from '../config/navigation/featureFlags';
import { hasFeatureAccess } from '../config/navigation/subscriptionFeatures';

export const useModuleAccess = () => {
  const user = useAppSelector((state) => state.auth.user);
  const tenantState = useAppSelector((state) => state.tenant as any);
  const tenant = tenantState.currentTenant || tenantState.tenant || {};
  const userRole = user?.role || (user as any)?.user_type || 'read_only';
  const subscriptionTier = tenant?.subscription_tier || user?.subscriptionTier || 'starter';
  const userFeatureFlags = tenant?.feature_flags || {};

  const accessibleModules = useMemo(() => {
    return getAccessibleModules(userRole);
  }, [userRole]);

  const checkModuleAccess = (moduleId: string): boolean => {
    return hasModuleAccess(userRole, moduleId);
  };

  const checkFeatureAccess = (featureId: string): boolean => {
    return isFeatureEnabled(featureId, subscriptionTier, userFeatureFlags);
  };

  const checkSubscriptionFeature = (feature: string): boolean => {
    return hasFeatureAccess(subscriptionTier, feature);
  };

  const hasAccessToAllModules = (moduleIds: string[]): boolean => {
    return moduleIds.every(moduleId => checkModuleAccess(moduleId));
  };

  const hasAccessToAnyModule = (moduleIds: string[]): boolean => {
    return moduleIds.some(moduleId => checkModuleAccess(moduleId));
  };

  return {
    accessibleModules,
    userRole,
    subscriptionTier,
    checkModuleAccess,
    checkFeatureAccess,
    checkSubscriptionFeature,
    hasAccessToAllModules,
    hasAccessToAnyModule,
  };
};


