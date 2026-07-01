/**
 * Tenant Profile Page
 * Comprehensive tenant workspace with multiple sections
 */

import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
  Api as ApiIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material'
import { useTenant } from '../../features/tenant/context'
import { TenantStatus } from '../../features/tenant/types'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export const TenantProfile: React.FC = () => {
  const { tenant, isLoading } = useTenant()
  const [tabValue, setTabValue] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Save failed', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!tenant) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">No tenant data available</Alert>
      </Container>
    )
  }

  const storagePercentage = (tenant.usage.storage.used / tenant.usage.storage.limit) * 100
  const usersPercentage = (tenant.usage.users.used / tenant.usage.users.limit) * 100

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={tenant.logo}
              alt={tenant.name}
              sx={{ width: 80, height: 80 }}
            >
              {tenant.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight={600}>
              {tenant.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {tenant.code} • {tenant.domain}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={tenant.status}
                color={tenant.status === TenantStatus.ACTIVE ? 'success' : 'warning'}
                size="small"
              />
              <Chip
                label={tenant.subscription.plan}
                color="primary"
                size="small"
              />
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {}}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Usage Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StorageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">Storage</Typography>
              </Box>
              <Typography variant="h6">
                {tenant.usage.storage.used} / {tenant.usage.storage.limit} {tenant.usage.storage.unit}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={storagePercentage}
                sx={{ mt: 1 }}
                color={storagePercentage > 80 ? 'error' : 'primary'}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">Users</Typography>
              </Box>
              <Typography variant="h6">
                {tenant.usage.users.used} / {tenant.usage.users.limit}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={usersPercentage}
                sx={{ mt: 1 }}
                color={usersPercentage > 80 ? 'error' : 'primary'}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ApiIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">API Calls</Typography>
              </Box>
              <Typography variant="h6">
                {tenant.usage.apiCalls.used.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SmartToyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">AI Credits</Typography>
              </Box>
              <Typography variant="h6">
                {tenant.usage.aiCredits.used} / {tenant.usage.aiCredits.limit}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Credits remaining
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Company Information" />
          <Tab label="Branding" />
          <Tab label="Business Details" />
          <Tab label="Subscription" />
          <Tab label="Security" />
          <Tab label="Audit" />
        </Tabs>

        {saveSuccess && (
          <Alert severity="success" sx={{ mx: 3, mt: 2 }}>
            Changes saved successfully
          </Alert>
        )}

        {/* Company Information */}
        <TabPanel value={tabValue} index={0}>
          <Container maxWidth="md">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  defaultValue={tenant.name}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tenant Code"
                  defaultValue={tenant.code}
                  disabled
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Domain"
                  defaultValue={tenant.domain}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subdomain"
                  defaultValue={tenant.subdomain}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Primary Contact
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  defaultValue={tenant.primaryContact.name}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={tenant.primaryContact.email}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button variant="outlined">Cancel</Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </TabPanel>

        {/* Branding */}
        <TabPanel value={tabValue} index={1}>
          <Container maxWidth="md">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Logo Management
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 3, textAlign: 'center' }}>
                  <Avatar
                    src={tenant.branding.logoLight}
                    alt="Light Logo"
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  >
                    <BusinessIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="body2" gutterBottom>
                    Light Theme Logo
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                    >
                      Upload
                    </Button>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 3, textAlign: 'center' }}>
                  <Avatar
                    src={tenant.branding.logoDark}
                    alt="Dark Logo"
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  >
                    <BusinessIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="body2" gutterBottom>
                    Dark Theme Logo
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                    >
                      Upload
                    </Button>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Brand Colors
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Primary Color"
                  defaultValue={tenant.branding.primaryColor}
                  type="color"
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Secondary Color"
                  defaultValue={tenant.branding.secondaryColor}
                  type="color"
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Accent Color"
                  defaultValue={tenant.branding.accentColor}
                  type="color"
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button variant="outlined">Cancel</Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </TabPanel>

        {/* Business Details */}
        <TabPanel value={tabValue} index={2}>
          <Container maxWidth="md">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  defaultValue={tenant.businessDetails.industry}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Size"
                  defaultValue={tenant.businessDetails.companySize}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  defaultValue={tenant.businessDetails.registrationNumber}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tax ID"
                  defaultValue={tenant.businessDetails.taxId}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  defaultValue={tenant.businessDetails.website}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  defaultValue={tenant.businessDetails.address?.line1}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  defaultValue={tenant.businessDetails.address?.line2}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  defaultValue={tenant.businessDetails.address?.city}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State"
                  defaultValue={tenant.businessDetails.address?.state}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  defaultValue={tenant.businessDetails.address?.country}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  defaultValue={tenant.businessDetails.address?.postalCode}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button variant="outlined">Cancel</Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </TabPanel>

        {/* Subscription */}
        <TabPanel value={tabValue} index={3}>
          <Container maxWidth="md">
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Plan: {tenant.subscription.plan.toUpperCase()}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip label={tenant.subscription.status} color="primary" />
                  <Chip label={`Renews: ${new Date(tenant.subscription.renewalDate).toLocaleDateString()}`} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Started: {new Date(tenant.subscription.startDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained">Upgrade Plan</Button>
              <Button variant="outlined">View Invoices</Button>
              <Button variant="outlined">Payment History</Button>
            </Box>
          </Container>
        </TabPanel>

        {/* Security */}
        <TabPanel value={tabValue} index={4}>
          <Container maxWidth="md">
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Security settings are managed in the Security page
            </Alert>
            <Button variant="contained" href="/settings/security">
              Go to Security Settings
            </Button>
          </Container>
        </TabPanel>

        {/* Audit */}
        <TabPanel value={tabValue} index={5}>
          <Container maxWidth="md">
            <Typography variant="h6" gutterBottom>
              Activity Timeline
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Detailed audit logs are available in the Audit page
            </Alert>
            <Button variant="contained" href="/settings/audit">
              View Audit Logs
            </Button>
          </Container>
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default TenantProfile
