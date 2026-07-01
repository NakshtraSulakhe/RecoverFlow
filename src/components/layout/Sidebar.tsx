import React, { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Star, 
  History, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { setSidebarOpen, setSidebarCollapsed } from '../../redux/slices/uiSlice'
import { SidebarItem } from './SidebarItem'
import { navigationGroups } from '../../constants/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface SidebarProps {
  onToggle?: () => void
  onCollapse?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  onToggle,
  onCollapse,
}) => {
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector((state) => (state as any).ui.sidebarOpen)
  const sidebarCollapsed = useAppSelector((state) => (state as any).ui.sidebarCollapsed)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    navigationGroups.map((g) => g.group)
  )

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
    <div className="flex h-full w-full flex-col sidebar-bg border-r border-white/5 transition-colors duration-250 select-none">
      {/* Brand Header */}
      <div className={cn(
        "flex items-center px-4 py-3 min-h-[64px] border-b border-white/5 transition-all",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
              RF
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none text-white">RecoverFlow</h1>
              <span className="text-[10px] text-indigo-300/70 font-semibold">Enterprise</span>
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
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Development Label */}
      {!sidebarCollapsed && (
        <div className="px-4 py-2">
          <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
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
                  className="flex items-center justify-between px-5 py-1.5 text-[10px] font-bold tracking-wider text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 transition-colors group"
                >
                  <span>{group.group}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </span>
                </div>
              ) : (
                <div className="border-t border-white/5 my-2" />
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
                        icon={item.icon}
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
        <div className="border-t border-white/5 px-2 py-3 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
            Quick Access
          </div>
          <SidebarItem icon={<Star className="h-4 w-4" />} label="Favorites" collapsed={false} />
          <SidebarItem icon={<History className="h-4 w-4" />} label="Recent" collapsed={false} />
        </div>
      )}

      {/* Collapse Footer Toggle */}
      <div className={cn(
        "border-t border-white/5 p-3 flex items-center justify-between",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!sidebarCollapsed && (
          <span className="text-xs text-zinc-600 font-semibold">v1.0.0</span>
        )}
        <button
          onClick={handleToggle}
          title="Toggle Sidebar"
          className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
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
