import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Scale, 
  DollarSign,
  MoreVertical,
  ArrowUp,
  Download,
  Filter,
  Search
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'
import { AddDialog } from '../../components/common/AddDialog'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 1000 },
]

interface KPICardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend: number
  color: 'primary' | 'secondary' | 'success' | 'info'
}

const KPICard = ({ title, value, icon, trend, color }: KPICardProps) => {
  const colorMap = {
    // Primary — Indigo (the brand colour)
    primary: {
      text: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      gradient: 'from-indigo-500 to-indigo-600',
      glow: 'shadow-indigo-500/10 dark:shadow-indigo-500/20',
    },
    // Secondary — Violet (adjacent to indigo)
    secondary: {
      text: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10 dark:bg-violet-500/20',
      gradient: 'from-violet-500 to-violet-600',
      glow: 'shadow-violet-500/10 dark:shadow-violet-500/20',
    },
    // Success — Emerald (kept for semantic meaning)
    success: {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/20',
    },
    // Info — Purple (completing indigo→violet→purple spectrum)
    info: {
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      gradient: 'from-purple-500 to-fuchsia-500',
      glow: 'shadow-purple-500/10 dark:shadow-purple-500/20',
    },
  }

  const activeColor = colorMap[color]

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`relative overflow-hidden border border-border bg-card p-6 shadow-md hover:shadow-lg ${activeColor.glow} transition-all duration-300`}>
        {/* Soft background glow decoration */}
        <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${activeColor.gradient}`} />
        
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {title}
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight">
              {value}
            </h3>
            <div className="flex items-center gap-1.5">
              <Badge variant="success" className="flex items-center gap-0.5 px-1.5 py-0.5 font-bold">
                <ArrowUp className="h-3 w-3" />
                <span>{trend}%</span>
              </Badge>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${activeColor.gradient} text-white shadow-md shadow-black/10`}>
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
} as const

export default function Dashboard() {
  const [exportOpen, setExportOpen] = useState(false)
  const [quickActionOpen, setQuickActionOpen] = useState(false)
  const [quickActionTitle, setQuickActionTitle] = useState('')

  const handleQuickAction = (title: string) => {
    setQuickActionTitle(title)
    setQuickActionOpen(true)
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Top Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, Admin. Here's what's happening with your recovery operations today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-1.5">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Customers" value="1,234" icon={<Users className="h-5 w-5" />} trend={12.5} color="primary" />
        <KPICard title="Active Cases" value="567" icon={<Scale className="h-5 w-5" />} trend={8.2} color="secondary" />
        <KPICard title="Total Recovered" value="$2.5M" icon={<DollarSign className="h-5 w-5" />} trend={15.3} color="success" />
        <KPICard title="Recovery Rate" value="78%" icon={<TrendingUp className="h-5 w-5" />} trend={4.1} color="info" />
      </motion.div>

      {/* Analytics and Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart Card */}
        <div className="lg:col-span-2">
          <Card className="h-[400px] border border-border bg-card shadow-sm flex flex-col">
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h4 className="text-base font-semibold leading-none">Recovery Performance</h4>
                <p className="text-xs text-muted-foreground mt-1">Weekly recovery trend</p>
              </div>
              <button className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <CardContent className="flex-1 min-h-0 p-6">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--border), 0.5)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(var(--foreground), 0.5)" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(var(--foreground), 0.5)" }} dx={-5} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--tw-prose-body, #18181b)",
                        borderRadius: '10px', 
                        border: '1px solid rgba(99,102,241,0.25)', 
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                        padding: '10px 14px',
                      }} 
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions List Card */}
        <div>
          <Card className="h-[400px] border border-border bg-card shadow-sm flex flex-col">
            <div className="p-6 pb-4">
              <h4 className="text-base font-semibold leading-none">Quick Actions</h4>
            </div>
            <CardContent className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
              {[
                { text: 'Create New Case', icon: <Scale className="h-4 w-4" />, color: 'primary' as const },
                { text: 'Verify Payment', icon: <DollarSign className="h-4 w-4" />, color: 'success' as const },
                { text: 'Download Reports', icon: <Download className="h-4 w-4" />, color: 'secondary' as const },
                { text: 'Global Search', icon: <Search className="h-4 w-4" />, color: 'info' as const },
              ].map((action, i) => {
                const colors = {
                  primary: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white',
                  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
                  secondary: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white',
                  info: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white',
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.text)}
                    className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3 hover:bg-indigo-600/10 hover:border-indigo-500/20 hover:translate-x-1 active:scale-[0.99] transition-all duration-200 group text-left"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${colors[action.color]}`}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{action.text}</span>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Add Dialog Triggers */}
      <AddDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export Report"
        description="Export your dashboard report as PDF or Excel."
      />
      <AddDialog
        open={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        title={quickActionTitle}
        description="This feature will be implemented soon!"
      />
    </motion.div>
  )
}
