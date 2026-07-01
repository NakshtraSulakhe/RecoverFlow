import React from 'react'
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material'

interface GlobalLoaderProps {
  message?: string
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <Backdrop
      open={true}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.modal + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h6" component="div">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  )
}
