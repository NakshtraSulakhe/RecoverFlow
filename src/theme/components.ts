import { Components, Theme } from '@mui/material/styles'

export const components: Components<Omit<Theme, 'components'>> = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        padding: '10px 20px',
        fontSize: '14px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      },
      outlined: ({ theme }: { theme: Theme }) => ({
        borderColor: theme.palette.divider,
        borderWidth: '1.5px',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        },
      }),
      text: ({ theme }: { theme: Theme }) => ({
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'light' 
          ? '0 1px 3px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: theme.palette.mode === 'light'
            ? '0 4px 12px rgba(0, 0, 0, 0.08)'
            : '0 4px 12px rgba(0, 0, 0, 0.4)',
          transform: 'translateY(-1px)',
        },
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '& fieldset': {
            borderColor: theme.palette.divider,
            borderWidth: '1.5px',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
          },
          '&.Mui-focused fieldset': {
            borderWidth: '2px',
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 4px ${theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(96, 165, 250, 0.2)'}`,
          },
        },
      }),
    },
  },
  MuiSelect: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: '8px',
        '& fieldset': {
          borderColor: theme.palette.divider,
          borderWidth: '1.5px',
        },
      }),
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '6px',
        fontWeight: 500,
        fontSize: '13px',
        height: '28px',
      },
      filled: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        color: theme.palette.text.primary,
      }),
      outlined: ({ theme }: { theme: Theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: '12px',
        boxShadow: theme.palette.mode === 'light'
          ? '0 1px 3px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px rgba(0, 0, 0, 0.3)',
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRadius: '16px',
        boxShadow: theme.palette.mode === 'light'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        padding: '24px',
        maxWidth: '600px',
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(12px)',
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: '16px',
      }),
      head: ({ theme }: { theme: Theme }) => ({
        fontWeight: 600,
        color: theme.palette.text.secondary,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: '8px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '14px',
        minHeight: '48px',
        '&.Mui-selected': {
          fontWeight: 600,
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        '& .MuiAlert-icon': {
          alignItems: 'center',
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }: { theme: Theme }) => ({
        borderRadius: '8px',
        fontSize: '13px',
        padding: '8px 12px',
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[900],
        color: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[100],
      }),
    },
  },
}
