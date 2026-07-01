import React from 'react'
import { Box, Typography, Collapse, IconButton } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

export interface SidebarGroupProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  collapsible?: boolean
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  title,
  children,
  defaultOpen = true,
  collapsible = true,
}) => {
  const [open, setOpen] = React.useState(defaultOpen)

  const handleToggle = () => {
    if (collapsible) {
      setOpen(!open)
    }
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          cursor: collapsible ? 'pointer' : 'default',
          '&:hover': collapsible ? { bgcolor: 'action.hover' } : {},
        }}
        onClick={handleToggle}
      >
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: 0.5,
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          {title}
        </Typography>
        {collapsible && (
          <IconButton size="small" sx={{ p: 0.5 }}>
            {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        )}
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Box>
  )
}
