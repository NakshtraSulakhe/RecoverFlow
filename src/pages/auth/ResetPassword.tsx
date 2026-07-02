import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../utils/cn';
import { toast } from 'react-toastify';
import { authService } from '../../features/auth/authService';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong' | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired reset token');
    }
  }, [token]);

  const calculatePasswordStrength = (password: string): 'weak' | 'fair' | 'good' | 'strong' | null => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength === 3) return 'fair';
    if (strength === 4) return 'good';
    return 'strong';
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    if (errors.password) setErrors({ ...errors, password: undefined });
  };

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid or expired reset token');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ token, password, confirmPassword });
      
      setSuccess(true);
      toast.success('Password reset successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-amber-500';
      case 'good': return 'bg-blue-500';
      case 'strong': return 'bg-emerald-500';
      default: return 'bg-zinc-300';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return '25%';
      case 'fair': return '50%';
      case 'good': return '75%';
      case 'strong': return '100%';
      default: return '0%';
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Card className={cn('border max-w-md w-full', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Invalid Reset Link</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button onClick={() => navigate('/forgot-password')} className="w-full">
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Card className={cn('border max-w-md w-full', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Password Reset Successful</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between overflow-hidden bg-zinc-950 p-12 lg:p-24">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-zinc-950 z-0" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-violet-600/20 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">RecoverFlow</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl font-bold text-white leading-[1.15] mb-6 tracking-tight">
              Set your new <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">password</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed font-medium">
              Create a strong password to secure your account. Use a mix of letters, numbers, and symbols.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-background">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">RecoverFlow</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
              
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                Reset Password
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground ml-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className={cn('pl-10 pr-10 h-11 bg-background', errors.password && 'border-red-500')}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </div>
                )}
                
                {password && passwordStrength && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Password Strength</span>
                      <span className={cn('text-xs font-medium capitalize', 
                        passwordStrength === 'weak' && 'text-red-500',
                        passwordStrength === 'fair' && 'text-amber-500',
                        passwordStrength === 'good' && 'text-blue-500',
                        passwordStrength === 'strong' && 'text-emerald-500'
                      )}>
                        {passwordStrength}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                      <div 
                        className={cn('h-full transition-all duration-300', getStrengthColor())}
                        style={{ width: getStrengthWidth() }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    className={cn('pl-10 pr-10 h-11 bg-background', errors.confirmPassword && 'border-red-500')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
