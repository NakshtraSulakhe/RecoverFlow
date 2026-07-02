export interface KPIData {
  title: string;
  value: string | number;
  icon: string;
  trend: number;
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface WorkQueueItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  path?: string;
  action?: () => void;
  requiredRoles?: string[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'insight' | 'action' | 'warning';
  confidence: number;
  actionable: boolean;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  icon?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionable: boolean;
}
