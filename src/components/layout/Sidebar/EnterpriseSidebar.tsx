import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNavigation } from '../../../hooks/useNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';

interface EnterpriseSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  collapsed = false,
  onToggle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, tenant } = useAuth();
  const { mode } = useTheme();
  const { modules } = useNavigation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['overview']);

  const isDark = mode === 'dark';

  const handleGroupToggle = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={cn(
        'hidden lg:flex h-screen sticky top-0 left-0 transition-all duration-300 z-30 flex-col border-r',
        isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'flex items-center px-6 py-5 min-h-[72px] border-b transition-all',
          isDark ? 'border-white/5' : 'border-zinc-200',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
              RF
            </div>
            <div>
              <h1 className={`text-base font-bold leading-none ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                RecoverFlow
              </h1>
              <span className={`text-[11px] font-semibold ${isDark ? 'text-indigo-300/70' : 'text-indigo-600'}`}>
                {tenant?.tenant_name || 'Enterprise'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
            RF
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {modules.map((module) => {
          const isExpanded = expandedGroups.includes(module.id);
          return (
            <div key={module.id} className="space-y-1">
              {!collapsed ? (
                <button
                  onClick={() => handleGroupToggle(module.id)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-[11px] font-bold tracking-wider uppercase rounded-lg transition-colors group ${
                    isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <span>{module.name}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {isExpanded ? (
                      <Icons.ChevronUp className="h-3 w-3" />
                    ) : (
                      <Icons.ChevronDown className="h-3 w-3" />
                    )}
                  </span>
                </button>
              ) : (
                <div className={`border-t my-3 ${isDark ? 'border-white/5' : 'border-zinc-200'}`} />
              )}

              <AnimatePresence initial={false}>
                {(collapsed || isExpanded) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden flex flex-col gap-0.5"
                  >
                    {module.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                          isActive(item.path)
                            ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                            : isDark 
                            ? 'text-zinc-400 hover:bg-white/5 hover:text-white' 
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                        )}
                      >
                        {getIcon(item.icon)}
                        {!collapsed && <span>{item.label}</span>}
                        {!collapsed && item.badge && (
                          <span className="ml-auto bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className={`border-t p-4 ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm">
              {user.first_name?.[0] || user.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {user.first_name} {user.last_name}
              </p>
              <p className={`text-xs truncate ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default EnterpriseSidebar;
