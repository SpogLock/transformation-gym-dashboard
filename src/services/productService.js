import apiFetch from './api';

/**
 * Product Service
 * Handles all product/inventory management API calls
 */

// Get all products with filters
export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.supplier) queryParams.append('supplier', filters.supplier);
  if (filters.stock_status) queryParams.append('stock_status', filters.stock_status);
  if (filters.is_active !== undefined) queryParams.append('is_active', filters.is_active);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
  if (filters.sort_order) queryParams.append('sort_order', filters.sort_order);
  if (filters.per_page) queryParams.append('per_page', filters.per_page);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';
  
  const data = await apiFetch(endpoint, { method: 'GET' });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch products');
};

// Get single product by ID
export const getProduct = async (productId) => {
  const data = await apiFetch(`/products/${productId}`, { method: 'GET' });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to fetch product');
};

// Create new product
export const createProduct = async (productData) => {
  const data = await apiFetch('/products', {
    method: 'POST',
    body: productData,
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to create product');
};

// Update existing product
export const updateProduct = async (productId, productData) => {
  const data = await apiFetch(`/products/${productId}`, {
    method: 'PUT',
    body: productData,
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to update product');
};

// Delete product
export const deleteProduct = async (productId) => {
  const data = await apiFetch(`/products/${productId}`, {
    method: 'DELETE',
  });
  
  if (data.success) {
    return data.message;
  }
  throw new Error(data.message || 'Failed to delete product');
};

// Restock product
export const restockProduct = async (productId, quantity) => {
  const data = await apiFetch(`/products/${productId}/restock`, {
    method: 'POST',
    body: { quantity },
  });
  
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to restock product');
};

// Get product statistics
export const getProductStatistics = async () => {
  const data = await apiFetch('/products/statistics', { method: 'GET' });
  
  if (data.success) {
    return data.data.statistics;
  }
  throw new Error(data.message || 'Failed to fetch product statistics');
};

