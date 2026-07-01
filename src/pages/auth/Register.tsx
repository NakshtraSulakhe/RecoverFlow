import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

export const Register: React.FC = () => {
  const navigate = useNavigate()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call for registration
    setTimeout(() => {
      setIsLoading(false)
      navigate('/login')
    }, 1500)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Form */}
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
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">Create an account</h2>
              <p className="text-muted-foreground text-sm font-medium">Request access to RecoverFlow Enterprise.</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11 bg-background"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-sm font-medium text-foreground ml-1">Company Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="pl-10 h-11 bg-background"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-sm font-medium text-foreground ml-1">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="email"
                    placeholder="john@acme.com"
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
                <p className="text-xs text-muted-foreground ml-1 mt-1 font-medium">Must be at least 8 characters long.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </motion.div>
            </form>
            
            <motion.div variants={itemVariants} className="pt-6 text-center">
              <span className="text-sm text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign in
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Branding / Graphic (Hidden on mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between overflow-hidden bg-zinc-950 p-12 lg:p-24">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-zinc-950 z-0" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-violet-600/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        
        {/* Content */}
        <div className="relative z-10 ml-auto flex flex-col items-end text-right w-full">
          <div className="flex items-center gap-3 text-white mb-16">
            <span className="text-2xl font-bold tracking-tight text-white">RecoverFlow</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl font-bold text-white leading-[1.15] mb-6 tracking-tight">
              Start recovering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">faster & smarter.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed font-medium">
              Join leading financial institutions that have transformed their debt recovery process with RecoverFlow's advanced omnichannel platform.
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 ml-auto mt-12 flex flex-col items-end gap-4">
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
              <div className="text-2xl font-bold text-white mb-1">45%</div>
              <div className="text-xs text-zinc-400 font-medium">Increase in Recovery</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
              <div className="text-2xl font-bold text-white mb-1">2.5x</div>
              <div className="text-xs text-zinc-400 font-medium">Faster Resolution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
