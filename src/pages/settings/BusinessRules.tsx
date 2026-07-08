/**
 * Business Rule Management Page
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
  Select,
  InputLabel,
  FormControl,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material'
import { businessRuleService, BusinessRule } from '../../services/api/businessRuleService'
import { toast } from 'react-toastify'

const ruleTypes = [
  'Assignment',
  'Notification',
  'Escalation',
  'Approval',
  'Reminder',
  'Legal Trigger',
  'Settlement Trigger',
  'Auto Close',
]

export const BusinessRules: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<BusinessRule | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [rules, setRules] = useState<BusinessRule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<BusinessRule>>({
    ruleCode: '',
    ruleName: '',
    ruleType: ruleTypes[0],
    description: '',
    priority: 0,
    isActive: true,
  })

  const fetchRules = async () => {
    try {
      setLoading(true)
      const data = await businessRuleService.getBusinessRules()
      setRules(data)
    } catch (error) {
      console.error('Error fetching business rules:', error)
      toast.error('Failed to load business rules')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const handleCreate = () => {
    setSelectedRule(null)
    setIsEditing(false)
    setFormData({
      ruleCode: '',
      ruleName: '',
      ruleType: ruleTypes[0],
      description: '',
      priority: 0,
      isActive: true,
    })
    setDrawerOpen(true)
  }

  const handleEdit = (rule: BusinessRule) => {
    setSelectedRule(rule)
    setIsEditing(true)
    setFormData(rule)
    setDrawerOpen(true)
  }

  const handleDelete = (rule: BusinessRule) => {
    setSelectedRule(rule)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (isEditing && selectedRule) {
        await businessRuleService.updateBusinessRule(selectedRule.id, formData)
        toast.success('Business rule updated successfully')
      } else {
        await businessRuleService.createBusinessRule(formData)
        toast.success('Business rule created successfully')
      }
      setDrawerOpen(false)
      fetchRules()
    } catch (error) {
      console.error('Error saving business rule:', error)
      toast.error('Failed to save business rule')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedRule) return
    try {
      setSaving(true)
      await businessRuleService.deleteBusinessRule(selectedRule.id)
      toast.success('Business rule deleted successfully')
      setDeleteDialogOpen(false)
      fetchRules()
    } catch (error) {
      console.error('Error deleting business rule:', error)
      toast.error('Failed to delete business rule')
    } finally {
      setSaving(false)
    }
  }

  const filteredRules = rules.filter((rule) =>
    searchQuery === '' ||
    rule.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.ruleCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Business Rules</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Rule
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
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.ruleName}</TableCell>
                  <TableCell>{rule.ruleCode}</TableCell>
                  <TableCell>
                    <Chip label={rule.ruleType} color="primary" size="small" />
                  </TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <Chip
                      label={rule.isActive ? 'Active' : 'Inactive'}
                      color={rule.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(rule)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(rule)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
            {isEditing ? 'Edit Business Rule' : 'Add Business Rule'}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rule Code"
                value={formData.ruleCode}
                onChange={(e) => setFormData({ ...formData, ruleCode: e.target.value })}
                disabled={isEditing}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rule Name"
                value={formData.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={formData.ruleType}
                  label="Rule Type"
                  onChange={(e) => setFormData({ ...formData, ruleType: e.target.value })}
                >
                  {ruleTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
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
        <DialogTitle>Delete Business Rule</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this business rule?
          </Alert>
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

export default BusinessRules
