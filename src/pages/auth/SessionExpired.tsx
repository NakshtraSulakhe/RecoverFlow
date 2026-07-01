/**
 * Session Expired Page
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
import { AccessTime as AccessTimeIcon } from '@mui/icons-material'

export const SessionExpired: React.FC = () => {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
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
          <AccessTimeIcon sx={{ fontSize: 64, color: 'warning.main', mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Session Expired
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Your session has expired due to inactivity. Please log in again to continue.
          </Typography>
          <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
            For security reasons, sessions automatically expire after a period of inactivity.
          </Alert>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ py: 1.5, px: 4 }}
          >
            Log In Again
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}

export default SessionExpired
