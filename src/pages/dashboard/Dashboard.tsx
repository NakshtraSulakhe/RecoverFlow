import React from 'react';
import { useAppSelector } from '../../redux/store';
import TenantAdminDashboard from './TenantAdminDashboard';
import { Box, Grid, Typography, Card, CardContent, IconButton, Button, Avatar, Chip } from '@mui/material'
import { 
  TrendingUp, 
  PeopleAltOutlined, 
  GavelOutlined, 
  AttachMoneyOutlined,
  MoreVert,
  ArrowUpward,
  FileDownloadOutlined,
  FilterList,
  Search
} from '@mui/icons-material'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 1000 },
]

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
              icon={<ArrowUpward sx={{ fontSize: 12 }} />} 
              sx={{ 
                bgcolor: 'success.50', 
                color: 'success.main', 
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
)

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);

  // Show Tenant Admin Dashboard for tenant_admin role
  if (user?.role === 'tenant_admin') {
    return <TenantAdminDashboard />;
  }

  // Show standard dashboard for other roles
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h2" gutterBottom>Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'Admin'}. Here's what's happening with your recovery operations today.
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button startIcon={<FilterList />} variant="outlined">Filters</Button>
          <Button startIcon={<FileDownloadOutlined />} variant="contained">Export Report</Button>
        </Box>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Customers" value="1,234" icon={<PeopleAltOutlined />} trend={12.5} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Active Cases" value="567" icon={<GavelOutlined />} trend={8.2} color="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Recovered" value="$2.5M" icon={<AttachMoneyOutlined />} trend={15.3} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Recovery Rate" value="78%" icon={<TrendingUp />} trend={4.1} color="info" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Recovery Performance</Typography>
                <IconButton size="small"><MoreVert /></IconButton>
              </Box>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }} 
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" mb={3}>Quick Actions</Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {[
                  { text: 'Create New Case', icon: <GavelOutlined fontSize="small" />, color: 'primary' },
                  { text: 'Verify Payment', icon: <AttachMoneyOutlined fontSize="small" />, color: 'success' },
                  { text: 'Download Reports', icon: <FileDownloadOutlined fontSize="small" />, color: 'secondary' },
                  { text: 'Global Search', icon: <Search fontSize="small" />, color: 'info' },
                ].map((action, i) => (
                  <Button
                    key={i}
                    variant="outlined"
                    fullWidth
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
                      <Avatar sx={{ width: 32, height: 32, bgcolor: `${action.color}.50`, color: `${action.color}.main`, mr: 0.5 }}>
                        {action.icon}
                      </Avatar>
                    }
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{action.text}</Typography>
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
