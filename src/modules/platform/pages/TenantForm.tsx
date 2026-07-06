
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
  Divider,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tenantService, Tenant } from '../../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CreateTenantPayload extends Partial<Tenant> {
  admin_first_name?: string;
  admin_last_name?: string;
  admin_email?: string;
  admin_password?: string;
}

const TENANT_FIELDS = [
  'tenant_code', 'tenant_name', 'legal_name', 'business_type', 'contact_email',
  'contact_person', 'phone', 'address', 'city', 'state', 'country', 'postal_code',
  'subdomain', 'industry', 'timezone', 'currency', 'gst_number', 'pan_number',
] as const;

const TenantForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateTenantPayload>({
    tenant_code: '',
    tenant_name: '',
    legal_name: '',
    business_type: 'bank',
    contact_email: '',
    contact_person: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    subdomain: '',
    industry: '',
    timezone: 'UTC',
    currency: 'USD',
    gst_number: '',
    pan_number: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: tenantData, isLoading: loadingTenant, error: tenantError } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => (id ? tenantService.getTenantById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  useEffect(() => {
    if (tenantData?.data) {
      const tenant = tenantData.data;
      setFormData((prev) => ({
        ...prev,
        tenant_code: tenant.tenant_code || '',
        tenant_name: tenant.tenant_name || '',
        legal_name: tenant.legal_name || '',
        business_type: tenant.business_type || 'bank',
        contact_email: tenant.contact_email || '',
        contact_person: tenant.contact_person || '',
        phone: tenant.contact_phone || tenant.phone || '',
        address: tenant.address || '',
        city: tenant.city || '',
        state: tenant.state || '',
        country: tenant.country || '',
        postal_code: tenant.postal_code || '',
        subdomain: tenant.subdomain || '',
        industry: tenant.industry || '',
        timezone: tenant.timezone || 'UTC',
        currency: tenant.currency || 'USD',
        gst_number: tenant.gst_number || '',
        pan_number: tenant.pan_number || '',
      }));
    }
  }, [tenantData]);

  const createMutation = useMutation({
    mutationFn: (data: CreateTenantPayload) => tenantService.createTenant(data),
    onSuccess: () => {
      toast.success('Tenant and admin account created successfully');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      navigate('/platform/tenants');
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || err.message || 'Failed to create tenant';
      toast.error(message);
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
      const message = err?.response?.data?.message || err.message || 'Failed to update tenant';
      toast.error(message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    let name: string;
    let value: string;

    if ('target' in e && 'name' in (e.target as HTMLInputElement)) {
      name = (e.target as HTMLInputElement).name;
      value = (e.target as HTMLInputElement).value;
    } else {
      name = 'business_type';
      value = (e as SelectChangeEvent).target.value;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenant_code?.trim()) newErrors.tenant_code = 'Tenant code is required';
    if (!formData.tenant_name?.trim()) newErrors.tenant_name = 'Tenant name is required';
    if (!formData.legal_name?.trim()) newErrors.legal_name = 'Legal name is required';
    if (!formData.business_type?.trim()) newErrors.business_type = 'Business type is required';
    if (!formData.contact_email?.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }

    if (!isEdit) {
      if (!formData.admin_first_name?.trim()) newErrors.admin_first_name = 'Admin first name is required';
      if (!formData.admin_last_name?.trim()) newErrors.admin_last_name = 'Admin last name is required';
      if (!formData.admin_email?.trim()) {
        newErrors.admin_email = 'Admin email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin_email)) {
        newErrors.admin_email = 'Invalid email format';
      }
      if (!formData.admin_password?.trim()) {
        newErrors.admin_password = 'Admin password is required';
      } else if (formData.admin_password.length < 8) {
        newErrors.admin_password = 'Password must be at least 8 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildTenantPayload = (): Partial<Tenant> => {
    const payload: Partial<Tenant> = {};
    for (const field of TENANT_FIELDS) {
      const value = formData[field];
      if (value !== undefined && value !== '') {
        (payload as Record<string, unknown>)[field] = value;
      }
    }
    return payload;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (isEdit) {
      updateMutation.mutate(buildTenantPayload());
    } else {
      createMutation.mutate({
        ...buildTenantPayload(),
        admin_first_name: formData.admin_first_name,
        admin_last_name: formData.admin_last_name,
        admin_email: formData.admin_email,
        admin_password: formData.admin_password,
      });
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
          {(tenantError as any)?.response?.data?.message ||
            (tenantError instanceof Error ? tenantError.message : 'Failed to load tenant')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="p-6 max-w-4xl mx-auto">
      <Box className="mb-6">
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Edit Tenant' : 'Create Tenant'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit
            ? 'Update tenant organization information'
            : 'Create a new tenant organization and its admin login credentials'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Information */}
        <Paper className="p-6">
          <Typography variant="h6" gutterBottom>
            Organization Information
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            Basic company and contact details for the tenant
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Tenant Code"
                name="tenant_code"
                value={formData.tenant_code}
                onChange={handleChange}
                error={!!errors.tenant_code}
                helperText={errors.tenant_code || 'Unique identifier, e.g. ACME001'}
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
                error={!!errors.tenant_name}
                helperText={errors.tenant_name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Legal Name"
                name="legal_name"
                value={formData.legal_name}
                onChange={handleChange}
                error={!!errors.legal_name}
                helperText={errors.legal_name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.business_type}>
                <InputLabel>Business Type</InputLabel>
                <Select
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
                error={!!errors.contact_email}
                helperText={errors.contact_email}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subdomain"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                helperText="Optional subdomain for tenant portal"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Address */}
        <Paper className="p-6">
          <Typography variant="h6" gutterBottom>
            Address
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  name="timezone"
                  value={formData.timezone}
                  label="Timezone"
                  onChange={(e) => setFormData((prev) => ({ ...prev, timezone: e.target.value }))}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                  <MenuItem value="America/New_York">America/New_York</MenuItem>
                  <MenuItem value="Europe/London">Europe/London</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  label="Currency"
                  onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Tenant Admin Credentials — create only */}
        {!isEdit && (
          <Paper className="p-6">
            <Typography variant="h6" gutterBottom>
              Tenant Admin Credentials
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mb-4">
              Create the initial tenant admin account. This user will log in at the tenant portal with these credentials.
            </Typography>
            <Divider className="mb-4" />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Admin First Name"
                  name="admin_first_name"
                  value={formData.admin_first_name}
                  onChange={handleChange}
                  error={!!errors.admin_first_name}
                  helperText={errors.admin_first_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Admin Last Name"
                  name="admin_last_name"
                  value={formData.admin_last_name}
                  onChange={handleChange}
                  error={!!errors.admin_last_name}
                  helperText={errors.admin_last_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Admin Login Email"
                  name="admin_email"
                  type="email"
                  value={formData.admin_email}
                  onChange={handleChange}
                  error={!!errors.admin_email}
                  helperText={errors.admin_email || 'Used for tenant admin sign-in'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Admin Password"
                  name="admin_password"
                  type="password"
                  value={formData.admin_password}
                  onChange={handleChange}
                  error={!!errors.admin_password}
                  helperText={errors.admin_password || 'Minimum 8 characters'}
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        <Box className="flex gap-4">
          <Button variant="outlined" onClick={() => navigate('/platform/tenants')}>
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
            ) : isEdit ? (
              'Update Tenant'
            ) : (
              'Create Tenant & Admin'
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default TenantForm;
