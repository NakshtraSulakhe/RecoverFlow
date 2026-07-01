import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { shadows } from './shadows'
import { typography } from './typography'
import { lightPalette, darkPalette } from './palette'
import { components } from './components'

// Base theme configuration (without palette)
const baseTheme = {
  typography,
  shadows,
  components,
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
}

// Light theme
export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
})

// Dark theme
export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
})

// Default theme (light)
export const theme = lightTheme

// Responsive theme helper
export const getResponsiveTheme = (theme: typeof lightTheme) => {
  return responsiveFontSizes(theme)
}
