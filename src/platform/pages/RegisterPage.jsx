import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../auth/components/onboarding/AuthLayout';
import StepIndicator from '../auth/components/onboarding/StepIndicator';
import Step1AccountType from '../auth/components/onboarding/Step1AccountType';
import Step2BusinessStructure from '../auth/components/onboarding/Step2BusinessStructure';
import Step3RegistrationDetails from '../auth/components/onboarding/Step3RegistrationDetails';
import useOnboardingStore from '../store/useOnboardingStore';

const RegisterPage = () => {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  return (
    <AuthLayout>
      <div className="w-full max-w-7xl mx-auto flex flex-col pt-8 pb-16">
        <StepIndicator />

        <div className="relative w-full">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <Step1AccountType key="step1" />}
            {currentStep === 2 && <Step2BusinessStructure key="step2" />}
            {currentStep === 3 && <Step3RegistrationDetails key="step3" />}
          </AnimatePresence>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
