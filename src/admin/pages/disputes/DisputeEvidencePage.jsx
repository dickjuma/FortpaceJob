import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, FileText, RefreshCw, Shield, Download, ExternalLink } from 'lucide-react';
import { fetchDisputeEvidence, resolveDispute } from '../../api/disputes.api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function DisputeEvidencePage() {
  const { disputeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: evidence, isLoading, refetch } = useQuery({
    queryKey: ['disputes', disputeId, 'evidence'],
    queryFn: () => fetchDisputeEvidence(disputeId),
    enabled: !!disputeId,
  });

  const handleResolve = useMutation({
    mutationFn: (data) => resolveDispute(disputeId, data),
    onSuccess: () => {
      toast.success('Dispute resolved successfully');
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Shield size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dispute Evidence: {disputeId}</h1>
          </div>
          <p className="text-sm text-zinc-500">Review evidence and documents for dispute</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 p-6">
        {evidence?.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            No evidence found for this dispute.
          </div>
        ) : (
          <div className="space-y-4">
            {evidence?.map((item, idx) => (
              <div key={item.id || idx} className="border border-zinc-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-900">{item.type || 'Evidence Document'}</h4>
                    <p className="text-sm text-zinc-500 mt-1">{item.description || item.url}</p>
                  </div>
                  <div className="flex gap-2">
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
