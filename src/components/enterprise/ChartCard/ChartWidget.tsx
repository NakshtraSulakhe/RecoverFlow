import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { WidgetConfig } from '../../../types/dashboard.types';

interface ChartWidgetProps {
  config: WidgetConfig;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ config }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const chartType = config.config?.chartType || 'area';
  const metric = config.config?.metric || 'default';

  // Mock data - replace with actual API calls
  const mockData = {
    area: [
      { name: 'Mon', value: 400 },
      { name: 'Tue', value: 300 },
      { name: 'Wed', value: 600 },
      { name: 'Thu', value: 800 },
      { name: 'Fri', value: 500 },
      { name: 'Sat', value: 900 },
      { name: 'Sun', value: 1000 },
    ],
    bar: [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 500 },
      { name: 'Jun', value: 700 },
    ],
    line: [
      { name: 'Week 1', value: 400 },
      { name: 'Week 2', value: 500 },
      { name: 'Week 3', value: 450 },
      { name: 'Week 4', value: 600 },
    ],
  };

  const data = mockData[chartType as keyof typeof mockData] || mockData.area;

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const axisProps = {
      stroke: isDark ? '#71717a' : '#71717a',
      fontSize: 12,
      tickLine: false,
      axisLine: false,
    };

    const tooltipProps = {
      contentStyle: {
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        border: isDark ? '1px solid #27272a' : '1px solid #e5e7eb',
        borderRadius: '8px',
      },
      itemStyle: { color: isDark ? '#fafafa' : '#18181b' },
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff10" : "#e5e7eb"} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff10" : "#e5e7eb"} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff10" : "#e5e7eb"} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {config.icon && (
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg`}>
              {getIcon(config.icon)}
            </div>
          )}
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {config.title}
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Last 7 days
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWidget;
