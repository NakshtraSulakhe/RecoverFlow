import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardConfig, getKPIsForRole, getWidgetConfig } from '../config/dashboards/dashboardRegistry';
import { DashboardConfig, KPIDefinition, WidgetConfig } from '../types/dashboard.types';

export const useDashboardConfig = () => {
  const { user } = useAuth();
  const userRole = user?.user_type || 'read_only';

  const dashboardConfig = useMemo(() => {
    return getDashboardConfig(userRole);
  }, [userRole]);

  const kpiDefinitions = useMemo(() => {
    return getKPIsForRole(userRole);
  }, [userRole]);

  const getWidgetById = (widgetId: string): WidgetConfig | undefined => {
    return getWidgetConfig(widgetId);
  };

  const getKPIById = (kpiId: string): KPIDefinition | undefined => {
    return kpiDefinitions.find(k => k.id === kpiId);
  };

  return {
    dashboardConfig,
    kpiDefinitions,
    userRole,
    getWidgetById,
    getKPIById,
  };
};
