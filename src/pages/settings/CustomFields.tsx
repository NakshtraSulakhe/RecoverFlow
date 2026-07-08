/**
 * Custom Field Management Page
 */

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Drawer,
  Grid,
  CircularProgress,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material'
import { customFieldService, CustomField } from '../../services/api/customFieldService'
import { toast } from 'react-toastify'

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file_upload', label: 'File Upload' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
]

export const CustomFields: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<CustomField | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [fields, setFields] = useState<CustomField[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<CustomField>>({
    fieldName: '',
    description: '',
    fieldType: 'text',
    isRequired: false,
  })

  const fetchFields = async () => {
    try {
      setLoading(true)
      const data = await customFieldService.getCustomFields()
      setFields(data)
    } catch (error) {
      console.error('Error fetching custom fields:', error)
      toast.error('Failed to load custom fields')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFields()
  }, [])

  const handleCreate = () => {
    setSelectedField(null)
    setIsEditing(false)
    setFormData({
      fieldName: '',
      description: '',
      fieldType: 'text',
      isRequired: false,
    })
    setDrawerOpen(true)
  }

  const handleEdit = (field: CustomField) => {
    setSelectedField(field)
    setIsEditing(true)
    setFormData(field)
    setDrawerOpen(true)
  }

  const handleDelete = (field: CustomField) => {
    setSelectedField(field)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (isEditing && selectedField) {
        await customFieldService.updateCustomField(selectedField.id, formData)
        toast.success('Custom field updated successfully')
      } else {
        await customFieldService.createCustomField(formData)
        toast.success('Custom field created successfully')
      }
      setDrawerOpen(false)
      fetchFields()
    } catch (error) {
      console.error('Error saving custom field:', error)
      toast.error('Failed to save custom field')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedField) return
    try {
      setSaving(true)
      await customFieldService.deleteCustomField(selectedField.id)
      toast.success('Custom field deleted successfully')
      setDeleteDialogOpen(false)
      fetchFields()
    } catch (error) {
      console.error('Error deleting custom field:', error)
      toast.error('Failed to delete custom field')
    } finally {
      setSaving(false)
    }
  }

  const filteredFields = fields.filter((field) =>
    searchQuery === '' ||
    field.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.fieldCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#6366F1' }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Custom Fields</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Field
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
        />
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>{field.fieldName}</TableCell>
                  <TableCell>{field.fieldCode}</TableCell>
                  <TableCell>
                    <Chip label={field.fieldType} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={field.isRequired ? 'Yes' : 'No'}
                      color={field.isRequired ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={field.isActive ? 'Active' : 'Inactive'}
                      color={field.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(field)}
                      disabled={field.isSystem}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {!field.isSystem && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(field)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 500 } }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Custom Field' : 'Add Custom Field'}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {!isEditing && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Field Code"
                  value={formData.fieldCode || ''}
                  onChange={(e) => setFormData({ ...formData, fieldCode: e.target.value })}
                  sx={{ mb: 3 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field Name"
                value={formData.fieldName || ''}
                onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Field Type"
                value={formData.fieldType || 'text'}
                onChange={(e) => setFormData({ ...formData, fieldType: e.target.value })}
                sx={{ mb: 3 }}
              >
                {fieldTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRequired || false}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                  />
                }
                label="Required"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Drawer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Custom Field</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this custom field?
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CustomFields
