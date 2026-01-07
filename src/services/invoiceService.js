import apiFetch from './api';

/**
 * Invoice Service
 * Handles all invoice-related API calls
 */

// Get all invoices with optional filters
export const getAllInvoices = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  // Add filters to query params (matching API documentation)
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.customer_id) queryParams.append('customer_id', filters.customer_id);
  if (filters.customer_name) queryParams.append('customer_name', filters.customer_name);
  if (filters.payment_status) queryParams.append('payment_status', filters.payment_status);
  if (filters.payment_method) queryParams.append('payment_method', filters.payment_method);
  if (filters.date_from) queryParams.append('date_from', filters.date_from);
  if (filters.date_to) queryParams.append('date_to', filters.date_to);
  if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
  if (filters.sort_order) queryParams.append('sort_order', filters.sort_order);
  if (filters.per_page) {
    // Support 'all' or 0 to get all records
    const perPageValue = filters.per_page === 'all' || filters.per_page === 0 ? 'all' : filters.per_page;
    queryParams.append('per_page', perPageValue);
  }
  if (filters.page) queryParams.append('page', filters.page);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/invoices?${queryString}` : '/invoices';

  try {
    const data = await apiFetch(endpoint, { method: 'GET' });

    if (data.success) {
      // Handle paginated response structure
      if (data.data && data.data.data) {
        return {
          invoices: data.data.data,
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
        invoices: data.data || [],
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
    throw new Error(data.message || 'Failed to fetch invoices');
  } catch (error) {
    // If the endpoint doesn't exist, return empty array
    if (error.message.includes('404') || error.message.includes('not found')) {
      console.warn('Invoices listing endpoint not available, returning empty array');
      return {
        invoices: [],
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
    throw error;
  }
};

// Get single invoice by ID
export const getInvoice = async (invoiceId) => {
  const data = await apiFetch(`/invoices/${invoiceId}`, {
    method: 'GET',
  });

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch invoice');
};

// Print an invoice to thermal printer
export const printInvoice = async (invoiceId) => {
  const token = localStorage.getItem('auth_token');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://server.transformations-fitness-studio.com/api';

  const res = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/print`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/pdf'
    }
  });

  if (!res.ok) throw new Error(`Failed to print invoice (${res.status})`);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};

// Download an invoice PDF
export const downloadInvoice = async (invoiceId, filename) => {
  const token = localStorage.getItem('auth_token');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://server.transformations-fitness-studio.com/api';

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

// Get invoice statistics
export const getInvoiceStats = async () => {
  try {
    const data = await apiFetch('/invoices-statistics', { method: 'GET' });

    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch invoice statistics');
  } catch (error) {
    // If stats endpoint doesn't exist, return basic stats
    console.warn('Invoice stats endpoint not available');
    return {
      total_invoices: 0,
      total_revenue: 0,
      paid_invoices: 0,
      pending_invoices: 0
    };
  }
};

// Update invoice
export const updateInvoice = async (invoiceId, updateData) => {
  const data = await apiFetch(`/invoices/${invoiceId}`, {
    method: 'PUT',
    body: updateData,
  });

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to update invoice');
};

// Delete invoice
export const deleteInvoice = async (invoiceId) => {
  const data = await apiFetch(`/invoices/${invoiceId}`, {
    method: 'DELETE',
  });

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to delete invoice');
};

// Get invoices by customer name
export const getInvoicesByCustomerName = async (customerName, filters = {}) => {
  const queryParams = new URLSearchParams({
    customer_name: customerName,
    ...filters
  });

  const data = await apiFetch(`/invoices-by-customer?${queryParams}`, {
    method: 'GET',
  });

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch invoices by customer');
};

// Bulk update invoice status
export const bulkUpdateInvoiceStatus = async (invoiceIds, paymentStatus, paymentMethod = null) => {
  const data = await apiFetch('/invoices-bulk-update-status', {
    method: 'PUT',
    body: {
      invoice_ids: invoiceIds,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
    },
  });

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to bulk update invoice status');
};

// Link invoice to customer
export const linkInvoiceToCustomer = async (invoiceId, customerId) => {
  const data = await apiFetch(`/invoices/${invoiceId}/link-customer`, {
    method: 'PUT',
    body: {
      customer_id: customerId,
    },
  });

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to link invoice to customer');
};

// Get guest invoices (invoices without customers)
export const getGuestInvoices = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  // Add filters to query params
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.payment_status) queryParams.append('payment_status', filters.payment_status);
  if (filters.payment_method) queryParams.append('payment_method', filters.payment_method);
  if (filters.date_from) queryParams.append('date_from', filters.date_from);
  if (filters.date_to) queryParams.append('date_to', filters.date_to);
  if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
  if (filters.sort_order) queryParams.append('sort_order', filters.sort_order);
  if (filters.per_page) {
    // Support 'all' or 0 to get all records
    const perPageValue = filters.per_page === 'all' || filters.per_page === 0 ? 'all' : filters.per_page;
    queryParams.append('per_page', perPageValue);
  }
  if (filters.page) queryParams.append('page', filters.page);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/invoices-guest?${queryString}` : '/invoices-guest';

  try {
    const data = await apiFetch(endpoint, { method: 'GET' });

    if (data.success) {
      // Handle paginated response structure
      if (data.data && data.data.data) {
        return {
          invoices: data.data.data,
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
        invoices: data.data || [],
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
    throw new Error(data.message || 'Failed to fetch guest invoices');
  } catch (error) {
    console.warn('Guest invoices endpoint not available');
    return {
      invoices: [],
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

// Bulk link invoices to customer
export const bulkLinkInvoicesToCustomer = async (invoiceIds, customerId) => {
  const data = await apiFetch('/invoices-bulk-link-customer', {
    method: 'PUT',
    body: {
      invoice_ids: invoiceIds,
      customer_id: customerId,
    },
  });

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to bulk link invoices to customer');
};
