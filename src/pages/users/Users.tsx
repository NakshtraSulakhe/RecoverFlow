import { useState } from 'react'
import { GroupOutlined } from '@mui/icons-material'
import { DataPageLayout } from '../../components/common/DataPageLayout'
import { AddDialog } from '../../components/common/AddDialog'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material'

interface UserFormData {
  name: string
  email: string
  role: string
  phone: string
  department: string
  isActive: boolean
  notes: string
}

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
]

export default function Users() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, reset } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'agent',
      phone: '',
      department: '',
      isActive: true,
      notes: '',
    },
  })

  const onSubmit = (data: UserFormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log('User created:', data)
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
        title="Users"
        subtitle="Manage team members, roles, and access across your organization."
        columns={columns}
        primaryAction={{ label: 'Add User', onClick: () => setOpen(true) }}
        emptyState={{
          icon: <GroupOutlined sx={{ fontSize: 36 }} />,
          title: 'No users yet',
          description: 'Invite team members to collaborate on recovery operations.',
          actionLabel: 'Add User',
          onAction: () => setOpen(true),
        }}
      />
      <AddDialog
        open={open}
        onClose={handleClose}
        title="Add User"
        description="Invite a new team member to the platform."
        onSubmit={handleSubmit(onSubmit)}
        submitButtonText="Add User"
        isSubmitting={isSubmitting}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
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
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select {...field} label="Role">
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="agent">Agent</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                variant="outlined"
                fullWidth
              />
            )}
          />

          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Department"
                variant="outlined"
                fullWidth
              />
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Active User"
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
                placeholder="Add notes about this user (optional)"
              />
            )}
          />
        </Box>
      </AddDialog>
    </>
  )
}
