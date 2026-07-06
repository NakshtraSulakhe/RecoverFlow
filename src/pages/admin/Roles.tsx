import React, { useState } from 'react';
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
  FormControlLabel,
  Switch,
  Divider,
  Alert,
} from '@mui/material';
import {
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Copy,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { DataPageLayout } from '../../components/common/DataPageLayout';

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: number;
  isSystem: boolean;
  isDefault: boolean;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Tenant Admin',
    description: 'Full access to all organization settings and management',
    userCount: 2,
    permissions: 45,
    isSystem: true,
    isDefault: false,
  },
  {
    id: '2',
    name: 'Recovery Manager',
    description: 'Manage recovery operations and team performance',
    userCount: 5,
    permissions: 28,
    isSystem: true,
    isDefault: false,
  },
  {
    id: '3',
    name: 'Team Leader',
    description: 'Lead recovery teams and manage cases',
    userCount: 8,
    permissions: 18,
    isSystem: true,
    isDefault: false,
  },
  {
    id: '4',
    name: 'Recovery Agent',
    description: 'Handle assigned recovery cases and customer communications',
    userCount: 15,
    permissions: 12,
    isSystem: true,
    isDefault: true,
  },
  {
    id: '5',
    name: 'Legal Officer',
    description: 'Manage legal proceedings and documentation',
    userCount: 3,
    permissions: 15,
    isSystem: true,
    isDefault: false,
  },
  {
    id: '6',
    name: 'QA Specialist',
    description: 'Review and quality assurance of recovery processes',
    userCount: 2,
    permissions: 10,
    isSystem: true,
    isDefault: false,
  },
];

const columns = [
  { id: 'name', label: 'Role Name', sortable: true },
  { id: 'description', label: 'Description', sortable: true },
  { id: 'userCount', label: 'Users', sortable: true },
  { id: 'permissions', label: 'Permissions', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'actions', label: 'Actions', align: 'right' as const },
];

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, role: Role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleAddRole = () => {
    setAddDialogOpen(true);
  };

  const handleEditRole = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDeleteRole = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDuplicateRole = () => {
    handleMenuClose();
    if (selectedRole) {
      const newRole = {
        ...selectedRole,
        id: `${Date.now()}`,
        name: `${selectedRole.name} (Copy)`,
        isSystem: false,
      };
      setRoles([...roles, newRole]);
    }
  };

  const handleManagePermissions = () => {
    handleMenuClose();
    setPermissionsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRole && !selectedRole.isSystem) {
      setRoles(roles.filter(r => r.id !== selectedRole.id));
    }
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRow = (role: Role) => ({
    name: (
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: role.isSystem ? 'primary.50' : 'secondary.50', color: role.isSystem ? 'primary.main' : 'secondary.main' }}>
          <Shield sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{role.name}</Typography>
          {role.isSystem && (
            <Chip label="System Role" size="small" sx={{ height: 18, fontSize: 10, mt: 0.5 }} />
          )}
        </Box>
      </Box>
    ),
    description: (
      <Typography variant="body2" color="text.secondary">{role.description}</Typography>
    ),
    userCount: (
      <Box display="flex" alignItems="center" gap={1}>
        <Users sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="body2">{role.userCount}</Typography>
      </Box>
    ),
    permissions: (
      <Typography variant="body2">{role.permissions} permissions</Typography>
    ),
    status: (
      <Box display="flex" alignItems="center" gap={1}>
        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
        <Typography variant="body2">Active</Typography>
      </Box>
    ),
    actions: (
      <IconButton onClick={(e) => handleMenuClick(e, role)} size="small">
        <MoreVertical sx={{ fontSize: 18 }} />
      </IconButton>
    ),
  });

  return (
    <>
      <DataPageLayout
        title="Roles"
        subtitle="Define and manage user roles with specific permissions for your organization."
        columns={columns}
        data={filteredRoles}
        renderRow={renderRow}
        primaryAction={{ label: 'Add Role', onClick: handleAddRole, icon: Plus }}
        searchPlaceholder="Search roles by name or description..."
        onSearch={setSearchQuery}
        emptyState={{
          icon: <Shield sx={{ fontSize: 48, color: 'text.disabled' }} />,
          title: 'No roles yet',
          description: 'Create roles to define user permissions and access levels.',
          actionLabel: 'Add Role',
          onAction: handleAddRole,
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
        <MenuItem onClick={handleManagePermissions}>
          <Lock sx={{ fontSize: 16, mr: 2 }} />
          Manage Permissions
        </MenuItem>
        <MenuItem onClick={handleEditRole} disabled={selectedRole?.isSystem}>
          <Edit sx={{ fontSize: 16, mr: 2 }} />
          Edit Role
        </MenuItem>
        <MenuItem onClick={handleDuplicateRole}>
          <Copy sx={{ fontSize: 16, mr: 2 }} />
          Duplicate Role
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteRole} 
          sx={{ color: 'error.main' }}
          disabled={selectedRole?.isSystem}
        >
          <Trash2 sx={{ fontSize: 16, mr: 2 }} />
          Delete Role
        </MenuItem>
      </Menu>

      {/* Add Role Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Name"
                placeholder="e.g., Senior Manager"
                size="small"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Describe the purpose and responsibilities of this role"
                size="small"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Set as default role for new users"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Role</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Name"
                size="small"
                defaultValue={selectedRole?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                size="small"
                multiline
                rows={3}
                defaultValue={selectedRole?.description}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked={selectedRole?.isDefault} />}
                label="Set as default role for new users"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          {selectedRole?.isSystem ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              System roles cannot be deleted. You can only modify custom roles.
            </Alert>
          ) : (
            <Typography variant="body2">
              Are you sure you want to delete <strong>{selectedRole?.name}</strong>? This action cannot be undone.
              Users assigned to this role will need to be reassigned.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDelete}
            disabled={selectedRole?.isSystem}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onClose={() => setPermissionsDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Manage Permissions - {selectedRole?.name}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Select the permissions that should be granted to users with this role.
          </Alert>
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {['User Management', 'Customer Management', 'Loan Management', 'Recovery Operations', 'Communication', 'Reports', 'Settings'].map((category) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>{category}</Typography>
                <Grid container spacing={1}>
                  {['View', 'Create', 'Edit', 'Delete', 'Export'].map((permission) => (
                    <Grid item xs={12} sm={6} md={4} key={permission}>
                      <FormControlLabel
                        control={<Switch size="small" defaultChecked={permission === 'View'} />}
                        label={permission}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Permissions</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
