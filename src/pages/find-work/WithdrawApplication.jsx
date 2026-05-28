import React, { useState } from 'react';
import { ArrowLeft, XCircle, AlertTriangle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const WithdrawApplication = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(agreed) {
      navigate('/find-work/my-applications');
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          
          <Link to="/find-work/my-applications" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Withdraw Application</h1>
            <p className="text-zinc-600 font-medium">Remove your proposal from consideration for this job.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              
              <div className="bg-surface border border-zinc-200 rounded-xl p-4 mb-8">
                <div className="text-sm font-bold text-zinc-500 mb-1">Proposal For:</div>
                <div className="font-bold text-zinc-900 text-lg">Senior React Developer for Dashboard Rebuild</div>
                <div className="text-sm text-zinc-600 mt-1">Submitted on Oct 24, 2026 • Bid: $6,000</div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900">Are you sure?</h4>
                  <p className="text-sm font-medium text-amber-800 mt-1">Withdrawing an application cannot be undone. The client will no longer be able to hire you for this specific posting.</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-700 mb-2">Reason for withdrawal (Optional)</label>
                <select className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-zinc-500 focus:outline-none font-medium text-zinc-900 cursor-pointer">
                  <option value="">Select a reason...</option>
                  <option value="no_longer_available">I am no longer available</option>
                  <option value="hired_elsewhere">I was hired for another job</option>
                  <option value="changed_mind">I changed my mind</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 rounded border-zinc-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <div className="font-bold text-zinc-900">I confirm I want to withdraw my proposal</div>
              </label>

            </div>

            <div className="flex justify-end gap-4">
              <Link to="/find-work/my-applications" className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={!agreed}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${agreed ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                <XCircle className="w-5 h-5" /> Withdraw
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default WithdrawApplication;
