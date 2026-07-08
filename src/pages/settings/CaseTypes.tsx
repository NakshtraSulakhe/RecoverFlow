/**
 * Case Type Management Page
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
import { caseTypeService, CaseType } from '../../services/api/caseTypeService'
import { toast } from 'react-toastify'

export const CaseTypes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<CaseType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [types, setTypes] = useState<CaseType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<CaseType>>({
    caseTypeName: '',
    description: '',
    icon: '',
    color: '#6366F1',
  })

  const fetchTypes = async () => {
    try {
      setLoading(true)
      const data = await caseTypeService.getCaseTypes()
      setTypes(data)
    } catch (error) {
      console.error('Error fetching case types:', error)
      toast.error('Failed to load case types')
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
      caseTypeName: '',
      description: '',
      icon: '',
      color: '#6366F1',
    })
    setDrawerOpen(true)
  }

  const handleEdit = (type: CaseType) => {
    setSelectedType(type)
    setIsEditing(true)
    setFormData(type)
    setDrawerOpen(true)
  }

  const handleDelete = (type: CaseType) => {
    setSelectedType(type)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (isEditing && selectedType) {
        await caseTypeService.updateCaseType(selectedType.id, formData)
        toast.success('Case type updated successfully')
      } else {
        await caseTypeService.createCaseType(formData)
        toast.success('Case type created successfully')
      }
      setDrawerOpen(false)
      fetchTypes()
    } catch (error) {
      console.error('Error saving case type:', error)
      toast.error('Failed to save case type')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedType) return
    try {
      setSaving(true)
      await caseTypeService.deleteCaseType(selectedType.id)
      toast.success('Case type deleted successfully')
      setDeleteDialogOpen(false)
      fetchTypes()
    } catch (error) {
      console.error('Error deleting case type:', error)
      toast.error('Failed to delete case type')
    } finally {
      setSaving(false)
    }
  }

  const filteredTypes = types.filter((type) =>
    searchQuery === '' ||
    type.caseTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.caseTypeCode.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Typography variant="h4">Case Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Case Type
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
                <TableCell>Color</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.caseTypeName}</TableCell>
                  <TableCell>{type.caseTypeCode}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: type.color || '#6366F1',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    />
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
            {isEditing ? 'Edit Case Type' : 'Add Case Type'}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {!isEditing && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Case Type Code"
                  value={formData.caseTypeCode || ''}
                  onChange={(e) => setFormData({ ...formData, caseTypeCode: e.target.value })}
                  sx={{ mb: 3 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Case Type Name"
                value={formData.caseTypeName || ''}
                onChange={(e) => setFormData({ ...formData, caseTypeName: e.target.value })}
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
        <DialogTitle>Delete Case Type</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this case type?
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

export default CaseTypes
