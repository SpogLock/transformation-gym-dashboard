import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import AppLoader from 'components/Loaders/AppLoader';

/**
 * Protected Route Component
 * Redirects to sign in page if user is not authenticated
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AppLoader message="Checking authentication..." fullHeight />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/signin" />
        )
      }
    />
  );
};

export default ProtectedRoute;

