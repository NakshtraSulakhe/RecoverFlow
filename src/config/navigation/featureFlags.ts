import { FeatureFlag } from '../../types/navigation.types';

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'ai_enabled',
    name: 'AI Features',
    description: 'Enable AI-powered predictions and recommendations',
    enabledByDefault: false,
    requiredSubscription: ['professional', 'enterprise'],
  },
  {
    id: 'smart_dialer',
    name: 'Smart Dialer',
    description: 'Enable AI-powered dialer with predictive analytics',
    enabledByDefault: false,
    requiredSubscription: ['professional', 'enterprise'],
  },
  {
    id: 'whatsapp_integration',
    name: 'WhatsApp Integration',
    description: 'Enable WhatsApp for recovery communication',
    enabledByDefault: false,
    requiredSubscription: ['professional', 'enterprise'],
  },
  {
    id: 'legal_management',
    name: 'Legal Management',
    description: 'Enable legal case management features',
    enabledByDefault: false,
    requiredSubscription: ['enterprise'],
  },
  {
    id: 'custom_workflows',
    name: 'Custom Workflows',
    description: 'Enable custom workflow automation',
    enabledByDefault: false,
    requiredSubscription: ['enterprise'],
  },
  {
    id: 'api_access',
    name: 'API Access',
    description: 'Enable public API access',
    enabledByDefault: false,
    requiredSubscription: ['enterprise'],
  },
  {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Enable advanced analytics and reporting',
    enabledByDefault: true,
    requiredSubscription: ['professional', 'enterprise'],
  },
  {
    id: 'team_management',
    name: 'Team Management',
    description: 'Enable team management features',
    enabledByDefault: true,
    requiredSubscription: ['professional', 'enterprise'],
  },
];

export const isFeatureEnabled = (
  featureId: string,
  subscriptionTier: string,
  userFlags: Record<string, boolean> = {}
): boolean => {
  // Check user-specific flag first
  if (userFlags[featureId] !== undefined) {
    return userFlags[featureId];
  }

  // Check feature flag configuration
  const feature = FEATURE_FLAGS.find(f => f.id === featureId);
  if (!feature) return false;

  // Check if subscription tier is required
  if (feature.requiredSubscription && feature.requiredSubscription.length > 0) {
    return feature.requiredSubscription.includes(subscriptionTier);
  }

  return feature.enabledByDefault;
};
