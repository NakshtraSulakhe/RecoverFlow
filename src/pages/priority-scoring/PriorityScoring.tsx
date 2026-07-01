import { useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
} from '@mui/material'
import { TrendingUp, Person, AttachMoney, Schedule } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { getPriorityCases, getRecoveryScore } from '../../redux/slices/priorityScoringSlice'
import { RISK_LEVELS } from '../../features/priority-scoring/constants'

export default function PriorityScoring() {
  const dispatch = useAppDispatch()
  const { priorityCases, isLoading, currentScore } = useAppSelector((state) => state.priorityScoring)

  useEffect(() => {
    dispatch(getPriorityCases())
    dispatch(getRecoveryScore('1'))
  }, [dispatch])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Priority Scoring
      </Typography>
      
      {/* Current Score Overview */}
      {currentScore && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recovery Score Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold">
                      {currentScore.overall}
                    </Typography>
                  </Box>
                  <Typography variant="h6">Recovery Score</Typography>
                  <Chip
                    label={RISK_LEVELS[currentScore.riskLevel].label}
                    color={RISK_LEVELS[currentScore.riskLevel].color}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Star Rating
                  </Typography>
                  <Rating
                    value={currentScore.starRating}
                    readOnly
                    sx={{ fontSize: 32 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Factors
                  </Typography>
                  <Stack spacing={1}>
                    {currentScore.factors.map((factor, index) => (
                      <Box key={index}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2">{factor.name}</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {factor.value}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={factor.weight}
                          color={factor.impact === 'positive' ? 'success' : factor.impact === 'negative' ? 'error' : 'primary'}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Priority Cases */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Priority Cases
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Recovery Score</TableCell>
                <TableCell>Amount Due</TableCell>
                <TableCell>DPD</TableCell>
                <TableCell>Assigned To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                priorityCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <TrendingUp />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {c.caseNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'secondary.light' }}>
                          <Person />
                        </Avatar>
                        <Typography variant="body2">{c.customerName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${c.recoveryScore.overall}%`}
                        color={RISK_LEVELS[c.recoveryScore.riskLevel].color}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AttachMoney fontSize="small" />
                        <Typography variant="body2">
                          ₹{c.amountDue.toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Schedule fontSize="small" />
                        <Typography variant="body2">{c.dpd} days</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{c.assignedTo}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
