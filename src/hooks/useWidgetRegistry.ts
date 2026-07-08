import { useMemo } from 'react'
import { getWidgetsByType, getWidgetsForRole } from '../config/dashboards/dashboardRegistry'
import { WidgetConfig, WidgetType } from '../types/dashboard.types'
import { useAppSelector } from '../redux/store'

export const useWidgetRegistry = () => {
  const user = useAppSelector((state) => state.auth.user)
  const userRole = user?.role || (user as any)?.user_type || 'read_only'

  const widgetsByType = useMemo(() => {
    return (type: WidgetType): WidgetConfig[] => {
      const widgets = getWidgetsByType(type)
      return widgets.filter(widget => {
        if (widget.requiredRoles && widget.requiredRoles.length > 0) {
          return widget.requiredRoles.includes(userRole)
        }
        return true
      })
    }
  }, [userRole])

  const widgetsForRole = useMemo(() => getWidgetsForRole(userRole), [userRole])
  const getWidgetConfig = (widgetId: string): WidgetConfig | undefined => widgetsForRole.find(w => w.id === widgetId)

  return { widgetsByType, widgetsForRole, userRole, getWidgetConfig }
}
