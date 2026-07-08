import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/store';
import { logout } from '../../../redux/slices/authSlice';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';

interface EnterpriseHeaderProps {
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  onSidebarToggle,
  sidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === 'dark';

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'New tenant registered', message: 'Acme Corp joined the platform', time: '2 hours ago', read: false },
    { id: 2, title: 'Subscription upgraded', message: 'Tech Solutions upgraded to Professional', time: '4 hours ago', read: false },
    { id: 3, title: 'System update', message: 'Platform maintenance scheduled', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      className={cn(
        'sticky top-0 z-20 border-b transition-all',
        isDark ? 'bg-zinc-950/80 backdrop-blur-xl border-white/5' : 'bg-white/80 backdrop-blur-xl border-zinc-200'
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark ? 'hover:bg-white/5 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
            )}
          >
            <Icons.Menu className="h-5 w-5" />
          </button>
          
          {/* Global Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border bg-transparent w-96">
            <Icons.Search className={`h-4 w-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <input
              type="text"
              placeholder="Search (Ctrl+K)"
              className={`flex-1 bg-transparent border-none outline-none text-sm ${
                isDark ? 'text-white placeholder-zinc-500' : 'text-zinc-900 placeholder-zinc-400'
              }`}
            />
            <kbd className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded border ${
              isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
            }`}>
              <span>⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Help */}
          <button
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark ? 'hover:bg-white/5 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
            )}
            title="Help"
          >
            <Icons.HelpCircle className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark ? 'hover:bg-white/5 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
            )}
            title="Toggle theme"
          >
            {isDark ? <Icons.Sun className="h-5 w-5" /> : <Icons.Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                'p-2 rounded-lg transition-colors relative',
                isDark ? 'hover:bg-white/5 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
              )}
              title="Notifications"
            >
              <Icons.Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowNotifications(false)}
                />
                <Card className={cn(
                  'absolute right-0 top-full mt-2 w-80 z-20 border shadow-xl',
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                )}>
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Mark all read
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              'p-4 border-b last:border-b-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors',
                              !notification.read && 'bg-indigo-500/5 dark:bg-indigo-500/10',
                              isDark ? 'border-zinc-800' : 'border-zinc-100'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.read && (
                                <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={cn('text-sm font-medium truncate', isDark ? 'text-white' : 'text-zinc-900')}>
                                  {notification.title}
                                </p>
                                <p className={cn('text-xs truncate', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                                  {notification.message}
                                </p>
                                <p className={cn('text-xs mt-1', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-4 border-l ml-2 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg p-2 transition-colors"
            >
              <div className="hidden sm:block text-right">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <Card className={cn(
                  'absolute right-0 top-full mt-2 w-56 z-20 border shadow-xl',
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                )}>
                  <CardContent className="p-2">
                    <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Icons.User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Icons.Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 my-2" />
                    <button
                      onClick={async () => {
                        await dispatch(logout());
                        setShowProfileMenu(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 transition-colors text-left"
                    >
                      <Icons.LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Version */}
      <div className="px-6 pb-2">
        <p className={`text-[10px] ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          RecoverFlow v1.0.0
        </p>
      </div>
    </header>
  );
};

export default EnterpriseHeader;
