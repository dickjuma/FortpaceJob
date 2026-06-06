import React, { useCallback, useEffect, useState } from 'react';
import { Upload, CheckCircle2, Clock, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  contractStatusLabel,
  formatMoney,
  loadContractOrOrder,
  loadFreelancerProfile,
} from './findWorkWorkflow';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}

function milestoneStatusClass(status) {
  const value = String(status || '').toUpperCase();
  if (['COMPLETED', 'APPROVED', 'PAID', 'SUBMITTED'].includes(value)) return 'bg-success';
  if (['IN_PROGRESS', 'ACTIVE'].includes(value)) return 'bg-[#4C1D95] animate-pulse';
  return 'bg-zinc-300';
}

const WorkProgress = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { record } = await loadContractOrOrder(orderId);
      if (!record) {
        toast.error('Order not found.');
        setContract(null);
        return;
      }
      setContract(record);
      const freelancerId = record.freelancerId || record.providerId;
      if (freelancerId) {
        loadFreelancerProfile(freelancerId).then(setProvider);
      }
    } catch (err) {
      toast.error(err.message || 'Could not load order.');
      setContract(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="bg-surface min-h-screen py-20 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#4C1D95] mb-4" />
        <p className="font-medium">Loading order progress…</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="bg-surface min-h-screen py-20 text-center">
        <p className="text-zinc-600 font-medium">This order could not be loaded.</p>
      </div>
    );
  }

  const statusLabel = contractStatusLabel(contract.status);
  const currency = contract.currency || 'KES';
  const amount = Number(contract.totalAmount ?? contract.amount ?? 0);
  const milestones = contract.milestones || [];
  const deliveryFiles = contract.deliveryFiles || contract.files || [];
  const providerName = provider?.displayName || provider?.name || contract.freelancerName || 'Provider';
  const isCompleted = String(contract.status || '').toUpperCase() === 'COMPLETED';

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{orderId}</span>
                <span className="px-2.5 py-1 bg-[#4C1D95]/10 text-[#4C1D95] border border-[#4C1D95]/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {statusLabel}
                </span>
              </div>
              <h1 className="text-3xl font-black text-zinc-900">{contract.title || contract.jobTitle || 'Active contract'}</h1>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 border border-zinc-200 rounded-xl shadow-sm">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Deadline</div>
                <div className="font-bold text-zinc-900">{formatDate(contract.deadline || contract.dueDate)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="flex overflow-x-auto border-b border-zinc-200 bg-surface/50">
                  {['overview', 'messages', 'files'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors border-b-2 capitalize ${activeTab === tab ? 'border-[#4C1D95]/20 text-[#4C1D95] bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-surface'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6 md:p-8">
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-6">Project Timeline</h3>
                        <div className="relative border-l-2 border-zinc-200 ml-3 space-y-8">
                          <div className="relative pl-6">
                            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-success border-2 border-white" />
                            <div className="font-bold text-zinc-900">Contract Started</div>
                            <div className="text-sm font-medium text-zinc-500">
                              {formatDate(contract.createdAt)} — Funds deposited in Escrow
                            </div>
                          </div>

                          {milestones.length > 0 ? (
                            milestones.map((milestone, index) => (
                              <div key={milestone.id || index} className="relative pl-6">
                                <div className={`absolute left-[-9px] top-1 w-4 h-4 rounded-full border-2 border-white ${milestoneStatusClass(milestone.status)}`} />
                                <div className="font-bold text-zinc-900">{milestone.title || `Milestone ${index + 1}`}</div>
                                <div className="text-sm font-medium text-zinc-500">
                                  {milestone.description || milestone.status || 'Pending'}
                                  {milestone.amount ? ` · ${formatMoney(milestone.amount, currency)}` : ''}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="relative pl-6">
                              <div className="absolute left-[-13px] top-0 bg-[#4C1D95]/10 border-4 border-white rounded-full p-1">
                                <div className="w-3 h-3 bg-[#4C1D95] rounded-full animate-pulse" />
                              </div>
                              <div className="font-bold text-[#4C1D95]">In Development</div>
                              <div className="text-sm font-medium text-zinc-500">Freelancer is currently working on the deliverables</div>
                            </div>
                          )}

                          <div className={`relative pl-6 ${isCompleted ? '' : 'opacity-40'}`}>
                            <div className={`absolute left-[-9px] top-1 w-4 h-4 rounded-full border-2 border-white ${isCompleted ? 'bg-success' : 'bg-zinc-300'}`} />
                            <div className="font-bold text-zinc-900">Final Delivery</div>
                            <div className="text-sm font-medium text-zinc-500">
                              {isCompleted ? formatDate(contract.completedAt || contract.updatedAt) : 'Awaiting submission'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#4C1D95]/5 border border-[#4C1D95]/20 rounded-2xl p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-[#4C1D95] mx-auto mb-3" />
                        <h4 className="text-lg font-bold text-[#4C1D95] mb-1">
                          {isCompleted ? 'Work completed' : 'Work is in progress'}
                        </h4>
                        <p className="text-[#4C1D95] text-sm mb-4">
                          {isCompleted
                            ? 'This contract has been marked complete.'
                            : `${providerName} is currently working on your project. You will be notified when deliverables are uploaded.`}
                        </p>
                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => toast.success('Update request sent to provider.')}
                            className="px-6 py-2.5 bg-white border border-[#4C1D95]/20 hover:bg-[#4C1D95]/10 text-[#4C1D95] font-bold rounded-xl transition-colors text-sm"
                          >
                            Request Update
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'messages' && (
                    <div className="h-[400px] flex flex-col justify-center items-center border border-zinc-200 rounded-2xl bg-surface text-zinc-500">
                      <p className="font-medium text-sm">Open Messages to chat with {providerName}.</p>
                    </div>
                  )}

                  {activeTab === 'files' && (
                    <div>
                      {deliveryFiles.length === 0 ? (
                        <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-10 text-center">
                          <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                          <div className="font-bold text-zinc-700 mb-1">No files uploaded yet</div>
                          <p className="text-sm text-zinc-500">Deliverables and project files will appear here.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {deliveryFiles.map((file, index) => (
                            <div key={file.id || index} className="flex items-center justify-between p-4 bg-surface border border-zinc-200 rounded-xl">
                              <div className="font-bold text-zinc-900">{file.name || file.filename || `File ${index + 1}`}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Contract Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Provider</span>
                    <span className="font-bold text-zinc-900">{providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Amount</span>
                    <span className="font-bold text-success">{formatMoney(amount, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-medium">Escrow Status</span>
                    <span className="font-bold text-zinc-900">{contract.escrowStatus || 'Funded'}</span>
                  </div>
                </div>

                <hr className="my-4 border-zinc-100" />

                <button
                  type="button"
                  onClick={() => navigate(`/find-work/orders/${orderId}/revise`)}
                  className="w-full py-2.5 mb-2 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/find-work/work/${orderId}/cancel`)}
                  className="w-full py-2.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" /> Cancel Contract
                </button>
              </div>

              {String(contract.status || '').toUpperCase() === 'DELIVERED' && (
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                  <button
                    type="button"
                    onClick={() => navigate(`/find-work/orders/${orderId}/complete`)}
                    className="w-full py-2.5 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    Review Final Delivery
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkProgress;


