import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Star, 
  Check, 
  X, 
  Zap, 
  Users, 
  Building2,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface PlanFeature {
  name: string;
  starter: boolean;
  professional: boolean;
  enterprise: boolean;
}

const PLAN_FEATURES: PlanFeature[] = [
  { name: 'Basic Dashboard', starter: true, professional: true, enterprise: true },
  { name: 'Customer Management', starter: true, professional: true, enterprise: true },
  { name: 'Case Management', starter: true, professional: true, enterprise: true },
  { name: 'Basic Reports', starter: true, professional: true, enterprise: true },
  { name: 'Email Notifications', starter: true, professional: true, enterprise: true },
  { name: 'Advanced Dashboard', starter: false, professional: true, enterprise: true },
  { name: 'Smart Dialer', starter: false, professional: true, enterprise: true },
  { name: 'WhatsApp Integration', starter: false, professional: true, enterprise: true },
  { name: 'Advanced Reports', starter: false, professional: true, enterprise: true },
  { name: 'AI Predictions', starter: false, professional: true, enterprise: true },
  { name: 'Team Management', starter: false, professional: true, enterprise: true },
  { name: 'AI Assistant', starter: false, professional: false, enterprise: true },
  { name: 'Legal Management', starter: false, professional: false, enterprise: true },
  { name: 'Custom Workflows', starter: false, professional: false, enterprise: true },
  { name: 'API Access', starter: false, professional: false, enterprise: true },
  { name: 'White Label', starter: false, professional: false, enterprise: true },
  { name: 'Priority Support', starter: false, professional: false, enterprise: true },
];

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Essential features for small teams',
    priceMonthly: 99,
    priceYearly: 990,
    maxUsers: 5,
    maxTenants: 1,
    color: 'from-blue-500 to-cyan-500',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Advanced features for growing teams',
    priceMonthly: 299,
    priceYearly: 2990,
    maxUsers: 25,
    maxTenants: 5,
    color: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full-featured solution for large organizations',
    priceMonthly: 999,
    priceYearly: 9990,
    maxUsers: -1,
    maxTenants: -1,
    color: 'from-amber-500 to-orange-500',
    popular: false,
  },
];

export const Plans: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
          Subscription Plans
        </h1>
        <p className={cn('text-lg', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
          Choose the right plan for your business needs
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              'relative overflow-hidden transition-all hover:shadow-lg',
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200',
              plan.popular && 'ring-2 ring-indigo-500'
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={cn(
                'w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br flex items-center justify-center',
                plan.color
              )}>
                <Star className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <p className={cn('text-sm mt-2', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                {plan.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Pricing */}
              <div className="text-center space-y-2">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={cn('text-4xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
                    {formatCurrency(plan.priceMonthly)}
                  </span>
                  <span className={cn('text-sm', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                    /month
                  </span>
                </div>
                <div className={cn('text-sm', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                  or {formatCurrency(plan.priceYearly)}/year (save 17%)
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-zinc-400" />
                  <span className={cn('text-sm', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                    {plan.maxUsers === -1 ? 'Unlimited' : `Up to ${plan.maxUsers}`} users
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-zinc-400" />
                  <span className={cn('text-sm', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                    {plan.maxTenants === -1 ? 'Unlimited' : `Up to ${plan.maxTenants}`} tenant(s)
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {PLAN_FEATURES.map((feature) => {
                  const hasFeature = plan.id === 'starter' ? feature.starter :
                                   plan.id === 'professional' ? feature.professional :
                                   feature.enterprise;
                  return (
                    <div key={feature.name} className="flex items-center gap-3">
                      {hasFeature ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <X className="h-4 w-4 text-zinc-400" />
                      )}
                      <span className={cn(
                        'text-sm',
                        hasFeature ? (isDark ? 'text-white' : 'text-zinc-900') : (isDark ? 'text-zinc-500' : 'text-zinc-400')
                      )}>
                        {feature.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <Button
                className={cn(
                  'w-full',
                  plan.popular && 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600'
                )}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.popular ? 'Get Started' : 'Choose Plan'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Zap className="h-8 w-8 text-amber-500" />
              <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                Instant Setup
              </h3>
              <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                Get started in minutes with our quick onboarding process
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-8 w-8 text-emerald-500" />
              <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                Flexible Pricing
              </h3>
              <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                Monthly or yearly billing with no hidden fees
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-indigo-500" />
              <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                Cancel Anytime
              </h3>
              <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                No long-term contracts, cancel whenever you want
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plans;
