import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useTenant, useCreateTenant, useUpdateTenant } from '../../hooks/useTenants';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  DollarSign,
  Calendar
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { toast } from 'react-toastify';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const TenantForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    tenant_code: '',
    tenant_name: '',
    legal_name: '',
    business_type: '',
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: tenant, isLoading } = useTenant(id!, { enabled: isEdit });
  const createMutation = useCreateTenant();
  const updateMutation = useUpdateTenant();

  React.useEffect(() => {
    if (isEdit && tenant?.data) {
      setFormData({
        tenant_code: tenant.data.tenant_code || '',
        tenant_name: tenant.data.tenant_name || '',
        legal_name: tenant.data.legal_name || '',
        business_type: tenant.data.business_type || '',
        contact_email: tenant.data.contact_email || '',
        contact_person: tenant.data.contact_person || '',
        phone: tenant.data.contact_phone || '',
        address: tenant.data.address || '',
        city: tenant.data.city || '',
        state: tenant.data.state || '',
        country: tenant.data.country || '',
        postal_code: tenant.data.postal_code || '',
        subdomain: tenant.data.subdomain || '',
        industry: tenant.data.industry || '',
        timezone: tenant.data.timezone || 'UTC',
        currency: tenant.data.currency || 'USD',
        gst_number: tenant.data.gst_number || '',
        pan_number: tenant.data.pan_number || '',
      });
    }
  }, [isEdit, tenant]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenant_code.trim()) {
      newErrors.tenant_code = 'Company code is required';
    }
    if (!formData.tenant_name.trim()) {
      newErrors.tenant_name = 'Company name is required';
    }
    if (!formData.legal_name.trim()) {
      newErrors.legal_name = 'Legal name is required';
    }
    if (!formData.business_type.trim()) {
      newErrors.business_type = 'Business type is required';
    }
    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id, data: formData });
        toast.success('Tenant updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Tenant created successfully');
      }
      navigate('/platform/tenants');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update tenant' : 'Failed to create tenant');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading && isEdit) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/platform/tenants')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
              {isEdit ? 'Edit Tenant' : 'Create New Tenant'}
            </h1>
            <p className={cn('text-sm', isDark ? 'text-zinc-500' : 'text-zinc-500')}>
              {isEdit ? 'Update tenant information' : 'Add a new company to the platform'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Company Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.tenant_code}
                  onChange={(e) => handleChange('tenant_code', e.target.value)}
                  placeholder="e.g., ACME001"
                  className={cn(errors.tenant_code && 'border-red-500')}
                />
                {errors.tenant_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.tenant_code}</p>
                )}
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.tenant_name}
                  onChange={(e) => handleChange('tenant_name', e.target.value)}
                  placeholder="e.g., Acme Corporation"
                  className={cn(errors.tenant_name && 'border-red-500')}
                />
                {errors.tenant_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.tenant_name}</p>
                )}
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Legal Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.legal_name}
                  onChange={(e) => handleChange('legal_name', e.target.value)}
                  placeholder="e.g., Acme Corporation Pvt Ltd"
                  className={cn(errors.legal_name && 'border-red-500')}
                />
                {errors.legal_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.legal_name}</p>
                )}
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.business_type}
                  onChange={(e) => handleChange('business_type', e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-md border bg-transparent',
                    isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900',
                    errors.business_type && 'border-red-500'
                  )}
                >
                  <option value="">Select business type</option>
                  <option value="nbfc">NBFC</option>
                  <option value="bank">Bank</option>
                  <option value="fintech">Fintech</option>
                  <option value="collection_agency">Collection Agency</option>
                  <option value="other">Other</option>
                </select>
                {errors.business_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.business_type}</p>
                )}
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Industry
                </label>
                <Input
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  placeholder="e.g., Financial Services"
                />
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Subdomain
                </label>
                <Input
                  value={formData.subdomain}
                  onChange={(e) => handleChange('subdomain', e.target.value)}
                  placeholder="e.g., acme"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  placeholder="e.g., contact@acme.com"
                  className={cn(errors.contact_email && 'border-red-500')}
                />
                {errors.contact_email && (
                  <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>
                )}
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Contact Person
                </label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => handleChange('contact_person', e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="e.g., +1 234 567 8900"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  City
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g., New York"
                />
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  State
                </label>
                <Input
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="e.g., NY"
                />
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Postal Code
                </label>
                <Input
                  value={formData.postal_code}
                  onChange={(e) => handleChange('postal_code', e.target.value)}
                  placeholder="e.g., 10001"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Country
                </label>
                <Input
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="e.g., United States"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-md border bg-transparent',
                    isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                  )}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                </select>
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-md border bg-transparent',
                    isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                  )}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  GST Number
                </label>
                <Input
                  value={formData.gst_number}
                  onChange={(e) => handleChange('gst_number', e.target.value)}
                  placeholder="e.g., 29ABCDE1234F1Z5"
                />
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                  PAN Number
                </label>
                <Input
                  value={formData.pan_number}
                  onChange={(e) => handleChange('pan_number', e.target.value)}
                  placeholder="e.g., ABCDE1234F"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/platform/tenants')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : isEdit ? 'Update Tenant' : 'Create Tenant'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TenantForm;
