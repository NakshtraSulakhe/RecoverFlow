import { SubscriptionTier } from '../../types/navigation.types';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    features: [
      'basic_dashboard',
      'customer_management',
      'case_management',
      'basic_reports',
      'email_notifications',
    ],
    maxUsers: 5,
    maxTenants: 1,
  },
  {
    id: 'professional',
    name: 'Professional',
    features: [
      'basic_dashboard',
      'customer_management',
      'case_management',
      'basic_reports',
      'email_notifications',
      'advanced_dashboard',
      'smart_dialer',
      'whatsapp_integration',
      'advanced_reports',
      'ai_predictions',
      'team_management',
    ],
    maxUsers: 25,
    maxTenants: 5,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    features: [
      'basic_dashboard',
      'customer_management',
      'case_management',
      'basic_reports',
      'email_notifications',
      'advanced_dashboard',
      'smart_dialer',
      'whatsapp_integration',
      'advanced_reports',
      'ai_predictions',
      'team_management',
      'ai_assistant',
      'legal_management',
      'custom_workflows',
      'api_access',
      'white_label',
      'priority_support',
      'unlimited_users',
      'unlimited_tenants',
    ],
    maxUsers: -1, // Unlimited
    maxTenants: -1, // Unlimited
  },
];

export const getSubscriptionFeatures = (tierId: string): string[] => {
  const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
  return tier?.features || [];
};

export const hasFeatureAccess = (tierId: string, feature: string): boolean => {
  const features = getSubscriptionFeatures(tierId);
  return features.includes(feature);
};
