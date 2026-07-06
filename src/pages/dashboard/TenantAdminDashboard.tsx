import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Building2,
  Users,
  TrendingUp,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Settings,
  Shield,
  Network,
  UsersRound,
  Phone,
  FileText,
  Plug,
  Lock,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SetupChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  path: string;
  icon: React.ElementType;
}

const KPICard = ({ title, value, icon, trend, color }: any) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>{value}</Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Chip 
              size="small" 
              label={`${trend}%`} 
              icon={<TrendingUp sx={{ fontSize: 12 }} />} 
              sx={{ 
                bgcolor: `${color}.50`, 
                color: `${color}.main`, 
                fontWeight: 700,
                fontSize: 11,
                height: 20
              }} 
            />
            <Typography variant="caption" color="text.secondary">vs last month</Typography>
          </Box>
        </Box>
        <Avatar 
          sx={{ 
            bgcolor: `${color}.50`, 
            color: `${color}.main`,
            borderRadius: 2,
            width: 48,
            height: 48
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const QuickActionButton = ({ label, icon, color, onClick }: any) => (
  <Button
    variant="outlined"
    fullWidth
    onClick={onClick}
    sx={{ 
      justifyContent: 'flex-start', 
      py: 1.5, 
      px: 2, 
      borderRadius: 3,
      border: '1px solid #f1f5f9',
      bgcolor: '#f8fafc',
      '&:hover': { bgcolor: '#f1f5f9' }
    }}
    startIcon={
      <Avatar sx={{ width: 32, height: 32, bgcolor: `${color}.50`, color: `${color}.main`, mr: 0.5 }}>
        {icon}
      </Avatar>
    }
  >
    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{label}</Typography>
  </Button>
);

export default function TenantAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [setupProgress, setSetupProgress] = useState(30);

  const setupChecklist: SetupChecklistItem[] = [
    {
      id: 'profile',
      label: 'Complete organization profile',
      description: 'Add your organization details and branding',
      completed: true,
      path: '/app/organization?tab=overview',
      icon: Building2,
    },
    {
      id: 'departments',
      label: 'Create departments',
      description: 'Set up organizational structure',
      completed: false,
      path: '/app/admin/departments',
      icon: Network,
    },
    {
      id: 'teams',
      label: 'Create teams',
      description: 'Organize your recovery teams',
      completed: false,
      path: '/app/admin/teams',
      icon: UsersRound,
    },
    {
      id: 'roles',
      label: 'Configure roles',
      description: 'Define user roles and permissions',
      completed: false,
      path: '/app/admin/roles',
      icon: Shield,
    },
    {
      id: 'users',
      label: 'Create users',
      description: 'Invite team members to your organization',
      completed: false,
      path: '/app/admin/users',
      icon: Users,
    },
    {
      id: 'communication',
      label: 'Configure communication providers',
      description: 'Set up email, SMS, and WhatsApp',
      completed: false,
      path: '/app/organization?tab=integrations',
      icon: Phone,
    },
    {
      id: 'customers',
      label: 'Import customers',
      description: 'Upload your customer database',
      completed: false,
      path: '/app/customers',
      icon: Users,
    },
    {
      id: 'loans',
      label: 'Import loans',
      description: 'Upload your loan portfolio',
      completed: false,
      path: '/app/loans',
      icon: FileText,
    },
  ];

  const recentActivities = [
    { id: 1, action: 'User created', details: 'John Smith joined as Recovery Agent', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Team updated', details: 'Collections Team A assigned 5 new cases', time: '4 hours ago', type: 'team' },
    { id: 3, action: 'Settings changed', details: 'Email configuration updated', time: '6 hours ago', type: 'settings' },
    { id: 4, action: 'Role created', details: 'New role "Senior Manager" created', time: '1 day ago', type: 'role' },
  ];

  const organizationAlerts = [
    { id: 1, severity: 'warning', title: 'Subscription expiring soon', message: 'Your subscription expires in 15 days', action: 'Renew Now' },
    { id: 2, severity: 'info', title: 'New features available', message: 'AI Assistant is now available for your plan', action: 'Learn More' },
  ];

  const completedCount = setupChecklist.filter(item => item.completed).length;
  const progressPercentage = (completedCount / setupChecklist.length) * 100;

  return (
    <Box>
      {/* Welcome Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'Admin'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's an overview of your organization and recovery operations.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Settings />}>
          Quick Setup
        </Button>
      </Box>

      {/* Organization Information */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3} mb={2}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.50' }}>
                  <Building2 sx={{ fontSize: 32, color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.tenantName || 'Your Organization'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tenant ID: {user?.tenantId || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Chip label="Active" size="small" color="success" icon={<CheckCircle2 sx={{ fontSize: 14 }} />} />
                <Chip label={`${user?.subscriptionTier || 'Starter'} Plan`} size="small" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Subscription Summary</Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Plan Type</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.subscriptionTier || 'Starter'}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip label="Active" size="small" color="success" sx={{ height: 24 }} />
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Next Billing</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Jan 15, 2026</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Enabled Modules</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.enabledModules?.length || 5} active</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Organization Alerts */}
      {organizationAlerts.length > 0 && (
        <Grid container spacing={3} mb={4}>
          {organizationAlerts.map((alert) => (
            <Grid item xs={12} md={6} key={alert.id}>
              <Alert 
                severity={alert.severity as any}
                action={
                  <Button color="inherit" size="small">
                    {alert.action}
                  </Button>
                }
              >
                <AlertTitle>{alert.title}</AlertTitle>
                {alert.message}
              </Alert>
            </Grid>
          ))}
        </Grid>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Users" value="12" icon={<Users />} trend={25} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Departments" value="4" icon={<Network />} trend={0} color="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Teams" value="8" icon={<UsersRound />} trend={33} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Roles" value="6" icon={<Shield />} trend={0} color="info" />
        </Grid>
      </Grid>

      {/* Quick Setup Checklist */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Quick Setup Checklist</Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedCount} of {setupChecklist.length} completed
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                {setupChecklist.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Box
                        onClick={() => !item.completed && navigate(item.path)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: item.completed ? 'success.50' : 'grey.50',
                          cursor: item.completed ? 'default' : 'pointer',
                          '&:hover': !item.completed ? { bgcolor: 'grey.100' } : {},
                          transition: 'all 0.2s',
                        }}
                      >
                        <Avatar sx={{ bgcolor: item.completed ? 'success.100' : 'grey.200', color: item.completed ? 'success.main' : 'grey.600' }}>
                          {item.completed ? <CheckCircle2 sx={{ fontSize: 20 }} /> : <Circle sx={{ fontSize: 20 }} />}
                        </Avatar>
                        <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main' }}>
                          <Icon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: item.completed ? 'text.disabled' : 'text.primary' }}>
                            {item.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.description}
                          </Typography>
                        </Box>
                        {!item.completed && <ChevronRight sx={{ fontSize: 20, color: 'text.secondary' }} />}
                      </Box>
                    </motion.div>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Quick Actions</Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <QuickActionButton 
                  label="Add New User" 
                  icon={<Users fontSize="small" />} 
                  color="primary"
                  onClick={() => navigate('/app/admin/users')}
                />
                <QuickActionButton 
                  label="Create Department" 
                  icon={<Network fontSize="small" />} 
                  color="secondary"
                  onClick={() => navigate('/app/admin/departments')}
                />
                <QuickActionButton 
                  label="Create Team" 
                  icon={<UsersRound fontSize="small" />} 
                  color="success"
                  onClick={() => navigate('/app/admin/teams')}
                />
                <QuickActionButton 
                  label="Configure Roles" 
                  icon={<Shield fontSize="small" />} 
                  color="info"
                  onClick={() => navigate('/app/admin/roles')}
                />
                <QuickActionButton 
                  label="View Reports" 
                  icon={<BarChart3 fontSize="small" />} 
                  color="warning"
                  onClick={() => navigate('/app/reports')}
                />
                <QuickActionButton 
                  label="Organization Settings" 
                  icon={<Settings fontSize="small" />} 
                  color="grey"
                  onClick={() => navigate('/app/organization')}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recovery Overview & Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Recovery Overview</Typography>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.100', mx: 'auto', mb: 3 }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'grey.400' }} />
                </Avatar>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No recovery data yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start by importing customers and loans to see recovery metrics.
                </Typography>
                <Button variant="outlined" startIcon={<ArrowRight />}>
                  Import Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Activities</Typography>
                <Button size="small" color="primary">
                  View All
                </Button>
              </Box>
              <Box display="flex" flexDirection="column" gap={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {recentActivities.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'grey.50',
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main', width: 36, height: 36 }}>
                      {activity.type === 'user' && <Users sx={{ fontSize: 18 }} />}
                      {activity.type === 'team' && <UsersRound sx={{ fontSize: 18 }} />}
                      {activity.type === 'settings' && <Settings sx={{ fontSize: 18 }} />}
                      {activity.type === 'role' && <Shield sx={{ fontSize: 18 }} />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.details}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
