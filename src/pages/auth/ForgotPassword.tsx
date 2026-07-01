/**
 * Forgot Password Page
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
  Link,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import { Email as EmailIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { authService } from '../../features/auth/authService'
import { validateForgotPassword } from '../../features/auth/validation'
import { AUTH_CONFIG } from '../../features/auth/constants'

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [tenantCode, setTenantCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [countdown, setCountdown] = useState(0)

  const steps = ['Enter Email', 'Check Your Inbox', 'Reset Password']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors([])

    const validation = validateForgotPassword(email)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setIsLoading(true)
    try {
      await authService.forgotPassword({ email, tenantCode })
      setActiveStep(1)
      startCountdown()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  const startCountdown = () => {
    setCountdown(AUTH_CONFIG.OTP_RESEND_COOLDOWN_SECONDS)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (countdown > 0) return

    setIsLoading(true)
    try {
      await authService.forgotPassword({ email, tenantCode })
      startCountdown()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend email')
    } finally {
      setIsLoading(false)
    }
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
          {/* Back Button */}
          <Link
            component="button"
            onClick={() => navigate('/login')}
            sx={{ display: 'flex', alignItems: 'center', mb: 3, color: 'text.primary' }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Back to Login
          </Link>

          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Forgot Password?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

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

          {activeStep === 0 && (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 2, display: 'flex' }}>
                      <EmailIcon color="action" />
                    </Box>
                  ),
                }}
                sx={{ mb: 3 }}
                required
                autoFocus
              />

              <TextField
                fullWidth
                label="Tenant Code (Optional)"
                placeholder="your-company"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ py: 1.5 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset email sent successfully!
              </Alert>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We've sent a password reset link to <strong>{email}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Please check your inbox and follow the instructions to reset your password.
              </Typography>

              <Button
                variant="outlined"
                onClick={handleResend}
                disabled={isLoading || countdown > 0}
                sx={{ mb: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend Email'
                )}
              </Button>

              <Box sx={{ mt: 4 }}>
                <Link
                  component="button"
                  onClick={() => {
                    setActiveStep(0)
                  }}
                  variant="body2"
                >
                  Try with different email
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  )
}

export default ForgotPassword
