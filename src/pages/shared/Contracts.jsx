import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, CheckCircle2, Clock, AlertTriangle, 
  FileText, Lock, PenTool, Search, ChevronDown, 
  UploadCloud, ExternalLink, ShieldCheck, DollarSign
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const contractsData = [
  {
    id: 'CTR-9284-A',
    title: 'Enterprise SaaS Dashboard Development',
    counterparty: { name: 'Elena R.', role: 'Lead Frontend Engineer', avatar: 'E' },
    status: 'Active',
    totalAmount: 'KES 1,500,000',
    escrowStatus: 'Funded',
    progress: 65,
    startDate: 'Oct 01, 2026',
    endDate: 'Dec 15, 2026',
    milestones: [
      { id: 1, title: 'UX Research & Wireframes', amount: 'KES 300,000', status: 'Completed', date: 'Oct 15' },
      { id: 2, title: 'Core UI Implementation', amount: 'KES 600,000', status: 'In Review', date: 'Nov 10' },
      { id: 3, title: 'API Integration & Testing', amount: 'KES 600,000', status: 'Pending', date: 'Dec 15' },
    ]
  },
  {
    id: 'CTR-1045-B',
    title: 'Smart Contract Security Audit',
    counterparty: { name: 'David L.', role: 'Web3 Security Auditor', avatar: 'D' },
    status: 'Pending',
    totalAmount: 'KES 850,000',
    escrowStatus: 'Awaiting Funds',
    progress: 0,
    startDate: 'Nov 20, 2026',
    endDate: 'Dec 05, 2026',
    milestones: [
      { id: 1, title: 'Initial Code Review', amount: 'KES 400,000', status: 'Pending', date: 'Nov 25' },
      { id: 2, title: 'Final Audit Report', amount: 'KES 450,000', status: 'Pending', date: 'Dec 05' },
    ]
  },
  {
    id: 'CTR-7721-C',
    title: 'Mobile App Refactoring',
    counterparty: { name: 'Sarah K.', role: 'React Native Expert', avatar: 'S' },
    status: 'Disputed',
    totalAmount: 'KES 1,200,000',
    escrowStatus: 'Frozen',
    progress: 50,
    startDate: 'Sep 01, 2026',
    endDate: 'Oct 30, 2026',
    milestones: [
      { id: 1, title: 'Architecture Planning', amount: 'KES 600,000', status: 'Completed', date: 'Sep 15' },
      { id: 2, title: 'Module Refactoring', amount: 'KES 600,000', status: 'Disputed', date: 'Oct 30' },
    ]
  }
];

const Contracts = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const [expandedId, setExpandedId] = useState('CTR-9284-A');

  const tabs = [
    { id: 'Active', label: 'Active Contracts', icon: Briefcase },
    { id: 'Pending', label: 'Pending Approvals', icon: Clock },
    { id: 'Completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'Disputed', label: 'Disputed', icon: AlertTriangle },
  ];

  const filteredContracts = contractsData.filter(c => c.status === activeTab);

  // Interaction Handlers
  const handleViewWork = () => toast('Opening deliverables package...', { icon: '📦' });
  const handleApproveRelease = () => toast.success('Initiating escrow release for milestone...');
  const handleRequestChanges = () => toast('Opening revision request form...', { icon: '📝' });
  const handleSubmitDeliverables = () => toast('Opening file upload dialog...', { icon: '📤' });
  const handleViewOriginalPDF = () => toast('Fetching signed contract document...', { icon: '📄' });
  const handleResolveDispute = () => toast.error('Connecting to Fortespace arbitration center...', { icon: '⚖️' });
  const handleAddFundsToEscrow = () => toast('Redirecting to escrow deposit gateway...', { icon: '💸' });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-3">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-brand-600" /> Contract Management
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">Secure escrow, milestone tracking, and deliverables.</p>
        </div>
        <div className="w-full sm:w-auto flex gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input type="text" placeholder="Search ID or Name" className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 mb-6 custom-scrollbar pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredContracts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 sm:p-12 text-center bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 border-dashed">
              <FileText className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No {activeTab.toLowerCase()} contracts found.</h3>
              <p className="text-sm text-zinc-500">You don't have any contracts matching this status right now.</p>
            </motion.div>
          ) : (
            filteredContracts.map((contract) => (
              <motion.div 
                key={contract.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white dark:bg-zinc-800 rounded-3xl border transition-all overflow-hidden ${
                  expandedId === contract.id ? 'border-brand-300 dark:border-brand-700 shadow-lg' : 'border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-zinc-300'
                }`}
              >
                {/* Contract Header (Clickable) */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer flex flex-col md:flex-row justify-between gap-4 sm:gap-6 items-start md:items-center"
                  onClick={() => setExpandedId(expandedId === contract.id ? null : contract.id)}
                >
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-xs font-bold text-zinc-400 font-mono bg-zinc-100 dark:bg-surface-dark px-2 py-1 rounded">{contract.id}</span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        contract.status === 'Active' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                        contract.status === 'Disputed' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                        'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>
                        {contract.status}
                      </span>
                      {contract.escrowStatus === 'Funded' && (
                         <span className="px-2 py-1 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                           <Lock className="w-3 h-3" /> Escrow Funded
                         </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">{contract.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 shrink-0">{contract.counterparty.avatar}</div>
                        <span className="font-semibold text-zinc-900 dark:text-white truncate max-w-[120px] sm:max-w-full">{contract.counterparty.name}</span>
                      </div>
                      <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />
                      <span className="whitespace-nowrap">{contract.startDate} - {contract.endDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100 dark:border-zinc-700">
                    <div className="text-lg sm:text-2xl font-extrabold text-zinc-900 dark:text-white">{contract.totalAmount}</div>
                    
                    <div className="flex items-center gap-3 w-32 sm:w-48">
                      <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${contract.status === 'Disputed' ? 'bg-red-500' : 'bg-brand-600'}`} style={{ width: `${contract.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right">{contract.progress}%</span>
                    </div>
                  </div>

                  <button className="hidden md:flex p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors shrink-0">
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedId === contract.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Expanded Details: Timeline & Milestones */}
                <AnimatePresence>
                  {expandedId === contract.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-zinc-100 dark:border-zinc-700/50 bg-surface dark:bg-surface-dark/30"
                    >
                      <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        
                        {/* Milestone Tracker (Legal-Tech UI) */}
                        <div className="lg:col-span-2">
                          <h3 className="font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-brand-600" /> Milestone Deliverables
                          </h3>
                          
                          <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-200 dark:border-zinc-700 space-y-6 sm:space-y-8">
                            {contract.milestones.map((milestone, idx) => (
                              <div key={milestone.id} className="relative">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[33px] sm:-left-[41px] w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900 ${
                                  milestone.status === 'Completed' ? 'bg-green-500' : 
                                  milestone.status === 'In Review' ? 'bg-brand-500' : 
                                  milestone.status === 'Disputed' ? 'bg-red-500' : 'bg-zinc-300 dark:bg-zinc-600'
                                }`} />
                                
                                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-sm">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                    <div>
                                      <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">{idx + 1}. {milestone.title}</h4>
                                      <p className="text-xs text-zinc-500 font-medium mt-1">Due Date: {milestone.date}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold text-sm sm:text-lg">{milestone.amount}</span>
                                      <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-md text-[10px] font-bold uppercase ${
                                        milestone.status === 'Completed' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                                        milestone.status === 'In Review' ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' :
                                        milestone.status === 'Disputed' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                                        'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                      }`}>
                                        {milestone.status}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Milestone Actions based on status */}
                                  {milestone.status === 'In Review' && (
                                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700 flex flex-col sm:flex-row gap-2 sm:gap-3">
                                      <button onClick={handleViewWork} className="w-full sm:w-auto justify-center px-4 py-2 bg-brand-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4" /> View Work
                                      </button>
                                      <button onClick={handleApproveRelease} className="w-full sm:w-auto justify-center px-4 py-2 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Approve
                                      </button>
                                      <button onClick={handleRequestChanges} className="w-full sm:w-auto justify-center px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-surface dark:hover:bg-zinc-700 transition-colors">
                                        Request Changes
                                      </button>
                                    </div>
                                  )}
                                  
                                  {milestone.status === 'Pending' && (
                                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700">
                                      <button onClick={handleSubmitDeliverables} className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold rounded-lg hover:bg-surface dark:hover:bg-zinc-700 transition-colors flex justify-center items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                        <UploadCloud className="w-4 h-4" /> Submit Deliverables
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Contract Actions & Digital Signatures */}
                        <div className="space-y-4 sm:space-y-6">
                           <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-sm">
                             <h3 className="font-bold text-sm sm:text-base mb-4 flex items-center gap-2">
                               <PenTool className="w-4 h-4 text-zinc-400" /> Digital Signatures
                             </h3>
                             <div className="space-y-2 sm:space-y-3">
                               <div className="flex justify-between items-center p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
                                 <div>
                                   <div className="text-xs font-semibold text-green-700 dark:text-green-400">Client Signed</div>
                                   <div className="text-[10px] text-zinc-500">IP: 192.168.1.1 • Oct 01</div>
                                 </div>
                                 <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                               </div>
                               <div className="flex justify-between items-center p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
                                 <div>
                                   <div className="text-xs font-semibold text-green-700 dark:text-green-400">Freelancer Signed</div>
                                   <div className="text-[10px] text-zinc-500">IP: 10.0.0.5 • Oct 01</div>
                                 </div>
                                 <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                               </div>
                             </div>
                             <button onClick={handleViewOriginalPDF} className="w-full mt-4 py-2 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex justify-center items-center gap-2 transition-colors">
                               <FileText className="w-4 h-4" /> View Original PDF
                             </button>
                           </div>

                           <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-sm">
                             <h3 className="font-bold text-sm sm:text-base mb-4 flex items-center gap-2">
                               <DollarSign className="w-4 h-4 text-zinc-400" /> Escrow Status
                             </h3>
                             <div className="mb-4">
                               <div className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">
                                 {contract.totalAmount.replace('1,500,000', '900,000').replace('1,200,000', '600,000')}
                               </div>
                               <div className="text-xs font-semibold text-zinc-500">Currently held in Escrow</div>
                             </div>
                             {contract.status === 'Disputed' ? (
                               <button onClick={handleResolveDispute} className="w-full py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-xs sm:text-sm font-bold rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition-colors">
                                 Resolve Dispute
                               </button>
                             ) : (
                               <button onClick={handleAddFundsToEscrow} className="w-full py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors">
                                 Add Funds to Escrow
                               </button>
                             )}
                           </div>
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

export default Contracts;
