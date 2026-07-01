import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { User, AuthErrorCode, UserRole } from '../../features/auth/types'
import { authService } from '../../features/auth/authService'
import { AUTH_CONFIG } from '../../features/auth/constants'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  tokenExpiresAt: string | null
  isLoading: boolean
  error: string | null
  errorCode: AuthErrorCode | null
  sessionTimeout: number
  idleTimeout: number
  lastActivity: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  isLoading: false,
  error: null,
  errorCode: null,
  sessionTimeout: AUTH_CONFIG.SESSION_TIMEOUT,
  idleTimeout: AUTH_CONFIG.IDLE_TIMEOUT,
  lastActivity: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string; tenantCode?: string; rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      // For demo purposes: accept any credentials and return a mock user
      const mockResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: 'Demo User',
          firstName: 'Demo',
          lastName: 'User',
          role: UserRole.ADMIN,
          permissions: ['read', 'write', 'delete', 'admin'],
          tenantId: 'demo-tenant',
          tenantName: 'Demo Company',
          language: 'en',
          theme: 'light' as const,
          timezone: 'UTC',
          isActive: true,
          isLocked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
        tokenType: 'Bearer',
      }
      return mockResponse
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
  } catch (error) {
    // Don't reject on logout error, just proceed
  }
})

export const refreshTokens = createAsyncThunk(
  'auth/refreshTokens',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const mockResponse = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      }
      return mockResponse
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any
      const mockUser = state.auth.user || {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin'],
        tenantId: 'demo-tenant',
        tenantName: 'Demo Company',
        language: 'en',
        theme: 'light',
        timezone: 'UTC',
        isActive: true,
        isLocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return mockUser
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; expiresAt: string }>) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.tokenExpiresAt = action.payload.expiresAt
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.tokenExpiresAt = null
      state.error = null
      state.errorCode = null
    },
    setError: (state, action: PayloadAction<{ message: string; code: AuthErrorCode }>) => {
      state.error = action.payload.message
      state.errorCode = action.payload.code
    },
    clearError: (state) => {
      state.error = null
      state.errorCode = null
    },
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString()
    },
    setSessionTimeout: (state, action: PayloadAction<number>) => {
      state.sessionTimeout = action.payload
    },
    setIdleTimeout: (state, action: PayloadAction<number>) => {
      state.idleTimeout = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.errorCode = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.tokenExpiresAt = new Date(Date.now() + action.payload.expiresIn * 1000).toISOString()
        state.error = null
        state.errorCode = null
        state.lastActivity = new Date().toISOString()
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Login failed'
        state.errorCode = AuthErrorCode.INVALID_CREDENTIALS
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.tokenExpiresAt = null
        state.lastActivity = null
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false
        // Still clear auth even on error
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.tokenExpiresAt = null
      })
      // Refresh tokens
      .addCase(refreshTokens.pending, (state) => {
        state.isLoading = true
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.isLoading = false
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.tokenExpiresAt = new Date(Date.now() + action.payload.expiresIn * 1000).toISOString()
        state.lastActivity = new Date().toISOString()
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Token refresh failed'
        state.errorCode = AuthErrorCode.TOKEN_EXPIRED
        // Clear auth on refresh failure
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.tokenExpiresAt = null
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = (action.payload as any)?.data || action.payload as User
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Failed to fetch user'
        state.errorCode = AuthErrorCode.UNAUTHORIZED
      })
  },
})

export const { setTokens, setUser, clearAuth, setError, clearError, updateLastActivity, setSessionTimeout, setIdleTimeout } = authSlice.actions
export default authSlice.reducer
