import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationStore, useAuthStore } from '../../store/authStore';
import PasswordStrength from './PasswordStrength';
import { authAPI } from '../../common/services/api';
import { registerRules, termsRule } from '../../common/utils/validationRules';

const FloatingInput = ({ label, type = "text", register, error, placeholder, ...rest }) => (
  <div className="relative mb-6">
    <input
      type={type}
      placeholder={placeholder || " "}
      className={`peer w-full h-16 px-5 pt-5 pb-1 rounded-2xl border-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:border-emerald-500 focus:ring-emerald-500'} bg-surface hover:bg-zinc-100 focus:bg-white text-zinc-900 shadow-sm focus:outline-none focus:ring-1 transition-all placeholder-transparent text-lg`}
      {...register}
      {...rest}
    />
    <label className={`absolute left-5 top-2 text-sm transition-all pointer-events-none ${error ? 'text-red-500' : 'text-zinc-500'} peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-sm peer-focus:text-success font-medium`}>
      {label}
    </label>
    {error && <span className="text-sm text-red-500 mt-2 block font-medium">{error.message}</span>}
  </div>
);

export default function DynamicRegisterForm() {
  const { role, clientType, freelancerMode, freelancerType, setStep, formData, updateFormData } = useRegistrationStore();
  const setAuth = useAuthStore((state) => state.setAuth || (() => {}));
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [registerError, setRegisterError] = useState(null);
  
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    defaultValues: formData
  });

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'password') setPasswordValue(value.password || '');
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    try {
      setRegisterError(null);
      updateFormData(data);
      
      const payload = {
        role: role.toUpperCase(),
        accountType: role === 'freelancer' ? freelancerType.toUpperCase() : clientType.toUpperCase(),
        email: data.email || data.corporateEmail || data.businessEmail,
        password: data.password,
        name: data.fullName || data.companyName || data.agencyName || data.organizationName,
        companyName: data.companyName || data.agencyName || data.organizationName,
      };

      const response = await authAPI.register(payload);
      
      if (response.accessToken) {
        setAuth(response.user, response.accessToken);
        // Automatically redirect to verification page with email in state
        navigate('/auth/verify-email', { state: { email: payload.email } });
      }

    } catch (error) {
      setRegisterError(error.message || 'Failed to create account. Please try again.');
    }
  };

  const getTitle = () => {
    if (role === 'client') {
      if (clientType === 'individual') return "Create personal account";
      if (clientType === 'sme') return "Create business account";
      return "Create enterprise account";
    } else {
      if (freelancerType === 'individual') return "Complete individual profile";
      if (freelancerType === 'sme') return "Setup agency profile";
      return "Setup corporate provider account";
    }
  };

  const themeColor = role === 'freelancer' ? 'emerald' : 'indigo';

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <button 
        onClick={() => setStep(role === 'freelancer' ? 3 : 2)}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to previous step
      </button>

      <div className="mb-12">
        <h2 className={`text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 tracking-tight`}>{getTitle()}</h2>
        <p className="text-xl text-zinc-500">Securely set up your identity to access Forte's global network.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <AnimatePresence>
          {registerError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600"
            >
              <span className="text-sm font-medium">{registerError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* FREELANCER FIELDS                                            */}
        {/* ============================================================== */}
        {role === 'freelancer' && (
          <>
            {freelancerType === 'individual' && (
              <>
                <FloatingInput label="Full Name" register={register('fullName', registerRules.fullName)} error={errors.fullName} />
                <FloatingInput label="Email Address" type="email" register={register('email', registerRules.email)} error={errors.email} />
              </>
            )}

            {freelancerType === 'sme' && (
              <>
                <FloatingInput label="Agency Name" register={register('agencyName', registerRules.fullName)} error={errors.agencyName} />
                <FloatingInput label="Business Email" type="email" register={register('businessEmail', registerRules.email)} error={errors.businessEmail} />
              </>
            )}

            {freelancerType === 'corporate' && (
              <>
                <FloatingInput label="Organization Name" register={register('organizationName', registerRules.fullName)} error={errors.organizationName} />
                <FloatingInput label="Corporate Email" type="email" register={register('corporateEmail', registerRules.email)} error={errors.corporateEmail} />
                
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mt-2 mb-6">
                  <h4 className="font-bold text-emerald-900 mb-2">Compliance Agreement Required</h4>
                  <p className="text-sm text-emerald-700 leading-relaxed mb-4">
                    As a Corporate Service Provider, you must agree to our strict vendor compliance policies and procurement workflows.
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-emerald-300 text-success focus:ring-emerald-500" {...register('complianceAgreement', termsRule)} />
                    <span className="text-sm font-semibold text-emerald-900">I accept the Corporate Vendor Terms</span>
                  </label>
                  {errors.complianceAgreement && <span className="text-sm text-red-500 block mt-2">{errors.complianceAgreement.message}</span>}
                </div>
              </>
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* CLIENT FIELDS                                                */}
        {/* ============================================================== */}
        {role === 'client' && (
          <>
            {(clientType === 'sme' || clientType === 'corporate') ? (
              <>
                <FloatingInput label={clientType === 'sme' ? "Business Name" : "Organization Name"} register={register('companyName', registerRules.fullName)} error={errors.companyName} />
                <FloatingInput label="Corporate Email" type="email" register={register('email', registerRules.email)} error={errors.email} />
                
                {clientType === 'corporate' && (
                  <div className="bg-[#14a800]/5 border border-[#14a800]/20 rounded-2xl p-6 mt-2 mb-6">
                    <h4 className="font-bold text-[#14a800] mb-2">Enterprise Compliance</h4>
                    <p className="text-sm text-[#14a800] leading-relaxed">
                      By proceeding, you acknowledge that this account will be subject to Forte's Enterprise Vendor Master Agreement and automated worker classification compliance checks.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <FloatingInput label="Legal Full Name" register={register('fullName', registerRules.fullName)} error={errors.fullName} />
                <FloatingInput label="Email Address" type="email" register={register('email', registerRules.email)} error={errors.email} />
              </>
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* PASSWORD FIELD WITH METER                                      */}
        {/* ============================================================== */}
        <div className="relative mb-2">
          <FloatingInput 
            label="Create Secure Password" 
            type={showPassword ? "text" : "password"} 
            register={register('password', registerRules.password)} 
            error={errors.password} 
          />
          <button 
            type="button" 
            className="absolute right-5 top-5 text-zinc-400 hover:text-zinc-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          </button>
        </div>
        
        <PasswordStrength password={passwordValue} />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 rounded-2xl font-bold text-xl text-white transition-all duration-300 transform hover:-tranzinc-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-8 ${
            role === 'client' ? 'bg-[#14a800] hover:bg-[#118a00] shadow-[#14a800]/25' : 'bg-success hover:bg-emerald-700 shadow-emerald-600/30'
          }`}
        >
          {isSubmitting ? 'Provisioning Account...' : 'Complete Account Setup'}
        </button>
      </form>
    </motion.div>
  );
}
