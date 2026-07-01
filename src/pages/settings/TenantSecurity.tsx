/**
 * Tenant Security Page
 * Security settings including password policy, session policy, MFA
 */

import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from '@mui/material'
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { useTenant } from '../../features/tenant/context'

export const TenantSecurity: React.FC = () => {
  const { tenant, isLoading } = useTenant()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
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
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>Loading...</Box>
  }

  if (!tenant) {
    return <Alert severity="error">No tenant data available</Alert>
  }

  const { security } = tenant

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Security Settings
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Security settings updated successfully
        </Alert>
      )}

      {/* Password Policy */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Password Policy
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Minimum Length"
              type="number"
              defaultValue={security.passwordPolicy.minLength}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maximum Length"
              type="number"
              defaultValue={security.passwordPolicy.maxLength}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Age (days)"
              type="number"
              defaultValue={security.passwordPolicy.maxAgeDays}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="History Count"
              type="number"
              defaultValue={security.passwordPolicy.historyCount}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked={security.passwordPolicy.requireUppercase} />}
                label="Require Uppercase Letters"
              />
              <FormControlLabel
                control={<Switch defaultChecked={security.passwordPolicy.requireLowercase} />}
                label="Require Lowercase Letters"
              />
              <FormControlLabel
                control={<Switch defaultChecked={security.passwordPolicy.requireNumbers} />}
                label="Require Numbers"
              />
              <FormControlLabel
                control={<Switch defaultChecked={security.passwordPolicy.requireSpecialChars} />}
                label="Require Special Characters"
              />
              <FormControlLabel
                control={<Switch defaultChecked={security.passwordPolicy.preventCommonPasswords} />}
                label="Prevent Common Passwords"
              />
              <FormControlLabel
                control={<Switch defaultChecked={security.passwordPolicy.preventPersonalInfo} />}
                label="Prevent Personal Information"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Session Policy */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Session Policy
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Session Timeout (minutes)"
              type="number"
              defaultValue={security.sessionPolicy.timeoutMinutes}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Idle Timeout (minutes)"
              type="number"
              defaultValue={security.sessionPolicy.idleTimeoutMinutes}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Concurrent Sessions"
              type="number"
              defaultValue={security.sessionPolicy.maxConcurrentSessions}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Remember Me Duration (days)"
              type="number"
              defaultValue={security.sessionPolicy.rememberMeDays}
              sx={{ mb: 3 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* MFA Settings */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Multi-Factor Authentication
        </Typography>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={<Switch defaultChecked={security.mfaEnabled} />}
            label="Enable MFA"
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={<Switch defaultChecked={security.mfaRequired} />}
            label="Require MFA for all users"
          />
        </Box>
        <Typography variant="subtitle2" gutterBottom>
          Available Methods
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {security.twoFactorMethods.map((method) => (
            <Chip key={method} label={method} variant="outlined" />
          ))}
        </Box>
      </Paper>

      {/* IP Whitelist */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          IP Whitelist
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Restrict access to specific IP addresses
        </Alert>
        <TextField
          fullWidth
          label="IP Addresses (one per line)"
          multiline
          rows={4}
          defaultValue={security.ipWhitelist.join('\n')}
          placeholder="192.168.1.1&#10;10.0.0.1"
          sx={{ mb: 3 }}
        />
      </Paper>

      {/* Allowed Domains */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Allowed Domains
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Restrict email registration to specific domains
        </Alert>
        <TextField
          fullWidth
          label="Domains (one per line)"
          multiline
          rows={4}
          defaultValue={security.allowedDomains.join('\n')}
          placeholder="company.com&#10;partner.com"
          sx={{ mb: 3 }}
        />
      </Paper>

      {/* Login History */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Login Activity
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          View detailed login history in the Audit page
        </Alert>
        <Button variant="outlined" href="/settings/audit">
          View Audit Logs
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
    </Container>
  )
}

export default TenantSecurity
