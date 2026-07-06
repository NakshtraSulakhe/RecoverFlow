import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  Users,
  Network,
  UsersRound,
  Shield,
  MessageSquare,
  Upload,
  CheckCircle2,
  Circle,
  AlertTriangle,
  TrendingUp,
  Gavel,
  DollarSign,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../../redux/store';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { departmentService, teamService, roleService, userService } from '../../../services/api';

const SETUP_ITEMS = [
  { id: 'profile', label: 'Complete organization profile', path: '/app/organization?tab=overview', check: 'profile' },
  { id: 'departments', label: 'Create departments', path: '/app/admin/departments', check: 'departments' },
  { id: 'teams', label: 'Create teams', path: '/app/admin/teams', check: 'teams' },
  { id: 'roles', label: 'Create roles', path: '/app/admin/roles', check: 'roles' },
  { id: 'users', label: 'Create users', path: '/app/admin/users', check: 'users' },
  { id: 'communication', label: 'Configure communication providers', path: '/app/organization?tab=integrations', check: 'communication' },
  { id: 'customers', label: 'Import customers', path: '/app/customers', check: 'customers' },
  { id: 'loans', label: 'Import loans', path: '/app/loans', check: 'loans' },
];

export const TenantAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const user = useAppSelector((state) => state.auth.user);

  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: () => departmentService.getAllDepartments() });
  const { data: teams } = useQuery({ queryKey: ['teams'], queryFn: () => teamService.getAllTeams() });
  const { data: roles } = useQuery({ queryKey: ['roles'], queryFn: () => roleService.getAllRoles() });
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: () => userService.getAllUsers() });

  const deptCount = departments?.data?.length || 0;
  const teamCount = teams?.data?.length || 0;
  const roleCount = roles?.data?.length || 0;
  const userCount = users?.data?.length || 0;

  const completedChecks: Record<string, boolean> = {
    profile: !!user?.tenantName,
    departments: deptCount > 0,
    teams: teamCount > 0,
    roles: roleCount > 0,
    users: userCount > 1,
    communication: false,
    customers: false,
    loans: false,
  };

  const completedCount = SETUP_ITEMS.filter((item) => completedChecks[item.check]).length;
  const setupProgress = Math.round((completedCount / SETUP_ITEMS.length) * 100);

  const kpis = [
    { title: 'Total Users', value: userCount, icon: Users, color: 'indigo' },
    { title: 'Departments', value: deptCount, icon: Network, color: 'violet' },
    { title: 'Teams', value: teamCount, icon: UsersRound, color: 'emerald' },
    { title: 'Active Cases', value: 0, icon: Gavel, color: 'amber' },
  ];

  const quickActions = [
    { label: 'Manage Organization', icon: Building2, path: '/app/organization' },
    { label: 'Add User', icon: Users, path: '/app/admin/users' },
    { label: 'Configure Roles', icon: Shield, path: '/app/admin/roles' },
    { label: 'View Settings', icon: Settings, path: '/app/settings' },
  ];

  const alerts = [
    ...(setupProgress < 100 ? [{ type: 'warning' as const, message: 'Complete your organization setup checklist to unlock full operational readiness.' }] : []),
    ...(user?.mustChangePassword ? [{ type: 'warning' as const, message: 'Password change required before full access.' }] : []),
    { type: 'info' as const, message: 'Customer Management and Collections modules will be available in upcoming sprints.' },
  ];

  const activities = [
    { action: 'Organization workspace initialized', time: 'Just now', type: 'system' },
    { action: `${userCount} user(s) in organization`, time: 'Current', type: 'users' },
    { action: `Subscription: ${user?.subscription?.plan_name || user?.subscriptionTier || 'Starter'}`, time: 'Active', type: 'billing' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
            Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className={cn('mt-1', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
            {user?.tenantName || 'Your Organization'} — Organization management & operational readiness
          </p>
        </div>
        <Badge className="w-fit bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
          Tenant Admin Workspace
        </Badge>
      </div>

      {/* Organization + Subscription Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-500" /> Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{user?.tenantName || '—'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Admin</span><span className="font-medium">{user?.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Timezone</span><span className="font-medium">{user?.timezone || 'UTC'}</span></div>
            <Button variant="link" className="p-0 h-auto text-indigo-500" onClick={() => navigate('/app/organization')}>
              View organization details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-violet-500" /> Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium capitalize">{user?.subscription?.plan_name || user?.subscriptionTier || 'Starter'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="outline" className="text-emerald-500 border-emerald-500/30">{user?.subscription?.status || 'Active'}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Modules</span><span className="font-medium">{user?.enabledModules?.length || 0} enabled</span></div>
            <Button variant="link" className="p-0 h-auto text-indigo-500" onClick={() => navigate('/app/organization?tab=subscription')}>
              Manage subscription <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{kpi.title}</span>
                <kpi.icon className={`h-4 w-4 text-${kpi.color}-500`} />
              </div>
              <p className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Setup Checklist */}
        <Card className={cn('xl:col-span-1 border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
          <CardHeader>
            <CardTitle className="text-base">Quick Setup Checklist</CardTitle>
            <p className="text-xs text-muted-foreground">{setupProgress}% complete · {completedCount}/{SETUP_ITEMS.length}</p>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mt-2">
              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${setupProgress}%` }} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {SETUP_ITEMS.map((item) => {
              const done = completedChecks[item.check];
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary',
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-zinc-500 shrink-0" />
                  )}
                  <span className={done ? 'line-through opacity-60' : ''}>{item.label}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recovery Overview + Quick Actions */}
        <div className="xl:col-span-2 space-y-4">
          <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Recovery Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Open Cases', value: '0', icon: Gavel },
                  { label: 'Collected', value: '$0', icon: DollarSign },
                  { label: 'PTP Rate', value: '—', icon: TrendingUp },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border p-4 text-center">
                    <stat.icon className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Recovery operations will populate once Customers and Loans modules are enabled in a future sprint.
              </p>
            </CardContent>
          </Card>

          <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button key={action.label} variant="outline" className="justify-start h-auto py-3" onClick={() => navigate(action.path)}>
                  <action.icon className="h-4 w-4 mr-2 text-indigo-500" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activities */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
          <CardHeader><CardTitle className="text-base">Recent Activities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                <span>{activity.action}</span>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Organization Alerts */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white')}>
          <CardHeader><CardTitle className="text-base">Organization Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={cn(
                'flex items-start gap-3 rounded-lg p-3 text-sm',
                alert.type === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
              )}>
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{alert.message}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantAdminDashboard;
