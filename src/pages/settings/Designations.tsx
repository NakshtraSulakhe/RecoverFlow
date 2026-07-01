/**
 * Designation Management Page
 */

import React, { useState } from 'react'
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Drawer,
  Grid,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material'
import { Designation, DesignationLevel, OrganizationStatus } from '../../features/tenant/types'

export const Designations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const designations: Designation[] = [
    {
      id: '1',
      tenantId: 'tenant-1',
      title: 'Senior Recovery Agent',
      code: 'SRA',
      level: DesignationLevel.SENIOR,
      permissions: ['view_cases', 'edit_cases'],
      status: OrganizationStatus.ACTIVE,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]

  const handleCreate = () => {
    setSelectedDesignation(null)
    setIsEditing(false)
    setDrawerOpen(true)
  }

  const handleEdit = (desig: Designation) => {
    setSelectedDesignation(desig)
    setIsEditing(true)
    setDrawerOpen(true)
  }

  const handleDelete = (desig: Designation) => {
    setSelectedDesignation(desig)
    setDeleteDialogOpen(true)
  }

  const filteredDesignations = designations.filter((desig) =>
    searchQuery === '' || desig.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Designations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Designation
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
                <TableCell>Title</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDesignations.map((desig) => (
                <TableRow key={desig.id}>
                  <TableCell>{desig.title}</TableCell>
                  <TableCell>{desig.code}</TableCell>
                  <TableCell>{desig.level}</TableCell>
                  <TableCell>{desig.permissions.length} permissions</TableCell>
                  <TableCell>
                    <Chip label={desig.status} color={desig.status === OrganizationStatus.ACTIVE ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(desig)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(desig)}>
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
          <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Designation' : 'Add Designation'}</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Title" defaultValue={selectedDesignation?.title} sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Code" defaultValue={selectedDesignation?.code} sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Level</InputLabel>
                <Select defaultValue={selectedDesignation?.level || DesignationLevel.MID} label="Level">
                  <MenuItem value={DesignationLevel.EXECUTIVE}>Executive</MenuItem>
                  <MenuItem value={DesignationLevel.MANAGEMENT}>Management</MenuItem>
                  <MenuItem value={DesignationLevel.SENIOR}>Senior</MenuItem>
                  <MenuItem value={DesignationLevel.MID}>Mid</MenuItem>
                  <MenuItem value={DesignationLevel.JUNIOR}>Junior</MenuItem>
                  <MenuItem value={DesignationLevel.INTERN}>Intern</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button variant="contained">Save</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Drawer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Designation</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>Are you sure you want to delete this designation?</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Designations
