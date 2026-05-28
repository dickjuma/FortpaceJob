import React, { useState } from 'react';
import { Handshake, DollarSign, Clock, Send, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const CounterOffer = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState('5000');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(budget) {
      navigate(`/find-work/work/${workId || 1}/applications`);
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          <Link to={`/find-work/work/${workId || 1}/applications`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Make a Counter Offer</h1>
            <p className="text-zinc-600 font-medium">Propose different terms to the freelancer before hiring.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Original Proposal</h2>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4 bg-surface border border-zinc-200 rounded-xl mb-8">
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Provider" className="w-12 h-12 rounded-full border border-zinc-200" />
                  <div>
                    <h3 className="font-bold text-zinc-900">DevMasterPro</h3>
                    <div className="text-sm font-medium text-zinc-500">Proposed: 3 weeks delivery</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-zinc-400 line-through">
                  $6,000.00
                </div>
              </div>

              <h2 className="text-xl font-bold text-zinc-900 mb-6">Your Counter Offer</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">New Budget</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 font-bold text-zinc-400"><DollarSign className="w-5 h-5" /></span>
                    <input 
                      type="number" 
                      required
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 font-bold text-zinc-900 text-lg" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">New Deadline (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 font-bold text-zinc-400"><Clock className="w-5 h-5" /></span>
                    <select className="w-full pl-12 pr-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 font-bold text-zinc-900 cursor-pointer appearance-none">
                      <option>Keep original (3 weeks)</option>
                      <option>2 weeks</option>
                      <option>1 month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Message to Freelancer</label>
                <textarea 
                  rows="4"
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Explain why you are proposing these new terms..."
                  className="w-full p-4 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 font-medium text-zinc-900 resize-y"
                ></textarea>
              </div>

            </div>

            <div className="flex justify-end gap-4">
              <Link to={`/find-work/work/${workId || 1}/applications`} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={!budget || !message}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${budget && message ? 'bg-brand-600 hover:bg-brand-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                <Handshake className="w-5 h-5" /> Send Counter Offer
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};

export default CounterOffer;
