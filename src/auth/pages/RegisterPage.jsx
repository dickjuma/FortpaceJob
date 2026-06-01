import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SignupForm from '../components/SignupForm';
import RegisterTopNav from '../components/register/RegisterTopNav';
import RegisterBrandPanel from '../components/register/RegisterBrandPanel';
import RegisterBottomSections from '../components/register/RegisterBottomSections';
import { useOnboardingStore } from '../../common/store/onboardingStore';

export default function RegisterPage() {
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const setStep = useOnboardingStore((state) => state.setStep);

  useEffect(() => {
    if (currentStep < 1 || currentStep > 3) {
      setStep(1);
    }
  }, [currentStep, setStep]);

  const isDetailsStep = currentStep === 3;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <RegisterTopNav />

      <main>
        <section className="px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
          <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6">
            {!isDetailsStep && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-zinc-800 dark:bg-zinc-900 sm:p-7 lg:p-10"
              >
                <div className="mx-auto mb-8 max-w-5xl border-b border-zinc-200 pb-6 text-center dark:border-zinc-800">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#14a800] dark:text-[#14a800]">
                      Join the future of work
                  </p>
                  <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl lg:text-[2.9rem]">
                    Hire top talent or offer your services without the noise.
                  </h1>
                  <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                    A clean, trust-first registration flow for freelancers, clients, growing teams, and enterprise hiring.
                  </p>
                  <div className="mt-5 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                    Already have an account?{' '}
                    <Link
                      to="/auth/login"
                      className="font-semibold text-[#14a800] transition-colors hover:text-[#14a800] dark:text-[#14a800] dark:hover:text-[#14a800]"
                    >
                      Log in
                    </Link>
                  </div>
                </div>

                <div className="mx-auto max-w-6xl">
                  <SignupForm />
                </div>
              </motion.div>
            )}

            {isDetailsStep && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr] xl:items-start"
              >
                <RegisterBrandPanel />

                <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-zinc-800 dark:bg-zinc-900 sm:p-7 xl:p-9">
                  <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#14a800] dark:text-[#14a800]">
                        Final step
                      </p>
                      <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                        Create your account
                      </h1>
                      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        Simple account setup now. Full profile completion can happen after verification.
                      </p>
                    </div>
                    <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                      Already have an account?{' '}
                      <Link
                        to="/auth/login"
                        className="font-semibold text-[#14a800] transition-colors hover:text-[#14a800] dark:text-[#14a800] dark:hover:text-[#14a800]"
                      >
                        Log in
                      </Link>
                    </div>
                  </div>

                  <SignupForm />
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <RegisterBottomSections />
      </main>
    </div>
  );
}
