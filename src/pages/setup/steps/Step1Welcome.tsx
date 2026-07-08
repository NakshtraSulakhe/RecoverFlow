import React from 'react';
import { Box, TextField, Typography, MenuItem } from '@mui/material';

// Country options
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' }
];

// Timezone options
const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' }
];

// Currency options
const currencies = [
  { code: 'USD', name: 'USD - US Dollar' },
  { code: 'INR', name: 'INR - Indian Rupee' },
  { code: 'EUR', name: 'EUR - Euro' },
  { code: 'GBP', name: 'GBP - British Pound' },
  { code: 'CAD', name: 'CAD - Canadian Dollar' },
  { code: 'AUD', name: 'AUD - Australian Dollar' }
];

interface Step1Props {
  data: any;
  updateData: (data: any) => void;
}

const Step1Welcome: React.FC<Step1Props> = ({ data, updateData }) => {
  const handleChange = (field: string, value: any) => {
    updateData({ [field]: value });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
        Welcome to RecoverFlow
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Let's get your organization set up! Please provide some basic details about your company.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <TextField
          label="Business Name"
          value={data.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: '#6366f1' },
              '&.Mui-focused fieldset': { borderColor: '#6366f1' }
            }
          }}
        />
        <TextField
          label="Country"
          select
          value={data.country}
          onChange={(e) => handleChange('country', e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: '#6366f1' },
              '&.Mui-focused fieldset': { borderColor: '#6366f1' }
            }
          }}
        >
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.code} sx={{ color: 'inherit' }}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Timezone"
          select
          value={data.timezone}
          onChange={(e) => handleChange('timezone', e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: '#6366f1' },
              '&.Mui-focused fieldset': { borderColor: '#6366f1' }
            }
          }}
        >
          {timezones.map((tz) => (
            <MenuItem key={tz.value} value={tz.value} sx={{ color: 'inherit' }}>
              {tz.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Currency"
          select
          value={data.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: '#6366f1' },
              '&.Mui-focused fieldset': { borderColor: '#6366f1' }
            }
          }}
        >
          {currencies.map((currency) => (
            <MenuItem key={currency.code} value={currency.code} sx={{ color: 'inherit' }}>
              {currency.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export default Step1Welcome;
