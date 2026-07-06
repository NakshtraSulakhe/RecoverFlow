import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { User, AuthErrorCode, UserRole } from '../../features/auth/types'
import { authService } from '../../features/auth/authService'
import { AUTH_CONFIG } from '../../features/auth/constants'
import { STORAGE_KEYS } from '../../utils/constants'

const defaultPermissions: Record<string, string[]> = {
  platform_owner: ['*'],
  tenant_admin: ['users.manage', 'customers.manage', 'loans.manage', 'recovery.manage', 'reports.view'],
  recovery_manager: ['customers.view', 'loans.view', 'recovery.manage', 'reports.view'],
  team_leader: ['customers.view', 'loans.view', 'recovery.manage'],
  recovery_agent: ['customers.view', 'loans.view'],
  legal_officer: ['legal.view', 'recovery.manage'],
  qa: ['reports.view'],
  auditor: ['*'],
  read_only: ['customers.view', 'reports.view'],
  viewer: ['customers.view'],
};

function mapUserFromResponse(data: any, userData: any): User {
  const tenant = data.tenant || userData.tenant;
  return {
    id: userData.id,
    email: userData.email,
    name: `${userData.first_name || userData.firstName || ''} ${userData.last_name || userData.lastName || ''}`.trim() || userData.email,
    firstName: userData.first_name || userData.firstName || '',
    lastName: userData.last_name || userData.lastName || '',
    role: (userData.user_type ?? userData.role ?? 'read_only') as UserRole,
    permissions: userData.permissions ?? defaultPermissions[userData.user_type ?? userData.role] ?? [],
    tenantId: tenant?.id || userData.tenant_id || undefined,
    tenantName: tenant?.tenant_name || tenant?.name || undefined,
    subscriptionTier: tenant?.subscription_tier || 'starter',
    enabledModules: tenant?.enabled_modules || userData.enabled_modules || ['dashboard', 'users', 'settings'],
    subscription: tenant?.subscription || null,
    mustChangePassword: userData.must_change_password ?? false,
    language: userData.language || 'en',
    theme: (userData.theme ?? 'light') as 'light' | 'dark' | 'system',
    timezone: userData.timezone || 'UTC',
    isActive: userData.status === 'active' || userData.is_active !== false,
    isLocked: userData.is_locked || false,
    lastLoginAt: userData.last_login_at || userData.lastLoginAt || undefined,
    createdAt: userData.created_at || userData.createdAt || new Date().toISOString(),
    updatedAt: userData.updated_at || userData.updatedAt || new Date().toISOString(),
  };
}

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
      const response = await authService.login(credentials)
      
      // Handle both possible response formats
      const data = (response as any).data || response
      
      // Transform backend response to match frontend expected format
      const userData = data.user || data
      
      return {
        user: mapUserFromResponse(data, userData),
        accessToken: data.access_token || data.accessToken,
        refreshToken: data.refresh_token || data.refreshToken,
        expiresIn: data.expires_in || data.expiresIn || 3600,
        tokenType: data.token_type || data.tokenType || 'Bearer',
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      const errorCode = error.response?.data?.error_code || null
      
      // Handle specific error codes
      if (error.response?.status === 401) {
        return rejectWithValue({ message: errorMessage, code: AuthErrorCode.INVALID_CREDENTIALS })
      } else if (error.response?.status === 403 && error.response?.data?.error_code === 'ACCOUNT_LOCKED') {
        return rejectWithValue({ message: errorMessage, code: AuthErrorCode.ACCOUNT_LOCKED })
      } else if (error.response?.status === 403 && error.response?.data?.error_code === 'ACCOUNT_INACTIVE') {
        return rejectWithValue({ message: errorMessage, code: AuthErrorCode.ACCOUNT_INACTIVE })
      } else if (error.response?.status === 429) {
        return rejectWithValue({ message: 'Too many attempts. Please try again later.', code: AuthErrorCode.VALIDATION_ERROR })
      }
      
      return rejectWithValue({ message: errorMessage, code: errorCode || AuthErrorCode.SERVER_ERROR })
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
      const response = await authService.refreshToken({ refreshToken })
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    credentials: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.changePassword({
        currentPassword: credentials.currentPassword,
        newPassword: credentials.newPassword,
        confirmPassword: credentials.newPassword,
      })
      return true
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password')
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
    initializeFromStorage: (state) => {
      // Initialize auth state from storage on app load
      const rememberMe = localStorage.getItem('remember_me') === 'true'
      const storage = rememberMe ? localStorage : sessionStorage
      
      const token = storage.getItem(STORAGE_KEYS.TOKEN)
      const refreshToken = storage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      const userStr = storage.getItem(STORAGE_KEYS.USER)
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          state.user = user
          state.accessToken = token
          state.refreshToken = refreshToken
          state.isAuthenticated = true
          
          // Also make sure tenant ID is in localStorage if available
          if (user.tenantId) {
            localStorage.setItem(STORAGE_KEYS.TENANT_ID, user.tenantId)
          }
        } catch (e) {
          // Invalid JSON, clear storage
          localStorage.removeItem(STORAGE_KEYS.TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
          localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
          localStorage.removeItem('remember_me')
          sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
          sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          sessionStorage.removeItem(STORAGE_KEYS.USER)
        }
      }
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
        
        // Persist tokens and user to secure storage
        const storage = action.meta.arg?.rememberMe ? localStorage : sessionStorage
        storage.setItem(STORAGE_KEYS.TOKEN, action.payload.accessToken)
        storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken)
        storage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user))
        if (action.payload.user.tenantId) {
          localStorage.setItem(STORAGE_KEYS.TENANT_ID, action.payload.user.tenantId)
        }
        if (action.meta.arg?.rememberMe) {
          localStorage.setItem('remember_me', 'true')
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        const payload = action.payload as { message: string; code: AuthErrorCode }
        state.error = payload?.message || 'Login failed'
        state.errorCode = payload?.code || AuthErrorCode.INVALID_CREDENTIALS
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
        
        // Clear storage
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
        localStorage.removeItem('remember_me')
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
        sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        sessionStorage.removeItem(STORAGE_KEYS.USER)
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false
        // Still clear auth even on error
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.tokenExpiresAt = null
        
        // Clear storage
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
        localStorage.removeItem('remember_me')
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
        sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        sessionStorage.removeItem(STORAGE_KEYS.USER)
      })
      // Refresh tokens
      .addCase(refreshTokens.pending, (state) => {
        state.isLoading = true
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.isLoading = false
        const data = (action.payload as any).data || action.payload
        state.accessToken = data.accessToken || data.access_token
        state.refreshToken = data.refreshToken || data.refresh_token
        state.tokenExpiresAt = new Date(Date.now() + (data.expiresIn || data.expires_in || 3600) * 1000).toISOString()
        state.lastActivity = new Date().toISOString()
        
        // Update persisted tokens
        const rememberMe = localStorage.getItem('remember_me') === 'true'
        const storage = rememberMe ? localStorage : sessionStorage
        if (state.accessToken) storage.setItem(STORAGE_KEYS.TOKEN, state.accessToken)
        if (state.refreshToken) storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken)
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || 'Token refresh failed'
        state.errorCode = AuthErrorCode.TOKEN_EXPIRED
        // Clear auth on refresh failure
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.tokenExpiresAt = null
        
        // Clear storage
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
        localStorage.removeItem('remember_me')
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
        sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        sessionStorage.removeItem(STORAGE_KEYS.USER)
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = (action.payload as any).data || action.payload
        const userData = payload.user || payload
        const tenant = payload.tenant || userData.tenant
        state.user = {
          ...(state.user || {}),
          id: userData.id,
          email: userData.email,
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.user_type || state.user?.role || 'read_only',
          permissions: userData.permissions || state.user?.permissions || [],
          tenantId: tenant?.id || userData.tenant_id,
          tenantName: tenant?.tenant_name,
          subscriptionTier: tenant?.subscription_tier || state.user?.subscriptionTier,
          enabledModules: tenant?.enabled_modules || state.user?.enabledModules,
          subscription: tenant?.subscription || state.user?.subscription,
          mustChangePassword: userData.must_change_password ?? false,
          isActive: userData.is_active !== false,
          language: state.user?.language || 'en',
          theme: state.user?.theme || 'light',
          timezone: state.user?.timezone || 'UTC',
          isLocked: false,
          createdAt: state.user?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as User
        state.isAuthenticated = true
        
        const rememberMe = localStorage.getItem('remember_me') === 'true'
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user))
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || 'Failed to fetch user'
        state.errorCode = AuthErrorCode.UNAUTHORIZED
      })
      .addCase(changePassword.fulfilled, (state) => {
        if (state.user) {
          state.user.mustChangePassword = false
          const rememberMe = localStorage.getItem('remember_me') === 'true'
          const storage = rememberMe ? localStorage : sessionStorage
          storage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user))
        }
      })
  },
})

export const { 
  setTokens, 
  setUser, 
  clearAuth, 
  setError, 
  clearError, 
  updateLastActivity, 
  setSessionTimeout, 
  setIdleTimeout,
  initializeFromStorage
} = authSlice.actions
export default authSlice.reducer
