import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  Plus,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface AppHeaderProps {
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onSidebarToggle,
  sidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 w-80">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-500 flex-1"
            />
            <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-xs text-zinc-500">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Quick Create Button */}
          {hasPermission('customers.create') && (
            <button
              onClick={() => navigate('/customers/new')}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Quick Create</span>
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-zinc-500">No new notifications</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-white/5 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-sm">
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-zinc-500 capitalize">
                  {user?.user_type?.replace(/_/g, ' ')}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-500 hidden lg:block" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="text-sm font-medium text-white">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-zinc-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
