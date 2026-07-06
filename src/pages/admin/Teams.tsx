import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  UsersRound,
  Users as UsersIcon,
  Building2,
  CheckCircle,
  XCircle,
  UserPlus,
} from 'lucide-react';
import { DataPageLayout } from '../../components/common/DataPageLayout';
import { toast } from 'react-hot-toast';
import { authFetch } from '../../utils/api';

interface Team {
  id: string;
  name: string;
  code: string;
  description: string;
  department_id: string;
  department_name: string;
  manager_id: string;
  manager_first_name: string;
  manager_last_name: string;
  is_active: boolean;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
}

const columns = [
  { id: 'name', label: 'Team', sortable: true },
  { id: 'code', label: 'Code', sortable: true },
  { id: 'department', label: 'Department', sortable: true },
  { id: 'leader', label: 'Team Leader', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'actions', label: 'Actions', align: 'right' as const },
];

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department_id: '',
    manager_id: '',
  });

  useEffect(() => {
    loadTeams();
    loadDepartments();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/api/v1/teams');
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
      } else {
        setError(data.message || 'Failed to load teams');
      }
    } catch (err) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await authFetch('/api/v1/departments');
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (err) {
      console.error('Failed to load departments');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, team: Team) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeam(team);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeam(null);
  };

  const handleAddTeam = () => {
    setFormData({ name: '', code: '', description: '', department_id: '', manager_id: '' });
    setAddDialogOpen(true);
  };

  const handleEditTeam = () => {
    if (selectedTeam) {
      setFormData({
        name: selectedTeam.name,
        code: selectedTeam.code,
        description: selectedTeam.description,
        department_id: selectedTeam.department_id || '',
        manager_id: selectedTeam.manager_id || '',
      });
    }
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDeleteTeam = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!selectedTeam) return;
    try {
      const response = await authFetch(`/api/v1/teams/${selectedTeam.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !selectedTeam.is_active }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Team ${selectedTeam.is_active ? 'deactivated' : 'activated'} successfully`);
        loadTeams();
      } else {
        toast.error(data.message || 'Failed to update team status');
      }
    } catch (err) {
      toast.error('Failed to update team status');
    }
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedTeam) return;
    try {
      const response = await authFetch(`/api/v1/teams/${selectedTeam.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Team deleted successfully');
        loadTeams();
      } else {
        toast.error(data.message || 'Failed to delete team');
      }
    } catch (err) {
      toast.error('Failed to delete team');
    }
    setDeleteDialogOpen(false);
    setSelectedTeam(null);
  };

  const handleCreateTeam = async () => {
    try {
      const response = await authFetch('/api/v1/teams', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Team created successfully');
        setAddDialogOpen(false);
        loadTeams();
      } else {
        toast.error(data.message || 'Failed to create team');
      }
    } catch (err) {
      toast.error('Failed to create team');
    }
  };

  const handleUpdateTeam = async () => {
    if (!selectedTeam) return;
    try {
      const response = await authFetch(`/api/v1/teams/${selectedTeam.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Team updated successfully');
        setEditDialogOpen(false);
        loadTeams();
      } else {
        toast.error(data.message || 'Failed to update team');
      }
    } catch (err) {
      toast.error('Failed to update team');
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.department_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRow = (team: Team) => ({
    name: (
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.50' }}>
          <UsersRound sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{team.name}</Typography>
          <Typography variant="caption" color="text.secondary">{team.description}</Typography>
        </Box>
      </Box>
    ),
    code: (
      <Typography variant="body2">{team.code}</Typography>
    ),
    department: (
      <Box display="flex" alignItems="center" gap={1}>
        <Building2 sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="body2">{team.department_name || '-'}</Typography>
      </Box>
    ),
    leader: (
      <Typography variant="body2">
        {team.manager_first_name && team.manager_last_name 
          ? `${team.manager_first_name} ${team.manager_last_name}` 
          : 'Unassigned'}
      </Typography>
    ),
    status: (
      <Chip
        label={team.is_active ? 'Active' : 'Inactive'}
        size="small"
        color={team.is_active ? 'success' : 'error'}
        icon={team.is_active ? <CheckCircle sx={{ fontSize: 14 }} /> : <XCircle sx={{ fontSize: 14 }} />}
      />
    ),
    actions: (
      <IconButton onClick={(e) => handleMenuClick(e, team)} size="small">
        <MoreVertical sx={{ fontSize: 18 }} />
      </IconButton>
    ),
  });

  return (
    <>
      <DataPageLayout
        title="Teams"
        subtitle="Create and manage recovery teams within your departments for efficient operations."
        columns={columns}
        data={filteredTeams}
        renderRow={renderRow}
        primaryAction={{ label: 'Add Team', onClick: handleAddTeam, icon: Plus }}
        searchPlaceholder="Search teams by name, description, or department..."
        onSearch={setSearchQuery}
        emptyState={{
          icon: <UsersRound sx={{ fontSize: 48, color: 'text.disabled' }} />,
          title: 'No teams yet',
          description: 'Create teams to organize your workforce and assign recovery cases.',
          actionLabel: 'Add Team',
          onAction: handleAddTeam,
        }}
      />

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEditTeam}>
          <Edit sx={{ fontSize: 16, mr: 2 }} />
          Edit Team
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedTeam?.is_active ? (
            <>
              <XCircle sx={{ fontSize: 16, mr: 2 }} />
              Deactivate Team
            </>
          ) : (
            <>
              <CheckCircle sx={{ fontSize: 16, mr: 2 }} />
              Activate Team
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDeleteTeam} sx={{ color: 'error.main' }}>
          <Trash2 sx={{ fontSize: 16, mr: 2 }} />
          Delete Team
        </MenuItem>
      </Menu>

      {/* Add Team Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Team</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Team Name"
                size="small"
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code"
                size="small"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                size="small"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTeam}>Create Team</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Team</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Team Name"
                size="small"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code"
                size="small"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                size="small"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateTeam}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete <strong>{selectedTeam?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
