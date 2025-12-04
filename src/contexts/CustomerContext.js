import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  uploadCustomerProfilePicture,
  deleteCustomerProfilePicture,
  getCustomer,
} from 'services/customerService';

const CustomerContext = createContext();

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const initializedRef = useRef(false);
  const loadingRef = useRef(false);

  // Fetch all customers (only if not already loaded)
  const fetchCustomers = useCallback(async (force = false) => {
    // Check if already initialized and not forcing refresh
    if (initializedRef.current && !force) {
      return customers;
    }

    // Prevent concurrent fetches
    if (loadingRef.current) {
      return customers;
    }

    loadingRef.current = true;
    setLoading(true);
    try {
      // Use per_page=all to get all customers at once (new API supports this)
      const response = await getCustomers({ per_page: 'all' });
      const customerList = response.customers || [];
      setCustomers(customerList);
      initializedRef.current = true;
      return customerList;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [customers]);

  // Get a single customer by ID (from cache or API)
  const getCustomerById = useCallback(async (customerId) => {
    // First check cache
    const cachedCustomer = customers.find(c => c.id === parseInt(customerId));
    if (cachedCustomer) {
      return cachedCustomer;
    }

    // If not in cache, fetch from API
    try {
      const customer = await getCustomer(customerId);
      // Add to cache
      setCustomers(prev => {
        const exists = prev.find(c => c.id === customer.id);
        if (exists) {
          return prev.map(c => c.id === customer.id ? customer : c);
        }
        return [...prev, customer];
      });
      return customer;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }, [customers]);

  // Add a new customer
  const addCustomer = useCallback(async (customerData, profilePictureFile) => {
    try {
      const newCustomer = await createCustomer(customerData);
      
      // Upload profile picture if provided
      if (profilePictureFile) {
        await uploadCustomerProfilePicture(newCustomer.id, profilePictureFile);
        // Refetch to get updated customer with picture URL
        const updatedCustomer = await getCustomer(newCustomer.id);
        setCustomers(prev => [...prev, updatedCustomer]);
        return updatedCustomer;
      }
      
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  }, []);

  // Update an existing customer
  const editCustomer = useCallback(async (customerId, customerData, profilePictureFile) => {
    try {
      const updatedCustomer = await updateCustomer(customerId, customerData);
      
      // Upload new profile picture if provided
      if (profilePictureFile) {
        await uploadCustomerProfilePicture(customerId, profilePictureFile);
      }
      
      // Refetch to get the latest data
      const latestCustomer = await getCustomer(customerId);
      
      // Update in cache
      setCustomers(prev =>
        prev.map(c => c.id === parseInt(customerId) ? latestCustomer : c)
      );
      
      return latestCustomer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }, []);

  // Delete a customer
  const removeCustomer = useCallback(async (customerId) => {
    try {
      await deleteCustomer(customerId);
      setCustomers(prev => prev.filter(c => c.id !== parseInt(customerId)));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }, []);

  // Remove profile picture
  const removeCustomerProfilePicture = useCallback(async (customerId) => {
    try {
      await deleteCustomerProfilePicture(customerId);
      
      // Update customer in cache
      setCustomers(prev =>
        prev.map(c =>
          c.id === parseInt(customerId)
            ? { ...c, profile_picture_url: null }
            : c
        )
      );
    } catch (error) {
      console.error('Error deleting customer profile picture:', error);
      throw error;
    }
  }, []);

  // Force refresh all data
  const refreshCustomers = useCallback(async () => {
    return fetchCustomers(true);
  }, [fetchCustomers]);

  const value = {
    customers,
    loading,
    fetchCustomers,
    getCustomerById,
    addCustomer,
    editCustomer,
    removeCustomer,
    removeCustomerProfilePicture,
    refreshCustomers,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

