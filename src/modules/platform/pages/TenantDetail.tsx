
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  Archive as ArchiveIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tenantService, Tenant } from '../../../services/api';
import { moduleService, TenantModuleWithInherited } from '../../../services/api/module.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';

const TenantDetail: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenantById(id!),
    enabled: !!id,
  });

  const { data: stats } = useQuery({
    queryKey: ['tenant-stats', id],
    queryFn: () => tenantService.getTenantStats(id!),
    enabled: !!id,
  });

  const { data: modulesData, isLoading: modulesLoading } = useQuery({
    queryKey: ['tenant-modules', id],
    queryFn: () => moduleService.getTenantModulesWithInherited(id!),
    enabled: !!id && tabValue === 2,
  });

  const suspendMutation = useMutation({
    mutationFn: () => tenantService.suspendTenant(id!),
    onSuccess: () => {
      toast.success('Tenant suspended successfully');
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to suspend tenant');
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => tenantService.activateTenant(id!),
    onSuccess: () => {
      toast.success('Tenant activated successfully');
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to activate tenant');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () => tenantService.archiveTenant(id!),
    onSuccess: () => {
      toast.success('Tenant archived successfully');
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to archive tenant');
    },
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({
      moduleId,
      data,
    }: {
      moduleId: string;
      data: {
        is_enabled: boolean;
        is_custom: boolean;
        overrides_subscription: boolean;
      };
    }) => moduleService.updateTenantModule(id!, moduleId, data),
    onSuccess: () => {
      toast.success('Module updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tenant-modules', id] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update module');
    },
  });

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center py-12">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    const apiMessage = (error as any)?.response?.data?.message;
    return (
      <Box className="p-6">
        <Alert severity="error">
          {apiMessage || (error instanceof Error ? error.message : 'Failed to load tenant')}
        </Alert>
      </Box>
    );
  }

  const tenant = data?.data as Tenant;

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'warning';
  };

  const getPlanName = (tier?: string) => {
    if (!tier) return 'N/A';
    const plans: Record<string, string> = {
      starter: 'Starter',
      professional: 'Professional',
      enterprise: 'Enterprise',
      custom: 'Custom',
    };
    return plans[tier] || tier;
  };

  const handleToggleModule = (module: TenantModuleWithInherited) => {
    const newEnabled = !module.tenant_enabled;
    updateModuleMutation.mutate({
      moduleId: module.id,
      data: {
        is_enabled: newEnabled,
        is_custom: module.is_custom,
        overrides_subscription: true,
      },
    });
  };

  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Box className="flex justify-between items-start mb-2">
          <Box>
            <Typography variant="h4" gutterBottom>
              {tenant.tenant_name}
            </Typography>
            <Box className="flex items-center gap-2">
              <Chip
                label={tenant.is_active ? 'Active' : 'Inactive'}
                color={getStatusColor(tenant.is_active)}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {tenant.tenant_code}
              </Typography>
            </Box>
          </Box>
          <Box className="flex gap-2">
            {tenant.is_active ? (
              <Button
                variant="outlined"
                color="warning"
                startIcon={<PauseIcon />}
                onClick={() => suspendMutation.mutate()}
                disabled={suspendMutation.isPending}
              >
                Suspend
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => activateMutation.mutate()}
                disabled={activateMutation.isPending}
              >
                Activate
              </Button>
            )}
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArchiveIcon />}
              onClick={() => archiveMutation.mutate()}
              disabled={archiveMutation.isPending}
            >
              Archive
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/platform/tenants/${id}/edit`)}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={3}>
          <Paper className="p-4 text-center">
            <Typography variant="h4" color="primary">
              {stats?.data?.users || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Users
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="p-4 text-center">
            <Typography variant="h4" color="primary">
              {stats?.data?.customers || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customers
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="p-4 text-center">
            <Typography variant="h4" color="primary">
              {stats?.data?.loans || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Loans
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="p-4 text-center">
            <Typography variant="h4" color="primary">
              {stats?.data?.cases || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cases
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        className="mb-4"
      >
        <Tab label="Details" />
        <Tab label="Subscriptions" />
        <Tab label="Modules" />
        <Tab label="Audit Logs" />
      </Tabs>

      {tabValue === 0 && (
        <Paper className="p-6">
          <Typography variant="h6" gutterBottom>
            Tenant Information
          </Typography>
          <Divider className="mb-4" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Legal Name
              </Typography>
              <Typography variant="body1">
                {tenant.legal_name || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Business Type
              </Typography>
              <Typography variant="body1">
                {(tenant.business_type || 'N/A').replace('_', ' ')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Contact Person
              </Typography>
              <Typography variant="body1">
                {tenant.contact_person || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Contact Email
              </Typography>
              <Typography variant="body1">
                {tenant.contact_email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">
                {tenant.phone || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Subscription Plan
              </Typography>
              <Typography variant="body1">
                {getPlanName(tenant.subscription_tier)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {new Date(tenant.created_at).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" gutterBottom>
              Tenant Modules
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toggle modules to enable/disable for this tenant
            </Typography>
          </div>
          <Divider className="mb-4" />

          {modulesLoading ? (
            <Box className="flex justify-center items-center py-12">
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {modulesData?.data?.map((module: TenantModuleWithInherited) => (
                <ListItem
                  key={module.id}
                  disablePadding
                  secondaryAction={
                    <Switch
                      edge="end"
                      checked={module.tenant_enabled}
                      onChange={() => handleToggleModule(module)}
                      disabled={updateModuleMutation.isPending}
                      icon={<ToggleOffIcon />}
                      checkedIcon={<ToggleOnIcon />}
                    />
                  }
                >
                  <ListItemButton>
                    <ListItemIcon>
                      {module.icon ? (
                        <span className="text-2xl">{module.icon}</span>
                      ) : module.requires_subscription_tier ? (
                        <LockIcon className="text-amber-500" />
                      ) : null}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{module.module_name}</span>
                          {module.is_core_module && (
                            <Chip label="Core" size="small" color="primary" />
                          )}
                          {module.is_add_on && (
                            <Chip label="Add-on" size="small" color="secondary" />
                          )}
                          {module.overrides_subscription && (
                            <Chip label="Overridden" size="small" color="info" />
                          )}
                        </div>
                      }
                      secondary={
                        <div className="flex flex-col gap-1">
                          <span>{module.description}</span>
                          <span className="text-xs text-zinc-500">
                            Category: {module.category}
                            {module.requires_subscription_tier &&
                              ` • Requires: ${getPlanName(
                                module.requires_subscription_tier
                              )}`}
                          </span>
                        </div>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default TenantDetail;
