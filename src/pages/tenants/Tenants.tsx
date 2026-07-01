import { useState } from 'react'
import { Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Divider, Stack } from '@mui/material'
import { Add, BusinessOutlined, FileDownloadOutlined } from '@mui/icons-material'
import { AddDialog } from '../../components/common/AddDialog'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'

interface TenantFormData {
  name: string
  domain: string
  email: string
  phone: string
  status: string
  address: string
  notes: string
}

export default function Tenants() {
  const [addOpen, setAddOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, reset } = useForm<TenantFormData>({
    defaultValues: {
      name: '',
      domain: '',
      email: '',
      phone: '',
      status: 'active',
      address: '',
      notes: '',
    },
  })

  const onSubmit = (data: TenantFormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log('Tenant created:', data)
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
            <Typography variant="h2" gutterBottom>Tenants</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your corporate clients and their respective organizational structures.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<FileDownloadOutlined />} onClick={() => setExportOpen(true)}>Export</Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
              Add Tenant
            </Button>
          </Stack>
        </Box>

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organization</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} padding="none">
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: 'grey.100', color: 'grey.400', mx: 'auto', mb: 2 }}>
                        <BusinessOutlined />
                      </Avatar>
                      <Typography variant="h6">No tenants available</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start by adding a new tenant to manage their operations.
                      </Typography>
                      <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }} onClick={() => setAddOpen(true)}>
                        Add Your First Tenant
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
      <AddDialog
        open={addOpen}
        onClose={handleAddClose}
        title="Add Tenant"
        description="Add a new tenant organization to the platform."
        onSubmit={handleSubmit(onSubmit)}
        submitButtonText="Add Tenant"
        isSubmitting={isSubmitting}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Organization name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Organization Name"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="domain"
            control={control}
            rules={{ required: 'Domain is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Domain (e.g., example.com)"
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
                label="Contact Email"
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
            render={({ field }) => (
              <TextField
                {...field}
                label="Contact Phone"
                variant="outlined"
                fullWidth
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
        title="Export Tenants"
        description="Export tenant data as CSV or Excel."
      />
    </>
  )
}
