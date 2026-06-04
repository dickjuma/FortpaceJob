import React from 'react';
import { FileSignature, ShieldCheck, Download, History, FileText, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContractPreview = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3">
                Pending Approval
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Contract Overview</h1>
              <p className="text-zinc-600">Review terms before digital signature and escrow funding.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg hover:bg-surface font-medium text-sm transition-colors">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg hover:bg-surface font-medium text-sm transition-colors">
                <History className="w-4 h-4" /> Audit Log
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-8 relative">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <div className="transform -rotate-45 text-9xl font-black text-zinc-900 tracking-widest">DRAFT</div>
            </div>

            {/* Contract Header */}
            <div className="p-8 border-b border-zinc-200 flex flex-col md:flex-row justify-between gap-8 relative z-10">
              <div>
                <div className="text-sm text-zinc-500 font-medium mb-1">Contract ID: #CTR-88492-X9</div>
                <h2 className="text-2xl font-bold text-zinc-900">Frontend E-commerce Development</h2>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="bg-surface px-3 py-1.5 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 mr-1">Type:</span> <span className="font-semibold text-zinc-900">Fixed-Price Milestone</span>
                  </div>
                  <div className="bg-surface px-3 py-1.5 rounded-lg border border-zinc-200">
                    <span className="text-zinc-500 mr-1">Created:</span> <span className="font-semibold text-zinc-900">Oct 24, 2023</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-500 font-medium mb-1">Total Contract Value</div>
                <div className="text-4xl font-black text-zinc-900">$2,000.00</div>
              </div>
            </div>

            {/* Parties */}
            <div className="p-8 border-b border-zinc-200 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 bg-surface/50">
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Client (The Buyer)</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-zinc-500">AC</div>
                  <div>
                    <div className="font-bold text-zinc-900">Acme Corp Ltd.</div>
                    <div className="text-sm text-zinc-500">john@acmecorp.com</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Freelancer (The Service Provider)</h3>
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80" alt="Sarah" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-bold text-zinc-900 flex items-center gap-1">Sarah Jenkins <ShieldCheck className="w-4 h-4 text-[#2bb75c]" /></div>
                    <div className="text-sm text-zinc-500">sarah.j.dev@example.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones & Escrow */}
            <div className="p-8 border-b border-zinc-200 relative z-10">
              <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-zinc-400" /> Escrow Milestones
              </h3>
              
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface border-b border-zinc-200 text-zinc-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Due Date</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    <tr>
                      <td className="px-4 py-4 font-medium text-zinc-900">1. Initial Design & Wireframes</td>
                      <td className="px-4 py-4 text-zinc-500">Nov 01, 2023</td>
                      <td className="px-4 py-4 font-medium text-zinc-900 text-right">$500.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium text-zinc-900">2. Frontend Development & Integration</td>
                      <td className="px-4 py-4 text-zinc-500">Nov 15, 2023</td>
                      <td className="px-4 py-4 font-medium text-zinc-900 text-right">$1,500.00</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-surface border-t border-zinc-200">
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-right font-medium text-zinc-600">Total Contract Value</td>
                      <td className="px-4 py-3 font-bold text-zinc-900 text-right">$2,000.00</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-right font-medium text-zinc-500">Platform Processing Fee (5%)</td>
                      <td className="px-4 py-3 font-medium text-zinc-500 text-right">$100.00</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-right font-bold text-zinc-900">Total Escrow Funding Required</td>
                      <td className="px-4 py-3 font-black text-[#2bb75c] text-right">$2,100.00</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="text-xs text-zinc-500 mt-3 text-center">
                Funds for the first milestone ($500.00 + fees) will be deposited into Fortspace Escrow upon contract signature.
              </p>
            </div>

            {/* Terms */}
            <div className="p-8 relative z-10 bg-surface">
              <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-400" /> Standard Terms
              </h3>
              <div className="h-48 overflow-y-auto bg-white border border-zinc-200 rounded-xl p-4 text-xs text-zinc-600 space-y-3 font-mono leading-relaxed">
                <p>1. SERVICES. Freelancer agrees to perform the services described in the milestones above.</p>
                <p>2. PAYMENT. Client agrees to pay the amounts specified in the milestones via Fortspace Escrow. Funds for the active milestone must be deposited prior to work commencement.</p>
                <p>3. OWNERSHIP. Upon full payment, Freelancer assigns to Client all rights, title, and interest in the work product.</p>
                <p>4. CONFIDENTIALITY. Freelancer agrees to keep confidential all proprietary information received from the Client.</p>
                <p>5. DISPUTES. Any disputes shall be resolved through the Fortspace Dispute Resolution Center.</p>
                <p>...</p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 sticky bottom-6 z-50">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input type="checkbox" id="agree" className="w-5 h-5 rounded border-zinc-300 text-[#2bb75c] focus:ring-[#2bb75c]/20 cursor-pointer" />
              <label htmlFor="agree" className="text-sm font-medium text-zinc-700 cursor-pointer">
                I agree to the <a href="#" className="text-[#2bb75c] hover:underline">Terms of Service</a> and Escrow Instructions.
              </label>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-3 border border-zinc-300 text-zinc-700 font-bold rounded-xl hover:bg-surface transition-colors">
                Cancel
              </button>
              <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-8 py-3 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl shadow-md transition-colors">
                <FileSignature className="w-5 h-5" /> Sign & Fund Escrow
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContractPreview;

