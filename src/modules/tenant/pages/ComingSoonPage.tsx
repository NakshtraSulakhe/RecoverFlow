import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../utils/cn';

interface ComingSoonPageProps {
  title: string;
  description?: string;
  moduleName?: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  description = 'This module is planned for a future sprint. Check back soon.',
  moduleName,
}) => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <Card className={cn('max-w-lg w-full border', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
        <CardContent className="pt-10 pb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Wrench className="h-8 w-8" />
          </div>
          <h1 className={cn('text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-zinc-900')}>{title}</h1>
          {moduleName && (
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-3">{moduleName}</p>
          )}
          <p className={cn('text-sm mb-6', isDark ? 'text-zinc-400' : 'text-zinc-600')}>{description}</p>
          <Button variant="outline" onClick={() => navigate('/app/dashboard')}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonPage;
