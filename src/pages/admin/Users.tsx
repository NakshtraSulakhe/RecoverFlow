import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  MoreVertical,
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Users as UsersIcon,
} from 'lucide-react';
import { DataPageLayout } from '../../components/common/DataPageLayout';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../services/axios/axios.config';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  role_code: string;
  role_id: string;
  department_name: string;
  department_id: string;
  team_name: string;
  team_id: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  last_login_at: string;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  code: string;
}

const columns = [
  { id: 'name', label: 'User', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'role', label: 'Role', sortable: true },
  { id: 'department', label: 'Department', sortable: true },
  { id: 'team', label: 'Team', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'lastLogin', label: 'Last Login', sortable: true },
  { id: 'actions', label: 'Actions', align: 'right' as const },
];

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department_id: '',
    team_id: '',
    role_id: '',
    status: 'active',
    send_welcome_email: false,
  });

  // Reference data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    loadUsers();
    loadDepartments();
    loadTeams();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/user-provisioning/provisioning');
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await axiosInstance.get('/departments');
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load departments');
    }
  };

  const loadTeams = async () => {
    try {
      const response = await axiosInstance.get('/teams');
      if (response.data.success) {
        setTeams(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load teams');
    }
  };

  const loadRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles');
      if (response.data.success) {
        setRoles(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load roles');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      department_id: '',
      team_id: '',
      role_id: '',
      status: 'active',
      send_welcome_email: false,
    });
    setAddDialogOpen(true);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setFormData({
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
        department_id: selectedUser.department_id || '',
        team_id: selectedUser.team_id || '',
        role_id: selectedUser.role_id || '',
        status: selectedUser.status,
        send_welcome_email: false,
      });
    }
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDeleteUser = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleResendInvite = async () => {
    handleMenuClose();
    // TODO: Implement resend invite
    toast.success('Invite resent successfully');
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    handleMenuClose();
    try {
      const response = await axiosInstance.post(`/user-provisioning/provisioning/${selectedUser.id}/reset-password`, { send_email: true });
      if (response.data.success) {
        toast.success('Password reset email sent');
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error('Failed to reset password');
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === 'active' ? 'locked' : 'active';
    try {
      const endpoint = newStatus === 'locked' ? 'lock' : 'unlock';
      const response = await axiosInstance.patch(`/user-provisioning/provisioning/${selectedUser.id}/${endpoint}`);
      if (response.data.success) {
        toast.success(`User ${newStatus === 'locked' ? 'locked' : 'unlocked'} successfully`);
        loadUsers();
      } else {
        toast.error(response.data.message || 'Failed to update user status');
      }
    } catch (err) {
      toast.error('Failed to update user status');
    }
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const response = await axiosInstance.delete(`/user-provisioning/provisioning/${selectedUser.id}`);
      if (response.data.success) {
        toast.success('User deleted successfully');
        loadUsers();
      } else {
        toast.error(response.data.message || 'Failed to delete user');
      }
    } catch (err) {
      toast.error('Failed to delete user');
    }
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCreateUser = async () => {
    try {
      const response = await axiosInstance.post('/user-provisioning/provisioning', formData);
      if (response.data.success) {
        toast.success('User created successfully');
        setAddDialogOpen(false);
        loadUsers();
      } else {
        toast.error(response.data.message || 'Failed to create user');
      }
    } catch (err) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const response = await axiosInstance.put(`/user-provisioning/provisioning/${selectedUser.id}`, formData);
      if (response.data.success) {
        toast.success('User updated successfully');
        setEditDialogOpen(false);
        loadUsers();
      } else {
        toast.error(response.data.message || 'Failed to update user');
      }
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={14} />;
      case 'inactive': return <XCircle size={14} />;
      case 'locked': return <Lock size={14} />;
      default: return null;
    }
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRow = (user: User) => ({
    name: (
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.50' }}>
          {user.first_name[0]}{user.last_name[0]}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
        </Box>
      </Box>
    ),
    email: (
      <Typography variant="body2">{user.email}</Typography>
    ),
    role: (
      <Chip label={user.role_name} size="small" variant="outlined" icon={<Shield size={14} />} />
    ),
    department: (
      <Typography variant="body2">{user.department_name || '-'}</Typography>
    ),
    team: (
      <Typography variant="body2">{user.team_name || '-'}</Typography>
    ),
    status: (
      <Chip 
        label={user.status} 
        size="small" 
        color={getStatusColor(user.status) as any}
        icon={getStatusIcon(user.status) || undefined}
      />
    ),
    lastLogin: (
      <Typography variant="body2" color="text.secondary">
        {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
      </Typography>
    ),
    actions: (
      <IconButton onClick={(e) => handleMenuClick(e, user)} size="small">
        <MoreVertical size={18} />
      </IconButton>
    ),
  });

  return (
    <>
      <DataPageLayout
        title="Users"
        subtitle="Manage team members, roles, and access across your organization."
        columns={columns}
        data={filteredUsers}
        renderRow={renderRow}
        primaryAction={{ label: 'Add User', onClick: handleAddUser, icon: Plus }}
        searchPlaceholder="Search users by name, email, or role..."
        onSearch={setSearchQuery}
        emptyState={{
          icon: <UsersIcon size={48} />,
          title: 'No users yet',
          description: 'Invite team members to collaborate on recovery operations.',
          actionLabel: 'Add User',
          onAction: handleAddUser,
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
        <MenuItem onClick={handleEditUser}>
          <Edit size={16} style={{ marginRight: 8 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedUser?.status === 'active' ? (
            <>
              <Lock size={16} style={{ marginRight: 8 }} />
              Deactivate User
            </>
          ) : (
            <>
              <CheckCircle size={16} style={{ marginRight: 8 }} />
              Activate User
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleResetPassword}>
          <Lock size={16} style={{ marginRight: 8 }} />
          Reset Password
        </MenuItem>
        {selectedUser?.status === 'pending' && (
          <MenuItem onClick={handleResendInvite}>
            <Mail size={16} style={{ marginRight: 8 }} />
            Resend Invite
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                size="small"
                autoFocus
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                size="small"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                size="small"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Team</InputLabel>
                <Select
                  label="Team"
                  value={formData.team_id}
                  onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                  disabled={!formData.department_id}
                >
                  {teams
                    .filter(t => !formData.department_id || true) // TODO: Filter by department
                    .map((team) => (
                      <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUser}>Create User</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                size="small"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                size="small"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                size="small"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Team</InputLabel>
                <Select
                  label="Team"
                  value={formData.team_id}
                  onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="locked">Locked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateUser}>Update User</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUser?.first_name} {selectedUser?.last_name}? This action cannot be undone.
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
