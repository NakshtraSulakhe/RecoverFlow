import { useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
} from '@mui/material'
import { EventNote, AttachMoney, TrendingUp, Person } from '@mui/icons-material'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { getPTPs } from '../../redux/slices/ptpTrackerSlice'
import { PTP_STATUSES } from '../../features/ptp-tracker/constants'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
})

export default function PTPTracker() {
  const dispatch = useAppDispatch()
  const { ptps, calendarEvents, isLoading } = useAppSelector((state) => state.ptpTracker)

  useEffect(() => {
    dispatch(getPTPs())
  }, [dispatch])

  const stats = {
    pending: ptps.filter(p => p.status === 'pending').length,
    kept: ptps.filter(p => p.status === 'kept').length,
    broken: ptps.filter(p => p.status === 'broken').length,
    totalAmount: ptps.reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Promise-to-Pay (PTP) Tracker
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <EventNote />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending PTPs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.kept}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kept Promises
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.broken}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Broken Promises
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'secondary.light' }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{stats.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Calendar */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              PTP Calendar
            </Typography>
            <Box sx={{ height: 500 }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* PTP List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent PTPs
            </Typography>
            {isLoading ? (
              <Typography align="center">Loading...</Typography>
            ) : (
              <Stack spacing={2}>
                {ptps.map((ptp) => (
                  <Card key={ptp.id} variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {format(new Date(ptp.ptpDate), 'MMM dd, yyyy')}
                        </Typography>
                        <Chip
                          label={PTP_STATUSES[ptp.status].label}
                          size="small"
                          color={PTP_STATUSES[ptp.status].color}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Amount: ₹{ptp.amount.toLocaleString()}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">
                          Confidence: {ptp.confidenceScore}%
                        </Typography>
                      </Box>
                      {ptp.notes && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          {ptp.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
