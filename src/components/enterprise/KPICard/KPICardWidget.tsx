import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { useDashboardConfig } from '../../../hooks/useDashboardConfig';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';
import { WidgetConfig } from '../../../types/dashboard.types';

interface KPICardWidgetProps {
  config: WidgetConfig;
}

export const KPICardWidget: React.FC<KPICardWidgetProps> = ({ config }) => {
  const { mode } = useTheme();
  const { getKPIById } = useDashboardConfig();
  const isDark = mode === 'dark';

  const kpiIds = config.config?.kpis || [];
  const kpis = kpiIds.map((id: string) => getKPIById(id)).filter(Boolean);

  const colorMap = {
    primary: {
      text: isDark ? 'text-indigo-400' : 'text-indigo-600',
      bg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    secondary: {
      text: isDark ? 'text-violet-400' : 'text-violet-600',
      bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
      gradient: 'from-violet-500 to-violet-600',
    },
    success: {
      text: isDark ? 'text-emerald-400' : 'text-emerald-600',
      bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      gradient: 'from-emerald-500 to-teal-500',
    },
    info: {
      text: isDark ? 'text-cyan-400' : 'text-cyan-600',
      bg: isDark ? 'bg-cyan-500/10' : 'bg-cyan-50',
      gradient: 'from-cyan-500 to-blue-500',
    },
    warning: {
      text: isDark ? 'text-amber-400' : 'text-amber-600',
      bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
      gradient: 'from-amber-500 to-orange-500',
    },
    error: {
      text: isDark ? 'text-red-400' : 'text-red-600',
      bg: isDark ? 'bg-red-500/10' : 'bg-red-50',
      gradient: 'from-red-500 to-rose-500',
    },
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi: any, index: number) => {
          const activeColor = colorMap[kpi.color as keyof typeof colorMap] || colorMap.primary;
          
          return (
            <motion.div
              key={kpi.id}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)',
                backgroundColor: isDark ? 'rgba(39,39,42,0.5)' : 'rgba(255,255,255,0.8)',
              }}
            >
              <div
                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${activeColor.gradient}`}
              />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {kpi.title}
                  </span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${activeColor.gradient} text-white shadow-md`}>
                    {getIcon(kpi.icon)}
                  </div>
                </div>
                
                <h3 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {kpi.value || '--'}
                </h3>
                
                <div className="flex items-center gap-1.5">
                  <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Icons.TrendingUp className="h-3 w-3" />
                    <span>+{Math.random() * 10 + 1}%</span>
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    vs last month
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default KPICardWidget;
