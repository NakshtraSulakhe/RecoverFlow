/**
 * Business Unit Management Page
 */

import React, { useEffect, useMemo, useState } from 'react'
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
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { businessUnitService, BusinessUnit as BusinessUnitModel } from '../../services/api/businessUnitService'

export const BusinessUnits: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBU, setSelectedBU] = useState<BusinessUnitModel | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitModel[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<BusinessUnitModel>>({
    businessUnitCode: '',
    businessUnitName: '',
    businessUnitType: 'DEPARTMENT',
    description: '',
    parentId: null,
    isActive: true,
  })

  const fetchBusinessUnits = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await businessUnitService.getBusinessUnits()
      setBusinessUnits(data)
    } catch (error) {
      console.error('Error fetching business units:', error)
      setError('Failed to load business units')
      toast.error('Failed to load business units')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinessUnits()
  }, [])

  const handleCreate = () => {
    setSelectedBU(null)
    setIsEditing(false)
    setFormData({
      businessUnitCode: '',
      businessUnitName: '',
      businessUnitType: 'DEPARTMENT',
      description: '',
      parentId: null,
      isActive: true,
    })
    setDrawerOpen(true)
  }

  const handleEdit = (bu: BusinessUnitModel) => {
    setSelectedBU(bu)
    setIsEditing(true)
    setFormData({
      ...bu,
      parentId: bu.parentId ?? null,
    })
    setDrawerOpen(true)
  }

  const handleDelete = (bu: BusinessUnitModel) => {
    setSelectedBU(bu)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.businessUnitCode?.trim() || !formData.businessUnitName?.trim()) {
      toast.error('Business unit code and name are required')
      return
    }

    try {
      setSaving(true)
      if (isEditing && selectedBU) {
        await businessUnitService.updateBusinessUnit(selectedBU.id, formData)
        toast.success('Business unit updated successfully')
      } else {
        await businessUnitService.createBusinessUnit(formData)
        toast.success('Business unit created successfully')
      }
      setDrawerOpen(false)
      await fetchBusinessUnits()
    } catch (error) {
      console.error('Error saving business unit:', error)
      toast.error('Failed to save business unit')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedBU) return
    try {
      setSaving(true)
      await businessUnitService.deleteBusinessUnit(selectedBU.id)
      toast.success('Business unit deleted successfully')
      setDeleteDialogOpen(false)
      await fetchBusinessUnits()
    } catch (error) {
      console.error('Error deleting business unit:', error)
      toast.error('Failed to delete business unit')
    } finally {
      setSaving(false)
    }
  }

  const filteredBUs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return businessUnits

    return businessUnits.filter((bu) =>
      bu.businessUnitName.toLowerCase().includes(query) ||
      bu.businessUnitCode.toLowerCase().includes(query) ||
      (bu.description || '').toLowerCase().includes(query)
    )
  }, [businessUnits, searchQuery])

  const parentOptions = useMemo(() => {
    return businessUnits.filter((bu) => bu.id !== selectedBU?.id)
  }, [businessUnits, selectedBU])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Business Units</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Business Unit
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="Search"
          placeholder="Search by name, code, or description"
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
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBUs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No business units found for the current search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBUs.map((bu) => (
                  <TableRow key={bu.id}>
                    <TableCell>{bu.businessUnitName}</TableCell>
                    <TableCell>{bu.businessUnitCode}</TableCell>
                    <TableCell>{bu.businessUnitType}</TableCell>
                    <TableCell>
                      <Chip label={bu.isActive ? 'Active' : 'Inactive'} color={bu.isActive ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(bu)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(bu)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 500 } }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Business Unit' : 'Add Business Unit'}</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Unit Code"
                value={formData.businessUnitCode || ''}
                onChange={(e) => setFormData({ ...formData, businessUnitCode: e.target.value })}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Unit Name"
                value={formData.businessUnitName || ''}
                onChange={(e) => setFormData({ ...formData, businessUnitName: e.target.value })}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.businessUnitType || 'DEPARTMENT'}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, businessUnitType: e.target.value })}
                >
                  <MenuItem value="DEPARTMENT">Department</MenuItem>
                  <MenuItem value="BRANCH">Branch</MenuItem>
                  <MenuItem value="REGION">Region</MenuItem>
                  <MenuItem value="DIVISION">Division</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Parent Unit</InputLabel>
                <Select
                  value={formData.parentId ?? ''}
                  label="Parent Unit"
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                >
                  <MenuItem value="">None</MenuItem>
                  {parentOptions.map((bu) => (
                    <MenuItem key={bu.id} value={bu.id}>
                      {bu.businessUnitName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label={formData.isActive ? 'Active' : 'Inactive'}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                  {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Drawer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Business Unit</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>Are you sure you want to delete this business unit?</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>
            {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BusinessUnits
