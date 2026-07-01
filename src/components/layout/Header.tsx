import React, { useState, useRef, useEffect } from 'react'
import { 
  Menu, 
  Search, 
  Bell, 
  Bot, 
  Moon, 
  Sun, 
  Globe, 
  Plus, 
  LogOut, 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Keyboard 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch } from '../../hooks/useRedux'
import { setSidebarOpen } from '../../redux/slices/uiSlice'
import { Breadcrumbs } from './Breadcrumbs'
import { TenantSwitcher } from '../../components/tenant'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/button'

export interface HeaderProps {
  onMenuClick?: () => void
  onSearchOpen?: () => void
  onCommandOpen?: () => void
  onNotificationsOpen?: () => void
  onAiOpen?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onSearchOpen,
  onNotificationsOpen,
  onAiOpen,
}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { mode, toggleTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isDarkMode = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const initials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) ?? ''}`
    : 'RF'

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md md:px-6 transition-colors duration-250">
      {/* Left side: Navigation / Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(setSidebarOpen(true))}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden active:scale-95 transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>

        {/* Ctrl+K Indicator */}
        <button
          onClick={onSearchOpen}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
        >
          <Keyboard className="h-3.5 w-3.5" />
          <span>Ctrl+K</span>
        </button>
      </div>

      {/* Middle side: Main Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={onSearchOpen}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:border-indigo-500/30 text-left transition-all duration-200 group"
        >
          <Search className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
          <span className="flex-1">Search anything...</span>
          <span className="text-xs font-semibold text-muted-foreground/60 border border-border rounded px-1.5 py-0.5">⌘K</span>
        </button>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <Button
          variant="default"
          size="sm"
          className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Quick Create</span>
        </Button>

        <div className="hidden lg:block">
          <TenantSwitcher />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="rounded-lg p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all duration-200"
        >
          {isDarkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Language Selection */}
        <button
          title="Language"
          className="hidden md:flex rounded-lg p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all duration-200"
        >
          <Globe className="h-4.5 w-4.5" />
        </button>

        {/* AI Assistant */}
        <button
          onClick={onAiOpen}
          title="AI Assistant"
          className="rounded-lg p-2.5 text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600 active:scale-95 transition-all duration-200"
        >
          <Bot className="h-4.5 w-4.5" />
        </button>

        {/* Notifications */}
        <button
          onClick={onNotificationsOpen}
          title="Notifications"
          className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all duration-200"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.7)]" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/25"
          >
            {initials}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", duration: 0.25 }}
                className="absolute right-0 mt-2.5 w-52 rounded-xl border border-border bg-card p-1 shadow-xl shadow-black/10 dark:shadow-black/40 focus:outline-none z-50"
              >
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border mb-1">
                  Signed in as <span className="font-bold text-foreground block truncate">{user?.email || 'Admin'}</span>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary text-left transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary text-left transition-colors"
                >
                  <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 text-left transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
