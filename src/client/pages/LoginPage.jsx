// LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../platform/common/authStore';
import { validateEmail, validateRequired } from '../../platform/common/utils/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passwordErr = validateRequired(password, 'Password');
    const validationError = emailErr || passwordErr;
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    try {
      const data = await login(email, password);
      const role = data.user.role;
      if (role === 'CLIENT') navigate('/client');
      else if (role === 'FREELANCER') navigate('/freelancer');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-accent-dark p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white border border-border rounded-2xl shadow-lg p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold text-brand-900">Client Login</h2>
          <p className="text-sm text-ink-secondary mt-1">Sign in to manage your projects and team</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger-light text-danger text-sm font-medium border border-danger/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
            />
          </div>
          <motion.button
            whileTap={buttonTap}
            type="submit"
            className="w-full h-11 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-ink-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:text-accent-dark font-medium">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
