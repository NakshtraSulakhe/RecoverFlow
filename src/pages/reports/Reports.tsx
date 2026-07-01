import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material'
import { Assessment, TrendingUp, AccountBalance, PieChart } from '@mui/icons-material'

export default function Reports() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Recovery Report
                  </Typography>
                  <Typography variant="body2">View recovery statistics</Typography>
                </Box>
                <TrendingUp color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Payment Report
                  </Typography>
                  <Typography variant="body2">View payment history</Typography>
                </Box>
                <AccountBalance color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Case Report
                  </Typography>
                  <Typography variant="body2">View case analytics</Typography>
                </Box>
                <Assessment color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Custom Report
                  </Typography>
                  <Typography variant="body2">Generate custom reports</Typography>
                </Box>
                <PieChart color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Report Generator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select report type and parameters to generate detailed reports
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
