import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Search as SearchIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  Star as StarIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Payments as PaymentsIcon,
  Gavel as GavelIcon,
  Assessment as AssessmentIcon,
  SmartToy as SmartToyIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

export interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

interface SearchCategory {
  id: string
  label: string
  icon: React.ReactNode
  items: SearchItem[]
}

interface SearchItem {
  id: string
  label: string
  path: string
  icon?: React.ReactNode
  category: string
  description?: string
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState(0)
  const [recentSearches] = useState<string[]>(['Customers', 'Payments', 'Reports'])
  const [favoriteSearches] = useState<string[]>(['Dashboard', 'AI Assistant'])

  const searchCategories: SearchCategory[] = [
    {
      id: 'all',
      label: 'All',
      icon: <SearchIcon />,
      items: [],
    },
    {
      id: 'navigation',
      label: 'Navigation',
      icon: <DashboardIcon />,
      items: [
        { id: '1', label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, category: 'navigation' },
        { id: '2', label: 'Customers', path: '/customers', icon: <PeopleIcon />, category: 'navigation' },
        { id: '3', label: 'Loans', path: '/loans', icon: <AccountBalanceIcon />, category: 'navigation' },
        { id: '4', label: 'Payments', path: '/payments', icon: <PaymentsIcon />, category: 'navigation' },
        { id: '5', label: 'Legal', path: '/legal', icon: <GavelIcon />, category: 'navigation' },
        { id: '6', label: 'Reports', path: '/reports', icon: <AssessmentIcon />, category: 'navigation' },
        { id: '7', label: 'AI Assistant', path: '/ai', icon: <SmartToyIcon />, category: 'navigation' },
        { id: '8', label: 'Settings', path: '/settings', icon: <SettingsIcon />, category: 'navigation' },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <PeopleIcon />,
      items: [],
    },
    {
      id: 'loans',
      label: 'Loans',
      icon: <AccountBalanceIcon />,
      items: [],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <AssessmentIcon />,
      items: [],
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

  const filteredItems = searchCategories.flatMap((category) =>
    category.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        },
      }}
      onKeyDown={handleKeyDown}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Global Search</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {/* Search Input */}
        <TextField
          fullWidth
          placeholder="Search anything... (Ctrl+K)"
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
          {searchCategories.map((category) => (
            <Tab
              key={category.id}
              label={category.label}
              icon={category.icon ? category.icon as React.ReactElement : undefined}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        {/* Search Results */}
        {searchQuery === '' ? (
          <Box>
            {/* Recent Searches */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HistoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  RECENT
                </Typography>
              </Box>
              <List dense>
                {recentSearches.map((search, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton dense>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <HistoryIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText primary={search} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Favorite Searches */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  FAVORITES
                </Typography>
              </Box>
              <List dense>
                {favoriteSearches.map((search, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton dense>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <StarIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText primary={search} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        ) : (
          <Box>
            {filteredItems.length > 0 ? (
              <List>
                {filteredItems.map((item) => (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton dense>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.description}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      <ArrowForwardIcon fontSize="small" color="action" />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No results found for "{searchQuery}"
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Keyboard Shortcuts */}
        <Box sx={{ mt:3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
            KEYBOARD SHORTCUTS
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="↑↓ Navigate" size="small" variant="outlined" />
            <Chip label="↵ Select" size="small" variant="outlined" />
            <Chip label="Esc Close" size="small" variant="outlined" />
            <Chip label="Tab Switch Category" size="small" variant="outlined" />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
