import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../common/services/api';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../../common/utils/validation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'CLIENT', // Defaulting to CLIENT for this route
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const firstErr = validateName(formData.firstName, 'First name');
    const lastErr = validateName(formData.lastName, 'Last name');
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const validationError = firstErr || lastErr || emailErr || passErr;
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authAPI.register(formData);
      // Registration successful, navigate to client dashboard or verification page
      navigate('/client');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] dark:from-[#2bb75c] dark:to-[#1d8d38]">
      <div className="w-full max-w-md rounded-xl bg-surface-secondary dark:bg-surface-dark p-8 shadow-card">
        <h2 className="mb-6 text-center text-2xl font-bold text-[#2bb75c] dark:text-[#2bb75c]">Register as a Client</h2>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-[#2bb75c]/20 focus:ring-[#2bb75c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-[#2bb75c]/20 focus:ring-[#2bb75c]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-[#2bb75c]/20 focus:ring-[#2bb75c]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-[#2bb75c]/20 focus:ring-[#2bb75c]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-[#2bb75c] hover:bg-[#2bb75c] text-white py-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <a href="/login" className="text-[#2bb75c] hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

