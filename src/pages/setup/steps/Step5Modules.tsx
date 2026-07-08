import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert
} from '@mui/material';
import { axiosInstance } from '../../../services/axios';

interface Module {
  id: string;
  module_code: string;
  module_name: string;
  description: string;
  is_core: boolean;
  is_active: boolean;
}

interface Step5Props {
  data: any;
  updateData: (data: any) => void;
}

const Step5Modules: React.FC<Step5Props> = ({ data, updateData }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enabledModules, setEnabledModules] = useState<string[]>(data.enabledModules || []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axiosInstance.get('/modules');
        const moduleData = response.data.data || [];
        setModules(moduleData);

        const coreModuleCodes = moduleData
          .filter((m: Module) => m.is_core)
          .map((m: Module) => m.module_code);

        const defaultModuleCodes = Array.isArray(data.selectedDomainPackDefaults?.defaultModules)
          ? data.selectedDomainPackDefaults.defaultModules
          : [];

        const initialEnabled = [...new Set([...(data.enabledModules || []), ...defaultModuleCodes, ...coreModuleCodes])];
        setEnabledModules(initialEnabled);
        updateData({ enabledModules: initialEnabled });
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules');
        const mockModules = [
          { id: '1', module_code: 'CUSTOMERS', module_name: 'Customers', description: 'Customer management', is_core: true, is_active: true },
          { id: '2', module_code: 'ACCOUNTS', module_name: 'Accounts', description: 'Account management', is_core: true, is_active: true },
          { id: '3', module_code: 'RECOVERY', module_name: 'Recovery', description: 'Recovery cases', is_core: true, is_active: true },
          { id: '4', module_code: 'FIELD_VISITS', module_name: 'Field Visits', description: 'Field visit management', is_core: false, is_active: true },
          { id: '5', module_code: 'DIALER', module_name: 'Dialer', description: 'Integrated dialer', is_core: false, is_active: true },
          { id: '6', module_code: 'SMS', module_name: 'SMS', description: 'SMS communication', is_core: false, is_active: true },
          { id: '7', module_code: 'PAYMENTS', module_name: 'Payments', description: 'Payment processing', is_core: true, is_active: true },
          { id: '8', module_code: 'REPORTS', module_name: 'Reports', description: 'Reports & analytics', is_core: true, is_active: true },
          { id: '9', module_code: 'AI', module_name: 'AI', description: 'AI-powered features', is_core: false, is_active: true }
        ];
        setModules(mockModules);
        const coreModuleCodes = mockModules.filter((m) => m.is_core).map((m) => m.module_code);
        const defaultModuleCodes = Array.isArray(data.selectedDomainPackDefaults?.defaultModules)
          ? data.selectedDomainPackDefaults.defaultModules
          : [];
        const initialEnabled = [...new Set([...(data.enabledModules || []), ...defaultModuleCodes, ...coreModuleCodes])];
        setEnabledModules(initialEnabled);
        updateData({ enabledModules: initialEnabled });
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const toggleModule = (moduleCode: string, isCore: boolean) => {
    if (isCore) return;

    setEnabledModules((prev) => {
      const newEnabled = prev.includes(moduleCode)
        ? prev.filter((m) => m !== moduleCode)
        : [...prev, moduleCode];
      updateData({ enabledModules: newEnabled });
      return newEnabled;
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ bgcolor: 'rgba(239,68,68,0.1)' }}>{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
        Enable Modules
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Select which modules to enable for your organization. Core modules cannot be disabled.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {modules.map((module) => (
          <Card
            key={module.id}
            sx={{
              bgcolor: 'rgba(24,24,27,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enabledModules.includes(module.module_code)}
                    onChange={() => toggleModule(module.module_code, module.is_core)}
                    disabled={module.is_core}
                    sx={{
                      color: '#6366f1',
                      '&.Mui-checked': { color: '#6366f1' }
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ color: 'white', fontWeight: 600 }}>
                      {module.module_name}
                      {module.is_core && (
                        <Typography component="span" sx={{ color: '#10b981', ml: 1, fontSize: '0.8rem' }}>
                          (Core)
                        </Typography>
                      )}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {module.description}
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Step5Modules;
