import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DynamicSidebar from '../components/layout/DynamicSidebar';
import AppHeader from '../components/layout/AppHeader';
import Breadcrumb from '../components/layout/Breadcrumb';
import { CircularProgress, Box } from '@mui/material';
import { cn } from '../utils/cn';

export const NewMainLayout: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        className="bg-zinc-950"
      >
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <DynamicSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AppHeader
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className={cn(
            'p-6 lg:p-8 transition-all duration-300',
            sidebarCollapsed ? 'lg:pl-8' : 'lg:pl-8'
          )}>
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb />
            </div>

            {/* Page Content */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewMainLayout;
