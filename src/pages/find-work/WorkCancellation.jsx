import React, { useState } from 'react';
import { XOctagon, ArrowLeft, DollarSign } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const WorkCancellation = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(agreed && reason) {
      navigate('/find-work/my-posted-work');
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          
          <Link to={`/find-work/orders/${workId || 'ORD-NEW'}`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Order
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Cancel Contract</h1>
            <p className="text-zinc-600 font-medium">Request a mutual cancellation and refund for this active contract.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              
              <div className="flex items-center justify-between p-4 bg-surface border border-zinc-200 rounded-xl mb-8">
                <div>
                  <div className="text-sm font-bold text-zinc-500 mb-1">Escrow Refund Estimate</div>
                  <div className="text-xs text-zinc-400">Assuming provider accepts the cancellation</div>
                </div>
                <div className="text-2xl font-black text-zinc-900 flex items-center">
                  <DollarSign className="w-6 h-6" />6,000.00
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-zinc-700 mb-2">Reason for Cancellation</label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none font-medium text-zinc-900 cursor-pointer"
                >
                  <option value="" disabled>Select a reason...</option>
                  <option value="unresponsive">Provider is unresponsive</option>
                  <option value="timeline">Provider cannot meet the timeline</option>
                  <option value="not_needed">Work is no longer needed</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 rounded border-zinc-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div>
                    <div className="font-bold text-rose-900">I understand the cancellation policy</div>
                    <div className="text-sm font-medium text-rose-800 mt-1">By submitting this request, the provider has 48 hours to accept or decline the cancellation. If they decline, the contract will enter dispute resolution. Fortspace processing fees (5%) are non-refundable.</div>
                  </div>
                </label>
              </div>

            </div>

            <div className="flex justify-end gap-4">
              <Link to={`/find-work/orders/${workId || 'ORD-NEW'}`} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Keep Contract Open
              </Link>
              <button 
                type="submit" 
                disabled={!agreed || !reason}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${agreed && reason ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                <XOctagon className="w-5 h-5" /> Request Cancellation
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};

export default WorkCancellation;
