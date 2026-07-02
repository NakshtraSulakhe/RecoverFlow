import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useTenant, useTenantStats } from '../../hooks/useTenants';
import { useUsageDashboard } from '../../hooks/useUsage';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  ArrowLeft, 
  Edit, 
  Building2, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Palette, 
  Plug,
  FileText,
  Activity,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

type TabType = 'overview' | 'subscription' | 'users' | 'usage' | 'billing' | 'integrations' | 'branding' | 'audit';

export const TenantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: tenant, isLoading: tenantLoading, error: tenantError } = useTenant(id!);
  const { data: stats, isLoading: statsLoading } = useTenantStats(id!);
  const { data: usage, isLoading: usageLoading } = useUsageDashboard(id!);

  if (tenantLoading) {
    return (
      <div className="p-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (tenantError || !tenant) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          Error loading tenant details
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Building2 },
    { id: 'subscription' as TabType, label: 'Subscription', icon: CreditCard },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'usage' as TabType, label: 'Usage', icon: BarChart3 },
    { id: 'billing' as TabType, label: 'Billing', icon: DollarSign },
    { id: 'integrations' as TabType, label: 'Integrations', icon: Plug },
    { id: 'branding' as TabType, label: 'Branding', icon: Palette },
    { id: 'audit' as TabType, label: 'Audit Logs', icon: Activity },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Company Information */}
            <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
              <CardHeader>
                <CardTitle className="text-lg">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Company Name
                    </label>
                    <p className={cn('mt-1 font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                      {tenant.tenant_name}
                    </p>
                  </div>
                  <div>
                    <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Company Code
                    </label>
                    <p className={cn('mt-1 font-mono text-sm', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                      {tenant.tenant_code}
                    </p>
                  </div>
                  <div>
                    <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Industry
                    </label>
                    <p className={cn('mt-1', isDark ? 'text-white' : 'text-zinc-900')}>
                      {tenant.industry || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Status
                    </label>
                    <div className="mt-1">
                      <StatusBadge status={tenant.is_active ? 'active' : 'inactive'} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', isDark ? 'bg-zinc-800' : 'bg-zinc-100')}>
                      <Mail className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                        Email
                      </label>
                      <p className={cn('mt-1 text-sm', isDark ? 'text-white' : 'text-zinc-900')}>
                        {tenant.contact_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', isDark ? 'bg-zinc-800' : 'bg-zinc-100')}>
                      <Phone className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                        Phone
                      </label>
                      <p className={cn('mt-1 text-sm', isDark ? 'text-white' : 'text-zinc-900')}>
                        {tenant.contact_phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', isDark ? 'bg-zinc-800' : 'bg-zinc-100')}>
                      <MapPin className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                        Address
                      </label>
                      <p className={cn('mt-1 text-sm', isDark ? 'text-white' : 'text-zinc-900')}>
                        {tenant.address || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', isDark ? 'bg-zinc-800' : 'bg-zinc-100')}>
                      <Globe className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <label className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                        Subdomain
                      </label>
                      <p className={cn('mt-1 text-sm font-mono', isDark ? 'text-white' : 'text-zinc-900')}>
                        {tenant.subdomain || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {!statsLoading && stats && (
              <div className="grid grid-cols-4 gap-4">
                <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                          Users
                        </p>
                        <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                          {stats.users}
                        </p>
                      </div>
                      <div className={cn('p-3 rounded-xl bg-indigo-500/10', isDark ? 'text-indigo-400' : 'text-indigo-600')}>
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                          Customers
                        </p>
                        <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                          {stats.customers}
                        </p>
                      </div>
                      <div className={cn('p-3 rounded-xl bg-emerald-500/10', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
                        <Building2 className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                          Loans
                        </p>
                        <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                          {stats.loans}
                        </p>
                      </div>
                      <div className={cn('p-3 rounded-xl bg-amber-500/10', isDark ? 'text-amber-400' : 'text-amber-600')}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                          Cases
                        </p>
                        <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                          {stats.cases}
                        </p>
                      </div>
                      <div className={cn('p-3 rounded-xl bg-purple-500/10', isDark ? 'text-purple-400' : 'text-purple-600')}>
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-6">
            {usageLoading ? (
              <SkeletonLoader />
            ) : usage ? (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                            Active Users
                          </p>
                          <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                            {usage.active_users}
                          </p>
                        </div>
                        <div className={cn('p-3 rounded-xl bg-indigo-500/10', isDark ? 'text-indigo-400' : 'text-indigo-600')}>
                          <Users className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                            Total Customers
                          </p>
                          <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                            {usage.total_customers}
                          </p>
                        </div>
                        <div className={cn('p-3 rounded-xl bg-emerald-500/10', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
                          <Building2 className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                            Total Loans
                          </p>
                          <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                            {usage.total_loans}
                          </p>
                        </div>
                        <div className={cn('p-3 rounded-xl bg-amber-500/10', isDark ? 'text-amber-400' : 'text-amber-600')}>
                          <CreditCard className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn('text-xs font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                            Total Cases
                          </p>
                          <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                            {usage.total_cases}
                          </p>
                        </div>
                        <div className={cn('p-3 rounded-xl bg-purple-500/10', isDark ? 'text-purple-400' : 'text-purple-600')}>
                          <FileText className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Month Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usage.current_month_usage && usage.current_month_usage.length > 0 ? (
                      <div className="space-y-3">
                        {usage.current_month_usage.map((item: any) => (
                          <div key={item.metric_name} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div>
                              <p className={cn('font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                                {item.metric_name.replace(/_/g, ' ').toUpperCase()}
                              </p>
                              <p className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                                {item.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                              <span className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
                                {item.total_value.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={cn('text-center py-8', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                        No usage data available for current month
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <p className={cn('text-center py-8', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                Loading usage data...
              </p>
            )}
          </div>
        );

      default:
        return (
          <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
            <CardContent className="p-12 text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
              <p className={cn('text-lg font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                {tabs.find(t => t.id === activeTab)?.label}
              </p>
              <p className={cn('text-sm mt-2', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                This tab is under development
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/platform/tenants')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
              {tenant.tenant_name}
            </h1>
            <p className={cn('text-sm', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
              {tenant.tenant_code} • {tenant.industry || 'N/A'}
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/platform/tenants/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Tenant
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TenantDetails;
