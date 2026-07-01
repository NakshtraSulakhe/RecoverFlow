/**
 * Tenant Settings Page
 * General settings including localization, timezone, currency
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { useTenant } from '../../features/tenant/context'

export const TenantSettings: React.FC = () => {
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

  const { settings } = tenant

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          General Settings
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
          Settings saved successfully
        </Alert>
      )}

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Localization
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Timezone</InputLabel>
              <Select
                defaultValue={settings.timezone}
                label="Timezone"
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="America/New_York">America/New_York</MenuItem>
                <MenuItem value="America/Los_Angeles">America/Los_Angeles</MenuItem>
                <MenuItem value="Europe/London">Europe/London</MenuItem>
                <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                defaultValue={settings.currency}
                label="Currency"
              >
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
                <MenuItem value="GBP">GBP - British Pound</MenuItem>
                <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Language</InputLabel>
              <Select
                defaultValue={settings.language}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Date Format</InputLabel>
              <Select
                defaultValue={settings.dateFormat}
                label="Date Format"
              >
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Time Format</InputLabel>
              <Select
                defaultValue={settings.timeFormat}
                label="Time Format"
              >
                <MenuItem value="12h">12 Hour (AM/PM)</MenuItem>
                <MenuItem value="24h">24 Hour</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>First Day of Week</InputLabel>
              <Select
                defaultValue={settings.firstDayOfWeek}
                label="First Day of Week"
              >
                <MenuItem value={0}>Sunday</MenuItem>
                <MenuItem value={1}>Monday</MenuItem>
                <MenuItem value={6}>Saturday</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Business Hours
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Configure your business operating hours
        </Alert>
        <Grid container spacing={2}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <Grid item xs={12} md={6} key={day}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography sx={{ width: 100 }}>{day}</Typography>
                <FormControlLabel
                  control={<Switch defaultChecked={day !== 'Saturday' && day !== 'Sunday'} />}
                  label="Active"
                />
                <TextField
                  size="small"
                  type="time"
                  defaultValue="09:00"
                  sx={{ width: 120 }}
                />
                <Typography>-</Typography>
                <TextField
                  size="small"
                  type="time"
                  defaultValue="17:00"
                  sx={{ width: 120 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Holiday Calendar
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Manage your organization's holidays
        </Alert>
        <Button variant="outlined">
          Add Holiday
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

export default TenantSettings
