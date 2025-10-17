import apiFetch from './api';

// Build query string from filters while ignoring empty values
const buildQueryString = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

// Get customers (paginated) with optional filters
export const getCustomers = async (filters = {}) => {
  const query = buildQueryString(filters);
  const data = await apiFetch(`/customers${query}`, {
    method: 'GET',
  });

  if (data.success) {
    return data.data; // { customers: [...], pagination: {...} }
  }
  throw new Error(data.message || 'Failed to load customers');
};

// Create new customer
export const createCustomer = async (customerData) => {
  const data = await apiFetch('/customers', {
    method: 'POST',
    body: customerData, // Don't stringify - apiFetch will do it
  });
  if (data.success) {
    return data.data.customer;
  }
  throw new Error(data.message || 'Failed to create customer');
};

// Get single customer
export const getCustomer = async (customerId) => {
  const data = await apiFetch(`/customers/${customerId}`, {
    method: 'GET',
  });
  if (data.success) {
    return data.data.customer;
  }
  throw new Error(data.message || 'Failed to get customer');
};

// Update customer
export const updateCustomer = async (customerId, updateData) => {
  const data = await apiFetch(`/customers/${customerId}`, {
    method: 'PUT',
    body: updateData, // Don't stringify - apiFetch will do it
  });
  if (data.success) {
    return data.data.customer;
  }
  throw new Error(data.message || 'Failed to update customer');
};

// Delete customer
export const deleteCustomer = async (customerId) => {
  const data = await apiFetch(`/customers/${customerId}`, {
    method: 'DELETE',
  });
  if (data.success) {
    return true;
  }
  throw new Error(data.message || 'Failed to delete customer');
};

// Generate a registration invoice later for an existing customer
export const createRegistrationInvoice = async (customerId, payload = {}) => {
  const data = await apiFetch(`/customers/${customerId}/registration-invoice`, {
    method: 'POST',
    body: payload,
  });
  if (data.success) {
    return data.data; // may include invoice details
  }
  throw new Error(data.message || 'Failed to create registration invoice');
};

// Get statistics
export const getCustomerStatistics = async () => {
  const data = await apiFetch('/customers-statistics', {
    method: 'GET',
  });
  if (data.success) {
    return data.data.statistics;
  }
  throw new Error(data.message || 'Failed to load statistics');
};

// Mark as paid
export const markCustomerAsPaid = async (customerId) => {
  const data = await apiFetch(`/customers/${customerId}/mark-as-paid`, {
    method: 'POST',
  });
  if (data.success) {
    return data.data.customer;
  }
  throw new Error(data.message || 'Failed to mark as paid');
};

// Send payment reminder
export const sendPaymentReminder = async (customerId) => {
  const data = await apiFetch(`/customers/${customerId}/send-reminder`, {
    method: 'POST',
  });
  if (data.success) {
    return data.data.customer;
  }
  throw new Error(data.message || 'Failed to send reminder');
};

// Upload customer profile picture (multipart/form-data)
export const uploadCustomerProfilePicture = async (customerId, imageFile) => {
  const formData = new FormData();
  formData.append('profile_picture', imageFile);

  const data = await apiFetch(`/customers/${customerId}/upload-profile-picture`, {
    method: 'POST',
    body: formData,
    // No headers needed; apiFetch detects FormData and avoids JSON content-type
  });

  if (data.success) {
    return data.data; // { customer, profile_picture_url }
  }
  throw new Error(data.message || 'Failed to upload profile picture');
};

// Delete customer profile picture
export const deleteCustomerProfilePicture = async (customerId) => {
  const data = await apiFetch(`/customers/${customerId}/delete-profile-picture`, {
    method: 'DELETE',
  });
  if (data.success) {
    return data.data.customer;
  }
  throw new Error(data.message || 'Failed to delete profile picture');
};

// Get customer profile picture URL
export const getCustomerProfilePicture = async (customerId) => {
  const data = await apiFetch(`/customers/${customerId}/profile-picture`, {
    method: 'GET',
  });
  if (data.success) {
    return data.data.profile_picture_url;
  }
  return null;
};


