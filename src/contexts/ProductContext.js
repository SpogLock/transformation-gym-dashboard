import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
import {
  getProducts as fetchProducts,
  getProduct as fetchProduct,
  createProduct as createProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
  restockProduct as restockProductAPI,
  getProductStatistics as fetchProductStatistics,
} from '../services/productService';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs to prevent duplicate fetches
  const initializedRef = useRef(false);
  const loadingRef = useRef(false);

  // Fetch all products with caching
  const fetchAllProducts = useCallback(async (filters = {}, force = false) => {
    // Return cached data if already initialized and not forcing refresh
    if (initializedRef.current && !force && Object.keys(filters).length === 0) {
      return products;
    }

    // Prevent concurrent calls
    if (loadingRef.current) {
      return products;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts(filters);
      const productList = data.data || [];
      setProducts(productList);
      
      // Only mark as initialized if no filters (full list)
      if (Object.keys(filters).length === 0) {
        initializedRef.current = true;
      }
      
      return productList;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [products]);

  // Fetch product statistics
  const fetchStats = useCallback(async (force = false) => {
    if (statistics && !force) {
      return statistics;
    }

    try {
      const stats = await fetchProductStatistics();
      setStatistics(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching product statistics:', err);
      throw err;
    }
  }, [statistics]);

  // Get single product
  const getProductById = useCallback(async (productId) => {
    try {
      const product = await fetchProduct(productId);
      return product;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Create new product
  const addProduct = useCallback(async (productData) => {
    try {
      const newProduct = await createProductAPI(productData);
      
      // Update local cache
      setProducts(prev => [newProduct, ...prev]);
      
      // Try to refresh statistics, but don't fail the add if it fails
      try {
        await fetchStats(true);
      } catch (statsError) {
        console.warn('Failed to refresh statistics after add:', statsError.message);
        // Don't throw - the add was successful
      }
      
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  // Update existing product
  const editProduct = useCallback(async (productId, productData) => {
    try {
      const updatedProduct = await updateProductAPI(productId, productData);
      
      // Update local cache
      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? updatedProduct : product
        )
      );
      
      // Try to refresh statistics, but don't fail the edit if it fails
      try {
        await fetchStats(true);
      } catch (statsError) {
        console.warn('Failed to refresh statistics after edit:', statsError.message);
        // Don't throw - the edit was successful
      }
      
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  // Delete product
  const removeProduct = useCallback(async (productId) => {
    try {
      await deleteProductAPI(productId);
      
      // Update local cache
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      // Try to refresh statistics, but don't fail the delete if it fails
      try {
        await fetchStats(true);
      } catch (statsError) {
        console.warn('Failed to refresh statistics after delete:', statsError.message);
        // Don't throw - the delete was successful
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  // Restock product
  const restock = useCallback(async (productId, quantity) => {
    try {
      const updatedProduct = await restockProductAPI(productId, quantity);
      
      // Update local cache
      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? updatedProduct : product
        )
      );
      
      // Try to refresh statistics, but don't fail the restock if it fails
      try {
        await fetchStats(true);
      } catch (statsError) {
        console.warn('Failed to refresh statistics after restock:', statsError.message);
        // Don't throw - the restock was successful
      }
      
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Force refresh all data
  const refreshAll = useCallback(async () => {
    initializedRef.current = false;
    await Promise.all([
      fetchAllProducts({}, true),
      fetchStats(true)
    ]);
  }, [fetchAllProducts, fetchStats]);

  const value = {
    products,
    statistics,
    loading,
    error,
    fetchAllProducts,
    fetchStats,
    getProductById,
    addProduct,
    editProduct,
    removeProduct,
    restock,
    clearError,
    refreshAll,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

