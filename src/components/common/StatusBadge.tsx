/**
 * Modern Status Badge Component
 * Professional status indicators with consistent styling
 */

import React from 'react'
import { Chip, ChipProps } from '@mui/material'

export type StatusType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'neutral'
  | 'new'
  | 'inProgress'
  | 'promiseToPay'
  | 'paid'
  | 'legal'
  | 'closed'

export interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: StatusType
  label?: string
  size?: 'small' | 'medium'
}

const statusConfig: Record<StatusType, { color: string; bgColor: string; label?: string }> = {
  success: { color: '#059669', bgColor: '#ecfdf5' },
  warning: { color: '#d97706', bgColor: '#fef3c7' },
  error: { color: '#dc2626', bgColor: '#fef2f2' },
  info: { color: '#0891b2', bgColor: '#ecfeff' },
  neutral: { color: '#475569', bgColor: '#f1f5f9' },
  new: { color: '#0ea5e9', bgColor: '#e0f2fe' },
  inProgress: { color: '#6366f1', bgColor: '#e0e7ff' },
  promiseToPay: { color: '#f59e0b', bgColor: '#fef3c7' },
  paid: { color: '#059669', bgColor: '#ecfdf5' },
  legal: { color: '#dc2626', bgColor: '#fef2f2' },
  closed: { color: '#64748b', bgColor: '#f1f5f9' },
}

const statusLabels: Record<StatusType, string> = {
  success: 'Active',
  warning: 'Pending',
  error: 'Failed',
  info: 'Info',
  neutral: 'Inactive',
  new: 'New',
  inProgress: 'In Progress',
  promiseToPay: 'Promise to Pay',
  paid: 'Paid',
  legal: 'Legal',
  closed: 'Closed',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'small',
  ...props
}) => {
  const config = statusConfig[status]
  const displayLabel = label || statusLabels[status]

  return (
    <Chip
      label={displayLabel}
      size={size}
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        fontSize: size === 'small' ? '12px' : '13px',
        height: size === 'small' ? '24px' : '28px',
        borderRadius: '6px',
        '& .MuiChip-label': {
          px: 1,
        },
        ...props.sx,
      }}
      {...props}
    />
  )
}
