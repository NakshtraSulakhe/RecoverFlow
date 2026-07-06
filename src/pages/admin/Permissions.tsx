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
  InputAdornment,
} from '@mui/material';
import {
  MoreVertical,
  Search,
  Plus,
  Edit,
  Trash2,
  KeyRound,
  Shield,
  Copy,
  Lock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { DataPageLayout } from '../../components/common/DataPageLayout';

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  roles: string[];
  isSystem: boolean;
}

const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'View Users',
    code: 'users.view',
    description: 'View user list and details',
    category: 'User Management',
    roles: ['Tenant Admin', 'Recovery Manager', 'Team Leader'],
    isSystem: true,
  },
  {
    id: '2',
    name: 'Create Users',
    code: 'users.create',
    description: 'Create new user accounts',
    category: 'User Management',
    roles: ['Tenant Admin'],
    isSystem: true,
  },
  {
    id: '3',
    name: 'Edit Users',
    code: 'users.edit',
    description: 'Edit user information and settings',
    category: 'User Management',
    roles: ['Tenant Admin'],
    isSystem: true,
  },
  {
    id: '4',
    name: 'Delete Users',
    code: 'users.delete',
    description: 'Delete user accounts',
    category: 'User Management',
    roles: ['Tenant Admin'],
    isSystem: true,
  },
  {
    id: '5',
    name: 'View Customers',
    code: 'customers.view',
    description: 'View customer profiles and information',
    category: 'Customer Management',
    roles: ['Tenant Admin', 'Recovery Manager', 'Team Leader', 'Recovery Agent', 'Read Only'],
    isSystem: true,
  },
  {
    id: '6',
    name: 'Manage Customers',
    code: 'customers.manage',
    description: 'Create, edit, and delete customer records',
    category: 'Customer Management',
    roles: ['Tenant Admin', 'Recovery Manager'],
    isSystem: true,
  },
  {
    id: '7',
    name: 'View Loans',
    code: 'loans.view',
    description: 'View loan portfolio and details',
    category: 'Loan Management',
    roles: ['Tenant Admin', 'Recovery Manager', 'Team Leader', 'Recovery Agent', 'Read Only'],
    isSystem: true,
  },
  {
    id: '8',
    name: 'Manage Loans',
    code: 'loans.manage',
    description: 'Create, edit, and delete loan records',
    category: 'Loan Management',
    roles: ['Tenant Admin', 'Recovery Manager'],
    isSystem: true,
  },
  {
    id: '9',
    name: 'View Recovery Cases',
    code: 'cases.view',
    description: 'View recovery case details and status',
    category: 'Recovery Operations',
    roles: ['Tenant Admin', 'Recovery Manager', 'Team Leader', 'Recovery Agent', 'Legal Officer', 'Read Only'],
    isSystem: true,
  },
  {
    id: '10',
    name: 'Manage Recovery Cases',
    code: 'cases.manage',
    description: 'Create, assign, and manage recovery cases',
    category: 'Recovery Operations',
    roles: ['Tenant Admin', 'Recovery Manager', 'Team Leader'],
    isSystem: true,
  },
  {
    id: '11',
    name: 'View Reports',
    code: 'reports.view',
    description: 'Access reports and analytics',
    category: 'Reports',
    roles: ['Tenant Admin', 'Recovery Manager', 'Team Leader', 'QA', 'Auditor', 'Read Only'],
    isSystem: true,
  },
  {
    id: '12',
    name: 'Export Reports',
    code: 'reports.export',
    description: 'Export reports in various formats',
    category: 'Reports',
    roles: ['Tenant Admin', 'Recovery Manager'],
    isSystem: true,
  },
];

const columns = [
  { id: 'name', label: 'Permission', sortable: true },
  { id: 'code', label: 'Permission Code', sortable: true },
  { id: 'category', label: 'Category', sortable: true },
  { id: 'roles', label: 'Assigned Roles', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'actions', label: 'Actions', align: 'right' as const },
];

export default function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(permissions.map(p => p.category)))];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, permission: Permission) => {
    setAnchorEl(event.currentTarget);
    setSelectedPermission(permission);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPermission(null);
  };

  const handleAddPermission = () => {
    setAddDialogOpen(true);
  };

  const handleEditPermission = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDeletePermission = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDuplicatePermission = () => {
    handleMenuClose();
    if (selectedPermission) {
      const newPermission = {
        ...selectedPermission,
        id: `${Date.now()}`,
        name: `${selectedPermission.name} (Copy)`,
        code: `${selectedPermission.code}_copy`,
        isSystem: false,
      };
      setPermissions([...permissions, newPermission]);
    }
  };

  const confirmDelete = () => {
    if (selectedPermission && !selectedPermission.isSystem) {
      setPermissions(permissions.filter(p => p.id !== selectedPermission.id));
    }
    setDeleteDialogOpen(false);
    setSelectedPermission(null);
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = 
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || permission.category ===过滤Category;
    return matchesSearch && matchesCategory;
  });

  const renderRow = (permission: Permission) => ({
    name: (
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{permission.name}</Typography>
        <Typography variant="caption" color="text.secondary">{permission.description}</Typography>
      </Box>
    ),
    code: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <KeyRound sx={{ fontSize: 14, color: 'text.secondary' }} />
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{permission.code}</Typography>
      </Box>
    ),
    category: (
      <Chip label={permission.category} size="small" variant="outlined" />
    ),
    roles: (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {permission.roles.slice(0, 2).map((role) => (
          <Chip key={role} label={role} size="small" sx={{ height: 20, fontSize: 10 }} />
        ))}
        {permission.roles.length > 2 && (
          <Chip label={`+${permission.roles.length - 2}`} size="small" sx={{ height: 20, fontSize: 10 }} />
        )}
      </Box>
    ),
    status: (
      <Box display="flex" alignItems="center" gap={1}>
        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
        <Typography variant="body2">Active</Typography>
      </Box>
    ),
    actions: (
      <IconButton onClick={(e) => handleMenuClick(e, permission)} size="small">
        <MoreVertical sx={{ fontSize: 18 }} />
      </IconButton>
    ),
  });

  return (
    <>
      <DataPageLayout
        title="Permissions"
        subtitle="Define and manage granular permissions for role-based access control."
        columns={columns}
        data={filteredPermissions}
        renderRow={renderRow}
        primaryAction={{ label: 'Add Permission', onClick: handleAddPermission, icon: Plus }}
        searchPlaceholder="Search permissions by name, code, or description..."
        onSearch={setSearchQuery}
        emptyState={{
          icon: <KeyRound sx={{ fontSize: 48, color: 'text.disabled' }} />,
          title: 'No permissions yet',
          description: 'Create permissions to define granular access control for your organization.',
          actionLabel: 'Add Permission',
          onAction: handleAddPermission,
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
        <MenuItem onClick={handleEditPermission} disabled={selectedPermission?.isSystem}>
          <Edit sx={{ fontSize: 16, mr: 2 }} />
          Edit Permission
        </MenuItem>
        <MenuItem onClick={handleDuplicatePermission}>
          <Copy sx={{ fontSize: 16, mr: 2 }} />
          Duplicate Permission
        </MenuItem>
        <MenuItem 
          onClick={handleDeletePermission} 
          sx={{ color: 'error.main' }}
          disabled={selectedPermission?.isSystem}
        >
          <Trash2 sx={{ fontSize: 16, mr: 2 }} />
          Delete Permission
        </MenuItem>
      </Menu>

      {/* Add Permission Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Permission</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Permission Name"
                placeholder="e.g., Export Reports"
                size="small"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Permission Code"
                placeholder="e.g., reports.export"
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><KeyRound sx={{ fontSize: 16 }} /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Describe what this permission allows"
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                placeholder="e.g., Reports"
                size="small"
                select
                SelectProps={{ native: true }}
              >
                <option value="">Select category</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Permission</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Permission</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Permission Name"
                size="small"
                defaultValue={selectedPermission?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Permission Code"
                size="small"
                defaultValue={selectedPermission?.code}
                disabled={selectedPermission?.isSystem}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><KeyRound sx={{ fontSize: 16 }} /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                size="small"
                multiline
                rows={2}
                defaultValue={selectedPermission?.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                size="small"
                defaultValue={selectedPermission?.category}
                select
                SelectProps={{ native: true }}
              >
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </TextField>
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
        <DialogTitle>Delete Permission</DialogTitle>
        <DialogContent>
          {selectedPermission?.isSystem ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              System permissions cannot be deleted. You can only modify custom permissions.
            </Alert>
          ) : (
            <Typography variant="body2">
              Are you sure you want to delete <strong>{selectedPermission?.name}</strong>? This action cannot be undone.
              Roles using this permission will lose access to the associated functionality.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDelete}
            disabled={selectedPermission?.isSystem}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
