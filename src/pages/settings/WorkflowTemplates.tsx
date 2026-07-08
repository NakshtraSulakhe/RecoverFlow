/**
 * Workflow Template Management Page
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
import { workflowTemplateService, WorkflowTemplate } from '../../services/api/workflowTemplateService'
import { toast } from 'react-toastify'

export const WorkflowTemplates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<WorkflowTemplate>>({
    templateCode: '',
    templateName: '',
    description: '',
    isActive: true,
  })

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const data = await workflowTemplateService.getWorkflowTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching workflow templates:', error)
      toast.error('Failed to load workflow templates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleCreate = () => {
    setSelectedTemplate(null)
    setIsEditing(false)
    setFormData({
      templateCode: '',
      templateName: '',
      description: '',
      isActive: true,
    })
    setDrawerOpen(true)
  }

  const handleEdit = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setIsEditing(true)
    setFormData(template)
    setDrawerOpen(true)
  }

  const handleDelete = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (isEditing && selectedTemplate) {
        await workflowTemplateService.updateWorkflowTemplate(selectedTemplate.id, formData)
        toast.success('Workflow template updated successfully')
      } else {
        await workflowTemplateService.createWorkflowTemplate(formData)
        toast.success('Workflow template created successfully')
      }
      setDrawerOpen(false)
      fetchTemplates()
    } catch (error) {
      console.error('Error saving workflow template:', error)
      toast.error('Failed to save workflow template')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedTemplate) return
    try {
      setSaving(true)
      await workflowTemplateService.deleteWorkflowTemplate(selectedTemplate.id)
      toast.success('Workflow template deleted successfully')
      setDeleteDialogOpen(false)
      fetchTemplates()
    } catch (error) {
      console.error('Error deleting workflow template:', error)
      toast.error('Failed to delete workflow template')
    } finally {
      setSaving(false)
    }
  }

  const filteredTemplates = templates.filter((template) =>
    searchQuery === '' ||
    template.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.templateCode.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Typography variant="h4">Workflow Templates</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Template
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
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.templateName}</TableCell>
                  <TableCell>{template.templateCode}</TableCell>
                  <TableCell>{template.description || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={template.isSystemTemplate ? 'System' : 'Custom'}
                      color={template.isSystemTemplate ? 'default' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.isActive ? 'Active' : 'Inactive'}
                      color={template.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(template)}
                      disabled={template.isSystemTemplate}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {!template.isSystemTemplate && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(template)}
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
            {isEditing ? 'Edit Workflow Template' : 'Add Workflow Template'}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Code"
                value={formData.templateCode}
                onChange={(e) => setFormData({ ...formData, templateCode: e.target.value })}
                disabled={isEditing}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Name"
                value={formData.templateName}
                onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
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
        <DialogTitle>Delete Workflow Template</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this workflow template?
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

export default WorkflowTemplates
