import React, { createContext, useContext, useState } from 'react';

const FreelancerContext = createContext();

export function FreelancerProvider({ children }) {
  // Global state for account type simulation
  // This will eventually be populated by your real backend API / JWT token
  const [accountType, setAccountType] = useState('INDIVIDUAL'); // INDIVIDUAL, SME, AGENCY, CORPORATE
  const [isOfflineProvider, setIsOfflineProvider] = useState(false);

  const switchAccountType = (type) => {
    setAccountType(type);
  };

  const toggleOfflineProvider = () => {
    setIsOfflineProvider(prev => !prev);
  };

  return (
    <FreelancerContext.Provider value={{ accountType, switchAccountType, isOfflineProvider, toggleOfflineProvider }}>
      {children}
    </FreelancerContext.Provider>
  );
}

export function useFreelancer() {
  const context = useContext(FreelancerContext);
  if (!context) {
    throw new Error('useFreelancer must be used within a FreelancerProvider');
  }
  return context;
}
