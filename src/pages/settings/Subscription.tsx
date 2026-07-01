/**
 * Subscription Page
 * Display current plan, usage, and billing information
 */

import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Upgrade as UpgradeIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { useTenant } from '../../features/tenant/context'
import { SubscriptionStatus } from '../../features/tenant/types'

export const Subscription: React.FC = () => {
  const { tenant, isLoading } = useTenant()
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>Loading...</Box>
  }

  if (!tenant) {
    return <Alert severity="error">No tenant data available</Alert>
  }

  const { subscription, usage } = tenant

  const plans = [
    { name: 'Starter', price: '$29', users: 5, branches: 1, storage: '10 GB' },
    { name: 'Professional', price: '$99', users: 50, branches: 10, storage: '100 GB' },
    { name: 'Enterprise', price: 'Custom', users: 'Unlimited', branches: 'Unlimited', storage: 'Unlimited' },
  ]

  const invoices = [
    { id: 'INV-001', date: '2024-01-15', amount: '$99.00', status: 'Paid' },
    { id: 'INV-002', date: '2024-02-15', amount: '$99.00', status: 'Paid' },
    { id: 'INV-003', date: '2024-03-15', amount: '$99.00', status: 'Pending' },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Subscription & Billing
      </Typography>

      {/* Current Plan */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Plan
              </Typography>
              <Typography variant="h3" color="primary" sx={{ mb: 2 }}>
                {subscription.plan.toUpperCase()}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip
                  label={subscription.status}
                  color={subscription.status === SubscriptionStatus.ACTIVE ? 'success' : 'warning'}
                />
                <Chip label={`Auto-renew: ${subscription.autoRenew ? 'On' : 'Off'}`} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Started: {new Date(subscription.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Renews: {new Date(subscription.renewalDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<UpgradeIcon />}
                  onClick={() => setUpgradeDialogOpen(true)}
                >
                  Upgrade Plan
                </Button>
                <Button variant="outlined" startIcon={<CancelIcon />}>
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usage Summary
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Users</Typography>
                  <Typography variant="body2">
                    {usage.users.used} / {usage.users.limit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(usage.users.used / usage.users.limit) * 100}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Branches</Typography>
                  <Typography variant="body2">
                    {usage.branches.used} / {usage.branches.limit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(usage.branches.used / usage.branches.limit) * 100}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Storage</Typography>
                  <Typography variant="body2">
                    {usage.storage.used} / {usage.storage.limit} {usage.storage.unit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(usage.storage.used / usage.storage.limit) * 100}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">API Calls</Typography>
                  <Typography variant="body2">{usage.apiCalls.used.toLocaleString()}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(usage.apiCalls.used / 100000) * 100}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Available Plans */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Available Plans
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.name}>
            <Card
              sx={{
                height: '100%',
                border: subscription.plan.toLowerCase() === plan.name.toLowerCase() ? 2 : 1,
                borderColor: subscription.plan.toLowerCase() === plan.name.toLowerCase() ? 'primary.main' : 'divider',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
                  {plan.price}
                  {plan.price !== 'Custom' && <span style={{ fontSize: '1rem' }}>/month</span>}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">• {plan.users} Users</Typography>
                  <Typography variant="body2">• {plan.branches} Branches</Typography>
                  <Typography variant="body2">• {plan.storage} Storage</Typography>
                </Box>
                <Button
                  variant={subscription.plan.toLowerCase() === plan.name.toLowerCase() ? 'outlined' : 'contained'}
                  fullWidth
                  disabled={subscription.plan.toLowerCase() === plan.name.toLowerCase()}
                >
                  {subscription.plan.toLowerCase() === plan.name.toLowerCase() ? 'Current Plan' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Invoices */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Invoices
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        color={invoice.status === 'Paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<ReceiptIcon />}>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Payment Method
      </Typography>
      <Card>
        <CardContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Payment integration coming soon
          </Alert>
          <Button variant="outlined" startIcon={<PaymentIcon />}>
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upgrade Your Plan</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Contact sales to upgrade your plan
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialogOpen(false)}>Close</Button>
          <Button variant="contained">Contact Sales</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Subscription
