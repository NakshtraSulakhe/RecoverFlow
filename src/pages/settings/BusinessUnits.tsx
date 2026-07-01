/**
 * Business Unit Management Page
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
import { BusinessUnit, OrganizationStatus } from '../../features/tenant/types'

export const BusinessUnits: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBU, setSelectedBU] = useState<BusinessUnit | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const businessUnits: BusinessUnit[] = [
    {
      id: '1',
      tenantId: 'tenant-1',
      name: 'Recovery Operations',
      code: 'RO',
      headId: 'user-1',
      departmentIds: ['1', '2'],
      status: OrganizationStatus.ACTIVE,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]

  const handleCreate = () => {
    setSelectedBU(null)
    setIsEditing(false)
    setDrawerOpen(true)
  }

  const handleEdit = (bu: BusinessUnit) => {
    setSelectedBU(bu)
    setIsEditing(true)
    setDrawerOpen(true)
  }

  const handleDelete = (bu: BusinessUnit) => {
    setSelectedBU(bu)
    setDeleteDialogOpen(true)
  }

  const filteredBUs = businessUnits.filter((bu) =>
    searchQuery === '' || bu.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <TableCell>Head</TableCell>
                <TableCell>Departments</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBUs.map((bu) => (
                <TableRow key={bu.id}>
                  <TableCell>{bu.name}</TableCell>
                  <TableCell>{bu.code}</TableCell>
                  <TableCell>{bu.headId}</TableCell>
                  <TableCell>{bu.departmentIds.length}</TableCell>
                  <TableCell>
                    <Chip label={bu.status} color={bu.status === OrganizationStatus.ACTIVE ? 'success' : 'default'} size="small" />
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 500 } }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Business Unit' : 'Add Business Unit'}</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Business Unit Name" defaultValue={selectedBU?.name} sx={{ mb: 3 }} />
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
        <DialogTitle>Delete Business Unit</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>Are you sure you want to delete this business unit?</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BusinessUnits
