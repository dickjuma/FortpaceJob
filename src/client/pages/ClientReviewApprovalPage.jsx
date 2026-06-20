import { useContractMilestones, useApproveMilestone, useRejectMilestone } from '../services/clientHooks';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, XCircle, AlertCircle, RefreshCw, 
  Download, FileText, Image as ImageIcon, MessageSquare, 
  Star, ThumbsUp, DollarSign, ChevronRight, Check
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { useAuthRedirect } from '../../platform/common/utils/authRedirect';

const SUBMITTED_FILES = [
  { id: 1, name: 'Final_App_Build_v1.zip', size: '145 MB', type: 'zip', icon: FileText, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/5' },
  { id: 2, name: 'Documentation.pdf', size: '2.4 MB', type: 'pdf', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 3, name: 'App_Screenshots.png', size: '8.1 MB', type: 'image', icon: ImageIcon, color: 'text-success', bg: 'bg-emerald-50' }
];

export default function ClientReviewApprovalPage() {
  const { contractId, milestoneId } = useParams();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const { requireAuth } = useAuthRedirect();
  
  const { data: milestones } = useContractMilestones(contractId || 'mock');
  const approveMutation = useApproveMilestone(contractId);
  const rejectMutation = useRejectMilestone(contractId);

  const handleApprove = async () => {
    await approveMutation.mutateAsync(milestoneId || 'mock_m_id');
    // In real app, submit review API as well
    setActiveModal(null);
    navigate('/client/contracts');
  };

  const handleReject = async () => {
    await rejectMutation.mutateAsync({ milestoneId: milestoneId || 'mock_m_id', feedback: revisionFeedback });
    setActiveModal(null);
    navigate('/client/contracts');
  };
  

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-2">
            <a href="#" className="hover:text-[#4C1D95] transition-colors">Contracts</a> <ChevronRight className="w-3 h-3" />
            <a href="#" className="hover:text-[#4C1D95] transition-colors">React Native E-Commerce App</a>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
                Review Final Delivery
              </h1>
              <p className="text-sm font-medium text-zinc-500 mt-1">Freelancer: Alex Rivera • Milestone: Final App Delivery</p>
            </div>
            
            <div className="flex items-center gap-4 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10 border border-[#4C1D95]/20 dark:border-[#4C1D95]/20/30 px-4 py-2 rounded-xl">
              <DollarSign className="w-5 h-5 text-[#4C1D95]" />
              <div>
                <p className="text-xs font-bold text-[#4C1D95] dark:text-[#4C1D95] uppercase tracking-wider">Payment to Release</p>
                <p className="text-sm font-black text-[#4C1D95] dark:text-[#4C1D95]">$3,200.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Submission Details */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <img src="https://i.pravatar.cc/150?u=a1" alt="Alex Rivera" className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700" />
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Alex Rivera submitted work for your review</h2>
                <p className="text-sm font-medium text-zinc-500">Delivered today at 10:45 AM</p>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-medium mb-8">
              <p>Hi Sarah,</p>
              <p>I have attached the final zip file containing the complete React Native source code, as well as the compiled APK for Android testing and the TestFlight link for iOS. I've also included a documentation PDF detailing how to set up the local environment and manage the backend integrations.</p>
              <p>Let me know if you need any adjustments!</p>
              <p>Best,<br/>Alex</p>
            </div>

            {/* Attached Files */}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Attached Files (3)</h3>
              <div className="space-y-3">
                {SUBMITTED_FILES.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-surface dark:hover:bg-zinc-800 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg", file.bg)}>
                        <file.icon className={cn("w-5 h-5", file.color)} />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-[#4C1D95] transition-colors">{file.name}</p>
                        <p className="text-xs font-medium text-zinc-500">{file.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-[#4C1D95] hover:bg-[#4C1D95]/5 dark:hover:bg-[#4C1D95]/10 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">What would you like to do?</h2>
            <p className="text-sm font-medium text-zinc-500 mb-6">You have 3 days left to request revisions before this milestone is automatically approved.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => requireAuth(() => setActiveModal('approve'), {
                  returnTo: '/client/review-approval',
                  state: { intent: 'approve-delivery' },
                })}
                className="p-6 border-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-success/10 rounded-2xl flex flex-col items-center justify-center text-center hover:border-emerald-500 transition-colors group"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-success/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-success dark:text-success" />
                </div>
                <h3 className="font-bold text-emerald-900 dark:text-success text-lg mb-1">Approve & Pay</h3>
                <p className="text-xs font-medium text-emerald-700 dark:text-success">Release $3,200 to freelancer</p>
              </button>

              <button 
                onClick={() => requireAuth(() => setActiveModal('revision'), {
                  returnTo: '/client/review-approval',
                  state: { intent: 'request-revision' },
                })}
                className="p-6 border-2 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex flex-col items-center justify-center text-center hover:border-amber-500 transition-colors group"
              >
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-amber-900 dark:text-amber-400 text-lg mb-1">Request Revision</h3>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-500">Ask for changes (Unlimited remaining)</p>
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-surface-dark dark:bg-surface-dark text-white rounded-3xl p-6 border border-zinc-800 shadow-xl">
            <h3 className="font-bold flex items-center gap-2 mb-4"><AlertCircle className="w-5 h-5 text-[#4C1D95]" /> Important</h3>
            <p className="text-sm font-medium text-zinc-400 leading-relaxed">
              Once you approve this delivery, the funds held in escrow will be immediately released to the freelancer. This action cannot be undone. Ensure you have fully reviewed the work before approving.
            </p>
          </div>
        </div>

      </div>

      {/* Approve & Rating Modal */}
      <AnimatePresence>
        {activeModal === 'approve' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-surface-dark/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
              <div className="bg-success p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black mb-1">Approve Delivery</h2>
                <p className="text-sm font-medium text-emerald-50">You are about to release $3,200.00 to Alex Rivera.</p>
              </div>
              
              <div className="p-8">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 text-center">How was your experience?</h3>
                
                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star className={cn("w-10 h-10 transition-colors", rating >= star ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700")} />
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Leave a public review</label>
                  <textarea 
                    rows="4" 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Alex was great to work with! The code was clean..."
                    className="w-full p-4 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#4C1D95]/20 resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setActiveModal(null)} className="flex-1 py-3 font-bold text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">Cancel</button>
                  <button onClick={handleApprove} disabled={approveMutation.isPending} className="flex-1 py-3 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    <DollarSign className="w-4 h-4" /> {approveMutation.isPending ? 'Processing...' : 'Release Payment'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Request Revision Modal */}
        {activeModal === 'revision' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-surface-dark/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-lg relative z-10 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                  <RefreshCw className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Request a Revision</h2>
                  <p className="text-sm font-medium text-zinc-500">Explain what needs to be changed.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Details of what needs fixing</label>
                  <textarea 
                    rows="5" 
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    placeholder="Please update the colors on the dashboard to match the new brand guidelines..."
                    className="w-full p-4 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#4C1D95]/20 resize-none"
                  ></textarea>
                </div>

                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-surface dark:hover:bg-zinc-800 transition-colors">
                  <ImageIcon className="w-6 h-6 text-zinc-400 mb-2" />
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Attach reference images (Optional)</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setActiveModal(null)} className="flex-1 py-3 font-bold text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">Cancel</button>
                  <button onClick={handleReject} disabled={rejectMutation.isPending} className="flex-1 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl shadow-lg shadow-[#4C1D95]/25/20 transition-colors disabled:opacity-50">
                    {rejectMutation.isPending ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



