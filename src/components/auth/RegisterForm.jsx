import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRegistrationStore } from '../../store/authStore';
import PasswordStrength from './PasswordStrength';

// A simple floating label input component
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

export default function RegisterForm() {
  const { role, clientType, setStep, formData, updateFormData } = useRegistrationStore();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  
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
    updateFormData(data);
    console.log("Submitting:", { role, clientType, ...data });
    alert("Registration Successful!");
  };

  const getTitle = () => {
    if (role === 'freelancer') return "Complete your freelancer profile";
    if (clientType === 'individual') return "Create personal account";
    if (clientType === 'sme') return "Create business account";
    return "Create enterprise account";
  };

  // Dynamic theme colors
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
        onClick={() => setStep(role === 'freelancer' ? 1 : 2)}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to previous step
      </button>

      <div className="mb-12">
        <h2 className={`text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 tracking-tight`}>{getTitle()}</h2>
        <p className="text-xl text-zinc-500">Securely set up your identity to access Forte's global network.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* COMMON FIELDS */}
        {(clientType === 'sme' || clientType === 'corporate') ? (
          <>
            <FloatingInput label={clientType === 'sme' ? "Business Name" : "Organization Name"} register={register('companyName', { required: "This field is required" })} error={errors.companyName} />
            <FloatingInput label="Corporate Email" type="email" register={register('email', { required: "Email is required" })} error={errors.email} />
          </>
        ) : (
          <>
            <FloatingInput label="Legal Full Name" register={register('fullName', { required: "Full name is required" })} error={errors.fullName} />
            <FloatingInput label="Email Address" type="email" register={register('email', { required: "Email is required" })} error={errors.email} />
          </>
        )}

        <FloatingInput label="Phone Number" type="tel" register={register('phone')} error={errors.phone} />
        
        {/* DYNAMIC FIELDS based on role/type */}
        {role === 'freelancer' && (
          <div className="grid md:grid-cols-2 gap-4">
            <FloatingInput label="Username" register={register('username', { required: "Username required" })} error={errors.username} />
            <div className="relative mb-6">
              <select 
                {...register('experienceLevel')} 
                className={`w-full h-16 px-5 pt-5 pb-1 rounded-2xl border-2 border-zinc-200 focus:border-${themeColor}-500 bg-surface hover:bg-zinc-100 focus:bg-white text-zinc-900 shadow-sm appearance-none text-lg font-medium transition-all`}
              >
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate Professional</option>
                <option value="expert">Senior / Expert</option>
              </select>
              <label className="absolute left-5 top-2 text-sm text-zinc-500 font-medium pointer-events-none">Experience Level</label>
            </div>
          </div>
        )}

        {(clientType === 'sme' || clientType === 'corporate') && (
          <div className="grid md:grid-cols-2 gap-4">
            <FloatingInput label="Industry Sector" register={register('industry', { required: "Industry required" })} error={errors.industry} />
            <div className="relative mb-6">
              <select 
                {...register('companySize')} 
                className={`w-full h-16 px-5 pt-5 pb-1 rounded-2xl border-2 border-zinc-200 focus:border-${themeColor}-500 bg-surface hover:bg-zinc-100 focus:bg-white shadow-sm appearance-none text-lg font-medium transition-all`}
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201+">201+ employees</option>
              </select>
              <label className="absolute left-5 top-2 text-sm text-zinc-500 font-medium pointer-events-none">Company Size</label>
            </div>
          </div>
        )}

        {/* PASSWORD FIELD WITH METER */}
        <div className="relative mb-2">
          <FloatingInput 
            label="Create Secure Password" 
            type={showPassword ? "text" : "password"} 
            register={register('password', { required: "Password is required" })} 
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

        {clientType === 'corporate' && (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 mt-6 mb-8">
            <h4 className="font-bold text-brand-900 mb-2">Enterprise Compliance</h4>
            <p className="text-sm text-brand-700 leading-relaxed">
              By proceeding, you acknowledge that this account will be subject to Forte's Enterprise Vendor Master Agreement and automated worker classification compliance checks.
            </p>
          </div>
        )}

        <div className="mt-10 mb-8">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-1">
              <input type="checkbox" className={`w-6 h-6 rounded-md border-2 border-zinc-300 text-${themeColor}-600 focus:ring-${themeColor}-500 cursor-pointer transition-all peer`} {...register('terms', { required: "Must agree to terms" })} />
            </div>
            <span className="text-zinc-600 text-lg">
              I agree to the <a href="#" className={`text-${themeColor}-600 font-bold hover:underline`}>Terms of Service</a> and <a href="#" className={`text-${themeColor}-600 font-bold hover:underline`}>Privacy Policy</a>.
            </span>
          </label>
          {errors.terms && <span className="text-sm text-red-500 ml-10 block mt-2 font-medium">{errors.terms.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 rounded-2xl font-bold text-xl text-white transition-all duration-300 transform hover:-tranzinc-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
            role === 'client' ? 'bg-brand-600 hover:bg-brand-700 shadow-indigo-600/30' : 'bg-success hover:bg-emerald-700 shadow-emerald-600/30'
          }`}
        >
          {isSubmitting ? 'Provisioning Account...' : 'Complete Account Setup'}
        </button>
      </form>
    </motion.div>
  );
}
