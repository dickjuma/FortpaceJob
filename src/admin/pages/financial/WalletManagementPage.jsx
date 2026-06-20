import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Wallet, RefreshCw, Lock, Unlock, AlertCircle } from 'lucide-react';
import { fetchWallet, freezeWallet, unfreezeWallet } from '../../api/financial.api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function WalletManagementPage() {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [action, setAction] = useState(null);

  const { data: wallet, isLoading, refetch } = useQuery({
    queryKey: ['wallets', walletId],
    queryFn: () => fetchWallet(walletId),
    enabled: !!walletId,
  });

  const handleFreeze = useMutation({
    mutationFn: () => freezeWallet(walletId),
    onSuccess: () => {
      toast.success('Wallet frozen successfully');
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      setAction(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleUnfreeze = useMutation({
    mutationFn: () => unfreezeWallet(walletId),
    onSuccess: () => {
      toast.success('Wallet unfrozen successfully');
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      setAction(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse"></div>
        <div className="h-96 bg-zinc-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="p-8 text-center bg-white dark:bg-surface-dark rounded-2xl">
          <Wallet size={48} className="mx-auto mb-4 text-zinc-300" />
          <p className="text-zinc-600">Wallet not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Wallet: {walletId}</h1>
          </div>
          <p className="text-sm text-zinc-500">Manage wallet status and restrictions</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 p-6">
          <h3 className="text-lg font-bold mb-4">Wallet Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">User ID:</span>
              <span className="font-mono">{wallet.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Available Balance:</span>
              <span className="font-bold">{wallet.availableBalance || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Pending Balance:</span>
              <span>{wallet.pendingBalance || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Locked Balance:</span>
              <span>{wallet.lockedBalance || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status:</span>
              <span className={cn(
                "px-2 py-1 rounded-lg text-xs font-medium",
                wallet.frozen ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              )}>
                {wallet.frozen ? 'Frozen' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 p-6">
          <h3 className="text-lg font-bold mb-4">Wallet Actions</h3>
          {wallet.frozen ? (
            <button
              onClick={() => handleUnfreeze.mutate()}
              disabled={handleUnfreeze.isPending}
              className="w-full px-4 py-2 text-white font-medium rounded-lg bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Unlock size={16} />
              Unfreeze Wallet
            </button>
          ) : (
            <button
              onClick={() => handleFreeze.mutate()}
              disabled={handleFreeze.isPending}
              className="w-full px-4 py-2 text-white font-medium rounded-lg bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              Freeze Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
