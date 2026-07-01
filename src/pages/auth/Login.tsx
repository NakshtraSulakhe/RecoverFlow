import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const from = (location.state as any)?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await login(email, password)
    } catch (err: any) {
      // Error is handled by the hook
    }
  }

  // Animation variants
  const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
} as const;

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Branding / Graphic (Hidden on mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between overflow-hidden bg-zinc-950 p-12 lg:p-24">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-zinc-950 z-0" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-violet-600/20 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
        
        {/* Content */}
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
              Enterprise debt recovery, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">reimagined.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed font-medium">
              Streamline your collections operations with intelligent workflows, multi-channel outreach, and AI-driven insights—all in one secure platform.
            </p>
          </motion.div>
        </div>

        {/* Footer/Testimonial area */}
        <div className="relative z-10 flex items-center gap-6 mt-12">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-sm font-medium text-zinc-400">
            Trusted by <strong className="text-white">500+</strong> financial institutions
          </div>
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
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">Welcome back</h2>
              <p className="text-muted-foreground text-sm font-medium">Sign in to your account to continue.</p>
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-1">
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
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-sm font-medium text-foreground ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-background"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </motion.div>
            </form>
            
            <motion.div variants={itemVariants} className="pt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">New to RecoverFlow?</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/register">
                  <Button variant="outline" className="w-full h-11 font-semibold">
                    Request an account
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
