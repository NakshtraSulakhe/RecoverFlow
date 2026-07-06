import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Clock, 
  Camera,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { toast } from 'react-toastify';

export const Profile: React.FC = () => {
  const user = useAppSelector(
    state => state.auth.user
);
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Connect to backend API
      // await authService.updateProfile(formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'platform_owner':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'tenant_admin':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'recovery_manager':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'inactive':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'suspended':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
          Profile
        </h1>
        <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className={cn('text-xl font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                  {user?.first_name} {user?.last_name}
                </h2>
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border capitalize', getRoleBadgeColor(user?.user_type || ''))}>
                  {user?.user_type?.replace('_', ' ')}
                </span>
              </div>
              <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                {user?.email}
              </p>
            </div>

            {/* Actions */}
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className={cn('text-sm font-medium mb-1 block', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                    First Name
                  </label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className={cn('bg-background', isDark ? 'border-zinc-700' : 'border-zinc-200')}
                  />
                </div>
                <div>
                  <label className={cn('text-sm font-medium mb-1 block', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                    Last Name
                  </label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className={cn('bg-background', isDark ? 'border-zinc-700' : 'border-zinc-200')}
                  />
                </div>
                <div>
                  <label className={cn('text-sm font-medium mb-1 block', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                    Email
                  </label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled
                    className={cn('bg-background', isDark ? 'border-zinc-700' : 'border-zinc-200')}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className={cn('h-5 w-5', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                  <div>
                    <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>Full Name</p>
                    <p className={cn('font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                      {user?.first_name} {user?.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className={cn('h-5 w-5', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                  <div>
                    <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>Email</p>
                    <p className={cn('font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className={cn('h-5 w-5', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                  <div>
                    <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>Role</p>
                    <p className={cn('font-medium capitalize', isDark ? 'text-white' : 'text-zinc-900')}>
                      {user?.user_type?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className={cn('h-5 w-5', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
              <div>
                <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>Account Created</p>
                <p className={cn('font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                  {formatDate(user?.created_at || '')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className={cn('h-5 w-5', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
              <div>
                <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>Last Login</p>
                <p className={cn('font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                  {formatDate(user?.last_login || '')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className={cn('h-5 w-5', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
              <div>
                <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-zinc-600')}>Status</p>
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border capitalize', getStatusBadgeColor(user?.status || 'active'))}>
                  {user?.status || 'active'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security */}
      <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
