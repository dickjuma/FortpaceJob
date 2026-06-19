import React from 'react';
import { RegistrationProvider, useRegistration } from './RegistrationContext';
import { RegistrationLayout } from './components/RegistrationLayout';
import { AccountSetup } from './components/AccountSetup';
import { ProfessionalIdentity } from './components/ProfessionalIdentity';
import { VerificationSecurity } from './components/VerificationSecurity';
import { AvailabilityPreferences } from './components/AvailabilityPreferences';
import { RegistrationSuccess } from './components/RegistrationSuccess';

const WizardContent = () => {
  const { currentStep } = useRegistration();

  if (currentStep === 5) {
    return <RegistrationSuccess />;
  }

  return (
    <RegistrationLayout>
      {currentStep === 1 && <AccountSetup />}
      {currentStep === 2 && <ProfessionalIdentity />}
      {currentStep === 3 && <VerificationSecurity />}
      {currentStep === 4 && <AvailabilityPreferences />}
    </RegistrationLayout>
  );
};

export default function FreelancerRegistrationWizard() {
  return (
    <RegistrationProvider>
      <WizardContent />
    </RegistrationProvider>
  );
}
