import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardConfig } from '../hooks/useDashboardConfig';
import { cn } from '../utils/cn';
import DashboardGrid from '../components/layout/Dashboard/DashboardGrid';
import DashboardHeader from '../components/layout/Dashboard/DashboardHeader';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { mode } = useTheme();
  const { dashboardConfig } = useDashboardConfig();
  const isDark = mode === 'dark';

  return (
    <div className={cn('min-h-screen', isDark ? 'bg-zinc-950' : 'bg-zinc-50')}>
      <DashboardHeader />
      
      <div className="p-6 lg:p-8">
        <DashboardGrid config={dashboardConfig} />
      </div>

      {children && (
        <div className="p-6 lg:p-8">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
