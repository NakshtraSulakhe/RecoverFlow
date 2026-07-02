import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { initializeFromStorage } from '../redux/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import EnterpriseSidebar from '../components/layout/Sidebar/EnterpriseSidebar';
import EnterpriseHeader from '../components/layout/Header/EnterpriseHeader';
import { cn } from '../utils/cn';

interface EnterpriseLayoutProps {
  children?: React.ReactNode;
}

export const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = () => {
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { mode } = useTheme();

  // Initialize auth state from storage on mount
  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isDark = mode === 'dark';

  if (isLoading) {
    return (
      <div className={`flex h-screen items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto" />
          <p className={`mt-4 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`flex h-screen ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      {/* Sidebar */}
      <EnterpriseSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <EnterpriseHeader
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className={cn(
            'transition-all duration-300',
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
          )}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnterpriseLayout;
