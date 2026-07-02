import { Box, Typography, Card, CardContent, Avatar, TextField, Button, Grid } from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'
import { useState } from 'react'

export default function Profile() {
  const [user, setUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '',
    bio: '',
  })

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h2" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your personal information and account settings.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, margin: '0 auto', mb: 2, bgcolor: 'primary.main' }}>
                <PersonIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary">
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}