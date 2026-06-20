import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Shield, RefreshCw, Lock, Unlock, AlertCircle, FileText } from 'lucide-react';
import { fetchEscrow, releaseEscrow, refundEscrow, holdEscrow } from '../../api/financial.api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function EscrowManagementPage() {
  const { escrowId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [action, setAction] = useState(null);

  const { data: escrow, isLoading, refetch } = useQuery({
    queryKey: ['escrow', escrowId],
    queryFn: () => fetchEscrow(escrowId),
    enabled: !!escrowId,
  });

  const handleRelease = useMutation({
    mutationFn: (data) => releaseEscrow(escrowId, data),
    onSuccess: () => {
      toast.success('Escrow released successfully');
      queryClient.invalidateQueries({ queryKey: ['escrow'] });
      setAction(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleRefund = useMutation({
    mutationFn: (data) => refundEscrow(escrowId, data),
    onSuccess: () => {
      toast.success('Escrow refunded successfully');
      queryClient.invalidateQueries({ queryKey: ['escrow'] });
      setAction(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleHold = useMutation({
    mutationFn: () => holdEscrow(escrowId),
    onSuccess: () => {
      toast.success('Escrow put on hold successfully');
      queryClient.invalidateQueries({ queryKey: ['escrow'] });
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

  if (!escrow) {
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
          <Shield size={48} className="mx-auto mb-4 text-zinc-300" />
          <p className="text-zinc-600">Escrow not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Shield size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Escrow: {escrowId}</h1>
          </div>
          <p className="text-sm text-zinc-500">Manage escrow funds and release</p>
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
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText size={18} />
            Escrow Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Contract ID:</span>
              <span className="font-mono">{escrow.contractId || escrowId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Amount:</span>
              <span className="font-bold">{escrow.amount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status:</span>
              <span className={cn(
                "px-2 py-1 rounded-lg text-xs font-medium uppercase",
                escrow.status === 'HELD' ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
              )}>
                {escrow.status || 'ACTIVE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Created:</span>
              <span>{escrow.createdAt ? new Date(escrow.createdAt).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 p-6">
          <h3 className="text-lg font-bold mb-4">Escrow Actions</h3>
          <div className="space-y-2">
            <select 
              value={action || ''}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg mb-3"
            >
              <option value="">Select Action</option>
              <option value="release">Release Funds</option>
              <option value="refund">Refund Funds</option>
              <option value="hold">Hold Escrow</option>
            </select>

            {action === 'release' && (
              <button
                onClick={() => handleRelease.mutate({})}
                disabled={handleRelease.isPending}
                className="w-full px-4 py-2 text-white font-medium rounded-lg bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Unlock size={16} />
                Release Escrow
              </button>
            )}
            {action === 'refund' && (
              <button
                onClick={() => handleRefund.mutate({})}
                disabled={handleRefund.isPending}
                className="w-full px-4 py-2 text-white font-medium rounded-lg bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
              >
                <AlertCircle size={16} />
                Refund Escrow
              </button>
            )}
            {action === 'hold' && (
              <button
                onClick={() => handleHold.mutate()}
                disabled={handleHold.isPending}
                className="w-full px-4 py-2 text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                Hold Escrow
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
