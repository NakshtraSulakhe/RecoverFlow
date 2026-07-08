import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Card,
  CardContent,
  FormGroup,
  Button,
  Stack,
  Divider,
  MenuItem,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';

interface Step6Props {
  data: any;
  updateData: (data: any) => void;
}

const Step6BusinessRules: React.FC<Step6Props> = ({ data, updateData }) => {
  const [workingDays, setWorkingDays] = useState<string[]>(
    data.workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  );
  const [defaultLanguage, setDefaultLanguage] = useState<string>(
    data.defaultLanguage || 'en'
  );
  const [slaConfig, setSlaConfig] = useState<Record<string, unknown>>(
    data.slaConfig || {
      responseTimeHours: 24,
      reminderDays: 3,
      autoEscalateHours: 72,
    }
  );
  const [approvalHierarchy, setApprovalHierarchy] = useState<Array<Record<string, unknown>>>(
    data.approvalHierarchy || [{ level: 1, role: 'tenant_admin' }]
  );

  useEffect(() => {
    updateData({
      workingDays,
      defaultLanguage,
      slaConfig,
      approvalHierarchy,
    });
  }, [workingDays, defaultLanguage, slaConfig, approvalHierarchy, updateData]);

  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ];

  const toggleWorkingDay = (day: string) => {
    const newDays = workingDays.includes(day)
      ? workingDays.filter(d => d !== day)
      : [...workingDays, day];
    setWorkingDays(newDays);
  };

  const updateSlaField = (field: string, value: string) => {
    setSlaConfig((prev) => ({ ...prev, [field]: value }));
  };

  const updateApprovalStep = (index: number, field: 'level' | 'role', value: string | number) => {
    setApprovalHierarchy((prev) => prev.map((step, currentIndex) => (
      currentIndex === index ? { ...step, [field]: value } : step
    )));
  };

  const addApprovalStep = () => {
    setApprovalHierarchy((prev) => [...prev, { level: prev.length + 1, role: 'recovery_manager' }]);
  };

  const removeApprovalStep = (index: number) => {
    setApprovalHierarchy((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
        Business Rules
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Configure your organization's business rules and preferences.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Working Days */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Working Days
            </Typography>
            <FormGroup row>
              {days.map((day) => (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={workingDays.includes(day.value)}
                      onChange={() => toggleWorkingDay(day.value)}
                      sx={{
                        color: '#6366f1',
                        '&.Mui-checked': { color: '#6366f1' }
                      }}
                    />
                  }
                  label={<Typography sx={{ color: 'white' }}>{day.label}</Typography>}
                />
              ))}
            </FormGroup>
          </CardContent>
        </Card>

        {/* Default Language */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Default Language
            </Typography>
            <TextField
              select
              label="Language"
              value={defaultLanguage}
              onChange={(e) => {
                setDefaultLanguage(e.target.value);
                updateData({ defaultLanguage: e.target.value });
              }}
              fullWidth
              SelectProps={{
                MenuProps: { sx: { color: 'white' } }
              }}
              InputProps={{ sx: { color: 'white' } }}
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} style={{ color: 'black' }}>
                  {lang.name}
                </option>
              ))}
            </TextField>
          </CardContent>
        </Card>

        {/* SLA Configuration */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              SLA & Escalation Rules
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Response time (hours)"
                type="number"
                value={slaConfig.responseTimeHours ?? 24}
                onChange={(e) => updateSlaField('responseTimeHours', e.target.value)}
                fullWidth
                InputProps={{ sx: { color: 'white' } }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
              />
              <TextField
                label="Reminder interval (days)"
                type="number"
                value={slaConfig.reminderDays ?? 3}
                onChange={(e) => updateSlaField('reminderDays', e.target.value)}
                fullWidth
                InputProps={{ sx: { color: 'white' } }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
              />
              <TextField
                label="Auto-escalate after (hours)"
                type="number"
                value={slaConfig.autoEscalateHours ?? 72}
                onChange={(e) => updateSlaField('autoEscalateHours', e.target.value)}
                fullWidth
                InputProps={{ sx: { color: 'white' } }}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Approval Hierarchy */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Approval Hierarchy
              </Typography>
              <Button startIcon={<Plus size={16} />} variant="outlined" onClick={addApprovalStep}>
                Add Step
              </Button>
            </Box>
            <Stack spacing={2}>
              {approvalHierarchy.map((step, index) => (
                <Box key={`${step.role}-${index}`} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Level"
                      type="number"
                      value={step.level ?? index + 1}
                      onChange={(e) => updateApprovalStep(index, 'level', Number(e.target.value))}
                      fullWidth
                      InputProps={{ sx: { color: 'white' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                    <TextField
                      select
                      label="Role"
                      value={step.role ?? 'recovery_manager'}
                      onChange={(e) => updateApprovalStep(index, 'role', e.target.value)}
                      fullWidth
                      InputProps={{ sx: { color: 'white' } }}
                      InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    >
                      <MenuItem value="tenant_admin">Tenant Admin</MenuItem>
                      <MenuItem value="recovery_manager">Recovery Manager</MenuItem>
                      <MenuItem value="legal_manager">Legal Manager</MenuItem>
                      <MenuItem value="finance_manager">Finance Manager</MenuItem>
                    </TextField>
                    <Button color="error" variant="outlined" startIcon={<Trash2 size={16} />} onClick={() => removeApprovalStep(index)}>
                      Remove
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Step6BusinessRules;
