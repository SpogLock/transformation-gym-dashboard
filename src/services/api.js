// API Configuration
const API_BASE_URL = 'https://server.transformations-fitness-studio.com/api';

/**
 * Base fetch wrapper with common configurations
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    'Accept': 'application/json',
    ...options.headers,
  };

  // Only set JSON content-type when NOT sending FormData
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Add authorization header if token exists
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: options.method || (options.body ? 'POST' : 'GET'),
    ...options,
    headers,
  };

  // Stringify JSON bodies; let FormData pass through
  if (config.body && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle HTTP errors
      const validation = data && data.errors ? ` (${Object.values(data.errors).flat().join('; ')})` : '';
      const message = (data && data.message ? data.message : `HTTP error! status: ${response.status}`) + validation;

      // Centralised 401 / unauthenticated handling
      if (response.status === 401 && !options.skipAuth) {
        try {
          // Clear any stale auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        } catch (e) {
          // no-op
        }

        // Redirect to sign-in if we're not already there
        if (typeof window !== 'undefined') {
          const signInHash = '#/auth/signin';
          if (window.location.hash !== signInHash) {
            window.location.hash = signInHash;
          }
        }
      }

      const error = new Error(message);
      // Preserve status code for callers that care
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default apiFetch;
export { API_BASE_URL };

