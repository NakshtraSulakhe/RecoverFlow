/**
 * Reset Password Page
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material'
import { Lock as LockIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { authService } from '../../features/auth/authService'
import { validateResetPassword, validatePasswordStrength } from '../../features/auth/validation'

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [passwordStrength, setPasswordStrength] = useState<any>(null)

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired reset token')
    }
  }, [token])

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const strength = validatePasswordStrength(value)
    setPasswordStrength(strength)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors([])

    const validation = validateResetPassword(token, password, confirmPassword)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword({ token, password, confirmPassword })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password')
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

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              Invalid or expired reset token
            </Alert>
            <Button variant="contained" onClick={() => navigate('/forgot-password')}>
              Request New Reset Link
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Password Reset Successful
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your password has been successfully reset. You can now login with your new password.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/login')}>
              Go to Login
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
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Enter your new password below.
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
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <LockIcon color="action" />
                  </Box>
                ),
              }}
              sx={{ mb: password ? 1 : 3 }}
              required
              autoFocus
            />

            {password && passwordStrength && (
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
              label="Confirm Password"
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
              {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link
              component="button"
              onClick={() => navigate('/login')}
              variant="body2"
            >
              Back to Login
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ResetPassword
