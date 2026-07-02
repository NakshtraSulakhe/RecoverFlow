import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../utils/cn';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className={cn('border max-w-md w-full text-center', isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}>
        <CardContent className="p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Search className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">404 Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved. Please check the URL and try again.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
