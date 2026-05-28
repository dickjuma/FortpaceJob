import React, { useState } from 'react';
import { FileSignature, ShieldCheck, CheckCircle2, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const WorkAgreement = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(agreed) {
      navigate('/find-work/orders/ORD-NEW');
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          <Link to={`/find-work/work/${workId}/applications`} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Applications
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Review Contract & Hire</h1>
            <p className="text-zinc-600 font-medium">Review the final terms before initiating the contract with Escrow.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Header Card */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?img=11" alt="Provider" className="w-16 h-16 rounded-full border-2 border-zinc-100" />
                <div>
                  <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Hiring</div>
                  <h3 className="font-black text-zinc-900 text-xl">DevMasterPro</h3>
                </div>
              </div>
              <div className="w-full md:w-px h-px md:h-16 bg-zinc-200"></div>
              <div className="text-center md:text-right w-full md:w-auto">
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">For Job</div>
                <h3 className="font-bold text-zinc-900 line-clamp-1">Senior React Developer for Dashboard Rebuild</h3>
              </div>
            </div>

            {/* Terms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-success" /> Financial Terms
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                    <span className="font-medium text-zinc-600">Agreed Amount (Fixed)</span>
                    <span className="font-black text-zinc-900 text-lg">$6,000.00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                    <span className="font-medium text-zinc-600">Client Processing Fee (5%)</span>
                    <span className="font-bold text-zinc-500">$300.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-zinc-900">Total Escrow Deposit</span>
                    <span className="font-black text-success text-2xl">$6,300.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-600" /> Timeline & Delivery
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                    <span className="font-medium text-zinc-600">Expected Delivery</span>
                    <span className="font-bold text-zinc-900">3 Weeks</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                    <span className="font-medium text-zinc-600">Start Date</span>
                    <span className="font-bold text-zinc-900">Immediate</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-medium text-zinc-600">Estimated Deadline</span>
                    <span className="font-bold text-zinc-900 text-lg">Nov 15, 2026</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Agreement Policy */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
              <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" /> Fortspace Protection
              </h3>
              <div className="prose prose-sm prose-slate max-w-none mb-6">
                <p>By clicking "Fund & Hire", your payment will be securely held in Fortspace Escrow. The funds will only be released to the freelancer once you have reviewed and approved the completed work.</p>
                <p>If the freelancer fails to deliver or the work does not meet the agreed requirements, you are protected by our Dispute Resolution process and may be entitled to a full refund.</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-4 bg-surface border border-zinc-200 rounded-xl hover:border-brand-300 transition-colors">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <div>
                  <div className="font-bold text-zinc-900">I agree to the terms of the contract</div>
                  <div className="text-sm font-medium text-zinc-500 mt-1">I authorize Fortspace to charge my default payment method for the total amount of $6,300.00.</div>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!agreed}
                className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${agreed ? 'bg-success hover:bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
              >
                <FileSignature className="w-5 h-5" /> Fund Contract & Hire
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};

export default WorkAgreement;
