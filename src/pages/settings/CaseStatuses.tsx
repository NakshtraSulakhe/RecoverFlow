/**
 * Case Status Management Page
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
import { caseStatusService, CaseStatus } from '../../services/api/caseStatusService'
import { toast } from 'react-toastify'

export const CaseStatuses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [statuses, setStatuses] = useState<CaseStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<CaseStatus>>({
    statusName: '',
    description: '',
    color: '#6366F1',
    orderIndex: 0,
    category: '',
  })

  const fetchStatuses = async () => {
    try {
      setLoading(true)
      const data = await caseStatusService.getCaseStatuses()
      setStatuses(data)
    } catch (error) {
      console.error('Error fetching case statuses:', error)
      toast.error('Failed to load case statuses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatuses()
  }, [])

  const handleCreate = () => {
    setSelectedStatus(null)
    setIsEditing(false)
    setFormData({
      statusName: '',
      description: '',
      color: '#6366F1',
      orderIndex: 0,
      category: '',
    })
    setDrawerOpen(true)
  }

  const handleEdit = (status: CaseStatus) => {
    setSelectedStatus(status)
    setIsEditing(true)
    setFormData(status)
    setDrawerOpen(true)
  }

  const handleDelete = (status: CaseStatus) => {
    setSelectedStatus(status)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (isEditing && selectedStatus) {
        await caseStatusService.updateCaseStatus(selectedStatus.id, formData)
        toast.success('Case status updated successfully')
      } else {
        await caseStatusService.createCaseStatus(formData)
        toast.success('Case status created successfully')
      }
      setDrawerOpen(false)
      fetchStatuses()
    } catch (error) {
      console.error('Error saving case status:', error)
      toast.error('Failed to save case status')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedStatus) return
    try {
      setSaving(true)
      await caseStatusService.deleteCaseStatus(selectedStatus.id)
      toast.success('Case status deleted successfully')
      setDeleteDialogOpen(false)
      fetchStatuses()
    } catch (error) {
      console.error('Error deleting case status:', error)
      toast.error('Failed to delete case status')
    } finally {
      setSaving(false)
    }
  }

  const filteredStatuses = statuses.filter((status) =>
    searchQuery === '' ||
    status.statusName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    status.statusCode.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Typography variant="h4">Case Statuses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Status
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
                <TableCell>Color</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStatuses.map((status) => (
                <TableRow key={status.id}>
                  <TableCell>{status.statusName}</TableCell>
                  <TableCell>{status.statusCode}</TableCell>
                  <TableCell>
                    {status.category ? (
                      <Chip label={status.category} size="small" />
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: status.color || '#6366F1',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={status.isActive ? 'Active' : 'Inactive'}
                      color={status.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(status)}
                      disabled={status.isSystem}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {!status.isSystem && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(status)}
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
            {isEditing ? 'Edit Case Status' : 'Add Case Status'}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {!isEditing && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Status Code"
                  value={formData.statusCode || ''}
                  onChange={(e) => setFormData({ ...formData, statusCode: e.target.value })}
                  sx={{ mb: 3 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Status Name"
                value={formData.statusName || ''}
                onChange={(e) => setFormData({ ...formData, statusName: e.target.value })}
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={formData.color || '#6366F1'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Order Index"
                value={formData.orderIndex || 0}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
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
        <DialogTitle>Delete Case Status</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this case status?
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

export default CaseStatuses
