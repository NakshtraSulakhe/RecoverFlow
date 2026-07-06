import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { changePassword } from '../../redux/slices/authSlice';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { cn } from '../../utils/cn';
import { toast } from 'react-toastify';
import { getRoleDashboardPath } from '../../utils/roles';

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!currentPassword) next.currentPassword = 'Current password is required';
    if (!newPassword) next.newPassword = 'New password is required';
    else if (newPassword.length < 8) next.newPassword = 'Must be at least 8 characters';
    if (newPassword !== confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      toast.success('Password updated successfully');
      navigate(getRoleDashboardPath(user?.role), { replace: true });
    } catch (err: any) {
      toast.error(typeof err === 'string' ? err : 'Failed to change password');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Change Your Password</h1>
          <p className="text-sm text-zinc-400 mb-6">
            {user?.mustChangePassword
              ? 'Your account requires a password change before you can access the workspace.'
              : 'Update your account password to continue.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Current Password</label>
              <div className="relative">
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={cn('bg-zinc-800 border-zinc-700 text-white pr-10', errors.currentPassword && 'border-red-500')}
                />
              </div>
              {errors.currentPassword && <p className="text-xs text-red-400 mt-1">{errors.currentPassword}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">New Password</label>
              <Input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={cn('bg-zinc-800 border-zinc-700 text-white', errors.newPassword && 'border-red-500')}
              />
              {errors.newPassword && <p className="text-xs text-red-400 mt-1">{errors.newPassword}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 block">Confirm New Password</label>
              <div className="relative">
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn('bg-zinc-800 border-zinc-700 text-white pr-10', errors.confirmPassword && 'border-red-500')}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Update Password
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
