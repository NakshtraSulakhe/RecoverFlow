import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';
import { WidgetConfig } from '../../../types/dashboard.types';

interface NotificationCenterWidgetProps {
  config: WidgetConfig;
}

export const NotificationCenterWidget: React.FC<NotificationCenterWidgetProps> = ({ config }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  // Mock data - replace with actual API calls
  const notifications = [
    {
      id: '1',
      title: 'New case assigned',
      message: 'Case #12345 has been assigned to you',
      type: 'info',
      timestamp: new Date(Date.now() - 10 * 60000),
      read: false,
      actionable: true,
    },
    {
      id: '2',
      title: 'Payment received',
      message: '$1,500 payment received from customer #67890',
      type: 'success',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      actionable: false,
    },
    {
      id: '3',
      title: 'Overdue reminder',
      message: '5 cases are approaching overdue status',
      type: 'warning',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true,
      actionable: true,
    },
    {
      id: '4',
      title: 'System maintenance',
      message: 'Scheduled maintenance in 2 hours',
      type: 'error',
      timestamp: new Date(Date.now() - 120 * 60000),
      read: true,
      actionable: false,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'success':
        return isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'warning':
        return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200';
      case 'error':
        return isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
      default:
        return isDark ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' : 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Icons.Info className="h-4 w-4" />;
      case 'success':
        return <Icons.CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <Icons.AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <Icons.XCircle className="h-4 w-4" />;
      default:
        return <Icons.Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg relative`}>
            <Icons.Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {config.title}
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {notifications.filter(n => !n.read).length} unread
            </p>
          </div>
        </div>
        <button className={`text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
          View All
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border transition-all hover:shadow-md ${
              !notification.read 
                ? isDark 
                  ? 'bg-indigo-500/10 border-indigo-500/20' 
                  : 'bg-indigo-50 border-indigo-200'
                : isDark 
                  ? 'bg-zinc-800/50 border-white/5 hover:border-white/10' 
                  : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${getTypeColor(notification.type)}`}>
                {getTypeIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="h-2 w-2 bg-indigo-500 rounded-full" />
                  )}
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {formatTimestamp(notification.timestamp)}
                  </span>
                  {notification.actionable && (
                    <button className={`text-[10px] font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                      View →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenterWidget;
