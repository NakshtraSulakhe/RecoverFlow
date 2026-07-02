import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material'
import { TrendingUp } from '@mui/icons-material'

export default function PriorityScoring() {
  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h2" gutterBottom>
          Priority Scoring
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure scoring rules and prioritization for recovery cases.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TrendingUp sx={{ color: 'primary.main', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">High Priority</Typography>
                  <Typography variant="body2" color="text.secondary">Score: 80-100</Typography>
                </Box>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip label="Overdue > 90 days" size="small" color="error" />
                <Chip label="High amount" size="small" color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TrendingUp sx={{ color: 'warning.main', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Medium Priority</Typography>
                  <Typography variant="body2" color="text.secondary">Score: 40-79</Typography>
                </Box>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip label="Overdue 30-89 days" size="small" color="warning" />
                <Chip label="Medium amount" size="small" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TrendingUp sx={{ color: 'info.main', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Low Priority</Typography>
                  <Typography variant="body2" color="text.secondary">Score: 0-39</Typography>
                </Box>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip label="New accounts" size="small" color="info" />
                <Chip label="Low amount" size="small" color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}