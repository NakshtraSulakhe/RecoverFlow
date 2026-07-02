import React, { useState, useMemo } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Star, 
  History, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { setSidebarOpen, setSidebarCollapsed } from '../../redux/slices/uiSlice'
import { SidebarItem } from './SidebarItem'
import { platformNavItems } from '../../modules/platform/constants/navigation'
import { tenantNavItems } from '../../modules/tenant/constants/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useAuth } from '../../features/auth/hooks/useAuth'

// Create navigation groups for both layouts
const createNavigationGroups = (items: any[]) => [
  {
    group: 'Main',
    items: items.slice(0, 3).map(item => ({
      ...item,
      label: item.text,
    })),
  },
  {
    group: 'Management',
    items: items.slice(3, 8).map(item => ({
      ...item,
      label: item.text,
    })),
  },
  {
    group: 'Settings',
    items: items.slice(8).map(item => ({
      ...item,
      label: item.text,
    })),
  },
]

// Filter navigation items based on user role and permissions
const filterNavItems = (items: any[], userRole: string) => {
  if (userRole === 'platform_owner') {
    return items // Platform owner sees all platform items
  }
  
  // For tenant users, you could add subscription/feature flag filtering here
  return items
}



export interface SidebarProps {
  onToggle?: () => void
  onCollapse?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  onToggle,
  onCollapse,
}) => {
  const location = useLocation()
  const { user } = useAuth()
  const isPlatform = location.pathname.startsWith('/platform')
  
  // Select nav items based on route
  const currentNavItems = useMemo(() => {
    const items = isPlatform ? platformNavItems : tenantNavItems
    return filterNavItems(items, user?.user_type || '')
  }, [isPlatform, user?.user_type])
  
  const navigationGroups = useMemo(() => createNavigationGroups(currentNavItems), [currentNavItems])
  
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector((state) => (state as any).ui.sidebarOpen)
  const sidebarCollapsed = useAppSelector((state) => (state as any).ui.sidebarCollapsed)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    navigationGroups.map((g) => g.group)
  )
  
  // Also update brand header to reflect platform vs tenant
  const brandName = isPlatform ? 'RecoverFlow Platform' : 'RecoverFlow'

  const handleToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen))
    onToggle?.()
  }

  const handleCollapse = () => {
    dispatch(setSidebarCollapsed(!sidebarCollapsed))
    onCollapse?.()
  }

  const handleGroupToggle = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    )
  }

  const drawerContent = (
    <div className="flex h-full w-full flex-col sidebar-bg border-r border-border transition-colors duration-250 select-none">
      {/* Brand Header */}
      <div className={cn(
        "flex items-center px-4 py-3 min-h-[64px] border-b border-border transition-all",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
              RF
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none text-foreground">{brandName}</h1>
              <span className="text-[10px] text-indigo-400/70 font-semibold dark:text-indigo-300/70">
                {isPlatform ? 'Platform Admin' : 'Enterprise'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
            RF
          </div>
        )}

        {!sidebarCollapsed && (
          <button
            onClick={handleCollapse}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Development Label */}
      {!sidebarCollapsed && (
        <div className="px-4 py-2">
          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Development
          </span>
        </div>
      )}

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto py-2 space-y-3">
        {navigationGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.group)
          return (
            <div key={group.group} className="space-y-1">
              {!sidebarCollapsed ? (
                <div
                  onClick={() => handleGroupToggle(group.group)}
                  className="flex items-center justify-between px-5 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase cursor-pointer hover:text-foreground transition-colors group"
                >
                  <span>{group.group}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </span>
                </div>
              ) : (
                <div className="border-t border-border my-2" />
              )}
              
              <AnimatePresence initial={false}>
                {(sidebarCollapsed || isExpanded) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden flex flex-col gap-0.5"
                  >
                    {group.items.map((item) => (
                      <SidebarItem
                        key={item.path}
                        icon={<item.icon className="h-5 w-5" />}
                        label={item.label}
                        path={item.path}
                        collapsed={sidebarCollapsed}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Quick Access List */}
      {!sidebarCollapsed && (
        <div className="border-t border-border px-2 py-3 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Quick Access
          </div>
          <SidebarItem icon={<Star className="h-4 w-4" />} label="Favorites" collapsed={false} />
          <SidebarItem icon={<History className="h-4 w-4" />} label="Recent" collapsed={false} />
        </div>
      )}

      {/* Collapse Footer Toggle */}
      <div className={cn(
        "border-t border-border p-3 flex items-center justify-between",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!sidebarCollapsed && (
          <span className="text-xs text-muted-foreground font-semibold">v1.0.0</span>
        )}
        <button
          onClick={handleToggle}
          title="Toggle Sidebar"
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:block h-screen sticky top-0 left-0 transition-all duration-300 z-30 shrink-0",
          sidebarCollapsed ? "w-[72px]" : "w-[280px]"
        )}
      >
        {drawerContent}
      </aside>

      {/* Mobile Drawer (Slide overlay) */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleToggle}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Content Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="relative z-10 flex h-full w-[280px] flex-col"
            >
              {drawerContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
