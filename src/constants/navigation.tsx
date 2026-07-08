import React from 'react'
import {
  DashboardOutlined,
  PeopleAltOutlined,
  GavelOutlined,
  LoopOutlined,
  PaymentOutlined,
  AssessmentOutlined,
  SmartToyOutlined,
  GroupOutlined,
  BusinessOutlined,
  SettingsOutlined,
  AccountTreeOutlined,
  LocationCityOutlined,
  GroupsOutlined,
  BadgeOutlined,
  PlaceOutlined,
  ApartmentOutlined,
  FlagOutlined,
  SecurityOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  TrendingUpOutlined,
  EventNoteOutlined,
} from '@mui/icons-material'

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
    items: [{ label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlined /> }],
  },
  {
    group: 'Portfolio',
    items: [{ label: 'Customers', path: '/customers', icon: <PeopleAltOutlined /> }],
  },
  {
    group: 'Recovery',
    items: [
      { label: 'Cases', path: '/cases', icon: <GavelOutlined /> },
      { label: 'Recovery Actions', path: '/recovery', icon: <LoopOutlined /> },
      { label: 'Priority Scoring', path: '/priority-scoring', icon: <TrendingUpOutlined /> },
      { label: 'PTP Tracker', path: '/ptp-tracker', icon: <EventNoteOutlined /> },
    ],
  },
  {
    group: 'Finance',
    items: [{ label: 'Payments', path: '/payments', icon: <PaymentOutlined /> }],
  },
  {
    group: 'Analytics',
    items: [{ label: 'Reports', path: '/reports', icon: <AssessmentOutlined /> }],
  },
  {
    group: 'AI',
    items: [{ label: 'AI Assistant', path: '/ai', icon: <SmartToyOutlined /> }],
  },
  {
    group: 'Administration',
    items: [
      { label: 'Users', path: '/users', icon: <GroupOutlined /> },
      { label: 'Tenants', path: '/tenants', icon: <BusinessOutlined /> },
    ],
  },
  {
    group: 'Settings',
    items: [{ label: 'Settings', path: '/settings', icon: <SettingsOutlined /> }],
  },
]

/** Settings hub cards linked to existing settings routes */
export const settingsSections = [
  {
    text: 'Tenant Profile',
    path: '/settings/tenant',
    icon: <BusinessOutlined />,
    description: 'Organization details, branding, and contact information',
    color: 'primary' as const,
  },
  {
    text: 'Subscription',
    path: '/settings/subscription',
    icon: <CreditCardOutlined />,
    description: 'Billing plans, usage limits, and payment methods',
    color: 'secondary' as const,
  },
  {
    text: 'General Settings',
    path: '/settings/general',
    icon: <SettingsOutlined />,
    description: 'Localization, timezone, and regional preferences',
    color: 'info' as const,
  },
  {
    text: 'Feature Flags',
    path: '/settings/features',
    icon: <FlagOutlined />,
    description: 'Enable or disable product modules for your tenant',
    color: 'warning' as const,
  },
  {
    text: 'Security',
    path: '/settings/security',
    icon: <SecurityOutlined />,
    description: 'IP allowlists, domain restrictions, and access policies',
    color: 'error' as const,
  },
  {
    text: 'Audit Log',
    path: '/settings/audit',
    icon: <HistoryOutlined />,
    description: 'Review system activity and compliance events',
    color: 'success' as const,
  },
  {
    text: 'Branches',
    path: '/settings/branches',
    icon: <AccountTreeOutlined />,
    description: 'Manage branch offices and regional structure',
    color: 'primary' as const,
  },
  {
    text: 'Departments',
    path: '/settings/departments',
    icon: <LocationCityOutlined />,
    description: 'Organize teams by department hierarchy',
    color: 'secondary' as const,
  },
  {
    text: 'Teams',
    path: '/settings/teams',
    icon: <GroupsOutlined />,
    description: 'Create and manage operational teams',
    color: 'info' as const,
  },
  {
    text: 'Designations',
    path: '/settings/designations',
    icon: <BadgeOutlined />,
    description: 'Define job titles and role designations',
    color: 'warning' as const,
  },
  {
    text: 'Locations',
    path: '/settings/locations',
    icon: <PlaceOutlined />,
    description: 'Configure office and field locations',
    color: 'success' as const,
  },
  {
    text: 'Business Units',
    path: '/app/settings/business-units',
    icon: <ApartmentOutlined />,
    description: 'Structure business units and divisions',
    color: 'primary' as const,
  },
]
