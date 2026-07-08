import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';

interface Step7Props {
  data: any;
}

const Step7Review: React.FC<Step7Props> = ({ data }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
        Review & Complete
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Review your organization setup. Click "Complete Setup" when you're ready.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Organization Details */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Organization Details
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Business Name</Typography>
                <Typography sx={{ color: 'white', fontWeight: 500 }}>{data.businessName || 'Not set'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Country</Typography>
                <Typography sx={{ color: 'white', fontWeight: 500 }}>{data.country || 'Not set'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Timezone</Typography>
                <Typography sx={{ color: 'white', fontWeight: 500 }}>{data.timezone || 'UTC'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Currency</Typography>
                <Typography sx={{ color: 'white', fontWeight: 500 }}>{data.currency || 'USD'}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Domain Pack */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Domain Pack
            </Typography>
            <Typography sx={{ color: 'white', fontWeight: 500 }}>
              {data.selectedDomainPackId ? 'Selected' : 'Not selected'}
            </Typography>
          </CardContent>
        </Card>

        {/* Business Units */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Business Units
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.businessUnits && data.businessUnits.length > 0 ? (
                data.businessUnits.map((unit: any, idx: number) => (
                  <Chip
                    key={idx}
                    label={unit.name || unit.code || 'Unit'}
                    sx={{
                      bgcolor: 'rgba(99,102,241,0.2)',
                      color: '#a5b4fc'
                    }}
                  />
                ))
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>No business units configured</Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Modules */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Enabled Modules
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.enabledModules && data.enabledModules.length > 0 ? (
                data.enabledModules.map((mod: string, idx: number) => (
                  <Chip
                    key={idx}
                    label={mod}
                    sx={{
                      bgcolor: 'rgba(16,185,129,0.2)',
                      color: '#6ee7b7'
                    }}
                  />
                ))
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>No modules selected</Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Business Rules */}
        <Card sx={{ bgcolor: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Business Rules
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.workingDays && data.workingDays.length > 0 ? (
                data.workingDays.map((day: string, idx: number) => (
                  <Chip
                    key={idx}
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                    sx={{
                      bgcolor: 'rgba(245,158,11,0.2)',
                      color: '#fcd34d'
                    }}
                  />
                ))
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>No working days set</Typography>
              )}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Default Language</Typography>
              <Typography sx={{ color: 'white', fontWeight: 500 }}>{data.defaultLanguage || 'English'}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Step7Review;
