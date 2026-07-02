import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import { WidgetConfig, WidgetType } from '../../../types/dashboard.types';
import KPICardWidget from '../../../components/enterprise/KPICard/KPICardWidget';
import ChartWidget from '../../../components/enterprise/ChartCard/ChartWidget';
import WorkQueueWidget from '../../../components/enterprise/WorkQueueCard/WorkQueueWidget';
import QuickActionWidget from '../../../components/enterprise/QuickActionCard/QuickActionWidget';
import AIRecommendationWidget from '../../../components/enterprise/AIRecommendationCard/AIRecommendationWidget';
import ActivityFeedWidget from '../../../components/enterprise/ActivityFeed/ActivityFeedWidget';
import NotificationCenterWidget from '../../../components/enterprise/NotificationCenter/NotificationCenterWidget';

interface WidgetContainerProps {
  widget: WidgetConfig;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ widget }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const renderWidget = () => {
    switch (widget.type) {
      case WidgetType.KPI_CARD:
        return <KPICardWidget config={widget} />;
      case WidgetType.CHART:
        return <ChartWidget config={widget} />;
      case WidgetType.WORK_QUEUE:
        return <WorkQueueWidget config={widget} />;
      case WidgetType.QUICK_ACTION:
        return <QuickActionWidget config={widget} />;
      case WidgetType.AI_RECOMMENDATION:
        return <AIRecommendationWidget config={widget} />;
      case WidgetType.ACTIVITY_FEED:
        return <ActivityFeedWidget config={widget} />;
      case WidgetType.NOTIFICATION_CENTER:
        return <NotificationCenterWidget config={widget} />;
      default:
        return <div className="p-4 text-center text-zinc-500">Unknown widget type</div>;
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-300 hover:shadow-lg',
        isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200'
      )}
    >
      {renderWidget()}
    </div>
  );
};

export default WidgetContainer;
