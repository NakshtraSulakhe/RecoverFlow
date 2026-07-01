/**
 * Password Expired Page
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material'
import { authService } from '../../features/auth/authService'
import { validateChangePassword, validatePasswordStrength } from '../../features/auth/validation'

export const PasswordExpired: React.FC = () => {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [passwordStrength, setPasswordStrength] = useState<any>(null)

  const handlePasswordChange = (value: string) => {
    setNewPassword(value)
    const strength = validatePasswordStrength(value)
    setPasswordStrength(strength)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors([])

    const validation = validateChangePassword(currentPassword, newPassword, confirmPassword)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setIsLoading(true)
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const getStrengthColor = () => {
    if (!passwordStrength) return 'grey'
    switch (passwordStrength.strength) {
      case 'weak': return 'error'
      case 'fair': return 'warning'
      case 'good': return 'info'
      case 'strong': return 'success'
      default: return 'grey'
    }
  }

  const getStrengthLabel = () => {
    if (!passwordStrength) return ''
    return passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)
  }

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <LockIcon sx={{ fontSize: 64, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Password Changed Successfully
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your password has been updated. You can now continue using the application.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/dashboard')}>
              Continue to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    )
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
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <LockIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Password Expired
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Your password has expired. Please create a new password to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {validationErrors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <LockIcon color="action" />
                  </Box>
                ),
              }}
              sx={{ mb: 3 }}
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <LockIcon color="action" />
                  </Box>
                ),
              }}
              sx={{ mb: newPassword ? 1 : 3 }}
              required
            />

            {newPassword && passwordStrength && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password Strength
                  </Typography>
                  <Typography variant="caption" color={getStrengthColor() as any}>
                    {getStrengthLabel()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    passwordStrength.strength === 'weak' ? 25 :
                    passwordStrength.strength === 'fair' ? 50 :
                    passwordStrength.strength === 'good' ? 75 : 100
                  }
                  color={getStrengthColor() as any}
                />
                {passwordStrength.errors.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {passwordStrength.errors.map((err: string, i: number) => (
                      <Typography key={i} variant="caption" color="error" display="block">
                        • {err}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <LockIcon color="action" />
                  </Box>
                ),
              }}
              sx={{ mb: 3 }}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Change Password'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={() => navigate('/logout')}
              color="error"
            >
              Sign Out
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PasswordExpired
