// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import { Shield, ArrowRight } from 'lucide-react';
import { authAPI } from '../../common/services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await authAPI.login(email, password);

      if (!data?.requiresTwoFactor || !data?.userId) {
        throw new Error('This account is not configured for administrator access.');
      }

      navigate('/auth/admin/verify', {
        state: {
          purpose: 'admin_2fa',
          email: email.trim().toLowerCase(),
          userId: data.userId,
        },
      });
      
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Admin specific background styling */}
      <div className="absolute inset-0 bg-surface-dark pointer-events-none" />
      
      <div className="relative z-10">
        <AuthLayout 
          title="Admin Portal Access" 
          subtitle="Restricted command and control center."
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}
            
            <Input
              label="Administrator Email"
              type="email"
              placeholder="dickjuma292gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <PasswordInput
              label="Admin Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button 
              type="submit" 
              className="w-full mt-2 bg-zinc-800 hover:bg-surface-dark dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-100" 
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Authenticate
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Unauthorized access is strictly prohibited and logged.
          </div>
        </AuthLayout>
      </div>
    </div>
  );
}
