/**
 * Unified Spacing System
 * Based on 8px grid system for consistent spacing across the application
 */

export const spacing = {
  // Base spacing unit (8px)
  unit: 8,

  // Spacing scale
  xs: 4,   // 0.5 unit
  sm: 8,   // 1 unit
  md: 16,  // 2 units
  lg: 24,  // 3 units
  xl: 32,  // 4 units
  xxl: 48, // 6 units
  xxxl: 64, // 8 units

  // Component-specific spacing
  button: {
    paddingX: 20,
    paddingY: 10,
    iconPadding: 8,
  },
  card: {
    padding: 24,
    paddingSmall: 16,
    paddingLarge: 32,
  },
  input: {
    paddingX: 12,
    paddingY: 8,
    labelMargin: 6,
  },
  table: {
    cellPadding: 16,
    headerPadding: 16,
  },
  dialog: {
    padding: 24,
    headerPadding: 24,
    footerPadding: 16,
  },
  sidebar: {
    width: 280,
    collapsedWidth: 72,
    itemPadding: 12,
    groupPadding: 8,
  },
  header: {
    height: 64,
    paddingX: 24,
  },
}

// Layout spacing
export const layoutSpacing = {
  page: {
    padding: 24,
    maxWidth: 1400,
  },
  section: {
    marginBottom: 32,
  },
  subsection: {
    marginBottom: 24,
  },
  grid: {
    gap: 24,
  },
  stack: {
    small: 8,
    medium: 16,
    large: 24,
  },
}

// Responsive spacing
export const responsiveSpacing = {
  mobile: {
    pagePadding: 16,
    gridGap: 16,
  },
  tablet: {
    pagePadding: 20,
    gridGap: 20,
  },
  desktop: {
    pagePadding: 24,
    gridGap: 24,
  },
}
