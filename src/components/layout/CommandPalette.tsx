import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Chip,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Brightness4 as Brightness4Icon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Payments as PaymentsIcon,
  Gavel as GavelIcon,
  Assessment as AssessmentIcon,
  SmartToy as SmartToyIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  category: string
  shortcut?: string
  action: () => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState(0)

  const commandCategories = [
    { id: 'all', label: 'All', icon: <SearchIcon /> },
    { id: 'navigation', label: 'Navigation', icon: <DashboardIcon /> },
    { id: 'create', label: 'Create', icon: <AddIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { id: 'help', label: 'Help', icon: <HelpIcon /> },
  ]

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      description: 'Navigate to the main dashboard',
      icon: <DashboardIcon />,
      category: 'navigation',
      shortcut: 'G D',
      action: () => {},
    },
    {
      id: 'nav-customers',
      label: 'Go to Customers',
      description: 'Navigate to customers page',
      icon: <PeopleIcon />,
      category: 'navigation',
      shortcut: 'G C',
      action: () => {},
    },
    {
      id: 'nav-loans',
      label: 'Go to Loans',
      description: 'Navigate to loans page',
      icon: <AccountBalanceIcon />,
      category: 'navigation',
      shortcut: 'G L',
      action: () => {},
    },
    {
      id: 'nav-payments',
      label: 'Go to Payments',
      description: 'Navigate to payments page',
      icon: <PaymentsIcon />,
      category: 'navigation',
      shortcut: 'G P',
      action: () => {},
    },
    // Create
    {
      id: 'create-customer',
      label: 'Create New Customer',
      description: 'Add a new customer to the system',
      icon: <PeopleIcon />,
      category: 'create',
      shortcut: 'C N',
      action: () => {},
    },
    {
      id: 'create-loan',
      label: 'Create New Loan',
      description: 'Create a new loan account',
      icon: <AccountBalanceIcon />,
      category: 'create',
      shortcut: 'C L',
      action: () => {},
    },
    {
      id: 'create-case',
      label: 'Create Recovery Case',
      description: 'Start a new recovery case',
      icon: <GavelIcon />,
      category: 'create',
      shortcut: 'C R',
      action: () => {},
    },
    // Settings
    {
      id: 'settings-profile',
      label: 'Profile Settings',
      description: 'Manage your profile settings',
      icon: <SettingsIcon />,
      category: 'settings',
      shortcut: 'S P',
      action: () => {},
    },
    {
      id: 'settings-theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      icon: <Brightness4Icon />,
      category: 'settings',
      shortcut: 'S T',
      action: () => {},
    },
    // Help
    {
      id: 'help-docs',
      label: 'Documentation',
      description: 'View documentation',
      icon: <HelpIcon />,
      category: 'help',
      shortcut: 'H D',
      action: () => {},
    },
    {
      id: 'help-shortcuts',
      label: 'Keyboard Shortcuts',
      description: 'View all keyboard shortcuts',
      icon: <HelpIcon />,
      category: 'help',
      shortcut: '?',
      action: () => {},
    },
  ]

  useEffect(() => {
    if (open) {
      setSearchQuery('')
      setSelectedTab(0)
    }
  }, [open])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  const filteredCommands = commands.filter((command) => {
    const matchesSearch = command.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (command.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedTab === 0 || commandCategories[selectedTab].id === command.category
    return matchesSearch && matchesCategory
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '70vh',
        },
      }}
      onKeyDown={handleKeyDown}
    >
      <DialogContent sx={{ pt: 2 }}>
        {/* Search Input */}
        <TextField
          fullWidth
          placeholder="Type a command or search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip label="ESC" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Category Tabs */}
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 2 }}>
          {commandCategories.map((category) => (
            <Tab
              key={category.id}
              label={category.label}
              icon={category.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        {/* Commands List */}
        <List>
          {filteredCommands.map((command) => (
            <ListItem key={command.id} disablePadding>
              <ListItemButton dense onClick={command.action}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {command.icon}
                </ListItemIcon>
                <ListItemText
                  primary={command.label}
                  secondary={command.description}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {command.shortcut && (
                    <Chip label={command.shortcut} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                  )}
                  <ArrowForwardIcon fontSize="small" color="action" />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {filteredCommands.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              No commands found for "{searchQuery}"
            </Typography>
          </Box>
        )}

        {/* Keyboard Shortcuts */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
            KEYBOARD SHORTCUTS
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="↑↓ Navigate" size="small" variant="outlined" />
            <Chip label="↵ Execute" size="small" variant="outlined" />
            <Chip label="Esc Close" size="small" variant="outlined" />
            <Chip label="Tab Switch Category" size="small" variant="outlined" />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
