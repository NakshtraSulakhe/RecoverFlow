import React from 'react'
import { IconButton, Tooltip, Badge, Avatar } from '@mui/material'

export interface HeaderActionProps {
  icon: React.ReactNode
  label: string
  badge?: number | boolean
  onClick?: () => void
  disabled?: boolean
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

export const HeaderAction: React.FC<HeaderActionProps> = ({
  icon,
  label,
  badge,
  onClick,
  disabled = false,
  color = 'inherit',
}) => {
  const content = (
    <Tooltip title={label}>
      <IconButton
        color={color}
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: 40,
          height: 40,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {typeof badge === 'number' && badge > 0 ? (
          <Badge badgeContent={badge} color="error" max={99}>
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  )

  return content
}
