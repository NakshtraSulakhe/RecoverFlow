import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Scale,
  DollarSign,
  ArrowUp,
  RefreshCw,
  Building2,
  Shield,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';

interface DashboardStats {
  totalCustomers: number;
  activeCases: number;
  totalRecovered: number;
  recoveryRate: number;
  weeklyData: Array<{ name: string; value: number }>;
}

const NewDashboard: React.FC = () => {
  const { user, tenant, user_type } = useAuth();
  const { mode } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeCases: 0,
    totalRecovered: 0,
    recoveryRate: 0,
    weeklyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Role-based dashboard content
  const getRoleBasedKPIs = () => {
    const baseKPIs = [
      {
        title: 'Total Customers',
        value: stats.totalCustomers.toLocaleString(),
        icon: <Users className="h-5 w-5" />,
        trend: 12.5,
        color: 'primary' as const,
      },
      {
        title: 'Active Cases',
        value: stats.activeCases.toLocaleString(),
        icon: <Scale className="h-5 w-5" />,
        trend: 8.2,
        color: 'secondary' as const,
      },
      {
        title: 'Total Recovered',
        value: formatCurrency(stats.totalRecovered),
        icon: <DollarSign className="h-5 w-5" />,
        trend: 15.3,
        color: 'success' as const,
      },
      {
        title: 'Recovery Rate',
        value: `${stats.recoveryRate}%`,
        icon: <TrendingUp className="h-5 w-5" />,
        trend: 5.1,
        color: 'info' as const,
      },
    ];

    // Platform owner gets additional KPIs
    if (user_type === 'platform_owner') {
      return [
        ...baseKPIs,
        {
          title: 'Active Tenants',
          value: '24',
          icon: <Building2 className="h-5 w-5" />,
          trend: 3.2,
          color: 'primary' as const,
        },
        {
          title: 'System Health',
          value: '98%',
          icon: <Shield className="h-5 w-5" />,
          trend: 0.5,
          color: 'success' as const,
        },
      ];
    }

    return baseKPIs;
  };

  const fetchDashboardStats = async () => {
    try {
      setIsRefreshing(true);
      
      // TODO: Replace with actual API calls when backend is ready
      // For now, using mock data
      const mockStats: DashboardStats = {
        totalCustomers: 1247,
        activeCases: 384,
        totalRecovered: 2847500,
        recoveryRate: 68.5,
        weeklyData: [
          { name: 'Mon', value: 400 },
          { name: 'Tue', value: 300 },
          { name: 'Wed', value: 600 },
          { name: 'Thu', value: 800 },
          { name: 'Fri', value: 500 },
          { name: 'Sat', value: 900 },
          { name: 'Sun', value: 1000 },
        ],
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleRefresh = () => {
    fetchDashboardStats();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpiData = getRoleBasedKPIs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-500" />
          <p className="text-sm text-zinc-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const isDark = mode === 'dark';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Welcome back, {user?.first_name || 'Admin'}!
          </h1>
          <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-600'} mt-1`}>
            Here's what's happening with {tenant?.tenant_name || 'your organization'} today.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} isDark={isDark} />
        ))}
      </div>

      {/* Chart */}
      <Card className={`border ${isDark ? 'border-white/5 bg-zinc-900/50' : 'border-zinc-200 bg-white'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Weekly Recovery Performance
            </h3>
            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300">
              Last 7 Days
            </Badge>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff10" : "#e5e7eb"} />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "#71717a" : "#71717a"}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isDark ? "#71717a" : "#71717a"}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    border: isDark ? '1px solid #27272a' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: isDark ? '#fafafa' : '#18181b' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
  color: 'primary' | 'secondary' | 'success' | 'info';
  isDark: boolean;
}

const KPICard = ({ title, value, icon, trend, color, isDark }: KPICardProps) => {
  const colorMap = {
    primary: {
      text: isDark ? 'text-indigo-400' : 'text-indigo-600',
      bg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
      gradient: 'from-indigo-500 to-indigo-600',
      glow: isDark ? 'shadow-indigo-500/10' : 'shadow-indigo-500/20',
    },
    secondary: {
      text: isDark ? 'text-violet-400' : 'text-violet-600',
      bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
      gradient: 'from-violet-500 to-violet-600',
      glow: isDark ? 'shadow-violet-500/10' : 'shadow-violet-500/20',
    },
    success: {
      text: isDark ? 'text-emerald-400' : 'text-emerald-600',
      bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      gradient: 'from-emerald-500 to-teal-500',
      glow: isDark ? 'shadow-emerald-500/10' : 'shadow-emerald-500/20',
    },
    info: {
      text: isDark ? 'text-purple-400' : 'text-purple-600',
      bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
      gradient: 'from-purple-500 to-fuchsia-500',
      glow: isDark ? 'shadow-purple-500/10' : 'shadow-purple-500/20',
    },
  };

  const activeColor = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`relative overflow-hidden border ${isDark ? 'border-white/5 bg-zinc-900/50' : 'border-zinc-200 bg-white'} p-6 shadow-md hover:shadow-lg ${activeColor.glow} transition-all duration-300`}
      >
        <div
          className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${activeColor.gradient}`}
        />
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <span className={`text-xs font-bold tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'} uppercase`}>
              {title}
            </span>
            <h3 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {value}
            </h3>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="success"
                className={`flex items-center gap-0.5 px-1.5 py-0.5 font-bold ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}
              >
                <ArrowUp className="h-3 w-3" />
                <span>{trend}%</span>
              </Badge>
              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>vs last month</span>
            </div>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${activeColor.gradient} text-white shadow-md`}
          >
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NewDashboard;
