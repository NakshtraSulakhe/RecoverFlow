import { useState } from 'react'
import { GavelOutlined } from '@mui/icons-material'
import { DataPageLayout } from '../../components/common/DataPageLayout'
import { AddDialog } from '../../components/common/AddDialog'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box
} from '@mui/material'

interface CaseFormData {
  caseNumber: string
  customerName: string
  amount: number
  status: string
  assignedTo: string
  description: string
}

const columns = [
  { id: 'caseNumber', label: 'Case Number' },
  { id: 'customer', label: 'Customer' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Status' },
  { id: 'assignedTo', label: 'Assigned To' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
]

export default function Cases() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, reset } = useForm<CaseFormData>({
    defaultValues: {
      caseNumber: '',
      customerName: '',
      amount: 0,
      status: 'pending',
      assignedTo: '',
      description: '',
    },
  })

  const onSubmit = (data: CaseFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Case created:', data)
      setIsSubmitting(false)
      setOpen(false)
      reset()
    }, 1000)
  }

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  return (
    <>
      <DataPageLayout
        title="Cases"
        subtitle="Track recovery cases, assignments, and resolution progress."
        columns={columns}
        primaryAction={{ label: 'Add Case', onClick: () => setOpen(true) }}
        emptyState={{
          icon: <GavelOutlined sx={{ fontSize: 36 }} />,
          title: 'No cases found',
          description: 'Create a case to begin tracking customer recovery workflows.',
          actionLabel: 'Add Case',
          onAction: () => setOpen(true),
        }}
      />
      <AddDialog
        open={open}
        onClose={handleClose}
        title="Add Case"
        description="Create a new recovery case to track customer debt."
        onSubmit={handleSubmit(onSubmit)}
        submitButtonText="Create Case"
        isSubmitting={isSubmitting}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller
            name="caseNumber"
            control={control}
            rules={{ required: 'Case number is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Case Number"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder="e.g., CASE-001"
              />
            )}
          />

          <Controller
            name="customerName"
            control={control}
            rules={{ required: 'Customer name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Customer Name"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="amount"
            control={control}
            rules={{ required: 'Amount is required', min: { value: 1, message: 'Amount must be greater than 0' } }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Amount"
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
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Assigned To"
                variant="outlined"
                fullWidth
                placeholder="Agent name or ID"
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                placeholder="Add notes or description about this case"
              />
            )}
          />
        </Box>
      </AddDialog>
    </>
  )
}
