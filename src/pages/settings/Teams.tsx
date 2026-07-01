/**
 * Team Management Page
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
import { Team, OrganizationStatus } from '../../features/tenant/types'

export const Teams: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const teams: Team[] = [
    {
      id: '1',
      tenantId: 'tenant-1',
      branchId: '1',
      departmentId: '1',
      name: 'Recovery Team A',
      code: 'RT-A',
      leadId: 'user-1',
      memberIds: ['user-1', 'user-2', 'user-3'],
      status: OrganizationStatus.ACTIVE,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]

  const handleCreate = () => {
    setSelectedTeam(null)
    setIsEditing(false)
    setDrawerOpen(true)
  }

  const handleEdit = (team: Team) => {
    setSelectedTeam(team)
    setIsEditing(true)
    setDrawerOpen(true)
  }

  const handleDelete = (team: Team) => {
    setSelectedTeam(team)
    setDeleteDialogOpen(true)
  }

  const filteredTeams = teams.filter((team) =>
    searchQuery === '' || team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Teams</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Team
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
                <TableCell>Lead</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.code}</TableCell>
                  <TableCell>{team.leadId}</TableCell>
                  <TableCell>{team.memberIds.length}</TableCell>
                  <TableCell>
                    <Chip label={team.status} color={team.status === OrganizationStatus.ACTIVE ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(team)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(team)}>
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
          <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Team' : 'Add Team'}</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Team Name" defaultValue={selectedTeam?.name} sx={{ mb: 3 }} />
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
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>Are you sure you want to delete this team?</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Teams
