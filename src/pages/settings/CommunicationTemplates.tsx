/**
 * Communication Template Management Page
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
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material'
import { communicationTemplateService, CommunicationTemplate } from '../../services/api/communicationTemplateService'
import { toast } from 'react-toastify'

const channels = [
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'letter', label: 'Letter' },
  { value: 'push_notification', label: 'Push Notification' },
]

export const CommunicationTemplates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<CommunicationTemplate>>({
    templateName: '',
    description: '',
    channel: 'sms',
    subject: '',
    content: '',
  })

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const data = await communicationTemplateService.getCommunicationTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching communication templates:', error)
      toast.error('Failed to load communication templates')
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
      templateName: '',
      description: '',
      channel: 'sms',
      subject: '',
      content: '',
    })
    setDrawerOpen(true)
  }

  const handleEdit = (template: CommunicationTemplate) => {
    setSelectedTemplate(template)
    setIsEditing(true)
    setFormData(template)
    setDrawerOpen(true)
  }

  const handleDelete = (template: CommunicationTemplate) => {
    setSelectedTemplate(template)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (isEditing && selectedTemplate) {
        await communicationTemplateService.updateCommunicationTemplate(selectedTemplate.id, formData)
        toast.success('Communication template updated successfully')
      } else {
        await communicationTemplateService.createCommunicationTemplate(formData)
        toast.success('Communication template created successfully')
      }
      setDrawerOpen(false)
      fetchTemplates()
    } catch (error) {
      console.error('Error saving communication template:', error)
      toast.error('Failed to save communication template')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedTemplate) return
    try {
      setSaving(true)
      await communicationTemplateService.deleteCommunicationTemplate(selectedTemplate.id)
      toast.success('Communication template deleted successfully')
      setDeleteDialogOpen(false)
      fetchTemplates()
    } catch (error) {
      console.error('Error deleting communication template:', error)
      toast.error('Failed to delete communication template')
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
        <CircularProgress sx={{ color: '#6366F1' }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Communication Templates</Typography>
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
                <TableCell>Channel</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.templateName}</TableCell>
                  <TableCell>{template.templateCode}</TableCell>
                  <TableCell>
                    <Chip label={template.channel} color="primary" size="small" />
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
                      disabled={template.isSystem}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {!template.isSystem && (
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

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 600 } }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Communication Template' : 'Add Communication Template'}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {!isEditing && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Template Code"
                  value={formData.templateCode || ''}
                  onChange={(e) => setFormData({ ...formData, templateCode: e.target.value })}
                  sx={{ mb: 3 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Name"
                value={formData.templateName || ''}
                onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Channel"
                value={formData.channel || 'sms'}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                sx={{ mb: 3 }}
              >
                {channels.map((channel) => (
                  <MenuItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {(formData.channel === 'email') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  sx={{ mb: 3 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={8}
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
        <DialogTitle>Delete Communication Template</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this communication template?
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

export default CommunicationTemplates
