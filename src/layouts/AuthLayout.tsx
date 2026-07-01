import { Outlet } from 'react-router-dom'
import { Box, Container, Paper, Typography } from '@mui/material'

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            RecoverFlow
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Debt Recovery Management System
          </Typography>
          <Box sx={{ width: '100%', mt: 2 }}>
            <Outlet />
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
