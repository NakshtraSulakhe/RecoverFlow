import React from 'react'
import {
  LayoutDashboard,
  Users,
  Scale,
  RefreshCw,
  TrendingUp,
  Calendar,
  Phone,
  MessageSquare,
  History,
  CreditCard,
  BarChart3,
  Bot,
  Settings,
  Shield,
  Flag,
  GitBranch,
  Building,
  Briefcase,
  MapPin,
  Building2
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

export interface NavGroup {
  group: string
  items: NavItem[]
}

/** Sidebar navigation aligned with registered routes */
export const navigationGroups: NavGroup[] = [
  {
    group: 'Main',
    items: [{ label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> }],
  },
  {
    group: 'Portfolio',
    items: [{ label: 'Customers', path: '/customers', icon: <Users className="h-4.5 w-4.5" /> }],
  },
  {
    group: 'Recovery',
    items: [
      { label: 'Cases', path: '/cases', icon: <Scale className="h-4.5 w-4.5" /> },
      { label: 'Recovery Actions', path: '/recovery', icon: <RefreshCw className="h-4.5 w-4.5" /> },
      { label: 'Priority Scoring', path: '/priority-scoring', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'PTP Tracker', path: '/ptp-tracker', icon: <Calendar className="h-4.5 w-4.5" /> },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Smart Dialer', path: '/smart-dialer', icon: <Phone className="h-4.5 w-4.5" /> },
      { label: 'WhatsApp Recovery', path: '/whatsapp-recovery', icon: <MessageSquare className="h-4.5 w-4.5" /> },
      { label: 'Omnichannel Timeline', path: '/omnichannel', icon: <History className="h-4.5 w-4.5" /> },
    ],
  },
  {
    group: 'Finance',
    items: [{ label: 'Payments', path: '/payments', icon: <CreditCard className="h-4.5 w-4.5" /> }],
  },
  {
    group: 'Analytics',
    items: [{ label: 'Reports', path: '/reports', icon: <BarChart3 className="h-4.5 w-4.5" /> }],
  },
  {
    group: 'AI',
    items: [{ label: 'AI Assistant', path: '/ai', icon: <Bot className="h-4.5 w-4.5" /> }],
  },
  {
    group: 'Administration',
    items: [
      { label: 'Users', path: '/users', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Tenants', path: '/tenants', icon: <Building2 className="h-4.5 w-4.5" /> },
    ],
  },
  {
    group: 'Settings',
    items: [{ label: 'Settings', path: '/settings', icon: <Settings className="h-4.5 w-4.5" /> }],
  },
]

/** Settings hub cards linked to existing settings routes */
export const settingsSections = [
  {
    text: 'Tenant Profile',
    path: '/settings/tenant',
    icon: <Building2 className="h-5 w-5" />,
    description: 'Organization details, branding, and contact information',
    color: 'primary' as const,
  },
  {
    text: 'Subscription',
    path: '/settings/subscription',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Billing plans, usage limits, and payment methods',
    color: 'secondary' as const,
  },
  {
    text: 'General Settings',
    path: '/settings/general',
    icon: <Settings className="h-5 w-5" />,
    description: 'Localization, timezone, and regional preferences',
    color: 'info' as const,
  },
  {
    text: 'Feature Flags',
    path: '/settings/features',
    icon: <Flag className="h-5 w-5" />,
    description: 'Enable or disable product modules for your tenant',
    color: 'warning' as const,
  },
  {
    text: 'Security',
    path: '/settings/security',
    icon: <Shield className="h-5 w-5" />,
    description: 'IP allowlists, domain restrictions, and access policies',
    color: 'error' as const,
  },
  {
    text: 'Audit Log',
    path: '/settings/audit',
    icon: <History className="h-5 w-5" />,
    description: 'Review system activity and compliance events',
    color: 'success' as const,
  },
  {
    text: 'Branches',
    path: '/settings/branches',
    icon: <GitBranch className="h-5 w-5" />,
    description: 'Manage branch offices and regional structure',
    color: 'primary' as const,
  },
  {
    text: 'Departments',
    path: '/settings/departments',
    icon: <Building className="h-5 w-5" />,
    description: 'Organize teams by department hierarchy',
    color: 'secondary' as const,
  },
  {
    text: 'Teams',
    path: '/settings/teams',
    icon: <Users className="h-5 w-5" />,
    description: 'Create and manage operational teams',
    color: 'info' as const,
  },
  {
    text: 'Designations',
    path: '/settings/designations',
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Define job titles and role designations',
    color: 'warning' as const,
  },
  {
    text: 'Locations',
    path: '/settings/locations',
    icon: <MapPin className="h-5 w-5" />,
    description: 'Configure office and field locations',
    color: 'success' as const,
  },
  {
    text: 'Business Units',
    path: '/settings/business-units',
    icon: <Building className="h-5 w-5" />,
    description: 'Structure business units and divisions',
    color: 'primary' as const,
  },
]
