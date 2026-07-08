import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface BusinessUnit {
  id?: string;
  code: string;
  name: string;
  type: string;
  parent_id?: string;
  manager_id?: string;
  location?: string;
  description?: string;
}

interface Step3Props {
  data: any;
  updateData: (data: any) => void;
}

const Step3BusinessUnits: React.FC<Step3Props> = ({ data, updateData }) => {
  const defaultBusinessUnits = [
    { code: 'COL', name: 'Collections', type: 'department', description: 'Collections department' },
    { code: 'FO', name: 'Field Operations', type: 'department', description: 'Field operations' },
    { code: 'LEGAL', name: 'Legal', type: 'department', description: 'Legal department' }
  ];

  const normalizeBusinessUnit = (unit: any): BusinessUnit => ({
    code: unit?.code || unit?.business_unit_code || '',
    name: unit?.name || unit?.business_unit_name || '',
    type: (unit?.type || unit?.business_unit_type || 'department').toLowerCase(),
    description: unit?.description || ''
  });

  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>(() => {
    const domainDefaults = Array.isArray(data.selectedDomainPackDefaults?.defaultBusinessUnits)
      ? data.selectedDomainPackDefaults.defaultBusinessUnits.map(normalizeBusinessUnit)
      : [];

    return domainDefaults.length > 0
      ? domainDefaults
      : (Array.isArray(data.businessUnits) && data.businessUnits.length > 0
          ? data.businessUnits.map(normalizeBusinessUnit)
          : defaultBusinessUnits.map(normalizeBusinessUnit));
  });
  const [hasAppliedDomainDefaults, setHasAppliedDomainDefaults] = useState(false);

  const unitTypes = [
    { value: 'company', label: 'Company' },
    { value: 'division', label: 'Division' },
    { value: 'department', label: 'Department' },
    { value: 'branch', label: 'Branch' },
    { value: 'team', label: 'Team' }
  ];

  useEffect(() => {
    const domainDefaults = Array.isArray(data.selectedDomainPackDefaults?.defaultBusinessUnits)
      ? data.selectedDomainPackDefaults.defaultBusinessUnits.map(normalizeBusinessUnit)
      : [];

    if (domainDefaults.length > 0 && !hasAppliedDomainDefaults) {
      setBusinessUnits(domainDefaults);
      setHasAppliedDomainDefaults(true);
      updateData({ businessUnits: domainDefaults });
    }
  }, [data.selectedDomainPackDefaults, hasAppliedDomainDefaults, updateData]);

  useEffect(() => {
    updateData({ businessUnits });
  }, [businessUnits, updateData]);

  const addBusinessUnit = () => {
    setBusinessUnits([
      ...businessUnits,
      {
        code: '',
        name: '',
        type: 'department',
        description: ''
      }
    ]);
  };

  const removeBusinessUnit = (index: number) => {
    const updated = [...businessUnits];
    updated.splice(index, 1);
    setBusinessUnits(updated);
  };

  const updateBusinessUnit = (index: number, field: keyof BusinessUnit, value: any) => {
    const updated = [...businessUnits];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessUnits(updated);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
        Configure Business Units
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Set up your organization's business units. You can add departments, branches, teams, and more.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<Add />}
          variant="outlined"
          onClick={addBusinessUnit}
          sx={{
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            '&:hover': { borderColor: '#6366f1' }
          }}
        >
          Add Business Unit
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {businessUnits.map((unit, index) => (
          <Card
            key={`${unit.code || 'unit'}-${index}`}
            sx={{
              bgcolor: 'rgba(24,24,27,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Code"
                  value={unit.code}
                  onChange={(e) => updateBusinessUnit(index, 'code', e.target.value)}
                  sx={{ flex: 1, minWidth: 120 }}
                  InputProps={{ sx: { color: 'white' } }}
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                />
                <TextField
                  label="Name"
                  value={unit.name}
                  onChange={(e) => updateBusinessUnit(index, 'name', e.target.value)}
                  sx={{ flex: 2, minWidth: 200 }}
                  InputProps={{ sx: { color: 'white' } }}
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                />
                <FormControl sx={{ flex: 1, minWidth: 150 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Type</InputLabel>
                  <Select
                    value={unit.type}
                    label="Type"
                    onChange={(e) => updateBusinessUnit(index, 'type', e.target.value)}
                    sx={{ color: 'white' }}
                  >
                    {unitTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton
                  color="error"
                  onClick={() => removeBusinessUnit(index)}
                  disabled={businessUnits.length <= 1}
                >
                  <Delete />
                </IconButton>
              </Box>
              <TextField
                label="Description"
                value={unit.description || ''}
                onChange={(e) => updateBusinessUnit(index, 'description', e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                InputProps={{ sx: { color: 'white' } }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Step3BusinessUnits;
