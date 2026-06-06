import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Shield, Zap } from 'lucide-react';
import useOnboardingStore from '../../../store/useOnboardingStore';
import FormInput from './FormInput';
import SocialLoginButtons from './SocialLoginButtons';
import { authAPI } from '../../../common/services/api';
import { useAuthStore } from '../../../common/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../common/context/ToastContext';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Step3RegistrationDetails = () => {
  const { accountType, businessStructure, prevStep } = useOnboardingStore();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email.toLowerCase(),
        password: data.password,
        role: accountType === 'freelancer' ? 'FREELANCER' : 'CLIENT',
        accountType: businessStructure === 'individual' ? 'INDIVIDUAL' : 'SME',
      };

      const res = await authAPI.register(payload);

      if (res?.accessToken && res?.user) {
        setAuth(res.user, res.accessToken, res.refreshToken);
      }

      toast.success('Registration successful!');
      sessionStorage.setItem('pendingVerificationEmail', payload.email);
      navigate('/auth/profile-completion');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-[#4C1D95]/25 overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 mt-4"
    >
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#4C1D95] to-blue-700 p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -tranzinc-y-1/2 tranzinc-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl tranzinc-y-1/3 -tranzinc-x-1/4" />

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">
            You're almost there.
          </h2>
          <p className="text-white/90 text-lg mb-12 max-w-md">
            Join thousands of {businessStructure === 'individual' ? 'professionals' : 'businesses'} scaling their success on Forte.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">Enterprise Security</h4>
                <p className="text-sm text-white/90">Bank-grade encryption & protection</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">Lightning Fast</h4>
                <p className="text-sm text-white/90">Optimized workflows and hiring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
        <button
          onClick={prevStep}
          className="self-start flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Create your account</h3>
        <p className="text-zinc-500 mb-8">
          Setting up as a <strong className="text-[#4C1D95] dark:text-[#4C1D95] capitalize">{accountType}</strong> ({businessStructure}).
        </p>

        <SocialLoginButtons />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormInput
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email}
          />

          <FormInput
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 w-full flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              isSubmitting
                ? 'bg-zinc-400 cursor-wait'
                : 'bg-[#4C1D95] hover:bg-[#22C55E] text-white shadow-lg shadow-[#4C1D95]/25 hover:shadow-[#4C1D95]/25 hover:-tranzinc-y-0.5'
            }`}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Step3RegistrationDetails;
