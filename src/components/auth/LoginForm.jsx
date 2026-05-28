import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../common/services/api';

// A simple floating label input component
const FloatingInput = ({ label, type = "text", register, error, placeholder, ...rest }) => (
  <div className="relative mb-6">
    <input
      type={type}
      placeholder={placeholder || " "}
      className={`peer w-full h-16 px-5 pt-5 pb-1 rounded-2xl border-2 ${error ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : 'border-zinc-200 focus:border-brand-500 focus:ring-indigo-500 bg-surface hover:bg-zinc-100 focus:bg-white'} text-zinc-900 shadow-sm focus:outline-none focus:ring-1 transition-all placeholder-transparent text-lg`}
      {...register}
      {...rest}
    />
    <label className={`absolute left-5 top-2 text-sm transition-all pointer-events-none ${error ? 'text-red-500' : 'text-zinc-500'} peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-sm peer-focus:text-brand-600 font-medium`}>
      {label}
    </label>
    {error && (
      <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500 mt-2 flex items-center gap-1 font-medium">
        <AlertCircle className="w-4 h-4" /> {error.message}
      </motion.span>
    )}
  </div>
);

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [loginError, setLoginError] = useState(null);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth || (() => {}));

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoginError(null);
      // Real API Call to backend
      const response = await authAPI.login(data.email, data.password);
      
      const role = response.user?.role || 'FREELANCER';

      // Set global auth store
      setAuth(response.user, response.accessToken);

      // Role-based redirection
      if (role === 'CLIENT' || role === 'COMPANY') {
        navigate('/client/dashboard');
      } else {
        navigate('/freelancer/dashboard');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleKeyUp = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 mb-2">Welcome Back</h2>
        <p className="text-zinc-500">Login to continue managing your work, contracts, and payments.</p>
      </div>

      <AnimatePresence>
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{loginError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <FloatingInput 
          label="Email Address or Username" 
          type="text" 
          register={register('email', { required: "Email or username is required" })} 
          error={errors.email} 
        />
        
        <div className="relative mb-2">
          <FloatingInput 
            label="Password" 
            type={showPassword ? "text" : "password"} 
            register={register('password', { required: "Password is required" })} 
            error={errors.password} 
            onKeyUp={handleKeyUp}
          />
          <button 
            type="button" 
            className="absolute right-5 top-5 text-zinc-400 hover:text-brand-600 focus:outline-none transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          </button>
          <AnimatePresence>
            {capsLockActive && (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute right-14 top-6 text-xs font-bold text-amber-500 uppercase tracking-widest"
              >
                Caps Lock ON
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-6 mb-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" className="w-5 h-5 rounded border-2 border-zinc-300 text-brand-600 focus:ring-indigo-500 cursor-pointer transition-all peer" {...register('rememberMe')} />
            </div>
            <span className="text-zinc-600 font-medium group-hover:text-zinc-900 transition-colors">Remember me</span>
          </label>

          <a href="/auth/forgot-password" className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors relative group">
            Forgot Password?
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 transition-all group-hover:w-full"></span>
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative w-full h-16 rounded-2xl font-bold text-xl text-white overflow-hidden transition-all duration-300 transform hover:-tranzinc-y-1 shadow-xl hover:shadow-2xl shadow-indigo-600/30 disabled:opacity-80 disabled:cursor-not-allowed disabled:transform-none bg-brand-600 hover:bg-brand-700"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" /> Authenticating...
            </span>
          ) : (
            'Login Securely'
          )}
        </button>
      </form>
    </motion.div>
  );
}
