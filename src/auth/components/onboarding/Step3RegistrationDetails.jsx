import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Star, Shield, Zap } from 'lucide-react';
import useOnboardingStore from '../../../store/useOnboardingStore';
import FormInput from './FormInput';
import SocialLoginButtons from './SocialLoginButtons';
import { authAPI } from '../../../common/services/api';
import { useAuthStore } from '../../../common/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../common/context/ToastContext';

// Dynamic validation schema based on account types
const createSchema = (accountType, businessStructure) => {
  return z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    // Conditional fields
    ...(businessStructure !== 'individual' && {
      companyName: z.string().min(2, 'Company name is required'),
      industry: z.string().min(2, 'Industry is required'),
    }),
    ...(accountType === 'freelancer' && {
      primarySkill: z.string().min(2, 'Primary skill is required'),
    })
  });
};

const Step3RegistrationDetails = () => {
  const { accountType, businessStructure, prevStep } = useOnboardingStore();
  
  const schema = createSchema(accountType, businessStructure);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched'
  });

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.fullName,
        fullName: data.fullName,
        firstName: data.fullName.split(' ')[0],
        lastName: data.fullName.split(' ').slice(1).join(' ') || data.fullName.split(' ')[0],
        email: data.email.toLowerCase(),
        password: data.password,
        role: accountType === 'freelancer' ? 'FREELANCER' : 'CLIENT',
        accountType: businessStructure === 'individual' ? 'INDIVIDUAL' : 'SME',
        companyName: data.companyName,
        industry: data.industry,
        primarySkillCategory: data.primarySkill
      };

      const res = await authAPI.register(payload);
      
      if (res?.accessToken && res?.user) {
        setAuth(res.user, res.accessToken, res.refreshToken);
      }
      
      toast.success('Registration successful!');
      sessionStorage.setItem('pendingVerificationEmail', payload.email);
      navigate('/auth/verify-email');
      
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
      className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-[#14a800]/25 overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 mt-4"
    >
      {/* Left Panel - Branding & Social Proof */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#14a800] to-blue-700 p-12 flex-col justify-between relative overflow-hidden text-white">
        {/* Abstract Background Shapes */}
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

        <div className="relative z-10 mt-12 bg-black/20 p-6 rounded-2xl backdrop-blur-md border border-white/10">
          <div className="flex gap-1 text-yellow-400 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <p className="text-sm text-#14a800]/5 italic mb-4">
            "Forte completely transformed how we build our remote engineering team. The quality of talent is unmatched."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-#14a800]/50 rounded-full flex items-center justify-center text-#118a00] font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-xs text-#14a800]/30">CTO, TechCorp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
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
          Setting up as a <strong className="text-[#14a800] dark:text-[#14a800] capitalize">{accountType}</strong> ({businessStructure}).
        </p>

        <SocialLoginButtons />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <FormInput 
              label="Full Name" 
              {...register('fullName')} 
              error={errors.fullName} 
            />
          </div>

          <FormInput 
            label="Email Address" 
            type="email" 
            {...register('email')} 
            error={errors.email} 
          />

          {businessStructure !== 'individual' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <FormInput 
                label="Company Name" 
                {...register('companyName')} 
                error={errors.companyName} 
              />
              <FormInput 
                label="Industry" 
                {...register('industry')} 
                error={errors.industry} 
              />
            </div>
          )}

          {accountType === 'freelancer' && (
            <FormInput 
              label="Primary Skill / Category" 
              {...register('primarySkill')} 
              error={errors.primarySkill} 
            />
          )}

          <FormInput 
            label="Password" 
            type="password" 
            {...register('password')} 
            error={errors.password} 
          />

          <div className="mt-8 flex items-start gap-3">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 border border-zinc-300 rounded bg-zinc-50 focus:ring-3 focus:ring-[#14a800] dark:bg-zinc-700 dark:border-zinc-600 dark:focus:ring-[#14a800] dark:ring-offset-zinc-800"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-zinc-500 dark:text-zinc-400">
              I agree to the <a href="/terms" className="font-semibold text-[#14a800] hover:underline dark:text-[#14a800]">Terms and Conditions</a> and <a href="/privacy" className="font-semibold text-[#14a800] hover:underline dark:text-[#14a800]">Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 w-full flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              isSubmitting 
                ? 'bg-zinc-400 cursor-wait' 
                : 'bg-[#14a800] hover:bg-[#118a00] text-white shadow-lg shadow-[#14a800]/25 hover:shadow-[#14a800]/25 hover:-tranzinc-y-0.5'
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
