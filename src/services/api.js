// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default apiFetch;
export { API_BASE_URL };

