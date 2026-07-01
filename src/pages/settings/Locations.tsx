/**
 * Location Management Page
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
import { Location, LocationType, OrganizationStatus } from '../../features/tenant/types'

export const Locations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const locations: Location[] = [
    {
      id: '1',
      tenantId: 'tenant-1',
      branchId: '1',
      name: 'Main Office',
      type: LocationType.OFFICE,
      address: {
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
      },
      capacity: 100,
      facilities: ['WiFi', 'Parking'],
      status: OrganizationStatus.ACTIVE,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]

  const handleCreate = () => {
    setSelectedLocation(null)
    setIsEditing(false)
    setDrawerOpen(true)
  }

  const handleEdit = (loc: Location) => {
    setSelectedLocation(loc)
    setIsEditing(true)
    setDrawerOpen(true)
  }

  const handleDelete = (loc: Location) => {
    setSelectedLocation(loc)
    setDeleteDialogOpen(true)
  }

  const filteredLocations = locations.filter((loc) =>
    searchQuery === '' || loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Locations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Location
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
                <TableCell>Type</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLocations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell>{loc.name}</TableCell>
                  <TableCell>{loc.type}</TableCell>
                  <TableCell>{loc.branchId}</TableCell>
                  <TableCell>{loc.capacity}</TableCell>
                  <TableCell>
                    <Chip label={loc.status} color={loc.status === OrganizationStatus.ACTIVE ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(loc)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(loc)}>
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
          <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Location' : 'Add Location'}</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Location Name" defaultValue={selectedLocation?.name} sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Type</InputLabel>
                <Select defaultValue={selectedLocation?.type || LocationType.OFFICE} label="Type">
                  <MenuItem value={LocationType.OFFICE}>Office</MenuItem>
                  <MenuItem value={LocationType.WAREHOUSE}>Warehouse</MenuItem>
                  <MenuItem value={LocationType.RETAIL}>Retail</MenuItem>
                  <MenuItem value={LocationType.BRANCH}>Branch</MenuItem>
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
        <DialogTitle>Delete Location</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>Are you sure you want to delete this location?</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Locations
