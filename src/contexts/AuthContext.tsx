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
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
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
  });

  const navigate = useNavigate();
  const location = useLocation();

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login({ email, password });
      
      const userData = response.data as any;
      
      setState({
        user: userData.user || userData,
        tenant: userData.tenant || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Login successful');
      
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
      throw error;
    }
  }, [navigate, location]);

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
      });
      
      toast.info('Logged out successfully');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

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
        });
        return;
      }

      const response = await authService.getCurrentUser();
      const user = authService.getCurrentUserFromStorage();
      const userData = response.data as any;
      
      setState({
        user: userData || user,
        tenant: (userData || user) ? { id: (userData || user).tenant_id } as Tenant : null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Auth check failed:', error);
      
      // Token might be expired, logout
      await logout();
    }
  }, [logout]);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
