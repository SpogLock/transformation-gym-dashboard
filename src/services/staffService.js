import apiFetch from './api';

/**
 * Staff Service
 * Handles all staff management API calls
 */

// Get all staff members with optional filters
export const getAllStaff = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.role) queryParams.append('role', filters.role);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
  if (filters.sort_order) queryParams.append('sort_order', filters.sort_order);
  if (filters.per_page) {
    // Support 'all' or 0 to get all records
    const perPageValue = filters.per_page === 'all' || filters.per_page === 0 ? 'all' : filters.per_page;
    queryParams.append('per_page', perPageValue);
  }
  if (filters.page) queryParams.append('page', filters.page);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/staff?${queryString}` : '/staff';
  
  try {
    const data = await apiFetch(endpoint, { method: 'GET' });
    
    if (data.success) {
      // Handle paginated response structure
      if (data.data && data.data.data) {
        return {
          staff: data.data.data,
          pagination: {
            current_page: data.data.current_page || 1,
            last_page: data.data.last_page || 1,
            per_page: data.data.per_page || 15,
            total: data.data.total || 0,
            from: data.data.from || 0,
            to: data.data.to || 0,
          }
        };
      }
      return {
        staff: data.data || [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: Array.isArray(data.data) ? data.data.length : 0,
          from: 1,
          to: Array.isArray(data.data) ? data.data.length : 0,
        }
      };
    }
    throw new Error(data.message || 'Failed to fetch staff');
  } catch (error) {
    console.warn('Staff listing endpoint not available, returning empty array');
    return {
      staff: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
      }
    };
  }
};

// Get single staff member by ID
export const getStaffMember = async (staffId) => {
  const data = await apiFetch(`/staff/${staffId}`, {
    method: 'GET',
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch staff member');
};

// Create new staff member
export const createStaff = async (staffData) => {
  const data = await apiFetch('/staff', {
    method: 'POST',
    body: staffData,
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to create staff member');
};

// Update staff member
export const updateStaff = async (staffId, updateData) => {
  const data = await apiFetch(`/staff/${staffId}`, {
    method: 'PUT',
    body: updateData,
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to update staff member');
};

// Delete staff member
export const deleteStaff = async (staffId) => {
  const data = await apiFetch(`/staff/${staffId}`, {
    method: 'DELETE',
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to delete staff member');
};

// Update staff status
export const updateStaffStatus = async (staffId, status) => {
  const data = await apiFetch(`/staff/${staffId}/status`, {
    method: 'PUT',
    body: { status },
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to update staff status');
};

// Update staff role
export const updateStaffRole = async (staffId, role) => {
  const data = await apiFetch(`/staff/${staffId}/role`, {
    method: 'PUT',
    body: { role },
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to update staff role');
};

// Change staff password
export const changeStaffPassword = async (staffId, password, passwordConfirmation) => {
  const data = await apiFetch(`/staff/${staffId}/change-password`, {
    method: 'PUT',
    body: {
      password,
      password_confirmation: passwordConfirmation,
    },
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to change staff password');
};

// Bulk update staff status
export const bulkUpdateStaffStatus = async (staffIds, status) => {
  const data = await apiFetch('/staff-bulk-update-status', {
    method: 'PUT',
    body: {
      staff_ids: staffIds,
      status,
    },
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to bulk update staff status');
};

// Get staff by role
export const getStaffByRole = async (role, filters = {}) => {
  const queryParams = new URLSearchParams({
    role,
    ...filters
  });
  
  const data = await apiFetch(`/staff-by-role?${queryParams}`, {
    method: 'GET',
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch staff by role');
};

// Get staff statistics
export const getStaffStats = async () => {
  try {
    const data = await apiFetch('/staff-statistics', { method: 'GET' });
    
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch staff statistics');
  } catch (error) {
    console.warn('Staff statistics endpoint not available');
    return {
      total_staff: 0,
      active_staff: 0,
      inactive_staff: 0,
      admin_count: 0,
      staff_count: 0
    };
  }
};
