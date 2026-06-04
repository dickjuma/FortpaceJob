import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../common/authStore';
import { validateEmail, validateRequired } from '../../common/utils/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async e => {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] dark:from-[#2bb75c] dark:to-[#1d8d38]">
      <div className="w-full max-w-md rounded-xl bg-surface-secondary dark:bg-surface-dark p-8 shadow-card">
        <h2 className="mb-6 text-center text-2xl font-bold text-[#2bb75c] dark:text-[#2bb75c]">Client Login</h2>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-[#2bb75c]/20 focus:ring-[#2bb75c]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-[#2bb75c]/20 focus:ring-[#2bb75c]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#2bb75c] hover:bg-[#2bb75c] text-white py-2 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? <a href="/register" className="text-[#2bb75c] hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}

