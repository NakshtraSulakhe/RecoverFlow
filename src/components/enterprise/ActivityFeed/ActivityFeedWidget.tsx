import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';
import { WidgetConfig } from '../../../types/dashboard.types';

interface ActivityFeedWidgetProps {
  config: WidgetConfig;
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ config }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  // Mock data - replace with actual API calls
  const activities = [
    {
      id: '1',
      type: 'case_created',
      title: 'New case created',
      description: 'Case #12345 created for customer John Doe',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 5 * 60000),
      icon: 'Plus',
    },
    {
      id: '2',
      type: 'payment_recorded',
      title: 'Payment recorded',
      description: '$500 payment received from customer #67890',
      user: 'Mike Johnson',
      timestamp: new Date(Date.now() - 15 * 60000),
      icon: 'DollarSign',
    },
    {
      id: '3',
      type: 'call_completed',
      title: 'Call completed',
      description: 'Successful call with customer #54321, PTP confirmed',
      user: 'Sarah Wilson',
      timestamp: new Date(Date.now() - 30 * 60000),
      icon: 'Phone',
    },
    {
      id: '4',
      type: 'case_updated',
      title: 'Case status updated',
      description: 'Case #98765 moved to "In Progress"',
      user: 'Tom Brown',
      timestamp: new Date(Date.now() - 45 * 60000),
      icon: 'RefreshCw',
    },
    {
      id: '5',
      type: 'document_uploaded',
      title: 'Document uploaded',
      description: 'Legal document uploaded for case #11111',
      user: 'Alice Green',
      timestamp: new Date(Date.now() - 60 * 60000),
      icon: 'FileText',
    },
  ];

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg`}>
            <Icons.Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {config.title}
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Recent activity
            </p>
          </div>
        </div>
        <button className={`text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[10px] font-bold`}>
              {getInitials(activity.user)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {activity.user}
                </p>
                <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {activity.title}
              </p>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                {activity.description}
              </p>
            </div>
            {activity.icon && (
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>
                {getIcon(activity.icon)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeedWidget;
