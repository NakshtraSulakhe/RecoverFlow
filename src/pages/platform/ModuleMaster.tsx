import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/ThemeContext';
import { moduleService, Module } from '../../services/api/module.service';
import { cn } from '../../utils/cn';

export const ModuleMaster: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState<Partial<Module>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['modules', page, search, statusFilter, categoryFilter],
    queryFn: () => moduleService.getAllModules({
      page,
      limit: 20,
      search,
      status: statusFilter,
      category: categoryFilter,
    }),
  });

  const createMutation = useMutation({
    mutationFn: moduleService.createModule,
    onSuccess: () => {
      toast.success('Module created successfully');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      handleDialogClose();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create module');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Module> }) =>
      moduleService.updateModule(id, data),
    onSuccess: () => {
      toast.success('Module updated successfully');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      handleDialogClose();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update module');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: moduleService.deleteModule,
    onSuccess: () => {
      toast.success('Module deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete module');
    },
  });

  const handleCreate = () => {
    setEditingModule(null);
    setFormData({
      module_code: '',
      module_name: '',
      category: 'Core',
      description: '',
      icon: '',
      route: '',
      sort_order: 0,
      status: 'active',
      is_core_module: false,
      is_add_on: false,
      requires_subscription_tier: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({ ...module });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingModule(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModule) {
      updateMutation.mutate({ id: editingModule.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'warning';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" className={cn(isDark ? 'text-white' : 'text-zinc-900')}>
            Module Master
          </Typography>
          <Typography variant="body2" className={cn(isDark ? 'text-zinc-400' : 'text-zinc-600')}>
            Manage all available modules for tenants
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Module
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search modules..."
          className="w-64"
          InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }}
        />
        <FormControl size="small" className="w-48">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className="w-48">
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Core">Core</MenuItem>
            <MenuItem value="Recovery">Recovery</MenuItem>
            <MenuItem value="Communication">Communication</MenuItem>
            <MenuItem value="Reports">Reports</MenuItem>
            <MenuItem value="AI">AI</MenuItem>
            <MenuItem value="Legal">Legal</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Table */}
      {isLoading ? (
        <Box className="flex justify-center items-center py-12">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" className="mb-4">
          {error instanceof Error ? error.message : 'Failed to load modules'}
        </Alert>
      ) : (
        <>
          <Paper className={cn(isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Module Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Sort</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.map((module: Module) => (
                    <TableRow key={module.id} hover>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {module.icon && <span className="text-xl">{module.icon}</span>}
                          <div>
                            <div className="font-medium">{module.module_name}</div>
                            {module.description && (
                              <div className="text-xs text-zinc-500">{module.description}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{module.module_code}</TableCell>
                      <TableCell>{module.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={module.status}
                          color={getStatusColor(module.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {module.is_core_module && (
                            <Chip label="Core" size="small" color="primary" />
                          )}
                          {module.is_add_on && (
                            <Chip label="Add-on" size="small" color="secondary" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{module.sort_order}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEdit(module)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(module.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {data?.meta?.total_pages && data.meta.total_pages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                count={data.meta.total_pages}
                page={page}
                onChange={(_, value) => setPage(value)}
              />
            </div>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6">
            {editingModule ? 'Edit Module' : 'Create Module'}
          </Typography>
          <IconButton onClick={handleDialogClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Module Code"
                  value={formData.module_code || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, module_code: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Module Name"
                  value={formData.module_name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, module_name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    required
                    value={formData.category || ''}
                    label="Category"
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <MenuItem value="Core">Core</MenuItem>
                    <MenuItem value="Recovery">Recovery</MenuItem>
                    <MenuItem value="Communication">Communication</MenuItem>
                    <MenuItem value="Reports">Reports</MenuItem>
                    <MenuItem value="AI">AI</MenuItem>
                    <MenuItem value="Legal">Legal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Icon (emoji)"
                  value={formData.icon || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Route"
                  value={formData.route || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, route: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Sort Order"
                  value={formData.sort_order || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status || ''}
                    label="Status"
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                    }
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Requires Subscription Tier</InputLabel>
                  <Select
                    value={formData.requires_subscription_tier || ''}
                    label="Requires Subscription Tier"
                    onChange={(e) =>
                      setFormData({ ...formData, requires_subscription_tier: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="starter">Starter</MenuItem>
                    <MenuItem value="professional">Professional</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Is Core Module</InputLabel>
                  <Select
                    value={formData.is_core_module ? 'true' : 'false'}
                    label="Is Core Module"
                    onChange={(e) =>
                      setFormData({ ...formData, is_core_module: e.target.value === 'true' })
                    }
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Is Add-on</InputLabel>
                  <Select
                    value={formData.is_add_on ? 'true' : 'false'}
                    label="Is Add-on"
                    onChange={(e) =>
                      setFormData({ ...formData, is_add_on: e.target.value === 'true' })
                    }
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              editingModule ? 'Update' : 'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModuleMaster;
