import React from 'react'
import { Box, Typography, TextField, Button, Chip, Avatar, IconButton, Menu, MenuItem } from '@mui/material'
import { Search, Filter, Download } from 'lucide-react'

export interface DataPageColumn {
  id: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface DataPageLayoutProps {
  title: string
  subtitle?: string
  columns: DataPageColumn[]
  data?: any[]
  renderRow?: (item: any) => Record<string, React.ReactNode>
  primaryAction?: { label: string; onClick?: () => void; icon?: any }
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  emptyState?: {
    icon?: React.ReactNode
    title: string
    description?: string
    actionLabel?: string
    onAction?: () => void
  }
  children?: React.ReactNode
}

export const DataPageLayout: React.FC<DataPageLayoutProps> = ({
  title,
  subtitle,
  columns,
  data = [],
  renderRow,
  primaryAction,
  searchPlaceholder,
  onSearch,
  emptyState,
  children,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const hasData = data.length > 0;

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 4, py: 4 }}>
      {/* Page Title & Top Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {primaryAction && (
          <Button
            variant="contained"
            startIcon={primaryAction.icon}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </Button>
        )}
      </Box>

      {/* Search Bar */}
      {searchPlaceholder && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search size={16} style={{ marginRight: 8 }} />,
            }}
            sx={{ maxWidth: 600 }}
          />
        </Box>
      )}

      {/* Table Content */}
      {children ? (
        children
      ) : (
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
          {hasData ? (
            <Box>
              {/* Table Header */}
              <Box sx={{ display: 'flex', bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', px: 3, py: 2 }}>
                {columns.map((col) => (
                  <Box
                    key={col.id}
                    sx={{
                      flex: 1,
                      textAlign: col.align || 'left',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                    }}
                  >
                    {col.label}
                  </Box>
                ))}
              </Box>
              {/* Table Body */}
              {data.map((item, index) => {
                const row = renderRow ? renderRow(item) : {};
                return (
                  <Box
                    key={item.id || index}
                    sx={{
                      display: 'flex',
                      px: 3,
                      py: 2.5,
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    {columns.map((col) => (
                      <Box
                        key={col.id}
                        sx={{
                          flex: 1,
                          textAlign: col.align || 'left',
                        }}
                      >
                        {row[col.id]}
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              {emptyState?.icon && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {emptyState.icon}
                </Box>
              )}
              <Typography variant="h6" sx={{ mb: 1 }}>{emptyState?.title || 'No records found'}</Typography>
              {emptyState?.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {emptyState.description}
                </Typography>
              )}
              {emptyState?.actionLabel && emptyState?.onAction && (
                <Button variant="outlined" onClick={emptyState.onAction}>
                  {emptyState.actionLabel}
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
export default DataPageLayout
