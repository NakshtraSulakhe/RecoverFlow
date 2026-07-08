import { useEffect, useMemo, useState } from 'react'
import { getDashboardConfig, getKPIsForRole, getWidgetConfig } from '../config/dashboards/dashboardRegistry'
import { KPIDefinition, WidgetConfig } from '../types/dashboard.types'
import { useAppSelector } from '../redux/store'
import { dashboardWidgetService, DashboardWidgetConfig } from '../services/api/dashboardWidgetService'

export const useDashboardConfig = () => {
  const user = useAppSelector((state) => state.auth.user)
  const userRole = user?.user_type || user?.role || 'read_only'
  const [dbWidgets, setDbWidgets] = useState<DashboardWidgetConfig[]>([])

  useEffect(() => {
    let active = true
    dashboardWidgetService
      .getWidgets()
      .then((widgets) => {
        if (active) setDbWidgets(widgets)
      })
      .catch(() => {
        if (active) setDbWidgets([])
      })
    return () => {
      active = false
    }
  }, [userRole])

  const fallbackConfig = useMemo(() => getDashboardConfig(userRole), [userRole])

  const dashboardConfig = useMemo(() => {
    if (dbWidgets.length === 0) return fallbackConfig

    return {
      ...fallbackConfig,
      widgets: dbWidgets.map((widget) => ({
        id: widget.id,
        title: widget.widgetConfig?.title || widget.widgetType,
        type: widget.widgetType as any,
        size: 'medium' as const,
        config: {
          ...widget.widgetConfig,
          grid: {
            x: widget.positionX,
            y: widget.positionY,
            w: widget.width,
            h: widget.height,
          },
        },
      })),
    }
  }, [dbWidgets, fallbackConfig])

  const kpiDefinitions = useMemo(() => getKPIsForRole(userRole), [userRole])

  const getWidgetById = (widgetId: string): WidgetConfig | undefined => getWidgetConfig(widgetId)
  const getKPIById = (kpiId: string): KPIDefinition | undefined => kpiDefinitions.find(k => k.id === kpiId)

  return {
    dashboardConfig,
    kpiDefinitions,
    userRole,
    getWidgetById,
    getKPIById,
  }
}
