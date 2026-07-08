/**
 * Activity Type Management Page
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
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material'
import { activityTypeService, ActivityType } from '../../services/api/activityTypeService'
import { toast } from 'react-toastify'

export const ActivityTypes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [types, setTypes] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<ActivityType>>({
    activityName: '',
    description: '',
    icon: '',
    category: '',
  })

  const fetchTypes = async () => {
    try {
      setLoading(true)
      const data = await activityTypeService.getActivityTypes()
      setTypes(data)
    } catch (error) {
      console.error('Error fetching activity types:', error)
      toast.error('Failed to load activity types')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTypes()
  }, [])

  const handleCreate = () => {
    setSelectedType(null)
    setIsEditing(false)
    setFormData({
      activityName: '',
      description: '',
      icon: '',
      category: '',
    })
    setDrawerOpen(true)
  }

  const handleEdit = (type: ActivityType) => {
    setSelectedType(type)
    setIsEditing(true)
    setFormData(type)
    setDrawerOpen(true)
  }

  const handleDelete = (type: ActivityType) => {
    setSelectedType(type)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (isEditing && selectedType) {
        await activityTypeService.updateActivityType(selectedType.id, formData)
        toast.success('Activity type updated successfully')
      } else {
        await activityTypeService.createActivityType(formData)
        toast.success('Activity type created successfully')
      }
      setDrawerOpen(false)
      fetchTypes()
    } catch (error) {
      console.error('Error saving activity type:', error)
      toast.error('Failed to save activity type')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedType) return
    try {
      setSaving(true)
      await activityTypeService.deleteActivityType(selectedType.id)
      toast.success('Activity type deleted successfully')
      setDeleteDialogOpen(false)
      fetchTypes()
    } catch (error) {
      console.error('Error deleting activity type:', error)
      toast.error('Failed to delete activity type')
    } finally {
      setSaving(false)
    }
  }

  const filteredTypes = types.filter((type) =>
    searchQuery === '' ||
    type.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.activityCode.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Typography variant="h4">Activity Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Activity Type
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
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.activityName}</TableCell>
                  <TableCell>{type.activityCode}</TableCell>
                  <TableCell>
                    {type.category ? (
                      <Chip label={type.category} size="small" />
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={type.isActive ? 'Active' : 'Inactive'}
                      color={type.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(type)}
                      disabled={type.isSystem}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {!type.isSystem && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(type)}
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
            {isEditing ? 'Edit Activity Type' : 'Add Activity Type'}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {!isEditing && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Activity Code"
                  value={formData.activityCode || ''}
                  onChange={(e) => setFormData({ ...formData, activityCode: e.target.value })}
                  sx={{ mb: 3 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Activity Name"
                value={formData.activityName || ''}
                onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                sx={{ mb: 3 }}
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
              <TextField
                fullWidth
                label="Category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
        <DialogTitle>Delete Activity Type</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this activity type?
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

export default ActivityTypes
