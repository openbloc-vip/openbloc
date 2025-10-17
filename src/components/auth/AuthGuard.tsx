import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.profile.role)) {
    // Redirect to home page if role is not authorized
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
