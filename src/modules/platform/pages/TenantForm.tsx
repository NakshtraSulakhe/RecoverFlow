
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tenantService, Tenant } from '../../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const TenantForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<Tenant>>({
    tenant_code: '',
    tenant_name: '',
    legal_name: '',
    business_type: 'bank',
    contact_email: '',
    contact_person: '',
    phone: '',
  });

  const { data: tenantData, isLoading: loadingTenant, error: tenantError } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => (id ? tenantService.getTenantById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  useEffect(() => {
    if (tenantData?.data) {
      setFormData(tenantData.data);
    }
  }, [tenantData]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Tenant>) => tenantService.createTenant(data),
    onSuccess: () => {
      toast.success('Tenant created successfully');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      navigate('/platform/tenants');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create tenant');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Tenant>) => tenantService.updateTenant(id!, data),
    onSuccess: () => {
      toast.success('Tenant updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
      navigate('/platform/tenants');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update tenant');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isEdit && loadingTenant) {
    return (
      <Box className="flex justify-center items-center py-12">
        <CircularProgress />
      </Box>
    );
  }

  if (isEdit && tenantError) {
    return (
      <Box className="p-6">
        <Alert severity="error">
          {tenantError instanceof Error ? tenantError.message : 'Failed to load tenant'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Edit Tenant' : 'Create Tenant'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit ? 'Update tenant information' : 'Create a new tenant organization'}
        </Typography>
      </Box>

      <Paper className="p-6">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Tenant Code"
                name="tenant_code"
                value={formData.tenant_code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Tenant Name"
                name="tenant_name"
                value={formData.tenant_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Legal Name"
                name="legal_name"
                value={formData.legal_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Business Type</InputLabel>
                <Select
                  required
                  name="business_type"
                  value={formData.business_type}
                  label="Business Type"
                  onChange={handleChange}
                >
                  <MenuItem value="bank">Bank</MenuItem>
                  <MenuItem value="nbfc">NBFC</MenuItem>
                  <MenuItem value="collection_agency">Collection Agency</MenuItem>
                  <MenuItem value="fintech">Fintech</MenuItem>
                  <MenuItem value="lending_company">Lending Company</MenuItem>
                  <MenuItem value="microfinance">Microfinance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Contact Email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box className="mt-6 flex gap-4">
            <Button
              variant="outlined"
              onClick={() => navigate('/platform/tenants')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                isEdit ? 'Update Tenant' : 'Create Tenant'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TenantForm;
