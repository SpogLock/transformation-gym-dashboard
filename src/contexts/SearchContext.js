import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    membershipStatus: '',
    customerPlan: '',
    feeStatus: '',
    trainerRequired: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      membershipStatus: '',
      customerPlan: '',
      feeStatus: '',
      trainerRequired: '',
    });
  };

  const resetSearch = () => {
    setSearchQuery('');
    clearFilters();
  };

  const value = {
    searchQuery,
    filters,
    isFilterOpen,
    setIsFilterOpen,
    updateSearchQuery,
    updateFilters,
    clearFilters,
    resetSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
