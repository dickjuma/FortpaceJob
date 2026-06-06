// RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../../common/services/api';
import {
  validateEmail,
  validatePassword,
} from '../../common/utils/validation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const validationError = emailErr || passErr;
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        role: 'CLIENT',
        accountType: 'INDIVIDUAL',
      });
      navigate('/client');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
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
          <h2 className="font-display text-2xl font-bold text-brand-900">Register as a Client</h2>
          <p className="text-sm text-ink-secondary mt-1">Create your account to start hiring</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger-light text-danger text-sm font-medium border border-danger/20">
            {error}
          </div>
        )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Email Address</label>
              <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
            />
          </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white text-ink-primary"
            />
              <p className="text-xs text-ink-tertiary mt-1.5">Minimum 8 characters, at least one letter and one number</p>
            </div>

          <motion.button
            whileTap={buttonTap}
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-ink-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-dark font-medium">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
