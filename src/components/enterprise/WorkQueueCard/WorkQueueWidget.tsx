import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';
import { WidgetConfig } from '../../../types/dashboard.types';

interface WorkQueueWidgetProps {
  config: WidgetConfig;
}

export const WorkQueueWidget: React.FC<WorkQueueWidgetProps> = ({ config }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  // Mock data - replace with actual API calls
  const workQueueItems = [
    { id: '1', title: 'Review customer account #12345', priority: 'high', status: 'In Progress', assignedTo: 'John Doe' },
    { id: '2', title: 'Follow up on promise to pay', priority: 'medium', status: 'Pending', assignedTo: 'Jane Smith' },
    { id: '3', title: 'Schedule legal consultation', priority: 'high', status: 'New', assignedTo: 'Mike Johnson' },
    { id: '4', title: 'Update payment records', priority: 'low', status: 'Pending', assignedTo: 'Sarah Wilson' },
    { id: '5', title: 'Generate monthly report', priority: 'medium', status: 'In Progress', assignedTo: 'Tom Brown' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return isDark ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' : 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700';
      case 'Pending':
        return isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700';
      case 'New':
        return isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700';
      default:
        return isDark ? 'bg-zinc-500/20 text-zinc-400' : 'bg-zinc-100 text-zinc-700';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg`}>
            <Icons.ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {config.title}
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {workQueueItems.length} items
            </p>
          </div>
        </div>
        <button className={`text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
          View All
        </button>
      </div>

      <div className="space-y-3">
        {workQueueItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-3 rounded-lg border transition-all hover:shadow-md ${
              isDark ? 'bg-zinc-800/50 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className={`flex-1 min-w-0`}>
              <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(item.priority)}`}>
                  {item.priority.toUpperCase()}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[10px] font-bold`}>
                {item.assignedTo.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkQueueWidget;
