import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAppSelector } from '../../../redux/store';
import { cn } from '../../../utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import DepartmentsPage from '../../../pages/settings/Departments';
import TeamsPage from '../../../pages/settings/Teams';
import RolesPage from '../../../pages/settings/Roles';
import PermissionsPage from '../../../pages/settings/Permissions';
import TenantUsersPage from './TenantUsers';
import ComingSoonPage from './ComingSoonPage';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'branding', label: 'Branding' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'modules', label: 'Modules' },
  { id: 'departments', label: 'Departments' },
  { id: 'teams', label: 'Teams' },
  { id: 'users', label: 'Users' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'security', label: 'Security' },
  { id: 'audit', label: 'Audit Logs' },
];

export const OrganizationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const user = useAppSelector((state) => state.auth.user);

  const setTab = (tab: string) => setSearchParams({ tab });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
            <CardHeader><CardTitle>Organization Overview</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Organization</span><p className="font-medium">{user?.tenantName}</p></div>
              <div><span className="text-muted-foreground">Tenant ID</span><p className="font-medium font-mono text-xs">{user?.tenantId}</p></div>
              <div><span className="text-muted-foreground">Plan</span><p className="font-medium capitalize">{user?.subscriptionTier}</p></div>
              <div><span className="text-muted-foreground">Enabled Modules</span><p className="font-medium">{user?.enabledModules?.join(', ') || '—'}</p></div>
            </CardContent>
          </Card>
        );
      case 'branding':
        return <ComingSoonPage title="Branding" description="Customize logo, colors, and white-label settings for your organization." moduleName="Organization · Branding" />;
      case 'subscription':
        return (
          <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
            <CardHeader><CardTitle>Subscription Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><Badge>{user?.subscription?.plan_name || user?.subscriptionTier}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Billing Cycle</span><span>{user?.subscription?.billing_cycle || 'Yearly'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-emerald-500">{user?.subscription?.status || 'Active'}</span></div>
            </CardContent>
          </Card>
        );
      case 'modules':
        return (
          <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
            <CardHeader><CardTitle>Enabled Modules</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(user?.enabledModules || []).map((mod) => (
                  <Badge key={mod} variant="outline">{mod}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'departments':
        return <DepartmentsPage />;
      case 'teams':
        return <TeamsPage />;
      case 'users':
        return <TenantUsersPage />;
      case 'integrations':
        return <ComingSoonPage title="Integrations" description="Connect SMS, email, WhatsApp, and dialer providers." moduleName="Organization · Integrations" />;
      case 'security':
        return <ComingSoonPage title="Security" description="Configure SSO, MFA, password policies, and session settings." moduleName="Organization · Security" />;
      case 'audit':
        return <ComingSoonPage title="Audit Logs" description="View organization-level audit trail and compliance logs." moduleName="Organization · Audit Logs" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className={cn('text-2xl font-bold flex items-center gap-2', isDark ? 'text-white' : 'text-zinc-900')}>
          <Building2 className="h-6 w-6 text-indigo-500" /> Organization
        </h1>
        <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
          Manage your organization profile, structure, and configuration
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-t-lg transition-colors',
              activeTab === tab.id
                ? 'text-indigo-500 border-b-2 border-indigo-500'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
};

export default OrganizationPage;
