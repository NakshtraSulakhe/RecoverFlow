import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material'
import { CalendarToday } from '@mui/icons-material'

export default function PTPTracker() {
  const ptps = [
    { customer: 'John Doe', amount: '$1,500', date: '2024-01-15', status: 'Pending' },
    { customer: 'Jane Smith', amount: '$800', date: '2024-01-16', status: 'Completed' },
    { customer: 'Bob Johnson', amount: '$2,200', date: '2024-01-17', status: 'Overdue' },
  ]

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h2" gutterBottom>
          PTP Tracker
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track and manage Promise to Pay agreements.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {ptps.map((ptp, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarToday sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {ptp.customer}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amount: {ptp.amount} | Date: {ptp.date}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button variant="outlined" size="small">
                      View
                    </Button>
                    <Button variant="contained" size="small">
                      Mark Complete
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}