import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSetupCheck } from '../../hooks/useSetupCheck';

interface SetupGuardProps {
  children: React.ReactNode;
}

export const SetupGuard: React.FC<SetupGuardProps> = ({ children }) => {
  const { isChecking } = useSetupCheck();

  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#09090b',
        }}
      >
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  return <>{children}</>;
};

export default SetupGuard;
