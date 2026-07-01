/**
 * Account Locked Page
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
import { Lock as LockIcon } from '@mui/icons-material'

export const AccountLocked: React.FC = () => {
  const navigate = useNavigate()

  const handleContactSupport = () => {
    navigate('/support')
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
          <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Account Locked
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Your account has been locked due to multiple failed login attempts or security concerns. Please contact your administrator to unlock your account.
          </Typography>
          <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
            For security reasons, you cannot attempt to log in until your account is unlocked.
          </Alert>
          <Button
            variant="contained"
            size="large"
            onClick={handleContactSupport}
            sx={{ py: 1.5, px: 4 }}
          >
            Contact Support
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}

export default AccountLocked
