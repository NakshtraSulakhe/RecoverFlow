/**
 * Authentication Service
 * Handles all authentication API calls
 */

import { apiClient } from '../../services/api'
import { API_ENDPOINTS } from '../../services/api/endpoints'
import {
  LoginCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  OTPRequest,
  OTPVerifyRequest,
  MFASetup,
  MFAVerifyRequest,
  SessionInfo,
} from './types'

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  }

  /**
   * Refresh access token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      request
    )
    return response.data
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME)
    return response.data
  }

  /**
   * Forgot password - send OTP
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, request)
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, request)
  }

  /**
   * Change password
   */
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await apiClient.post('/auth/change-password', request)
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  }

  /**
   * Setup MFA
   */
  async setupMFA(): Promise<MFASetup> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.MFA_SETUP)
    return (response.data as any).data || response.data as unknown as MFASetup
  }

  /**
   * Verify MFA
   */
  async verifyMFA(request: MFAVerifyRequest): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.MFA_VERIFY, request)
    return (response.data as any).data || response.data as unknown as AuthResponse
  }

  /**
   * Request OTP
   */
  async requestOTP(request: OTPRequest): Promise<void> {
    await apiClient.post('/auth/otp/request', request)
  }

  /**
   * Verify OTP
   */
  async verifyOTP(request: OTPVerifyRequest): Promise<void> {
    await apiClient.post('/auth/otp/verify', request)
  }

  /**
   * Get active sessions
   */
  async getSessions(): Promise<SessionInfo[]> {
    const response = await apiClient.get('/auth/sessions')
    return (response.data as any).data || response.data as unknown as SessionInfo[]
  }

  /**
   * Revoke session
   */
  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.post(`/auth/sessions/${sessionId}/revoke`)
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllOtherSessions(): Promise<void> {
    await apiClient.post('/auth/sessions/revoke-others')
  }

  /**
   * Revoke all sessions
   */
  async revokeAllSessions(): Promise<void> {
    await apiClient.post('/auth/sessions/revoke-all')
  }
}

export const authService = new AuthService()
