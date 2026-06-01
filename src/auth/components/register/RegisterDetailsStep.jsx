import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, Building2, Mail, ShieldCheck, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import TurnstileWidget from '../TurnstileWidget';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';
import SelectField from './fields/SelectField';
import PhoneField from './fields/PhoneField';
import {
  COMPANY_SIZE_OPTIONS,
  COUNTRY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  HIRING_NEEDS_OPTIONS,
  INDUSTRY_OPTIONS,
  SKILL_CATEGORY_OPTIONS,
  TEAM_SIZE_OPTIONS,
  getCountryOption,
} from './registerOptions';
import { buildRegisterSchema } from './registerSchema';

export default function RegisterDetailsStep({
  role,
  accountType,
  initialValues,
  lastSavedAt,
  onBack,
  onAutosave,
  onSubmit,
  accountTypeLabel,
  turnstileEnabled = false,
  onTurnstileVerify,
}) {
  const schema = React.useMemo(() => buildRegisterSchema(role, accountType), [role, accountType]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const [submitError, setSubmitError] = React.useState(null);
  const watchedCountry = watch('country');
  const watchedBusinessName = watch('businessName');

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  React.useEffect(() => {
    const subscription = watch((values) => {
      onAutosave(values);
    });

    return () => subscription.unsubscribe();
  }, [onAutosave, watch]);

  const isBusinessAccount = accountType === 'SME' || accountType === 'CORPORATE';
  const isFreelancer = role === 'FREELANCER';
  const countryMeta = getCountryOption(watchedCountry);

  const submitForm = handleSubmit(
    async (values) => {
      setSubmitError(null);

      try {
        await onSubmit(values);
      } catch (error) {
        const msg = error.message || 'We could not create your account. Please try again.';
        setSubmitError(msg);
        toast.error(msg);
      }
    },
    (errors) => {
      toast.error('Please fix the errors in the form before submitting.');
    }
  );

  return (
    <form onSubmit={submitForm} className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#14a800]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#14a800] dark:text-[#14a800]">
              {role === 'CLIENT' ? 'Client journey' : 'Freelancer journey'}
            </span>
            <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white dark:bg-white dark:text-zinc-950">
              {accountTypeLabel || accountType}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
            Registration details
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Add your account details and we will tailor the workspace, verification, and onboarding around your setup.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Session autosave enabled
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {lastSavedAt
                  ? `Last saved ${new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
                  : 'Your progress will be preserved during this session.'}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-zinc-400">
                Country default: {countryMeta.label} {countryMeta.dialCode}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {submitError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {submitError}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14a800]/10 text-[#14a800] dark:text-[#14a800]">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Identity</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Core account details for sign-in and public profile setup.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Full name"
                    icon={UserRound}
                    placeholder="Jane Doe"
                    error={errors.fullName?.message}
                  />
                )}
              />

              {isBusinessAccount ? (
                <Controller
                  name="businessName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Business name"
                      icon={Building2}
                      placeholder={role === 'CLIENT' ? 'Northforge Studio' : 'Atlas Creative Agency'}
                      error={errors.businessName?.message}
                    />
                  )}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  Individual accounts can add a business or studio name later from profile settings.
                </div>
              )}

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Email address"
                    icon={Mail}
                    type="email"
                    placeholder="name@company.com"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Country"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={COUNTRY_OPTIONS.map((item) => ({
                      value: item.code,
                      label: `${item.label} (${item.dialCode})`,
                    }))}
                    error={errors.country?.message}
                  />
                )}
              />

              <div className="md:col-span-2">
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneField
                      label="Phone number"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      country={watchedCountry}
                      error={errors.phoneNumber?.message}
                      helperText="Used for secure account alerts and future phone verification."
                    />
                  )}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Profile context</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Tell us what kind of work or hiring journey this account is for.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {isBusinessAccount && (
                <>
                  <Controller
                    name="companySize"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        label="Company size"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={COMPANY_SIZE_OPTIONS}
                        error={errors.companySize?.message}
                      />
                    )}
                  />
                  <Controller
                    name="teamSize"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        label="Team size"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={TEAM_SIZE_OPTIONS}
                        error={errors.teamSize?.message}
                      />
                    )}
                  />
                  <div className="md:col-span-2">
                    <Controller
                      name="industry"
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          label="Industry"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          options={INDUSTRY_OPTIONS}
                          error={errors.industry?.message}
                        />
                      )}
                    />
                  </div>
                </>
              )}

              {isFreelancer ? (
                <>
                  <Controller
                    name="primarySkillCategory"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        label="Primary skill category"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={SKILL_CATEGORY_OPTIONS}
                        error={errors.primarySkillCategory?.message}
                      />
                    )}
                  />
                  <Controller
                    name="experienceLevel"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        label="Experience level"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={EXPERIENCE_LEVEL_OPTIONS}
                        error={errors.experienceLevel?.message}
                      />
                    )}
                  />
                </>
              ) : (
                <div className="md:col-span-2">
                  <Controller
                    name="hiringNeeds"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        label="Hiring needs"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={HIRING_NEEDS_OPTIONS}
                        error={errors.hiringNeeds?.message}
                        helperText="This helps shape your dashboard and recommendations after registration."
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Secure access</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Create a strong password and prepare your account for verification.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Password"
                    showStrength
                    error={errors.password?.message}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Confirm password"
                    error={errors.confirmPassword?.message}
                    showStrength={false}
                  />
                )}
              />
            </div>

            {turnstileEnabled && (
              <div className="mt-5">
                <TurnstileWidget onVerify={onTurnstileVerify} />
              </div>
            )}

            <Controller
              name="antiSpamWebsite"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
              )}
            />
          </section>

          <section className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
            <h3 className="text-base font-bold text-zinc-950 dark:text-white">
              Protected by enterprise-grade security
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              <p>Your registration is designed for secure verification, consent-aware onboarding, and future compliance-ready profile completion.</p>
              <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                icon={ArrowLeft}
                onClick={onBack}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="gradient"
                isLoading={isSubmitting}
                className="flex-1"
              >
                Create account
              </Button>
            </div>
            <p className="mt-4 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
              Business account name: {watchedBusinessName || 'Not provided yet'}.
            </p>
          </section>
        </div>
      </div>
    </form>
  );
}
