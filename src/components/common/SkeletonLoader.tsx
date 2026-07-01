/**
 * Modern Skeleton Loader Components
 * Professional loading states for various UI patterns
 */

import React from 'react'
import { Box, Skeleton, Card, CardContent, Grid, Typography } from '@mui/material'

export interface SkeletonLoaderProps {
  variant?: 'text' | 'rectangular' | 'circular'
  width?: number | string
  height?: number | string
  animation?: 'pulse' | 'wave' | false
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = 40,
  animation = 'pulse',
}) => {
  return <Skeleton variant={variant} width={width} height={height} animation={animation} />
}

// Card skeleton loader
export const CardSkeleton: React.FC<{ showAvatar?: boolean }> = ({ showAvatar = false }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {showAvatar && (
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        )}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </Box>
      <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={16} />
    </CardContent>
  </Card>
)

// Table skeleton loader
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <Box>
    {[...Array(rows)].map((_, rowIndex) => (
      <Box
        key={rowIndex}
        sx={{
          display: 'flex',
          gap: 2,
          py: 2,
          borderBottom: '1px solid #e2e8f0',
       }}
      >
        {[...Array(columns)].map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            width={colIndex === 0 ? '30%' : '20%'}
            height={20}
            sx={{ flex: 1 }}
          />
        ))}
      </Box>
    ))}
  </Box>
)

// Dashboard KPI card skeleton
export const KPICardSkeleton: React.FC = () => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="30%" height={20} />
        </Box>
        <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
      </Box>
    </CardContent>
  </Card>
)

// Form skeleton loader
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <Box>
    {[...Array(fields)].map((_, index) => (
      <Box key={index} sx={{ mb: 3 }}>
        <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={40} />
      </Box>
    ))}
    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
      <Skeleton variant="rectangular" width={120} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
    </Box>
  </Box>
)

// List skeleton loader
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <Box>
    {[...Array(items)].map((_, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 2,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="60%" height={16} />
        </Box>
        <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
      </Box>
    ))}
  </Box>
)

// Grid skeleton loader
export const GridSkeleton: React.FC<{ items?: number; columns?: number }> = ({
  items = 6,
  columns = 3,
}) => (
  <Grid container spacing={3}>
    {[...Array(items)].map((_, index) => (
      <Grid item xs={12} sm={6} md={12 / columns} key={index}>
        <CardSkeleton />
      </Grid>
    ))}
  </Grid>
)
