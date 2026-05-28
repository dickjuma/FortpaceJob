import React, { useState } from 'react';
import { PackageCheck, CheckCircle2, DollarSign, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const WorkCompletion = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleApprove = () => {
    if(agreed) {
      navigate(`/find-work/orders/${orderId}/review`);
    }
  };

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageCheck className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Review Final Delivery</h1>
            <p className="text-zinc-600 font-medium">DevMasterPro has submitted the final work. Review and release payment.</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm mb-8">
            <div className="p-6 md:p-8 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-4">Submitted Files</h2>
              
              <div className="flex items-center justify-between p-4 bg-surface border border-zinc-200 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center font-black text-xs">ZIP</div>
                  <div>
                    <div className="font-bold text-zinc-900">dashboard_source_code_final.zip</div>
                    <div className="text-xs text-zinc-500 font-medium">45.2 MB • Uploaded 2 hours ago</div>
                  </div>
                </div>
                <button className="p-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
                <h4 className="font-bold text-brand-900 text-sm mb-1">Message from DevMasterPro:</h4>
                <p className="text-sm text-brand-800">Here is the final source code as requested. I've also included the README with deployment instructions. Let me know if you need anything else!</p>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-surface/50">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Payment Release</h2>
              
              <div className="max-w-sm mx-auto bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm text-center mb-6">
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Escrow Release Amount</div>
                <div className="text-4xl font-black text-success flex items-center justify-center gap-1">
                  <DollarSign className="w-8 h-8" />6,000.00
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 rounded border-zinc-300 text-success focus:ring-emerald-500 cursor-pointer"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div>
                    <div className="font-bold text-zinc-900">I am satisfied with the delivery</div>
                    <div className="text-sm font-medium text-zinc-500 mt-1">By checking this box, you instruct Fortspace Escrow to release $6,000.00 to DevMasterPro. This action cannot be undone and marks the contract as completed.</div>
                  </div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => navigate(`/find-work/orders/${orderId}/revise`)} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold rounded-xl transition-colors">
                  Request Revision
                </button>
                <button 
                  onClick={handleApprove}
                  disabled={!agreed}
                  className={`px-8 py-3 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${agreed ? 'bg-success hover:bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                >
                  <ShieldCheck className="w-5 h-5" /> Approve & Release Payment
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default WorkCompletion;
