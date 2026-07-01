import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar, 
  Chip,
  IconButton,
  InputBase,
  Divider,
  Stack
} from '@mui/material'
import { 
  Add, 
  Search, 
  FilterList, 
  MoreVert, 
  PersonOutline, 
  MailOutline, 
  LocalPhoneOutlined,
  FileDownloadOutlined
} from '@mui/icons-material'
import { AddDialog } from '../../components/common/AddDialog'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'

interface CustomerFormData {
  name: string
  email: string
  phone: string
  totalDebt: number
  status: string
  address: string
  notes: string
}

export default function Customers() {
  const hasData = false // Simulate empty state
  const [addOpen, setAddOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, reset } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      totalDebt: 0,
      status: 'active',
      address: '',
      notes: '',
    },
  })

  const onSubmit = (data: CustomerFormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log('Customer created:', data)
      setIsSubmitting(false)
      setAddOpen(false)
      reset()
    }, 1000)
  }

  const handleAddClose = () => {
    setAddOpen(false)
    reset()
  }

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
          <Box>
            <Typography variant="h2" gutterBottom>Customers</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your debt recovery portfolio and track customer interactions.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<FileDownloadOutlined />} onClick={() => setExportOpen(true)}>Export</Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
              Add Customer
            </Button>
          </Stack>
        </Box>

        <Card sx={{ overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: 'grey.100', 
              px: 2, 
              py: 0.75, 
              borderRadius: 2,
              flex: 1,
              maxWidth: 400
            }}>
              <Search fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
              <InputBase
                placeholder="Search customers by name, email..."
                sx={{ fontSize: 14, flex: 1 }}
              />
            </Box>
            <Button startIcon={<FilterList />} sx={{ color: 'text.secondary' }}>Filters</Button>
          </Box>
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Details</TableCell>
                  <TableCell>Contact Information</TableCell>
                  <TableCell>Total Debt</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hasData ? (
                  // Sample data rows would go here
                  <TableRow />
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} padding="none">
                      <Box sx={{ 
                        py: 12, 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'grey.100', color: 'grey.400' }}>
                          <PersonOutline sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">No customers found</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Try adjusting your filters or add a new customer to get started.
                          </Typography>
                        </Box>
                        <Button variant="contained" startIcon={<Add />} sx={{ mt: 1 }} onClick={() => setAddOpen(true)}>
                          Add Your First Customer
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
      <AddDialog
        open={addOpen}
        onClose={handleAddClose}
        title="Add Customer"
        description="Add a new customer to your recovery portfolio."
        onSubmit={handleSubmit(onSubmit)}
        submitButtonText="Add Customer"
        isSubmitting={isSubmitting}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Customer name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Full Name"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            rules={{ required: 'Phone number is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Phone Number"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="totalDebt"
            control={control}
            rules={{ required: 'Total debt is required', min: { value: 1, message: 'Debt must be greater than 0' } }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Total Debt"
                type="number"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{ inputProps: { min: 0 } }}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
              />
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notes"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
              />
            )}
          />
        </Box>
      </AddDialog>
      <AddDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export Customers"
        description="Export customer data as CSV or Excel."
      />
    </>
  )
}
