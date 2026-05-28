import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../common/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await authAPI.login(email, password);
      const role = data.user.role;
      if (role === 'FREELANCER') navigate('/freelancer');
      else if (role === 'CLIENT') navigate('/client');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-800 to-brand-900 dark:from-brand-950 dark:to-brand-900">
      <div className="w-full max-w-md rounded-xl bg-surface-secondary dark:bg-surface-dark p-8 shadow-card">
        <h2 className="mb-6 text-center text-2xl font-bold text-brand-600 dark:text-brand-300">Freelancer Login</h2>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-brand-500 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-surface-white dark:bg-surface-dark focus:border-brand-500 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-brand-600 hover:bg-brand-500 text-white py-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? <a href="/freelancer/register" className="text-brand-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
