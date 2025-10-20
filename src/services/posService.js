import apiFetch from './api';

// Create POS Sale (Multi-Product Invoice)
export const createPOSSale = async (saleData) => {
  const data = await apiFetch('/invoices', {
    method: 'POST',
    body: saleData,
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to create POS sale');
};

// Get Customer List for POS
export const getCustomersForPOS = async (searchTerm = '', page = 1, perPage = 15) => {
  const queryParams = new URLSearchParams({
    search: searchTerm,
    per_page: perPage.toString(),
    page: page.toString(),
    sort_by: 'name',
    sort_order: 'asc'
  });
  
  const data = await apiFetch(`/customers?${queryParams}`, {
    method: 'GET',
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch customers');
};

// Get Product List for POS
export const getProductsForPOS = async (searchTerm = '', page = 1, perPage = 50) => {
  const queryParams = new URLSearchParams({
    is_active: 'true',
    stock_status: 'in_stock',
    search: searchTerm,
    per_page: perPage.toString(),
    page: page.toString()
  });
  
  const data = await apiFetch(`/products?${queryParams}`, {
    method: 'GET',
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch products');
};

// Get Invoice Details
export const getInvoiceDetails = async (invoiceId) => {
  const data = await apiFetch(`/invoices/${invoiceId}`, {
    method: 'GET',
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch invoice details');
};

// Search customers by name, email, or mobile
export const searchCustomers = async (searchTerm) => {
  if (searchTerm.length < 2) {
    return { customers: [], pagination: { total: 0 } };
  }
  
  try {
    const data = await getCustomersForPOS(searchTerm, 1, 10);
    return data;
  } catch (error) {
    console.error('Error searching customers:', error);
    return { customers: [], pagination: { total: 0 } };
  }
};

// Search products by name, brand, or category
export const searchProducts = async (searchTerm) => {
  try {
    const data = await getProductsForPOS(searchTerm, 1, 50);
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    return { data: [], pagination: { total: 0 } };
  }
};

// Process POS sale with validation
export const processPOSSale = async (cartItems, customerId, paymentMethod, discount = 0, tax = 0, notes = '', salespersonId = null) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  // Validate cart items
  for (const item of cartItems) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      throw new Error('Invalid cart item');
    }
    if (item.quantity > item.stock) {
      throw new Error(`Insufficient stock for ${item.name}. Available: ${item.stock}`);
    }
  }

  // Prepare transactions array
  const transactions = cartItems.map(item => ({
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: parseFloat(item.price)
  }));

  const requestData = {
    customer_id: customerId || null,
    transactions: transactions,
    tax_amount: parseFloat(tax),
    discount_amount: parseFloat(discount),
    payment_method: paymentMethod,
    notes: notes || `POS sale - ${customerId ? 'Customer purchase' : 'Guest sale'}`,
    // Optional: explicitly assign a salesperson different from the authenticated user
    staff_id: salespersonId || undefined
  };

  return await createPOSSale(requestData);
};
