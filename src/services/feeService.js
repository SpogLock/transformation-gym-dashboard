import apiFetch, { API_BASE_URL } from './api';

// Submit a fee payment and generate invoices (billing-period based)
// NOTE:
// - For monthly fees, do NOT send `amount` from the frontend anymore.
// - Instead, pass an array of `billing_period_ids` and let the backend compute amounts.
// - Other fee types (e.g. registration) can still send their own payloads as needed.
export const submitFee = async (payload) => {
  const data = await apiFetch('/fee-submissions/submit', {
    method: 'POST',
    body: payload,
  });

  if (data.success) {
    // New API returns collections instead of single records for billing-period payments
    // Shape (simplified):
    // {
    //   fee_submissions: [...],
    //   invoices: [...],
    //   billing_periods: [...],
    //   customer: {...}
    // }
    return data.data;
  }

  // Try to surface validation / business rule errors clearly
  if (data.errors) {
    const firstErrorKey = Object.keys(data.errors)[0];
    const firstErrorMessage = data.errors[firstErrorKey]?.[0];
    throw new Error(firstErrorMessage || data.message || 'Failed to submit fee');
  }

  throw new Error(data.message || 'Failed to submit fee');
};

// Get fee status for a customer
export const getCustomerFeeStatus = async (customerId) => {
  const data = await apiFetch(`/customers/${customerId}/fee-status`, { method: 'GET' });
  if (data.success) return data.data;
  throw new Error(data.message || 'Failed to load fee status');
};

// Get fee history (paginated) for a customer; returns array of items by default
export const getCustomerFeeHistory = async (customerId, filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, v);
  });
  const qs = params.toString();
  const data = await apiFetch(`/customers/${customerId}/fee-history${qs ? `?${qs}` : ''}`, { method: 'GET' });
  if (data.success) {
    const paginator = data.data.fee_submissions;
    return {
      paginator,
      items: Array.isArray(paginator?.data) ? paginator.data : []
    };
  }
  throw new Error(data.message || 'Failed to load fee history');
};

// Print an invoice to thermal printer (opens a new tab with PDF/print view)
export const printInvoice = async (invoiceId) => {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/print`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/pdf'
    }
  });
  if (!res.ok) throw new Error(`Failed to open invoice (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};

// Download an invoice PDF
export const downloadInvoice = async (invoiceId, filename) => {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/download`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/pdf'
    }
  });
  if (!res.ok) throw new Error(`Failed to download invoice (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename || `invoice-${invoiceId}`}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};


