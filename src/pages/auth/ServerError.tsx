import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function ServerError() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" color="error" sx={{ mb: 2 }}>
        500
      </Typography>
      <Typography variant="h4" gutterBottom>
        Server Error
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Something went wrong on our end. Please try again later.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Box>
  )
}