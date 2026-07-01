import { useState } from 'react'
import { LoopOutlined } from '@mui/icons-material'
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

interface RecoveryActionFormData {
  caseNumber: string
  method: string
  amount: number
  status: string
  date: string
  notes: string
}

const columns = [
  { id: 'case', label: 'Case' },
  { id: 'method', label: 'Method' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Status' },
  { id: 'date', label: 'Date' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
]

export default function Recovery() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, reset } = useForm<RecoveryActionFormData>({
    defaultValues: {
      caseNumber: '',
      method: 'call',
      amount: 0,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  })

  const onSubmit = (data: RecoveryActionFormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log('Recovery action created:', data)
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
        title="Recovery Actions"
        subtitle="Monitor follow-ups, outreach activities, and recovery outcomes."
        columns={columns}
        primaryAction={{ label: 'Add Recovery Action', onClick: () => setOpen(true) }}
        emptyState={{
          icon: <LoopOutlined sx={{ fontSize: 36 }} />,
          title: 'No recovery actions',
          description: 'Log calls, visits, and follow-ups to keep cases moving forward.',
          actionLabel: 'Add Recovery Action',
          onAction: () => setOpen(true),
        }}
      />
      <AddDialog
        open={open}
        onClose={handleClose}
        title="Add Recovery Action"
        description="Create a new recovery action to track your workflow."
        onSubmit={handleSubmit(onSubmit)}
        submitButtonText="Create Action"
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
              />
            )}
          />

          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Method</InputLabel>
                <Select {...field} label="Method">
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="visit">Visit</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Amount (Optional)"
                type="number"
                variant="outlined"
                fullWidth
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
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="date"
            control={control}
            rules={{ required: 'Date is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
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
                rows={3}
                placeholder="Add notes about this recovery action"
              />
            )}
          />
        </Box>
      </AddDialog>
    </>
  )
}
