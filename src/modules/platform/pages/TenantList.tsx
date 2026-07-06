
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tenantService, Tenant } from '../../../services/api';
import { useQuery } from '@tanstack/react-query';

const TenantList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tenants', page, pageSize, search, statusFilter],
    queryFn: () => tenantService.getAllTenants({ page, limit: pageSize, search, status: statusFilter }),
  });

  const handleStatusChange = async (id: string, action: 'suspend' | 'activate' | 'archive') => {
    try {
      if (action === 'suspend') {
        await tenantService.suspendTenant(id);
      } else if (action === 'activate') {
        await tenantService.activateTenant(id);
      } else if (action === 'archive') {
        await tenantService.archiveTenant(id);
      }
      toast.success(`Tenant ${action}d successfully`);
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update tenant status');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tenant?')) {
      try {
        await tenantService.deleteTenant(id);
        toast.success('Tenant deleted successfully');
        refetch();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete tenant');
      }
    }
  };

  const getStatusColor = (status?: string, isActive?: boolean) => {
    if (isActive === false) {
      return 'warning';
    }
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'warning';
      case 'terminated':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPlanName = (tier?: string) => {
    if (!tier) return 'N/A';
    const plans: Record<string, string> = {
      starter: 'Starter',
      professional: 'Professional',
      enterprise: 'Enterprise',
      custom: 'Custom'
    };
    return plans[tier] || tier;
  };

  return (
    <Box className="p-6">
      <Box className="mb-6 flex justify-between items-center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Tenant Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all tenant organizations
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/platform/tenants/new')}
        >
          Create Tenant
        </Button>
      </Box>

      <Box className="mb-4 flex flex-wrap gap-4 items-center">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tenants..."
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
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box className="flex justify-center items-center py-12">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" className="mb-4">
          {error instanceof Error ? error.message : 'Failed to load tenants'}
        </Alert>
      ) : (
        <>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Business Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Subscription</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.map((tenant: Tenant) => (
                    <TableRow key={tenant.id} hover>
                      <TableCell className="font-medium">{tenant.tenant_name}</TableCell>
                      <TableCell>{tenant.tenant_code}</TableCell>
                      <TableCell>
                        {(tenant.business_type || 'N/A').replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tenant.is_active ? 'Active' : 'Inactive'}
                          color={getStatusColor(tenant.subscription_status, tenant.is_active)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{getPlanName(tenant.subscription_tier)}</TableCell>
                      <TableCell>
                        {new Date(tenant.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/platform/tenants/${tenant.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/platform/tenants/${tenant.id}/edit`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(tenant.id)}
                        >
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
            <Box className="mt-4 flex justify-center">
              <Pagination
                count={data.meta.total_pages}
                page={page}
                onChange={(_, value) => setPage(value)}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default TenantList;
