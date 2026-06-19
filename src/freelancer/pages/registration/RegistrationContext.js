import React, { createContext, useContext, useState } from 'react';

const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Setup
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    // Professional Identity
    title: '',
    categoryId: '',
    subcategoryId: '',
    serviceId: '',
    overview: '',
    skills: [],
    portfolioUrl: '',
    linkedIn: '',
    github: '',
    // Verification & Security
    idDocumentType: '',
    idDocumentFront: null,
    idDocumentBack: null,
    address: '',
    city: '',
    country: '',
    // Availability & Preferences
    hourlyRate: '',
    availability: 'full-time',
    preferredWorkType: 'remote',
    openToRelocation: false,
  });

  const [errors, setErrors] = useState({});

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <RegistrationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        errors,
        setErrors,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};
