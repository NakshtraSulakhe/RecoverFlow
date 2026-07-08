import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { domainPackService, DomainPack } from '../../../services/api/domainPackService';

interface Step2Props {
  data: any;
  updateData: (data: any) => void;
}

const Step2DomainPack: React.FC<Step2Props> = ({ data, updateData }) => {
  const [domainPacks, setDomainPacks] = useState<DomainPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomainPacks = async () => {
      try {
        const packs = await domainPackService.getDomainPacks();
        setDomainPacks(packs || []);

        if (!data.selectedDomainPackId && packs?.length) {
          const defaultPack = packs[0];
          handlePackSelection(defaultPack.id, packs);
        }
      } catch (err) {
        console.error('Error fetching domain packs:', err);
        setError('Failed to load domain packs');
      } finally {
        setLoading(false);
      }
    };

    fetchDomainPacks();
  }, []);

  const normalizeStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === 'string');
  };

  const handlePackSelection = (packId: string, packs: DomainPack[] = domainPacks) => {
    const selectedPack = packs.find((pack) => pack.id === packId);

    updateData({
      selectedDomainPackId: packId,
      selectedDomainPackDefaults: {
        defaultModules: normalizeStringArray(selectedPack?.defaultModules),
        defaultBusinessUnits: Array.isArray(selectedPack?.defaultBusinessUnits) ? selectedPack.defaultBusinessUnits : [],
        defaultWorkflows: Array.isArray(selectedPack?.defaultWorkflows) ? selectedPack.defaultWorkflows : []
      }
    });
  };

  const getPackName = (pack: DomainPack) => pack.packName || (pack as any).pack_name || 'Unnamed pack';
  const getPackDescription = (pack: DomainPack) => pack.description || '';

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
        Choose a Domain Pack
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Select a pre-configured domain pack tailored for your industry. You can customize everything later.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
        {domainPacks.map((pack) => {
          const defaultModules = normalizeStringArray(pack.defaultModules);

          return (
            <Card
              key={pack.id}
              sx={{
                bgcolor: data.selectedDomainPackId === pack.id ? 'rgba(99,102,241,0.1)' : 'rgba(24,24,27,0.8)',
                border: data.selectedDomainPackId === pack.id ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#6366f1',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardActionArea onClick={() => handlePackSelection(pack.id)} sx={{ p: 0 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                    {getPackName(pack)}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 2, fontSize: '0.9rem' }}>
                    {getPackDescription(pack)}
                  </Typography>

                  {defaultModules.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      {defaultModules.slice(0, 5).map((mod, idx) => (
                        <Chip
                          key={`${pack.id}-${idx}`}
                          label={mod}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(99,102,241,0.2)',
                            color: '#a5b4fc'
                          }}
                        />
                      ))}
                      {defaultModules.length > 5 && (
                        <Chip
                          label={`+${defaultModules.length - 5} more`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)'
                          }}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default Step2DomainPack;
