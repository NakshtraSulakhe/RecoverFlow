import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface SidebarItemProps {
  icon?: React.ReactNode
  label: string
  path?: string
  children?: SidebarItemProps[]
  collapsed?: boolean
  level?: number
  onClick?: () => void
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  path,
  children,
  collapsed = false,
  level = 0,
  onClick,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const isActive = path ? location.pathname === path : false
  const hasChildren = children && children.length > 0
  const isChildActive = children?.some(child => child.path === location.pathname)

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open)
    } else if (path) {
      navigate(path)
      onClick?.()
    } else {
      onClick?.()
    }
  }

  const content = (
    <div className="w-full">
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold select-none transition-all duration-200 group active:scale-[0.98]",
          collapsed ? "justify-center" : "justify-start",
          level > 0 ? "pl-6" : "pl-3",
          isActive 
            ? "bg-indigo-600/20 text-indigo-300 dark:text-indigo-200 sidebar-active-glow" 
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          hasChildren && isChildActive && !isActive && "text-foreground bg-secondary"
        )}
      >
        {icon && (
          <span className={cn(
            "flex items-center justify-center transition-colors",
            isActive ? "text-indigo-400 dark:text-indigo-300" : "text-muted-foreground group-hover:text-foreground"
          )}>
            {icon}
          </span>
        )}
        
        {!collapsed && (
          <span className="flex-grow text-left truncate">{label}</span>
        )}

        {!collapsed && hasChildren && (
          <span className={cn(isActive ? "text-indigo-400 dark:text-indigo-300" : "text-muted-foreground group-hover:text-foreground")}>
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        )}
      </button>

      {/* Submenu Children */}
      <AnimatePresence initial={false}>
        {hasChildren && open && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-1 flex flex-col gap-1 border-l border-border/60 ml-5"
          >
            {children.map((child, index) => (
              <SidebarItem
                key={`${child.path}-${index}`}
                {...child}
                collapsed={collapsed}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  if (collapsed) {
    return (
      <div className="relative group/tooltip flex justify-center w-full my-0.5 px-2">
        {content}
        <div className="absolute left-16 z-50 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-250 bg-slate-900 text-slate-50 text-xs font-semibold px-2 py-1.5 rounded-md whitespace-nowrap shadow-md pointer-events-none">
          {label}
        </div>
      </div>
    )
  }

  return <div className="my-0.5 px-2">{content}</div>
}
