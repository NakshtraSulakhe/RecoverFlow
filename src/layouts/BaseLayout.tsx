import React, { useEffect, useState, useCallback } from 'react'
import { Box } from '@mui/material'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { ContentContainer } from '../components/layout/ContentContainer'
import { CommandPalette } from '../components/layout/CommandPalette'
import { SearchOverlay } from '../components/layout/SearchOverlay'
import { NotificationDrawer } from '../components/layout/NotificationDrawer'
import { AIAssistantDrawer } from '../components/layout/AIAssistantDrawer'

export interface BaseLayoutProps {
  children: React.ReactNode
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
      {/* Subtle ambient glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -256,
            left: '25%',
            width: 600,
            height: 600,
            bgcolor: 'primary.main',
            opacity: 0.04,
            borderRadius: '50%',
            filter: 'blur(96px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: -256,
            width: 500,
            height: 500,
            bgcolor: 'secondary.main',
            opacity: 0.03,
            borderRadius: '50%',
            filter: 'blur(96px)',
          }}
        />
      </Box>
      
      <Sidebar />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 10 }}>
        <Header
          onSearchOpen={() => setSearchOpen(true)}
          onCommandOpen={() => setCommandOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen(true)}
          onAiOpen={() => setAiOpen(true)}
        />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <ContentContainer>{children}</ContentContainer>
        </Box>
      </Box>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AIAssistantDrawer open={aiOpen} onClose={() => setAiOpen(false)} />
    </Box>
  )
}
