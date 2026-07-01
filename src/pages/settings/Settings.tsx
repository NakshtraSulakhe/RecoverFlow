import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Card, CardContent, Avatar, CardActionArea } from '@mui/material'
import { ChevronRight } from '@mui/icons-material'
import { settingsSections } from '../../constants/navigation'

export default function Settings() {
  const navigate = useNavigate()

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h2" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your account preferences and manage system-wide settings.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {settingsSections.map((section) => (
          <Grid item xs={12} sm={6} lg={4} key={section.path}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea sx={{ height: '100%' }} onClick={() => navigate(section.path)}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: `${section.color}.50`,
                        color: `${section.color}.main`,
                        borderRadius: 2,
                      }}
                    >
                      {section.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {section.text}
                      </Typography>
                    </Box>
                    <ChevronRight sx={{ color: 'grey.300' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
