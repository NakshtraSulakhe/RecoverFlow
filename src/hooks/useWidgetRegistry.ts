import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWidgetsByType, getWidgetsForRole } from '../config/dashboards/dashboardRegistry';
import { WidgetConfig, WidgetType } from '../types/dashboard.types';

export const useWidgetRegistry = () => {
  const user = useAppSelector(
    state => state.auth.user
);
  const userRole = user?.user_type || 'read_only';

  const widgetsByType = useMemo(() => {
    return (type: WidgetType): WidgetConfig[] => {
      const widgets = getWidgetsByType(type);
      return widgets.filter(widget => {
        if (widget.requiredRoles && widget.requiredRoles.length > 0) {
          return widget.requiredRoles.includes(userRole);
        }
        return true;
      });
    };
  }, [userRole]);

  const widgetsForRole = useMemo(() => {
    return getWidgetsForRole(userRole);
  }, [userRole]);

  const getWidgetConfig = (widgetId: string): WidgetConfig | undefined => {
    return widgetsForRole.find(w => w.id === widgetId);
  };

  return {
    widgetsByType,
    widgetsForRole,
    userRole,
    getWidgetConfig,
  };
};
