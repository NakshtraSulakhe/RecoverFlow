import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { NAVIGATION_ITEMS, FEATURE_KEYS } from '../../constants/features';
import { FeatureGuard } from '../routing/FeatureGuard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import * as Icons from 'lucide-react';

interface DynamicSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
  collapsed = false,
  onToggle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, tenant, hasRole } = useAuth();
  const { mode } = useTheme();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Main', 'Customers']);

  const isDark = mode === 'dark';

  const handleGroupToggle = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  const filterNavigationItems = () => {
    return NAVIGATION_ITEMS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        // Check if feature is enabled
        if (item.feature && tenant?.features) {
          const isFeatureEnabled = tenant.features[item.feature];
          if (!isFeatureEnabled) return false;
        }

        // Check if user has required role
        if ('roles' in item && item.roles && item.roles.length > 0) {
          return hasRole(item.roles);
        }

        return true;
      }),
    })).filter((group) => group.items.length > 0);
  };

  const filteredNavItems = filterNavigationItems();

  return (
    <aside
      className={cn(
        'hidden md:block h-screen sticky top-0 left-0 transition-all duration-300 z-30 shrink-0 border-r',
        isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      <div className="flex h-full w-full flex-col">
        {/* Brand Header */}
        <div
          className={cn(
            'flex items-center px-4 py-3 min-h-[64px] border-b transition-all',
            isDark ? 'border-white/5' : 'border-zinc-200',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
                RF
              </div>
              <div>
                <h1 className={`text-sm font-bold leading-none ${isDark ? 'text-white' : 'text-zinc-900'}`}>RecoverFlow</h1>
                <span className={`text-[10px] font-semibold ${isDark ? 'text-indigo-300/70' : 'text-indigo-600'}`}>
                  {tenant?.tenant_name || 'Enterprise'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
              RF
            </div>
          )}
        </div>

        {/* Development Label */}
        {!collapsed && (
          <div className="px-4 py-2">
            <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
              Development
            </span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2 space-y-3">
          {filteredNavItems.map((group) => {
            const isExpanded = expandedGroups.includes(group.group);
            return (
              <div key={group.group} className="space-y-1">
                {!collapsed ? (
                  <div
                    onClick={() => handleGroupToggle(group.group)}
                    className={`flex items-center justify-between px-5 py-1.5 text-[10px] font-bold tracking-wider uppercase cursor-pointer hover:text-zinc-300 transition-colors group ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
                  >
                    <span>{group.group}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {isExpanded ? (
                        <Icons.ChevronUp className="h-3 w-3" />
                      ) : (
                        <Icons.ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  </div>
                ) : (
                  <div className={`border-t my-2 ${isDark ? 'border-white/5' : 'border-zinc-200'}`} />
                )}

                <AnimatePresence initial={false}>
                  {(collapsed || isExpanded) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden flex flex-col gap-0.5"
                    >
                      {group.items.map((item) => (
                        <FeatureGuard key={item.path} featureKey={item.feature}>
                          <button
                            onClick={() => navigate(item.path)}
                            className={cn(
                              'flex items-center gap-3 px-5 py-2.5 text-sm font-medium rounded-lg transition-all',
                              location.pathname === item.path
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : isDark ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                            )}
                          >
                            {getIcon(item.icon)}
                            {!collapsed && <span>{item.label}</span>}
                          </button>
                        </FeatureGuard>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">
                {user.first_name?.[0] || user.email?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {user.first_name} {user.last_name}
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DynamicSidebar;
