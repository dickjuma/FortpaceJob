import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';
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
}) {
  const schema = React.useMemo(() => buildRegisterSchema(role, accountType), [role, accountType]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      antiSpamWebsite: '',
      ...initialValues,
    },
    mode: 'onChange',
  });

  const [submitError, setSubmitError] = React.useState(null);

  React.useEffect(() => {
    reset({
      email: '',
      password: '',
      antiSpamWebsite: '',
      ...initialValues,
    });
  }, [initialValues, reset]);

  React.useEffect(() => {
    const subscription = watch((values) => {
      onAutosave(values);
    });

    return () => subscription.unsubscribe();
  }, [onAutosave, watch]);

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
    () => {
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
            <span className="inline-flex items-center rounded-full bg-[#4C1D95]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4C1D95] dark:text-[#4C1D95]">
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
            Create your account with email and password only. We will complete the rest of your profile after sign-up.
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
                Only email and password are required now
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
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4C1D95]/10 text-[#4C1D95] dark:text-[#4C1D95]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Quick signup</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  We will finish your profile, business details, and preferences after sign-up.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Password"
                    error={errors.password?.message}
                  />
                )}
              />
            </div>
          </section>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/88 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack} icon={ArrowLeft} fullWidth={false}>
          Back
        </Button>

        <Button type="submit" variant="primary">
          Create account
        </Button>
      </div>
    </form>
  );
}
