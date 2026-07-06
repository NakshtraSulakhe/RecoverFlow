import React, { useState, useEffect } from 'react'
import { ChevronLeft, Menu, ChevronDown, ChevronUp } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { setSidebarOpen, setSidebarCollapsed } from '../../redux/slices/uiSlice'
import { SidebarItem } from './SidebarItem'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useTenantNavigation } from '../../hooks/useTenantNavigation'

export interface SidebarProps {
  onToggle?: () => void
  onCollapse?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onToggle, onCollapse }) => {
  const location = useLocation()
  const isPlatform = location.pathname.startsWith('/platform')
  const { navigationGroups } = useTenantNavigation(isPlatform)

  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector((state) => (state as any).ui.sidebarOpen)
  const sidebarCollapsed = useAppSelector((state) => (state as any).ui.sidebarCollapsed)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  useEffect(() => {
    setExpandedGroups(navigationGroups.map((g) => g.id))
  }, [navigationGroups])

  const brandName = isPlatform ? 'RecoverFlow Platform' : 'RecoverFlow'

  const handleToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen))
    onToggle?.()
  }

  const handleCollapse = () => {
    dispatch(setSidebarCollapsed(!sidebarCollapsed))
    onCollapse?.()
  }

  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
    )
  }

  const drawerContent = (
    <div className="flex h-full w-full flex-col sidebar-bg border-r border-border transition-colors duration-250 select-none">
      <div className={cn(
        'flex items-center px-4 py-3 min-h-[64px] border-b border-border transition-all',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
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

      <div className="flex-1 overflow-y-auto py-2 space-y-3">
        {navigationGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.id)
          return (
            <div key={group.id} className="space-y-1">
              {!sidebarCollapsed ? (
                <div
                  onClick={() => handleGroupToggle(group.id)}
                  className="flex items-center justify-between px-5 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase cursor-pointer hover:text-foreground transition-colors group"
                >
                  <span>{group.label}</span>
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
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden flex flex-col gap-0.5"
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <SidebarItem
                          key={item.id}
                          icon={<Icon className="h-5 w-5" />}
                          label={item.comingSoon ? `${item.label} · Soon` : item.label}
                          path={item.path.split('?')[0]}
                          collapsed={sidebarCollapsed}
                        />
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className={cn(
        'border-t border-border p-3 flex items-center justify-between',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!sidebarCollapsed && <span className="text-xs text-muted-foreground font-semibold">v1.0.0</span>}
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
      <aside className={cn(
        'hidden md:block h-screen sticky top-0 left-0 transition-all duration-300 z-30 shrink-0',
        sidebarCollapsed ? 'w-[72px]' : 'w-[280px]'
      )}>
        {drawerContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleToggle}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
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
