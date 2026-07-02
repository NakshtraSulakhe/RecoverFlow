import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';
import { WidgetConfig } from '../../../types/dashboard.types';

interface QuickActionWidgetProps {
  config: WidgetConfig;
}

export const QuickActionWidget: React.FC<QuickActionWidgetProps> = ({ config }) => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const actions = config.config?.actions || [
    { id: 'add_customer', label: 'Add Customer', icon: 'UserPlus', path: '/customers/new' },
    { id: 'create_case', label: 'Create Case', icon: 'Plus', path: '/cases/new' },
    { id: 'record_payment', label: 'Record Payment', icon: 'DollarSign', path: '/payments/new' },
    { id: 'schedule_call', label: 'Schedule Call', icon: 'Phone', path: '/schedule-call' },
  ];

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const handleAction = (action: any) => {
    if (action.path) {
      navigate(action.path);
    } else if (action.action) {
      action.action();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg`}>
          <Icons.Zap className="h-5 w-5" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {config.title}
          </h3>
          <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Quick actions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md',
              isDark 
                ? 'bg-zinc-800/50 border-white/5 hover:border-white/10 hover:bg-zinc-800' 
                : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100'
            )}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md`}>
              {getIcon(action.icon)}
            </div>
            <span className={`text-xs font-medium text-center ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionWidget;
