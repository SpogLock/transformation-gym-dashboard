import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

/**
 * Protected Route Component
 * Redirects to sign in page if user is not authenticated
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        Loading...
      </div>
    );
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

