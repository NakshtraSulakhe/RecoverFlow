/**
 * Department Management Page
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
  Pagination,
  Drawer,
  Grid,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { Department, OrganizationStatus } from '../../features/tenant/types'

export const Departments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const departments: Department[] = [
    {
      id: '1',
      tenantId: 'tenant-1',
      branchId: '1',
      name: 'Finance',
      code: 'FIN',
      headId: 'user-1',
      status: OrganizationStatus.ACTIVE,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      tenantId: 'tenant-1',
      branchId: '1',
      name: 'Operations',
      code: 'OPS',
      headId: 'user-2',
      status: OrganizationStatus.ACTIVE,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]

  const handleCreate = () => {
    setSelectedDepartment(null)
    setIsEditing(false)
    setDrawerOpen(true)
  }

  const handleEdit = (dept: Department) => {
    setSelectedDepartment(dept)
    setIsEditing(true)
    setDrawerOpen(true)
  }

  const handleDelete = (dept: Department) => {
    setSelectedDepartment(dept)
    setDeleteDialogOpen(true)
  }

  const filteredDepartments = departments.filter((dept) =>
    searchQuery === '' || dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Departments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Department
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
                <TableCell>Branch</TableCell>
                <TableCell>Head</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.code}</TableCell>
                  <TableCell>{dept.branchId}</TableCell>
                  <TableCell>{dept.headId}</TableCell>
                  <TableCell>
                    <Chip label={dept.status} color={dept.status === OrganizationStatus.ACTIVE ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(dept)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(dept)}>
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
          <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Department' : 'Add Department'}</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Department Name" defaultValue={selectedDepartment?.name} sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Code" defaultValue={selectedDepartment?.code} sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select defaultValue={selectedDepartment?.status || OrganizationStatus.ACTIVE} label="Status">
                  <MenuItem value={OrganizationStatus.ACTIVE}>Active</MenuItem>
                  <MenuItem value={OrganizationStatus.INACTIVE}>Inactive</MenuItem>
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
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>Are you sure you want to delete this department?</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Departments
