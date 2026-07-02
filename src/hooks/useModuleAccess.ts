import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAccessibleModules, hasModuleAccess } from '../config/navigation/moduleAccess';
import { isFeatureEnabled } from '../config/navigation/featureFlags';
import { hasFeatureAccess } from '../config/navigation/subscriptionFeatures';

export const useModuleAccess = () => {
  const { user, tenant } = useAuth();
  const userRole = user?.user_type || 'read_only';
  const subscriptionTier = tenant?.subscription_tier || 'starter';
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
