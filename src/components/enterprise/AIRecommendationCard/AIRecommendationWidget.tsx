import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import * as Icons from 'lucide-react';
import { WidgetConfig } from '../../../types/dashboard.types';

interface AIRecommendationWidgetProps {
  config: WidgetConfig;
}

export const AIRecommendationWidget: React.FC<AIRecommendationWidgetProps> = ({ config }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  // Mock data - replace with actual API calls
  const recommendations = [
    {
      id: '1',
      title: 'High recovery probability',
      description: 'Customer #12345 has 85% probability of payment within 7 days',
      type: 'insight',
      confidence: 85,
      actionable: true,
    },
    {
      id: '2',
      title: 'Escalate case #67890',
      description: 'This case has been stagnant for 30 days, consider escalation',
      type: 'action',
      confidence: 72,
      actionable: true,
    },
    {
      id: '3',
      title: 'Risk alert: Portfolio segment',
      description: 'Segment B shows increased default risk, review strategy',
      type: 'warning',
      confidence: 68,
      actionable: false,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insight':
        return isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'action':
        return isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'warning':
        return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return isDark ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' : 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'insight':
        return <Icons.Lightbulb className="h-4 w-4" />;
      case 'action':
        return <Icons.Zap className="h-4 w-4" />;
      case 'warning':
        return <Icons.AlertTriangle className="h-4 w-4" />;
      default:
        return <Icons.Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg`}>
          <Icons.Brain className="h-5 w-5" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {config.title}
          </h3>
          <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            AI-powered insights
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${
              isDark ? 'bg-zinc-800/50 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${getTypeColor(rec.type)}`}>
                {getTypeIcon(rec.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {rec.title}
                  </p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                    {rec.confidence}% confidence
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {rec.description}
                </p>
                {rec.actionable && (
                  <button className={`mt-2 text-xs font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                    Take Action →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationWidget;
