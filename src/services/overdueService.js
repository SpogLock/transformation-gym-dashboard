import apiFetch from './api';

export const getOverdueStats = async () => {
  const data = await apiFetch('/overdue-stats', { method: 'GET' });
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to load overdue stats');
};

export const forceMarkOverdueFees = async () => {
  const data = await apiFetch('/mark-overdue-fees', { method: 'POST' });
  if (data.success) return data;
  throw new Error(data.message || 'Failed to update overdue statuses');
};

export const getOverdueCustomers = async () => {
  const data = await apiFetch('/overdue-customers', { method: 'GET' });
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to load overdue customers');
};

export const getCustomerMonthlyTracking = async (customerId) => {
  const data = await apiFetch(`/customers/${customerId}/monthly-tracking`, { method: 'GET' });
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to load monthly tracking');
};


