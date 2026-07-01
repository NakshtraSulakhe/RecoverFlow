import React, { useEffect, useState, useCallback } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ContentContainer } from './ContentContainer'
import { CommandPalette } from './CommandPalette'
import { SearchOverlay } from './SearchOverlay'
import { NotificationDrawer } from './NotificationDrawer'
import { AIAssistantDrawer } from './AIAssistantDrawer'
import { useAppSelector } from '../../hooks/useRedux'

export interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [commandOpen, setCommandOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      setSearchOpen(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-250 relative">
      {/* Subtle ambient glow (barely visible in light mode, prominent in dark mode) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-64 left-1/4 w-[600px] h-[600px] bg-indigo-600/[0.04] dark:bg-indigo-600/[0.07] rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-64 w-[500px] h-[500px] bg-violet-600/[0.03] dark:bg-violet-600/[0.06] rounded-full blur-3xl" />
      </div>
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 relative z-10">
        <Header
          onSearchOpen={() => setSearchOpen(true)}
          onCommandOpen={() => setCommandOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen(true)}
          onAiOpen={() => setAiOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <ContentContainer>{children}</ContentContainer>
        </main>
      </div>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AIAssistantDrawer open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}
export default DashboardLayout
