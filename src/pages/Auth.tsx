import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthForm mode={mode} />;
};

export default Auth;