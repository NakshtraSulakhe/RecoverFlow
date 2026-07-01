import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface FeatureGuardProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureKey,
  children,
  fallback = null,
}) => {
  const { tenant } = useAuth();

  if (!tenant) {
    return <>{fallback}</>;
  }

  // Check if the feature is enabled in the tenant's subscription
  const isFeatureEnabled = tenant.features?.[featureKey] ?? false;

  if (!isFeatureEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default FeatureGuard;
