import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../utils/cn';
import { toast } from 'react-toastify';
import { authService } from '../../features/auth/authService';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [step, setStep] = useState<'email' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      
      setStep('success');
      startCountdown();
      toast.success('Password reset email sent successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
      toast.error('Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      
      startCountdown();
      toast.success('Reset email resent successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend email');
      toast.error('Failed to resend email');
    } finally {
      setIsLoading(false);
    }
  };

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
              Reset your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">password</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed font-medium">
              We'll send you a secure link to reset your password. Check your inbox for instructions.
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
                {step === 'email' ? 'Forgot password?' : 'Check your email'}
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                {step === 'email' 
                  ? 'Enter your email to receive a password reset link'
                  : `We've sent a reset link to ${email}`
                }
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground ml-1">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-background"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            )}

            {step === 'success' && (
              <div className="space-y-6">
                <Card className={cn('border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Email sent successfully
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleResend}
                      disabled={isLoading || countdown > 0}
                      className="w-full"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : countdown > 0 ? (
                        `Resend in ${countdown}s`
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend email
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <button
                  onClick={() => setStep('email')}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Try with a different email
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
