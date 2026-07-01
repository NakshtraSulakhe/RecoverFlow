import React from 'react'
import { Box, Typography, Chip } from '@mui/material'

export interface FooterProps {
  version?: string
  environment?: string
  buildNumber?: string
  copyright?: string
}

export const Footer: React.FC<FooterProps> = ({
  version = '1.0.0',
  environment = 'Development',
  buildNumber = '2024.01.01',
  copyright = '© 2024 RecoverFlow. All rights reserved.',
}) => {
  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {copyright}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            •
          </Typography>
          <Typography variant="caption" color="text.secondary">
            v{version}
          </Typography>
          <Chip
            label={environment}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              bgcolor: environment === 'Production' ? 'success.main' : 'warning.main',
              color: 'white',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Build: {buildNumber}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
