import apiFetch from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.password_confirmation - Password confirmation
 * @param {string} [userData.role] - User role (optional: "admin" or "staff")
 * @returns {Promise<Object>} - User data and token
 */
export const registerUser = async (userData) => {
  const data = await apiFetch('/register', {
    method: 'POST',
    body: userData, // Don't stringify - apiFetch will do it
    skipAuth: true,
  });

  if (data.success) {
    // Store token and user data
    localStorage.setItem('auth_token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @param {boolean} [credentials.remember_me] - Remember me flag
 * @returns {Promise<Object>} - User data and token
 */
export const loginUser = async (credentials) => {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: credentials, // Don't stringify - apiFetch will do it
    skipAuth: true,
  });

  if (data.success) {
    // Store token and user data
    localStorage.setItem('auth_token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} - Logout response
 */
export const logoutUser = async () => {
  try {
    const data = await apiFetch('/logout', {
      method: 'POST',
    });

    // Clear stored authentication data regardless of API response
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    return data;
  } catch (error) {
    // Still clear local storage even if API call fails
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    throw error;
  }
};

/**
 * Get user profile
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async () => {
  const data = await apiFetch('/profile', {
    method: 'GET',
  });

  if (data.success) {
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data.user;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @param {string} [profileData.name] - User's name
 * @param {string} [profileData.email] - User's email
 * @param {boolean} [profileData.remember_me] - Remember me preference
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUserProfile = async (profileData) => {
  const data = await apiFetch('/profile', {
    method: 'PUT',
    body: profileData, // Don't stringify - apiFetch will do it
  });

  if (data.success) {
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data.user;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Change password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.current_password - Current password
 * @param {string} passwordData.password - New password
 * @param {string} passwordData.password_confirmation - New password confirmation
 * @returns {Promise<string>} - Success message
 */
export const changePassword = async (passwordData) => {
  const data = await apiFetch('/change-password', {
    method: 'POST',
    body: passwordData, // Don't stringify - apiFetch will do it
  });

  if (data.success) {
    return data.message;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Test authentication
 * @returns {Promise<Object>} - User data if authenticated
 */
export const testAuth = async () => {
  const data = await apiFetch('/user', {
    method: 'GET',
  });

  if (data.success) {
    return data.data.user;
  } else {
    throw new Error(data.message);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

/**
 * Get stored user data
 * @returns {Object|null} - User data or null
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user has admin role
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = () => {
  const user = getStoredUser();
  return user?.role === 'admin';
};

/**
 * Check if user has staff role
 * @returns {boolean} - True if user is staff
 */
export const isStaff = () => {
  const user = getStoredUser();
  return user?.role === 'staff';
};

