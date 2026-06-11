import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, CheckCircle2, Clock, AlertTriangle, 
  FileText, Lock, PenTool, Search, ChevronDown, 
  UploadCloud, ExternalLink, ShieldCheck, DollarSign
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { contractAPI, walletAPI } from '../../common/services/api';

export default function Contracts() {
  const [activeTab, setActiveTab] = useState('Active');
  const [expandedId, setExpandedId] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'Active', label: 'Active Contracts', icon: Briefcase },
    { id: 'Pending', label: 'Pending Approvals', icon: Clock },
    { id: 'Completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'Disputed', label: 'Disputed', icon: AlertTriangle },
  ];

  useEffect(() => {
    loadContracts();
  }, [activeTab]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const data = await contractAPI.getMyContracts({ status: activeTab });
      setContracts(data.contracts || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMilestone = async (contractId, milestoneId) => {
    try {
      await contractAPI.approveMilestone(milestoneId);
      toast.success('Milestone approved!');
      loadContracts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmitDeliverables = async (contractId, milestoneId, deliverables) => {
    try {
      await contractAPI.submitMilestone(milestoneId, { deliverables });
      toast.success('Deliverables submitted!');
      loadContracts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddFundsToEscrow = async (contractId) => {
    try {
      await walletAPI.deposit(1000, 'mpesa', '+254700000000');
      toast.success('Deposit initiated!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredContracts = contracts;

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading contracts...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-3">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#4C1D95]" /> Contract Management
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">Secure escrow, milestone tracking, and deliverables.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 mb-6 custom-scrollbar pb-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'border-[#4C1D95] text-[#4C1D95]' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredContracts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-8 sm:p-12 text-center bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 border-dashed">
              <FileText className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No {activeTab.toLowerCase()} contracts found.</h3>
              <p className="text-sm text-zinc-500">You don't have any contracts matching this status right now.</p>
            </motion.div>
          ) : (
            filteredContracts.map((contract) => (
              <motion.div key={contract.id} layout initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white dark:bg-zinc-800 rounded-3xl border transition-all overflow-hidden ${
                  expandedId === contract.id ? 'border-[#4C1D95]/20 shadow-lg' : 'border-zinc-200 dark:border-zinc-700 shadow-sm'
                }`}>
                
                <div className="p-4 sm:p-6 cursor-pointer flex flex-col md:flex-row justify-between gap-4 sm:gap-6 items-start md:items-center"
                  onClick={() => setExpandedId(expandedId === contract.id ? null : contract.id)}>
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-xs font-bold text-zinc-400 font-mono bg-zinc-100 dark:bg-surface-dark px-2 py-1 rounded">{contract.id}</span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        contract.status === 'Active' ? 'bg-green-50 text-green-700' :
                        contract.status === 'Disputed' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {contract.status}
                      </span>
                      {contract.escrowStatus === 'Funded' && (
                        <span className="px-2 py-1 bg-[#4C1D95]/5 text-[#4C1D95] text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Escrow Funded
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">{contract.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                      <span>{new Date(contract.createdAt).toLocaleDateString()} - {contract.deadline ? new Date(contract.deadline).toLocaleDateString() : 'Ongoing'}</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
                    <div className="text-lg sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                      KES {(contract.totalAmount || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === contract.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-zinc-100 dark:border-zinc-700/50 bg-surface dark:bg-surface-dark/30">
                      <div className="p-4 sm:p-6 md:p-8">
                        <h3 className="font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#4C1D95]" /> Milestone Deliverables
                        </h3>
                        <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-200 dark:border-zinc-700 space-y-6 sm:space-y-8">
                          {(contract.milestones || []).map((milestone, idx) => (
                            <div key={milestone.id} className="relative">
                              <div className={`absolute -left-[33px] sm:-left-[41px] w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900 ${
                                  milestone.status === 'Completed' ? 'bg-green-500' : 
                                  milestone.status === 'In Review' ? 'bg-[#4C1D95]' : 
                                  milestone.status === 'Disputed' ? 'bg-red-500' : 'bg-zinc-300'
                                }`} />
                                
                              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                  <div>
                                    <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">{idx + 1}. {milestone.title}</h4>
                                    <p className="text-xs text-zinc-500 font-medium mt-1">Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No due date'}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-sm sm:text-lg">KES {(milestone.amount || 0).toLocaleString()}</span>
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                      milestone.status === 'Completed' ? 'bg-green-50 text-green-700' :
                                      milestone.status === 'In Review' ? 'bg-[#4C1D95]/5 text-[#4C1D95]' :
                                      milestone.status === 'Disputed' ? 'bg-red-50 text-red-700' :
                                      'bg-zinc-100 text-zinc-600'
                                    }`}>
                                      {milestone.status}
                                    </span>
                                  </div>
                                </div>
                                
                                {milestone.status === 'In Review' && (
                                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700 flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <button onClick={() => handleApproveMilestone(contract.id, milestone.id)}
                                      className="w-full sm:w-auto justify-center px-4 py-2 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2">
                                      <ShieldCheck className="w-4 h-4" /> Approve
                                    </button>
                                  </div>
                                )}
                                
                                {milestone.status === 'Pending' && (
                                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700">
                                    <button onClick={() => handleSubmitDeliverables(contract.id, milestone.id, 'Deliverables')}
                                      className="w-full sm:w-auto px-4 py-2 bg-zinc-100 text-sm font-semibold rounded-lg hover:bg-zinc-200 flex justify-center items-center gap-2">
                                      <UploadCloud className="w-4 h-4" /> Submit Deliverables
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};