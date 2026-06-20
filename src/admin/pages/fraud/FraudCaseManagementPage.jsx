import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ShieldAlert, RefreshCw, Monitor, FileText, TrendingUp } from 'lucide-react';
import { fetchFraudCase, restrictFraudCase, escalateFraudCase, resolveFraudCase } from '../../api/fraud.api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function FraudCaseManagementPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState('');

  const { data: fraudCase, isLoading, refetch } = useQuery({
    queryKey: ['fraud', 'cases', caseId],
    queryFn: () => fetchFraudCase(caseId),
    enabled: !!caseId,
  });

  const handleRestrict = useMutation({
    mutationFn: (data) => restrictFraudCase(caseId, data),
    onSuccess: () => {
      toast.success('Case restricted successfully');
      queryClient.invalidateQueries({ queryKey: ['fraud'] });
      setAction(null);
      setReason('');
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleEscalate = useMutation({
    mutationFn: (data) => escalateFraudCase(caseId, data),
    onSuccess: () => {
      toast.success('Case escalated successfully');
      queryClient.invalidateQueries({ queryKey: ['fraud'] });
      setAction(null);
      setReason('');
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleResolve = useMutation({
    mutationFn: (data) => resolveFraudCase(caseId, data),
    onSuccess: () => {
      toast.success('Case resolved successfully');
      queryClient.invalidateQueries({ queryKey: ['fraud'] });
      setAction(null);
      setReason('');
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleSubmit = () => {
    if (!action || !reason) {
      toast.error('Please provide a reason for the action');
      return;
    }
    
    if (action === 'restrict') {
      handleRestrict.mutate({ reason });
    } else if (action === 'escalate') {
      handleEscalate.mutate({ reason });
    } else if (action === 'resolve') {
      handleResolve.mutate({ resolutionType: 'INVESTIGATE', resolutionDetails: reason });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse"></div>
        <div className="h-96 bg-zinc-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!fraudCase) {
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
          <ShieldAlert size={48} className="mx-auto mb-4 text-zinc-300" />
          <p className="text-zinc-600">Fraud case not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
              <ShieldAlert size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Fraud Case: {caseId}</h1>
          </div>
          <p className="text-sm text-zinc-500">Manage fraud investigation and resolution</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText size={18} />
              Case Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500">Status:</span>
                <span className={cn(
                  "ml-2 px-2 py-1 rounded-lg text-xs font-medium uppercase",
                  fraudCase.status === 'OPEN' ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                )}>
                  {fraudCase.status}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Severity:</span>
                <span className="ml-2 font-medium">{fraudCase.severity || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500">Created:</span>
                <span className="ml-2">{fraudCase.createdAt ? new Date(fraudCase.createdAt).toLocaleString() : 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500">User:</span>
                <span className="ml-2 font-mono">{fraudCase.userId}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-500">Reason:</span>
                <p className="mt-1 text-sm">{fraudCase.reason || fraudCase.description || 'No reason provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-bold mb-4">Actions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Action Type</label>
                <select 
                  value={action || ''}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
                >
                  <option value="">Select Action</option>
                  <option value="restrict">Restrict User</option>
                  <option value="escalate">Escalate Case</option>
                  <option value="resolve">Resolve Case</option>
                </select>
              </div>
              
              {action && (
                <div>
                  <label className="block text-sm font-medium mb-2">Reason/Notes</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for action..."
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
                    rows={3}
                  />
                </div>
              )}

              {action && (
                <button
                  onClick={handleSubmit}
                  disabled={handleRestrict.isPending || handleEscalate.isPending || handleResolve.isPending}
                  className={cn(
                    "w-full px-4 py-2 text-white font-medium rounded-lg transition-colors",
                    action === 'escalate' ? "bg-orange-600 hover:bg-orange-700" :
                    action === 'resolve' ? "bg-green-600 hover:bg-green-700" :
                    "bg-red-600 hover:bg-red-700"
                  )}
                >
                  {action === 'escalate' ? 'Escalate Case' : 
                   action === 'resolve' ? 'Resolve Case' : 'Restrict User'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              Risk Score
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                {fraudCase.riskScore || 0}
              </div>
              <div className="text-sm text-zinc-500">out of 100</div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate(`/admin/users/${fraudCase.userId}/profile`)}
                className="w-full px-3 py-2 text-sm font-medium bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center gap-2"
              >
                <TrendingUp size={14} />
                View User Profile
              </button>
              <button 
                onClick={() => navigate(`/admin/users/${fraudCase.userId}/sessions`)}
                className="w-full px-3 py-2 text-sm font-medium bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center gap-2"
              >
                <Monitor size={14} />
                Manage Sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
