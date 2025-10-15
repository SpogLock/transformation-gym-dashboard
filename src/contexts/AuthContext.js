import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getStoredUser,
  isAuthenticated as checkAuth,
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = getStoredUser();
      const authenticated = checkAuth();

      if (authenticated && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      const data = await loginUser({ email, password, remember_me: rememberMe });
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Register handler
   */
  const register = async (name, email, password, passwordConfirmation, role = 'staff') => {
    try {
      const data = await registerUser({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    }
  };

  /**
   * Refresh user profile
   */
  const refreshProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

