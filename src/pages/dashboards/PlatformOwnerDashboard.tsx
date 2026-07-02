import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Building2, 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const PlatformOwnerDashboard: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const kpiData = [
    {
      title: 'Total Tenants',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Subscriptions',
      value: '18',
      change: '+8%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Total Users',
      value: '1,234',
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Monthly Revenue',
      value: '$124,500',
      change: '+22%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'New tenant registered', tenant: 'Acme Corp', time: '2 hours ago', status: 'success' },
    { id: 2, action: 'Subscription upgraded', tenant: 'Tech Solutions', time: '4 hours ago', status: 'success' },
    { id: 3, action: 'Payment failed', tenant: 'Global Finance', time: '6 hours ago', status: 'warning' },
    { id: 4, action: 'User limit reached', tenant: 'StartUp Inc', time: '1 day ago', status: 'warning' },
    { id: 5, action: 'Trial expired', tenant: 'Demo Company', time: '2 days ago', status: 'error' },
  ];

  const systemHealth = [
    { name: 'API Server', status: 'operational', uptime: '99.9%' },
    { name: 'Database', status: 'operational', uptime: '99.8%' },
    { name: 'Redis Cache', status: 'operational', uptime: '99.9%' },
    { name: 'Email Service', status: 'degraded', uptime: '98.5%' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'degraded':
        return 'text-amber-500 bg-amber-500/10';
      case 'down':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-zinc-500 bg-zinc-500/10';
    }
  };

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-zinc-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
          Platform Dashboard
        </h1>
        <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
          Overview of your platform performance and tenant activity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn('text-sm font-medium', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                      {kpi.title}
                    </p>
                    <p className={cn('text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-zinc-900')}>
                      {kpi.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className={cn('h-4 w-4', kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500')} />
                      <span className={cn('text-sm font-medium', kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className={cn('p-3 rounded-xl bg-gradient-to-br', kpi.color)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                      {activity.action}
                    </p>
                    <p className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                      {activity.tenant}
                    </p>
                  </div>
                  <span className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div>
                    <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                      {service.name}
                    </p>
                    <p className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                      Uptime: {service.uptime}
                    </p>
                  </div>
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold capitalize', getStatusColor(service.status))}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className={cn('w-full text-left px-4 py-3 rounded-lg border transition-colors', isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50')}>
                <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                  Add New Tenant
                </p>
                <p className={cn('text-xs mt-1', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                  Register a new company
                </p>
              </button>
              <button className={cn('w-full text-left px-4 py-3 rounded-lg border transition-colors', isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50')}>
                <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                  View Subscriptions
                </p>
                <p className={cn('text-xs mt-1', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                  Manage tenant subscriptions
                </p>
              </button>
              <button className={cn('w-full text-left px-4 py-3 rounded-lg border transition-colors', isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50')}>
                <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                  Generate Reports
                </p>
                <p className={cn('text-xs mt-1', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                  Platform analytics
                </p>
              </button>
              <button className={cn('w-full text-left px-4 py-3 rounded-lg border transition-colors', isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50')}>
                <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                  System Settings
                </p>
                <p className={cn('text-xs mt-1', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
                  Configure platform
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformOwnerDashboard;
