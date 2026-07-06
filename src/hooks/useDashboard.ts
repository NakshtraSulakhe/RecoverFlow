import { useState, useEffect } from 'react';
import { DASHBOARD_CONFIGS, DashboardConfig } from '../config/dashboard.config';

export const useDashboard = () => {
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardConfig();
  }, []);

  const loadDashboardConfig = async () => {
    setLoading(true);
    try {
      // Fetch user's role from backend
      const response = await fetch('/api/v1/auth/me');
      const data = await response.json();

      if (data.success && data.data?.role_code) {
        const roleCode = data.data.role_code;
        
        // Get dashboard config from configuration file
        const config = DASHBOARD_CONFIGS[roleCode] || DASHBOARD_CONFIGS.tenant_admin;
        setDashboardConfig(config);
      } else {
        // Fallback to default
        setDashboardConfig(DASHBOARD_CONFIGS.tenant_admin);
      }
    } catch (error) {
      console.error('Failed to load dashboard config:', error);
      setDashboardConfig(DASHBOARD_CONFIGS.tenant_admin);
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboardConfig,
    loading,
    reloadDashboard: loadDashboardConfig,
  };
};
