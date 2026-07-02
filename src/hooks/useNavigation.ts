import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NAVIGATION_MODULES, getNavigationModules } from '../config/navigation/navigationRegistry';
import { getAccessibleModules, hasModuleAccess } from '../config/navigation/moduleAccess';
import { getSubscriptionFeatures, hasFeatureAccess } from '../config/navigation/subscriptionFeatures';
import { isFeatureEnabled } from '../config/navigation/featureFlags';
import { NavigationModule, NavigationItem } from '../types/navigation.types';

export const useNavigation = () => {
  const { user, tenant } = useAuth();
  const userRole = user?.user_type || 'read_only';
  const subscriptionTier = tenant?.subscription_tier || 'starter';
  const userFeatureFlags = tenant?.feature_flags || {};

  const filteredModules = useMemo(() => {
    return getNavigationModules().filter(module => {
      // Check if user has access to this module
      if (!hasModuleAccess(userRole, module.id)) {
        return false;
      }

      // Check if module requires specific roles
      if (module.requiredRoles && module.requiredRoles.length > 0) {
        if (!module.requiredRoles.includes(userRole)) {
          return false;
        }
      }

      // Check if module excludes specific roles
      if (module.excludedRoles && module.excludedRoles.length > 0) {
        if (module.excludedRoles.includes(userRole)) {
          return false;
        }
      }

      // Check if module requires specific subscription
      if (module.requiredSubscription && module.requiredSubscription.length > 0) {
        if (!module.requiredSubscription.includes(subscriptionTier)) {
          return false;
        }
      }

      // Check if module requires specific features
      if (module.requiredFeatures && module.requiredFeatures.length > 0) {
        const hasAllFeatures = module.requiredFeatures.every(feature =>
          isFeatureEnabled(feature, subscriptionTier, userFeatureFlags)
        );
        if (!hasAllFeatures) {
          return false;
        }
      }

      // Filter items within the module
      module.items = module.items.filter(item => {
        // Check if item requires specific roles
        if (item.requiredRoles && item.requiredRoles.length > 0) {
          if (!item.requiredRoles.includes(userRole)) {
            return false;
          }
        }

        // Check if item excludes specific roles
        if (item.excludedRoles && item.excludedRoles.length > 0) {
          if (item.excludedRoles.includes(userRole)) {
            return false;
          }
        }

        // Check if item requires specific subscription
        if (item.requiredSubscription && item.requiredSubscription.length > 0) {
          if (!item.requiredSubscription.includes(subscriptionTier)) {
            return false;
          }
        }

        // Check if item requires specific features
        if (item.requiredFeatures && item.requiredFeatures.length > 0) {
          const hasAllFeatures = item.requiredFeatures.every(feature =>
            isFeatureEnabled(feature, subscriptionTier, userFeatureFlags)
          );
          if (!hasAllFeatures) {
            return false;
          }
        }

        // Filter children if they exist
        if (item.children && item.children.length > 0) {
          item.children = item.children.filter(child => {
            if (child.requiredRoles && child.requiredRoles.length > 0) {
              if (!child.requiredRoles.includes(userRole)) {
                return false;
              }
            }
            if (child.requiredFeatures && child.requiredFeatures.length > 0) {
              const hasAllFeatures = child.requiredFeatures.every(feature =>
                isFeatureEnabled(feature, subscriptionTier, userFeatureFlags)
              );
              if (!hasAllFeatures) {
                return false;
              }
            }
            return true;
          });
        }

        return true;
      });

      // Only show module if it has items after filtering
      return module.items.length > 0;
    });
  }, [userRole, subscriptionTier, userFeatureFlags]);

  const accessibleModules = useMemo(() => {
    return getAccessibleModules(userRole);
  }, [userRole]);

  const checkModuleAccess = (moduleId: string): boolean => {
    return hasModuleAccess(userRole, moduleId);
  };

  const checkFeatureAccess = (feature: string): boolean => {
    return isFeatureEnabled(feature, subscriptionTier, userFeatureFlags);
  };

  const checkSubscriptionFeature = (feature: string): boolean => {
    return hasFeatureAccess(subscriptionTier, feature);
  };

  return {
    modules: filteredModules,
    accessibleModules,
    userRole,
    subscriptionTier,
    checkModuleAccess,
    checkFeatureAccess,
    checkSubscriptionFeature,
  };
};
