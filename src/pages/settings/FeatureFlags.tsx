/**
 * Feature Flags Page
 * Manage tenant feature toggles
 */

import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Button,
} from '@mui/material'
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { useTenant } from '../../features/tenant/context'
import { FEATURE_NAMES } from '../../features/tenant/constants'

export const FeatureFlags: React.FC = () => {
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

  const { features } = tenant

  const featureCategories = [
    {
      title: 'Core Features',
      features: [
        { key: 'notifications' as const, name: FEATURE_NAMES.NOTIFICATIONS, description: 'Enable notifications system' },
        { key: 'api' as const, name: FEATURE_NAMES.API, description: 'API access for integrations' },
        { key: 'reports' as const, name: FEATURE_NAMES.REPORTS, description: 'Advanced reporting capabilities' },
      ],
    },
    {
      title: 'AI & Automation',
      features: [
        { key: 'ai' as const, name: FEATURE_NAMES.AI, description: 'AI-powered insights and automation' },
        { key: 'workflows' as const, name: FEATURE_NAMES.WORKFLOWS, description: 'Custom workflow automation' },
      ],
    },
    {
      title: 'Business Modules',
      features: [
        { key: 'payments' as const, name: FEATURE_NAMES.PAYMENTS, description: 'Payment processing module' },
        { key: 'legal' as const, name: FEATURE_NAMES.LEGAL, description: 'Legal document management' },
      ],
    },
    {
      title: 'Advanced Features',
      features: [
        { key: 'integrations' as const, name: FEATURE_NAMES.INTEGRATIONS, description: 'Third-party integrations' },
        { key: 'advancedAnalytics' as const, name: FEATURE_NAMES.ADVANCED_ANALYTICS, description: 'Advanced analytics dashboard' },
        { key: 'customFields' as const, name: FEATURE_NAMES.CUSTOM_FIELDS, description: 'Custom field definitions' },
        { key: 'multiCurrency' as const, name: FEATURE_NAMES.MULTI_CURRENCY, description: 'Multi-currency support' },
        { key: 'multiLanguage' as const, name: FEATURE_NAMES.MULTI_LANGUAGE, description: 'Multi-language support' },
      ],
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Feature Flags
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
          Feature flags updated successfully
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 4 }}>
        Enable or disable features for your organization. Some features may require additional setup.
      </Alert>

      {featureCategories.map((category) => (
        <Paper key={category.title} sx={{ mb: 4 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {category.title}
            </Typography>
          </Box>
          <Divider />
          <Grid container spacing={2} sx={{ p: 3 }}>
            {category.features.map((feature) => (
              <Grid item xs={12} md={6} lg={4} key={feature.key}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {feature.name}
                      </Typography>
                      <Switch
                        checked={features[feature.key]?.enabled || false}
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    {features[feature.key]?.limit && (
                      <Chip
                        label={`Limit: ${features[feature.key]?.limit}`}
                        size="small"
                        color="info"
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
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

export default FeatureFlags
