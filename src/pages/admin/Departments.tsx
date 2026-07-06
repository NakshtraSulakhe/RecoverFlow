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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Network,
  Users as UsersIcon,
  Building2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { DataPageLayout } from '../../components/common/DataPageLayout';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../services/axios/axios.config';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const columns = [
  { id: 'name', label: 'Department', sortable: true },
  { id: 'code', label: 'Code', sortable: true },
  { id: 'description', label: 'Description', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'actions', label: 'Actions', align: 'right' as const },
];

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/departments');
      if (response.data.success) {
        setDepartments(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load departments');
      }
    } catch (err) {
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, department: Department) => {
    setAnchorEl(event.currentTarget);
    setSelectedDepartment(department);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDepartment(null);
  };

  const handleAddDepartment = () => {
    setFormData({ name: '', code: '', description: '' });
    setAddDialogOpen(true);
  };

  const handleEditDepartment = () => {
    if (selectedDepartment) {
      setFormData({
        name: selectedDepartment.name,
        code: selectedDepartment.code,
        description: selectedDepartment.description,
      });
    }
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDeleteDepartment = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!selectedDepartment) return;
    try {
      const response = await axiosInstance.put(`/departments/${selectedDepartment.id}`, { is_active: !selectedDepartment.is_active });
      if (response.data.success) {
        toast.success(`Department ${selectedDepartment.is_active ? 'deactivated' : 'activated'} successfully`);
        loadDepartments();
      } else {
        toast.error(response.data.message || 'Failed to update department status');
      }
    } catch (err) {
      toast.error('Failed to update department status');
    }
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedDepartment) return;
    try {
      const response = await axiosInstance.delete(`/departments/${selectedDepartment.id}`);
      if (response.data.success) {
        toast.success('Department deleted successfully');
        loadDepartments();
      } else {
        toast.error(response.data.message || 'Failed to delete department');
      }
    } catch (err) {
      toast.error('Failed to delete department');
    }
    setDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleCreateDepartment = async () => {
    try {
      const response = await axiosInstance.post('/departments', formData);
      if (response.data.success) {
        toast.success('Department created successfully');
        setAddDialogOpen(false);
        loadDepartments();
      } else {
        toast.error(response.data.message || 'Failed to create department');
      }
    } catch (err) {
      toast.error('Failed to create department');
    }
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment) return;
    try {
      const response = await axiosInstance.put(`/departments/${selectedDepartment.id}`, formData);
      if (response.data.success) {
        toast.success('Department updated successfully');
        setEditDialogOpen(false);
        loadDepartments();
      } else {
        toast.error(response.data.message || 'Failed to update department');
      }
    } catch (err) {
      toast.error('Failed to update department');
    }
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    department.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRow = (department: Department) => ({
    name: (
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.50' }}>
          <Building2 size={20} />
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{department.name}</Typography>
          <Typography variant="caption" color="text.secondary">{department.description}</Typography>
        </Box>
      </Box>
    ),
    code: (
      <Typography variant="body2">{department.code}</Typography>
    ),
    description: (
      <Typography variant="body2" color="text.secondary">{department.description}</Typography>
    ),
    status: (
      <Chip
        label={department.is_active ? 'Active' : 'Inactive'}
        size="small"
        color={department.is_active ? 'success' : 'error'}
        icon={department.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
      />
    ),
    actions: (
      <IconButton onClick={(e) => handleMenuClick(e, department)} size="small">
        <MoreVertical size={18} />
      </IconButton>
    ),
  });

  return (
    <>
      <DataPageLayout
        title="Departments"
        subtitle="Organize your workforce into departments for better management and reporting."
        columns={columns}
        data={filteredDepartments}
        renderRow={renderRow}
        primaryAction={{ label: 'Add Department', onClick: handleAddDepartment }}
        searchPlaceholder="Search departments by name or description..."
        onSearch={setSearchQuery}
        emptyState={{
          icon: <Network size={48} />,
          title: 'No departments yet',
          description: 'Create departments to organize your organizational structure.',
          actionLabel: 'Add Department',
          onAction: handleAddDepartment,
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
        <MenuItem onClick={handleEditDepartment}>
          <Edit size={16} style={{ marginRight: 8 }} />
          Edit Department
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedDepartment?.is_active ? (
            <>
              <XCircle size={16} style={{ marginRight: 8 }} />
              Deactivate Department
            </>
          ) : (
            <>
              <CheckCircle size={16} style={{ marginRight: 8 }} />
              Activate Department
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDeleteDepartment} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete Department
        </MenuItem>
      </Menu>

      {/* Add Department Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department Name"
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateDepartment}>Create Department</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department Name"
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateDepartment}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete <strong>{selectedDepartment?.name}</strong>? This action cannot be undone.
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
