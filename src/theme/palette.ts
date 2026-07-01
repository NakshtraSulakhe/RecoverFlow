import { PaletteOptions } from '@mui/material/styles'

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#2563eb', // Modern Tech Blue
    light: '#3b82f6',
    dark: '#1d4ed8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#4f46e5', // Vibrant Indigo
    light: '#6366f1',
    dark: '#3730a3',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10b981', // Emerald Success
    light: '#34d399',
    dark: '#047857',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#f59e0b', // Amber Warning
    light: '#fbbf24',
    dark: '#b45309',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#ef4444', // Rose/Red Error
    light: '#f87171',
    dark: '#b91c1c',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#06b6d4', // Cyan Info
    light: '#22d3ee',
    dark: '#0891b2',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
  divider: '#e2e8f0',
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  action: {
    active: '#64748b',
    hover: 'rgba(15, 23, 42, 0.04)',
    selected: 'rgba(37, 99, 235, 0.08)',
    disabled: 'rgba(15, 23, 42, 0.26)',
    disabledBackground: 'rgba(15, 23, 42, 0.08)',
  },
}

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#60a5fa', // High-contrast Light Blue
    light: '#93c5fd',
    dark: '#2563eb',
    contrastText: '#0f172a',
  },
  secondary: {
    main: '#818cf8', // High-contrast Indigo
    light: '#a5b4fc',
    dark: '#4f46e5',
    contrastText: '#0f172a',
  },
  success: {
    main: '#34d399',
    light: '#6ee7b7',
    dark: '#065f46',
    contrastText: '#0f172a',
  },
  warning: {
    main: '#fbbf24',
    light: '#fde047',
    dark: '#92400e',
    contrastText: '#0f172a',
  },
  error: {
    main: '#f87171',
    light: '#fca5a5',
    dark: '#991b1b',
    contrastText: '#ffffff',
  },
  info: {
    main: '#22d3ee',
    light: '#67e8f9',
    dark: '#0369a1',
    contrastText: '#0f172a',
  },
  grey: {
    50: '#0f172a',
    100: '#1e293b',
    200: '#334155',
    300: '#475569',
    400: '#64748b',
    500: '#94a3b8',
    600: '#cbd5e1',
    700: '#e2e8f0',
    800: '#f1f5f9',
    900: '#f8fafc',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    disabled: '#64748b',
  },
  divider: '#1e293b',
  background: {
    default: '#0b0f19', // Premium deep dark space slate
    paper: '#111827',   // Rich slate paper surface
  },
  action: {
    active: '#94a3b8',
    hover: 'rgba(248, 250, 252, 0.06)',
    selected: 'rgba(96, 165, 250, 0.16)',
    disabled: 'rgba(248, 250, 252, 0.3)',
    disabledBackground: 'rgba(248, 250, 252, 0.12)',
  },
}

export const statusColors = {
  new: '#0ea5e9',
  inProgress: '#6366f1',
  promiseToPay: '#f59e0b',
  paid: '#10b981',
  legal: '#ef4444',
  closed: '#64748b',
}
