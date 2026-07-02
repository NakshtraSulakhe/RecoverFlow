import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useDashboardConfig } from '../../../hooks/useDashboardConfig';
import { cn } from '../../../utils/cn';
import WidgetContainer from './WidgetContainer';
import { DashboardConfig } from '../../../types/dashboard.types';

interface DashboardGridProps {
  config: DashboardConfig;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ config }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const getGridCols = (layout: string) => {
    switch (layout) {
      case 'grid':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'masonry':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 'flex':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  const getWidgetSpan = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-1 md:col-span-2';
      case 'large':
        return 'col-span-1 md:col-span-2 lg:col-span-3';
      case 'wide':
        return 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4';
      default:
        return 'col-span-1';
    }
  };

  return (
    <div className={cn('grid gap-6', getGridCols(config.layout))}>
      {config.widgets.map((widget) => (
        <div
          key={widget.id}
          className={getWidgetSpan(widget.size)}
        >
          <WidgetContainer widget={widget} />
        </div>
      ))}
    </div>
  );
};

export default DashboardGrid;
