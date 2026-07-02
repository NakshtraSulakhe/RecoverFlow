import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { user, tenant } = useAuth();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {getGreeting()}, {user?.first_name || 'User'}!
          </h1>
          <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-600'} mt-1`}>
            Here's what's happening with {tenant?.tenant_name || 'your organization'} today.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200'
            )}
          >
            <Icons.RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <button
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-indigo-500 hover:bg-indigo-600 text-white'
            )}
          >
            <Icons.Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
