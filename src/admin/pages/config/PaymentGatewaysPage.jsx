import React from 'react';
import { 
  CreditCard, Zap, RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';

export default function PaymentGatewaysPage() {
  const queryClient = useQueryClient();

  const { data: gatewayConfig, isLoading, error } = useQuery({
    queryKey: ['settings', 'payment-gateways'],
    queryFn: async () => {
      const response = await apiClient.get('/settings/payment-gateway');
      return unwrapAdminResponse(response).data;
    },
    staleTime: 60_000,
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (config) => {
      const response = await apiClient.put('/settings/payment-gateway', config);
      return unwrapAdminResponse(response).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'payment-gateways'] });
      toast.success('M-Pesa configuration updated');
    },
    onError: (error) => toast.error(error?.message || 'Failed to update configuration'),
  });

  const getEnvStatus = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const hasRealCredentials = gatewayConfig?.consumerKey && gatewayConfig?.consumerKey !== 'mock';
    return isProduction && hasRealCredentials ? 'live' : 'sandbox';
  };

  const getStatusBadge = () => {
    const status = getEnvStatus();
    return (
      <span className={cn(
        "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
        status === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      )}>
        {status}
      </span>
    );
  };

  const triggerTestSTK = useMutation({
    mutationFn: async (testPhone) => {
      const response = await apiClient.post('/settings/payment-gateway/test-stk', { phoneNumber: testPhone || '254708379477' });
      return unwrapAdminResponse(response).data;
    },
    onSuccess: () => toast.success('M-Pesa STK push test initiated'),
    onError: (error) => toast.error(error?.message || 'STK push test failed'),
  });

  const triggerTestB2C = useMutation({
    mutationFn: async (testPhone) => {
      const response = await apiClient.post('/settings/payment-gateway/test-b2c', { 
        phoneNumber: testPhone || '254708379477', 
        amount: 10 
      });
      return unwrapAdminResponse(response).data;
    },
    onSuccess: () => toast.success('M-Pesa B2C payout test initiated'),
    onError: (error) => toast.error(error?.message || 'B2C test failed'),
  });

  if (isLoading) return <div className="p-8">Loading M-Pesa configuration...</div>;
  if (error) return <div className="p-8 text-rose-500">Failed to load payment gateway configuration</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl shadow-sm">
              <CreditCard size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">M-Pesa Payment Gateway</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Exclusive payment processor for ForteSpace. Manage Safaricom Daraja API credentials and test payment flows.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => triggerTestSTK.mutate()}
            disabled={triggerTestSTK.isPending}
            className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={triggerTestSTK.isPending ? 'animate-spin' : ''} /> Test STK Push
          </button>
          <button 
            onClick={() => triggerTestB2C.mutate()}
            disabled={triggerTestB2C.isPending}
            className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={triggerTestB2C.isPending ? 'animate-spin' : ''} /> Test B2C Payout
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
            <Zap size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">M-Pesa (Safaricom Daraja)</h2>
            <p className="text-xs text-zinc-500 mt-1">Primary payment rail for deposits and withdrawals</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-black text-zinc-400 uppercase">active</span>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Consumer Key</label>
            <input 
              type="password"
              value={gatewayConfig?.consumerKey || ''}
              onChange={(e) => updateConfigMutation.mutate({ ...gatewayConfig, consumerKey: e.target.value })}
              placeholder="Enter M-Pesa Consumer Key"
              className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Consumer Secret</label>
            <input 
              type="password"
              value={gatewayConfig?.consumerSecret ? '••••••••' : ''}
              onChange={(e) => updateConfigMutation.mutate({ ...gatewayConfig, consumerSecret: e.target.value })}
              placeholder="Enter M-Pesa Consumer Secret"
              className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Business Shortcode</label>
            <input 
              type="text"
              value={gatewayConfig?.shortcode || ''}
              onChange={(e) => updateConfigMutation.mutate({ ...gatewayConfig, shortcode: e.target.value })}
              placeholder="174379"
              className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Passkey</label>
            <input 
              type="password"
              value={gatewayConfig?.passkey ? '••••••••' : ''}
              onChange={(e) => updateConfigMutation.mutate({ ...gatewayConfig, passkey: e.target.value })}
              placeholder="Daraja Passkey"
              className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Callback URL (Webhook)</label>
            <input 
              type="text"
              value={gatewayConfig?.callbackUrl || ''}
              onChange={(e) => updateConfigMutation.mutate({ ...gatewayConfig, callbackUrl: e.target.value })}
              placeholder="https://yourdomain.com/api/webhook/mpesa/stk"
              className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">B2C Callback URL</label>
            <input 
              type="text"
              value={gatewayConfig?.b2cCallbackUrl || ''}
              onChange={(e) => updateConfigMutation.mutate({ ...gatewayConfig, b2cCallbackUrl: e.target.value })}
              placeholder="https://yourdomain.com/api/webhook/mpesa/b2c"
              className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
