export interface NavigationModule {
  id: string;
  name: string;
  icon: string;
  order: number;
  items: NavigationItem[];
  requiredRoles?: string[];
  requiredSubscription?: string[];
  requiredFeatures?: string[];
  excludedRoles?: string[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  requiredRoles?: string[];
  requiredSubscription?: string[];
  requiredFeatures?: string[];
  excludedRoles?: string[];
  badge?: string;
  children?: NavigationItem[];
}

export interface SubscriptionTier {
  id: string;
  name: string;
  features: string[];
  maxUsers?: number;
  maxTenants?: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabledByDefault: boolean;
  requiredSubscription?: string[];
}
