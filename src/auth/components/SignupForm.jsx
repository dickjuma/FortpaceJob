import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '../../common/store/onboardingStore';
import { useAuthStore } from '../../common/authStore';
import { authAPI } from '../services/authApi';
import AccountTypeSelection from './AccountTypeSelection';
import SignupStepper from './SignupStepper';
import Button from './ui/Button';
import RegisterDetailsStep from './register/RegisterDetailsStep';

const SIGNUP_STEPS = [
  { num: 1, label: 'Join As' },
  { num: 2, label: 'Account Type' },
  { num: 3, label: 'Details' },
];

export default function SignupForm() {
  const store = useOnboardingStore();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formError, setFormError] = useState(null);

  const accountTypeLabel = useMemo(() => {
    const roleLabel = store.selectedRole === 'FREELANCER' ? 'Freelancer' : 'Client';
    const typeLabel = {
      INDIVIDUAL: 'Individual',
      SME: 'SME',
      CORPORATE: 'Corporate',
    }[store.accountType] || 'Account';

    return `${typeLabel} ${roleLabel}`;
  }, [store.accountType, store.selectedRole]);

  const handleContinue = () => {
    setFormError(null);

    if (store.currentStep === 1) {
      if (!store.selectedRole) {
        setFormError('Please select if you are joining as a client or freelancer.');
        return;
      }

      store.setStep(2);
      return;
    }

    if (store.currentStep === 2) {
      if (!store.accountType) {
        setFormError('Please select individual, SME, or corporate account type.');
        return;
      }

      store.setStep(3);
      return;
    }
  };

  const handleSubmitDetails = async (values) => {
    setFormError(null);

    const fullName = values.fullName.trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(' ') || firstName;
    const isBusinessAccount = store.accountType === 'SME' || store.accountType === 'CORPORATE';

    const payload = {
      name: fullName,
      fullName,
      firstName,
      lastName,
      email: values.email.trim().toLowerCase(),
      password: values.password,
      role: store.selectedRole,
      accountType: store.accountType,
      companyName: isBusinessAccount ? values.businessName.trim() : undefined,
      industry: isBusinessAccount ? values.industry : undefined,
      companySize: isBusinessAccount ? values.companySize : undefined,
      phoneNumber: values.phoneNumber || undefined,
      country: values.country || undefined,
      teamSize: values.teamSize || undefined,
      primarySkillCategory: values.primarySkillCategory || undefined,
      experienceLevel: values.experienceLevel || undefined,
      hiringNeeds: values.hiringNeeds || undefined,
    };

    try {
      store.setSubmitting(true);
      const data = await authAPI.register(payload);

      if (data?.accessToken && data?.user) {
        setAuth(data.user, data.accessToken, data.refreshToken);
      }

      sessionStorage.setItem('pendingVerificationEmail', payload.email);
      navigate('/auth/verify-email', {
        state: {
          email: payload.email,
          role: payload.role,
          accountType: payload.accountType,
        },
      });
    } catch (error) {
      throw error;
    } finally {
      store.setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <SignupStepper currentStep={store.currentStep > 3 ? 3 : store.currentStep} steps={SIGNUP_STEPS} />

      {formError && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {formError}
        </div>
      )}

      {store.currentStep < 3 ? (
        <AccountTypeSelection
          currentStep={store.currentStep}
          selectedRole={store.selectedRole}
          selectedAccountType={store.accountType}
          onRoleSelect={store.setSelectedRole}
          onAccountTypeSelect={store.setAccountType}
        />
      ) : (
        <RegisterDetailsStep
          role={store.selectedRole}
          accountType={store.accountType}
          initialValues={store.details}
          lastSavedAt={store.lastSavedAt}
          onBack={() => store.setStep(2)}
          onAutosave={store.updateDetails}
          onSubmit={handleSubmitDetails}
          accountTypeLabel={accountTypeLabel}
        />
      )}

      {store.currentStep < 3 && (
        <div className="sticky bottom-4 z-20 mt-8 flex flex-col-reverse gap-3 rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/88 sm:flex-row">
          {store.currentStep > 1 && (
            <Button variant="secondary" onClick={() => store.setStep(store.currentStep - 1)} icon={ArrowLeft} fullWidth={false}>
              Back
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleContinue}
            isLoading={store.isSubmitting}
            icon={ArrowRight}
            iconPosition="right"
            className="flex-1 sm:ml-auto sm:max-w-xs"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
