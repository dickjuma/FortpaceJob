import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Building2, Mail, ShieldCheck, UserRound, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../common/authStore';
import { useOnboardingStore } from '../../common/store/onboardingStore';
import { authAPI } from '../services/authApi';
import Button from './ui/Button';
import Input from './ui/Input';
import PasswordInput from './ui/PasswordInput';
import SignupStepper from './SignupStepper';
import { validateEmail, validatePassword } from '../../common/utils/validation';

const SIGNUP_STEPS = [
  { num: 1, label: 'Choose role' },
  { num: 2, label: 'Create account' },
];

const ROLE_CHOICES = [
  {
    id: 'CLIENT',
    title: 'Client',
    description: 'Hire talent, post projects, and manage delivery from the client workspace.',
    icon: Users,
  },
  {
    id: 'FREELANCER',
    title: 'Freelancer',
    description: 'Find work, build your reputation, and launch a stronger service profile.',
    icon: Briefcase,
  },
];

export default function SignupForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const store = useOnboardingStore();
  const [formError, setFormError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const roleLabel = useMemo(() => {
    if (store.selectedRole === 'CLIENT') return 'Client account';
    if (store.selectedRole === 'FREELANCER') return 'Freelancer account';
    return 'Account type';
  }, [store.selectedRole]);

  const resetError = () => {
    if (formError) setFormError('');
  };

  const handleRoleSelect = (role) => {
    resetError();
    store.setSelectedRole(role);
    store.setStep(2);
  };

  const handleBack = () => {
    resetError();
    store.setStep(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetError();

    if (!store.selectedRole) {
      const message = 'Please choose whether you are joining as a client or freelancer.';
      setFormError(message);
      toast.error(message);
      return;
    }

    const emailError = validateEmail(credentials.email);
    if (emailError) {
      setFormError(emailError);
      toast.error(emailError);
      return;
    }

    const passwordError = validatePassword(credentials.password);
    if (passwordError) {
      setFormError(passwordError);
      toast.error(passwordError);
      return;
    }

    const email = credentials.email.trim().toLowerCase();
    const payload = {
      email,
      password: credentials.password,
      role: store.selectedRole,
      accountType: 'INDIVIDUAL',
    };

    try {
      store.setSubmitting(true);
      const data = await authAPI.register(payload);

      if (data?.accessToken && data?.user) {
        setAuth(data.user, data.accessToken, data.refreshToken);
        const role = String(data.user?.role || store.selectedRole || '').toUpperCase();
        if (role === 'FREELANCER' || role === 'FREELANCE') {
          const { subscriptionAPI } = await import('../../common/services/subscriptionApi');
          subscriptionAPI.getMySubscription().catch(() => {});
        }
      }

      sessionStorage.setItem('pendingVerificationEmail', email);
      toast.success('Account created. Finish your profile to unlock the dashboard.');
      navigate('/auth/profile-completion', { replace: true });
    } catch (error) {
      const message = error.message || 'We could not create your account. Please try again.';
      setFormError(message);
      toast.error(message);
    } finally {
      store.setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <SignupStepper currentStep={store.currentStep > 2 ? 2 : store.currentStep} steps={SIGNUP_STEPS} />

      {formError && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {formError}
        </div>
      )}

      {store.currentStep === 1 ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {ROLE_CHOICES.map((choice) => {
              const isSelected = store.selectedRole === choice.id;
              const Icon = choice.icon;

              return (
                <motion.button
                  key={choice.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleRoleSelect(choice.id)}
                  className={`rounded-[1.6rem] border p-5 text-left transition-all ${
                    isSelected
                      ? 'border-[#4C1D95] bg-[#4C1D95]/5 shadow-[0_18px_40px_rgba(20,168,0,0.12)]'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${isSelected ? 'bg-[#4C1D95] text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                      Select
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black text-zinc-950 dark:text-white">{choice.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{choice.description}</p>
                </motion.button>
              );
            })}
          </div>

          <div className="rounded-[1.6rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4C1D95]/10 text-[#4C1D95]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Profile details come later</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  We only need your role here. Your full profile, business details, skills, and work preferences are completed after sign-up.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#4C1D95]">{roleLabel}</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Create your account</h2>
              </div>
              <div className="hidden rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 sm:flex">
                Blank profile will be created automatically
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Email address"
                  icon={Mail}
                  type="email"
                  placeholder="name@company.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials((current) => ({ ...current, email: e.target.value }))}
                  required
                />
              </div>

              <PasswordInput
                label="Password"
                value={credentials.password}
                onChange={(e) => setCredentials((current) => ({ ...current, password: e.target.value }))}
                required
              />

            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              Your profile details, company information, or freelancer portfolio can be completed from the profile page after sign-up.
            </div>
          </div>

          <div className="sticky bottom-4 z-20 flex flex-col-reverse gap-3 rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/88 sm:flex-row">
              <Button type="button" variant="secondary" onClick={handleBack} icon={ArrowLeft} fullWidth={false}>
                Back
              </Button>

            <Button
              variant="primary"
              type="submit"
              isLoading={store.isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="flex-1 sm:ml-auto sm:max-w-xs"
            >
              Create account
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}


