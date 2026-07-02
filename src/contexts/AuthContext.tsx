import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { User, Tenant } from '../services/api/types';
import { toast } from 'react-toastify';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
  user_type?: string;
  setRememberMe: (value: boolean) => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    rememberMe: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const setRememberMe = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, rememberMe: value }));
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, rememberMe }));

    try {
      const response = await authService.login({ email, password }, rememberMe);

      const userData = response.data as any;

      // Transform user data to match expected format
      const transformedUser = userData.user || userData;
      const userWithRole = {
        ...transformedUser,
        user_type: transformedUser.user_type || transformedUser.role,
        first_name: transformedUser.first_name || transformedUser.firstName,
        last_name: transformedUser.last_name || transformedUser.lastName,
      };

      setState({
        user: userWithRole,
        tenant: userData.tenant || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        rememberMe,
      });

      toast.success('Login successful');

      // Redirect based on user role
      const redirectPath = userWithRole.user_type === 'platform_owner' 
        ? '/platform/dashboard' 
        : '/app/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        rememberMe: false,
      });
      
      toast.info('Logged out successfully');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Refresh failed, logout user
      await logout();
    }
  }, [logout]);

  const checkAuth = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const isAuth = authService.isAuthenticated();
      
      if (!isAuth) {
        setState({
          user: null,
          tenant: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          rememberMe: false,
        });
        return;
      }

      // Check if token needs silent refresh
      if (authService.shouldRefreshToken()) {
        await refreshToken();
      }

      // Try to get current user from storage first
      const user = authService.getCurrentUserFromStorage();
      
      if (user) {
        setState({
          user: user,
          tenant: { id: user.tenant_id } as Tenant,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          rememberMe: localStorage.getItem('remember_me') === 'true',
        });
      } else {
        // No user in storage, clear everything
        authService.logout();
        setState({
          user: null,
          tenant: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          rememberMe: false,
        });
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      
      // Clear auth state on error
      authService.logout();
      setState({
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        rememberMe: false,
      });
    }
  }, [refreshToken]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false;
    
    // Implement permission logic based on user role and tenant features
    const rolePermissions: Record<string, string[]> = {
      platform_owner: ['*'],
      tenant_admin: ['users.manage', 'customers.manage', 'loans.manage', 'recovery.manage', 'reports.view'],
      recovery_manager: ['customers.view', 'loans.view', 'recovery.manage', 'reports.view'],
      team_leader: ['customers.view', 'loans.view', 'recovery.manage'],
      recovery_agent: ['customers.view', 'loans.view', 'recovery.view'],
      legal_officer: ['recovery.manage', 'legal.view'],
      qa: ['recovery.view', 'reports.view'],
      auditor: ['*'],
      read_only: ['customers.view', 'loans.view', 'recovery.view', 'reports.view'],
    };

    const userPermissions = rolePermissions[state.user.user_type] || [];
    
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
  }, [state.user]);

  const hasRole = useCallback((roles: string[]): boolean => {
    if (!state.user) return false;
    return roles.includes(state.user.user_type);
  }, [state.user]);

  // Set up periodic token refresh check (every 4 minutes)
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(async () => {
      if (authService.shouldRefreshToken()) {
        await refreshToken();
      }
    }, 4 * 60 * 1000); // 4 minutes

    return () => clearInterval(interval);
  }, [state.isAuthenticated, refreshToken]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
    clearError,
    hasPermission,
    hasRole,
    user_type: state.user?.user_type,
    setRememberMe,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
