import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Grid,
  TextField,
  Chip,
  Avatar,
  Switch,
  Divider,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Building2,
  Palette,
  CreditCard,
  Grid3x3,
  Network,
  UsersRound,
  Users,
  Plug,
  Lock,
  FileText,
  Save,
  Upload,
  X,
  Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`organization-tabpanel-${index}`}
      aria-labelledby={`organization-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `organization-tab-${index}`,
    'aria-controls': `organization-tabpanel-${index}`,
  };
}

export default function Organization() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const { user } = useAppSelector((state) => state.auth);
  
  const tabMap: Record<string, number> = {
    overview: 0,
    branding: 1,
    subscription: 2,
    modules: 3,
    departments: 4,
    teams: 5,
    users: 6,
    integrations: 7,
    security: 8,
    audit: 9,
  };

  const [value, setValue] = useState(tabMap[initialTab] || 0);
  const [logo, setLogo] = useState<string | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    { label: 'Overview', icon: Building2 },
    { label: 'Branding', icon: Palette },
    { label: 'Subscription', icon: CreditCard },
    { label: 'Modules', icon: Grid3x3 },
    { label: 'Departments', icon: Network },
    { label: 'Teams', icon: UsersRound },
    { label: 'Users', icon: Users },
    { label: 'Integrations', icon: Plug },
    { label: 'Security', icon: Lock },
    { label: 'Audit Logs', icon: FileText },
  ];

  const enabledModules = [
    { id: 'dashboard', name: 'Dashboard', description: 'Main dashboard and analytics', enabled: true, core: true },
    { id: 'customers', name: 'Customer Management', description: 'Manage customer profiles and data', enabled: true, core: false },
    { id: 'loans', name: 'Loan Management', description: 'Track and manage loan portfolios', enabled: true, core: false },
    { id: 'recovery', name: 'Recovery Cases', description: 'Manage debt recovery operations', enabled: true, core: false },
    { id: 'communication', name: 'Communication Hub', description: 'Multi-channel communication tools', enabled: false, core: false },
    { id: 'ai-assistant', name: 'AI Assistant', description: 'AI-powered insights and automation', enabled: false, core: false },
    { id: 'reports', name: 'Reports & Analytics', description: 'Advanced reporting and analytics', enabled: true, core: false },
    { id: 'payments', name: 'Payment Processing', description: 'Handle payment collections', enabled: true, core: false },
  ];

  const integrations = [
    { id: 'email', name: 'Email Service', provider: 'SendGrid', status: 'connected', icon: '📧' },
    { id: 'sms', name: 'SMS Gateway', provider: 'Twilio', status: 'connected', icon: '📱' },
    { id: 'whatsapp', name: 'WhatsApp Business', provider: 'Meta', status: 'disconnected', icon: '💬' },
    { id: 'payment', name: 'Payment Gateway', provider: 'Stripe', status: 'connected', icon: '💳' },
    { id: 'crm', name: 'CRM Integration', provider: 'Salesforce', status: 'not configured', icon: '🔄' },
  ];

  const recentAuditLogs = [
    { id: 1, action: 'User created', user: 'Admin', details: 'Created user john@example.com', timestamp: '2024-01-15 10:30:00', ip: '192.168.1.100' },
    { id: 2, action: 'Settings updated', user: 'Admin', details: 'Updated email configuration', timestamp: '2024-01-15 09:15:00', ip: '192.168.1.100' },
    { id: 3, action: 'Role modified', user: 'Admin', details: 'Modified permissions for Recovery Manager', timestamp: '2024-01-14 16:45:00', ip: '192.168.1.100' },
    { id: 4, action: 'Login', user: 'Admin', details: 'Successful login', timestamp: '2024-01-14 09:00:00', ip: '192.168.1.100' },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Organization Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your organization profile, subscription, and configuration.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Save />}>
          Save Changes
        </Button>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="organization tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <Tab
                  key={tab.label}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ fontSize: 16 }} />
                      {tab.label}
                    </Box>
                  }
                  {...a11yProps(index)}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={value} index={0}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Organization Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Organization Name"
                          defaultValue={user?.tenantName || 'Your Organization'}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Industry"
                          placeholder="e.g., Financial Services, Healthcare"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Business Address"
                          placeholder="Street address, City, State, ZIP"
                          variant="outlined"
                          size="small"
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          placeholder="+1 (555) 000-0000"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Website"
                          placeholder="https://yourcompany.com"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Tax ID / VAT Number"
                          placeholder="Enter your tax identification number"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Subscription Details</Typography>
                    <Box sx={{ mb: 3 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">Current Plan</Typography>
                        <Chip label={user?.subscriptionTier || 'Starter'} size="small" color="primary" />
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Chip label="Active" size="small" color="success" />
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">Billing Cycle</Typography>
                        <Typography variant="body2">Monthly</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">Next Billing Date</Typography>
                        <Typography variant="body2">January 15, 2026</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Active Users</Typography>
                        <Typography variant="body2">12 / Unlimited</Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Button variant="outlined" fullWidth>
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Quick Stats</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                          <Typography variant="h4" color="primary.main">12</Typography>
                          <Typography variant="caption" color="text.secondary">Users</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.50', borderRadius: 2 }}>
                          <Typography variant="h4" color="secondary.main">4</Typography>
                          <Typography variant="caption" color="text.secondary">Departments</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                          <Typography variant="h4" color="success.main">8</Typography>
                          <Typography variant="caption" color="text.secondary">Teams</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
                          <Typography variant="h4" color="info.main">6</Typography>
                          <Typography variant="caption" color="text.secondary">Roles</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Branding Tab */}
        <TabPanel value={value} index={1}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Logo & Branding</Typography>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
                      }}
                    >
                      {logo ? (
                        <Box position="relative" display="inline-block">
                          <Avatar src={logo} sx={{ width: 120, height: 120 }} />
                          <Button
                            size="small"
                            sx={{ position: 'absolute', top: -8, right: -8 }}
                            onClick={() => setLogo(null)}
                          >
                            <X sx={{ fontSize: 16 }} />
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Drag and drop your logo here
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            PNG, JPG up to 2MB
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Primary Color"
                      type="color"
                      defaultValue="#6366f1"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Secondary Color"
                      type="color"
                      defaultValue="#8b5cf6"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Email Branding</Typography>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email From Name"
                          placeholder="e.g., RecoverFlow"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Reply-to Email"
                          placeholder="e.g., support@yourcompany.com"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Footer Text"
                          placeholder="Custom footer for all emails"
                          variant="outlined"
                          size="small"
                          multiline
                          rows={3}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Subscription Tab */}
        <TabPanel value={value} index={2}>
          <CardContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Subscription Management</AlertTitle>
              Contact our sales team to upgrade or modify your subscription plan.
            </Alert>
            <Grid container spacing={3}>
              {['Starter', 'Professional', 'Enterprise'].map((plan) => (
                <Grid item xs={12} md={4} key={plan}>
                  <Card
                    sx={{
                      height: '100%',
                      border: user?.subscriptionTier?.toLowerCase() === plan.toLowerCase() ? 2 : 1,
                      borderColor: user?.subscriptionTier?.toLowerCase() === plan.toLowerCase() ? 'primary.main' : 'divider',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{plan}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        {plan === 'Starter' && '$99'}
                        {plan === 'Professional' && '$299'}
                        {plan === 'Enterprise' && 'Custom'}
                        <Typography variant="body2" color="text.secondary">/month</Typography>
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="body2">✓ Core dashboard</Typography>
                        <Typography variant="body2">✓ User management</Typography>
                        {plan !== 'Starter' && <Typography variant="body2">✓ Communication hub</Typography>}
                        {plan !== 'Starter' && <Typography variant="body2">✓ AI assistant</Typography>}
                        {plan === 'Enterprise' && <Typography variant="body2">✓ Custom integrations</Typography>}
                        {plan === 'Enterprise' && <Typography variant="body2">✓ Dedicated support</Typography>}
                      </Box>
                      <Button
                        variant={user?.subscriptionTier?.toLowerCase() === plan.toLowerCase() ? 'outlined' : 'contained'}
                        fullWidth
                        sx={{ mt: 3 }}
                        disabled={user?.subscriptionTier?.toLowerCase() === plan.toLowerCase()}
                      >
                        {user?.subscriptionTier?.toLowerCase() === plan.toLowerCase() ? 'Current Plan' : 'Upgrade'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Modules Tab */}
        <TabPanel value={value} index={3}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Enabled Modules</Typography>
            <Grid container spacing={2}>
              {enabledModules.map((module) => (
                <Grid item xs={12} md={6} key={module.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {module.name}
                            {module.core && (
                              <Chip label="Core" size="small" sx={{ ml: 1, height: 20 }} />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {module.description}
                          </Typography>
                        </Box>
                        <Switch
                          checked={module.enabled}
                          disabled={module.core}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Departments Tab */}
        <TabPanel value={value} index={4}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Departments</Typography>
              <Button variant="contained" startIcon={<Plus />}>
                Add Department
              </Button>
            </Box>
            <Alert severity="info">
              <AlertTitle>Manage Departments</AlertTitle>
              Navigate to the Departments page to manage organizational structure.
              <Button size="small" sx={{ ml: 2 }} href="/app/admin/departments">
                Go to Departments
              </Button>
            </Alert>
          </CardContent>
        </TabPanel>

        {/* Teams Tab */}
        <TabPanel value={value} index={5}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Teams</Typography>
              <Button variant="contained" startIcon={<Plus />}>
                Add Team
              </Button>
            </Box>
            <Alert severity="info">
              <AlertTitle>Manage Teams</AlertTitle>
              Navigate to the Teams page to manage recovery teams.
              <Button size="small" sx={{ ml: 2 }} href="/app/admin/teams">
                Go to Teams
              </Button>
            </Alert>
          </CardContent>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={value} index={6}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Users</Typography>
              <Button variant="contained" startIcon={<Plus />}>
                Add User
              </Button>
            </Box>
            <Alert severity="info">
              <AlertTitle>Manage Users</AlertTitle>
              Navigate to the Users page to manage team members.
              <Button size="small" sx={{ ml: 2 }} href="/app/admin/users">
                Go to Users
              </Button>
            </Alert>
          </CardContent>
        </TabPanel>

        {/* Integrations Tab */}
        <TabPanel value={value} index={7}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Integrations</Typography>
            <Grid container spacing={2}>
              {integrations.map((integration) => (
                <Grid item xs={12} md={6} key={integration.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="h4">{integration.icon}</Typography>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {integration.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {integration.provider}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={integration.status}
                          size="small"
                          color={
                            integration.status === 'connected' ? 'success' :
                            integration.status === 'disconnected' ? 'error' : 'default'
                          }
                        />
                      </Box>
                      <Button
                        variant={integration.status === 'connected' ? 'outlined' : 'contained'}
                        fullWidth
                        sx={{ mt: 2 }}
                        size="small"
                      >
                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={value} index={8}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Security Settings</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                      Password Policy
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="body2">Require strong passwords</Typography>
                          <Switch defaultChecked size="small" />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="body2">Password expiration (90 days)</Typography>
                          <Switch size="small" />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="body2">Prevent password reuse</Typography>
                          <Switch defaultChecked size="small" />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                      Two-Factor Authentication
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="body2">Require 2FA for all users</Typography>
                      <Switch size="small" />
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Require 2FA for admins only</Typography>
                      <Switch defaultChecked size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                      Session Management
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Session Timeout (minutes)"
                          type="number"
                          defaultValue={60}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Maximum Concurrent Sessions"
                          type="number"
                          defaultValue={3}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Audit Logs Tab */}
        <TabPanel value={value} index={9}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Audit Logs</Typography>
              <Button variant="outlined" startIcon={<FileText />}>
                Export Logs
              </Button>
            </Box>
            <Card>
              <CardContent>
                {recentAuditLogs.map((log) => (
                  <Box
                    key={log.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {log.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.details}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="caption" color="text.secondary">
                        {log.timestamp}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        IP: {log.ip}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
}
