/**
 * Unauthorized Page
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Alert,
} from '@mui/material'
import { Block as BlockIcon } from '@mui/icons-material'

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <BlockIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </Typography>
          <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
            Error Code: 403 Forbidden
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{ py: 1.5, px: 4 }}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              onClick={handleDashboard}
              sx={{ py: 1.5, px: 4 }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Unauthorized
