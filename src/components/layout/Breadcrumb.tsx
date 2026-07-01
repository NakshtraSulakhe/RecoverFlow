import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatBreadcrumbName = (name: string): string => {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-zinc-500">
      <Link
        to="/"
        className="flex items-center hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-white font-medium">
                {formatBreadcrumbName(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-white transition-colors"
              >
                {formatBreadcrumbName(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
