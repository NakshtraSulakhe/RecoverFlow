/**
 * Branch Management Page
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
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material'
import { Branch, BranchType, OrganizationStatus } from '../../features/tenant/types'

export const Branches: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Mock branches
  const branches: Branch[] = [
    {
      id: '1',
      tenantId: 'tenant-1',
      name: 'Headquarters',
      code: 'HQ',
      type: BranchType.HEADQUARTERS,
      managerId: 'user-1',
      location: {
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
      },
      contact: { email: 'hq@company.com' },
      status: OrganizationStatus.ACTIVE,
      isHeadquarters: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      tenantId: 'tenant-1',
      name: 'West Coast Regional',
      code: 'WC',
      type: BranchType.REGIONAL,
      parentId: '1',
      managerId: 'user-2',
      location: {
        line1: '456 Market St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102',
      },
      contact: { email: 'west@company.com' },
      status: OrganizationStatus.ACTIVE,
      isHeadquarters: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
  ]

  const getStatusColor = (status: OrganizationStatus) => {
    switch (status) {
      case OrganizationStatus.ACTIVE:
        return 'success'
      case OrganizationStatus.INACTIVE:
        return 'default'
      case OrganizationStatus.SUSPENDED:
        return 'error'
      default:
        return 'default'
    }
  }

  const getTypeLabel = (type: BranchType) => {
    switch (type) {
      case BranchType.HEADQUARTERS:
        return 'Headquarters'
      case BranchType.REGIONAL:
        return 'Regional'
      case BranchType.LOCAL:
        return 'Local'
      case BranchType.VIRTUAL:
        return 'Virtual'
      default:
        return type
    }
  }

  const handleCreate = () => {
    setSelectedBranch(null)
    setIsEditing(false)
    setDrawerOpen(true)
  }

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch)
    setIsEditing(true)
    setDrawerOpen(true)
  }

  const handleDelete = (branch: Branch) => {
    setSelectedBranch(branch)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false)
    setSelectedBranch(null)
  }

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = searchQuery === '' || 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === '' || branch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Branches
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Branch
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value={OrganizationStatus.ACTIVE}>Active</MenuItem>
                <MenuItem value={OrganizationStatus.INACTIVE}>Inactive</MenuItem>
                <MenuItem value={OrganizationStatus.SUSPENDED}>Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('')
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Branches Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {branch.isHeadquarters && (
                        <Chip label="HQ" size="small" color="primary" />
                      )}
                      <Typography variant="body2" fontWeight={500}>
                        {branch.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{branch.code}</TableCell>
                  <TableCell>{getTypeLabel(branch.type)}</TableCell>
                  <TableCell>
                    {branch.location.city}, {branch.location.state}
                  </TableCell>
                  <TableCell>{branch.managerId}</TableCell>
                  <TableCell>
                    <Chip
                      label={branch.status}
                      color={getStatusColor(branch.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(branch)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(branch)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBranches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No branches found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredBranches.length / 10)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
        />
      </Box>

      {/* Create/Edit Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 500 } }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Branch' : 'Add Branch'}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Branch Name"
                defaultValue={selectedBranch?.name}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code"
                defaultValue={selectedBranch?.code}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  defaultValue={selectedBranch?.type || BranchType.LOCAL}
                  label="Type"
                >
                  <MenuItem value={BranchType.HEADQUARTERS}>Headquarters</MenuItem>
                  <MenuItem value={BranchType.REGIONAL}>Regional</MenuItem>
                  <MenuItem value={BranchType.LOCAL}>Local</MenuItem>
                  <MenuItem value={BranchType.VIRTUAL}>Virtual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked={selectedBranch?.isHeadquarters} />}
                label="Is Headquarters"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                defaultValue={selectedBranch?.location.line1}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                defaultValue={selectedBranch?.location.city}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                defaultValue={selectedBranch?.location.state}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                defaultValue={selectedBranch?.location.country}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Postal Code"
                defaultValue={selectedBranch?.location.postalCode}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Email"
                defaultValue={selectedBranch?.contact.email}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  defaultValue={selectedBranch?.status || OrganizationStatus.ACTIVE}
                  label="Status"
                >
                  <MenuItem value={OrganizationStatus.ACTIVE}>Active</MenuItem>
                  <MenuItem value={OrganizationStatus.INACTIVE}>Inactive</MenuItem>
                  <MenuItem value={OrganizationStatus.SUSPENDED}>Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={() => setDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button variant="contained">Save</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this branch? This action cannot be undone.
          </Alert>
          <Typography variant="body2">
            Branch: {selectedBranch?.name}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Branches
