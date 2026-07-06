// import React from 'react';
// import { Navigate } from 'react-router-dom';
// // import { useAuth } from '../../contexts/AuthContext';
// import { useAppSelector } from '../../redux/store';

// interface PublicRouteProps {
//   children: React.ReactNode;
//   redirectTo?: string;
// }

// export const PublicRoute: React.FC<PublicRouteProps> = ({
//   children,
//   redirectTo = '/dashboard',
// }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return null;
//   }

//   if (isAuthenticated) {
//     return <Navigate to={redirectTo} replace />;
//   }

//   return <>{children}</>;
// };

// export default PublicRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/app/dashboard',
}) => {
  const isAuthenticated = useAppSelector(
    state => state.auth.isAuthenticated
  );

  const user = useAppSelector(
    state => state.auth.user
  );

  const location = useLocation();

  if (isAuthenticated && user) {
    const from =
      (location.state as any)?.from?.pathname ??
      (user.role === 'platform_owner'
        ? '/platform/dashboard'
        : '/app/dashboard');

    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
