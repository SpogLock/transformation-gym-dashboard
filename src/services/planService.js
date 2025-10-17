import apiFetch from './api';

// List plans (paginated); returns paginator object
export const getPlans = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, v);
  });
  const qs = params.toString();
  const data = await apiFetch(`/plans${qs ? `?${qs}` : ''}`, { method: 'GET' });
  if (data.success) return data.data; // Laravel paginator
  throw new Error(data.message || 'Failed to load plans');
};

// Get single plan
export const getPlan = async (id) => {
  const data = await apiFetch(`/plans/${id}`, { method: 'GET' });
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to load plan');
};

// Create
export const createPlan = async (payload) => {
  // Ensure numeric fields are numbers (backend expects numeric)
  const normalized = {
    ...payload,
    monthly_fee: typeof payload.monthly_fee === 'number' ? payload.monthly_fee : Number(payload.monthly_fee),
    registration_fee: typeof payload.registration_fee === 'number' ? payload.registration_fee : Number(payload.registration_fee),
  };
  const data = await apiFetch('/plans', { method: 'POST', body: normalized });
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to create plan');
};

// Update
export const updatePlan = async (id, payload) => {
  const normalized = {
    ...payload,
    monthly_fee: typeof payload.monthly_fee === 'number' ? payload.monthly_fee : Number(payload.monthly_fee),
    registration_fee: typeof payload.registration_fee === 'number' ? payload.registration_fee : Number(payload.registration_fee),
  };
  const data = await apiFetch(`/plans/${id}`, { method: 'PUT', body: normalized });
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to update plan');
};

// Delete
export const deletePlan = async (id) => {
  const data = await apiFetch(`/plans/${id}`, { method: 'DELETE' });
  if (data.success) return true;
  throw new Error(data.message || 'Failed to delete plan');
};


