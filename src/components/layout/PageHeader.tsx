import React from 'react'
import { Box, Typography, IconButton, Stack, Divider } from '@mui/material'
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  showRefresh?: boolean
  showExport?: boolean
  showFilter?: boolean
  onRefresh?: () => void
  onExport?: () => void
  onFilter?: () => void
  rightContent?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  showRefresh = true,
  showExport = true,
  showFilter = true,
  onRefresh,
  onExport,
  onFilter,
  rightContent,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Breadcrumbs items={breadcrumbs} />
          <Typography variant="h2" sx={{ mt: breadcrumbs?.length ? 1 : 0 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actions}
          <Stack direction="row" spacing={1}>
            {showRefresh && (
              <IconButton onClick={onRefresh} size="small" title="Refresh">
                <RefreshIcon />
              </IconButton>
            )}
            {showFilter && (
              <IconButton onClick={onFilter} size="small" title="Filter">
                <FilterListIcon />
              </IconButton>
            )}
            {showExport && (
              <IconButton onClick={onExport} size="small" title="Export">
                <DownloadIcon />
              </IconButton>
            )}
            <IconButton size="small" title="More">
              <MoreVertIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
      {rightContent && (
        <>
          <Divider sx={{ mb: 2 }} />
          {rightContent}
        </>
      )}
    </Box>
  )
}
