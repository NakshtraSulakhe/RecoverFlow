import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { organizationConfigService } from '../services/api/organizationConfigService';
import { isTenantRole } from '../utils/roles';

export const useSetupCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      // Only check for tenant roles
      if (!user || !isTenantRole(user.role)) {
        setIsChecking(false);
        return;
      }

      // Don't redirect if already on setup page
      if (location.pathname === '/app/setup') {
        setIsChecking(false);
        return;
      }

      try {
        const config = await organizationConfigService.getConfiguration();
        if (!config?.organizationSetupCompleted) {
          navigate('/app/setup', { replace: true });
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSetup();
  }, [user, location.pathname, navigate]);

  return { isChecking };
};
