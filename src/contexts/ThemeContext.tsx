import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from '../theme'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextType {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode
    return savedMode || 'system'
  })

  const [currentTheme, setCurrentTheme] = useState(lightTheme)

  useEffect(() => {
    const applyTheme = () => {
      let effectiveMode: 'light' | 'dark'

      if (mode === 'system') {
        effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        effectiveMode = mode
      }

      setCurrentTheme(effectiveMode === 'dark' ? darkTheme : lightTheme)
      document.documentElement.setAttribute('data-theme', effectiveMode)
      if (effectiveMode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme()

    // Listen for system theme changes
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme()
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [mode])

  const setModeAndPersist = (newMode: ThemeMode) => {
    setMode(newMode)
    localStorage.setItem('theme-mode', newMode)
  }

  const toggleTheme = () => {
    const effectiveMode = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode
    setModeAndPersist(effectiveMode === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode: setModeAndPersist, toggleTheme }}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}
