import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Download, Edit3, CheckCircle, Clock } from 'lucide-react';

export default function DigitalContractViewer({ contractTitle = "Enterprise Web App Development" }) {
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState('');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-dark dark:text-white flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#2bb75c]" /> Contract Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">Ref: CON-9921 • Generated on May 19, 2026</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-button text-sm font-medium hover:bg-surface dark:hover:bg-surface-dark-tertiary transition-colors flex items-center shadow-card">
            <Download className="w-4 h-4 mr-2" /> PDF Copy
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-card overflow-hidden">
        {/* Legal Header */}
        <div className="bg-surface-tertiary dark:bg-surface-dark-secondary p-8 border-b border-gray-200 dark:border-surface-dark-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-serif text-surface-dark dark:text-white mb-2">Independent Contractor Agreement</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-success" /> Legally Binding</span>
              <span>Effective Date: <strong>May 20, 2026</strong></span>
            </div>
          </div>
          {isSigned ? (
            <div className="bg-success/10 text-success border border-success/20 px-4 py-2 rounded-badge flex items-center gap-2 font-bold">
              <CheckCircle className="w-5 h-5" /> Fully Executed
            </div>
          ) : (
            <div className="bg-warning/10 text-warning border border-warning/20 px-4 py-2 rounded-badge flex items-center gap-2 font-bold">
              <Clock className="w-5 h-5" /> Pending Signature
            </div>
          )}
        </div>

        {/* Contract Body */}
        <div className="p-8 md:p-12 space-y-10 text-surface-dark dark:text-gray-300 font-serif leading-relaxed">
          <section>
            <h3 className="text-xl font-bold font-sans text-[#2bb75c] mb-4 uppercase tracking-wider">1. The Parties</h3>
            <p>
              This Agreement is made between <strong>TechCorp Inc.</strong> ("Client") and <strong>Sarah Jenkins</strong> ("Contractor"). 
              Client agrees to engage Contractor, and Contractor agrees to be engaged by Client to perform the services outlined in this agreement.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold font-sans text-[#2bb75c] mb-4 uppercase tracking-wider">2. Scope of Work</h3>
            <p className="mb-4">Contractor will provide the following services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Design and develop a complete overhaul of the enterprise dashboard.</li>
              <li>Implement real-time WebSocket communication for live updates.</li>
              <li>Ensure 100% responsive coverage for mobile, tablet, and desktop viewports.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold font-sans text-[#2bb75c] mb-4 uppercase tracking-wider">3. Compensation & Milestones</h3>
            <p className="mb-4">Total compensation for this project is <strong>$12,500.00 USD</strong>. Payments will be released via Escrow upon completion of the following milestones:</p>
            <div className="bg-surface-tertiary dark:bg-surface-dark-secondary rounded-xl border border-gray-200 dark:border-surface-dark-border p-4 font-sans text-sm">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold">M1: Wireframes & Research</span>
                <span className="font-bold text-success">$2,500.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold">M2: High-Fidelity Designs</span>
                <span className="font-bold text-success">$3,500.00</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-bold">M3: Frontend Implementation</span>
                <span className="font-bold text-success">$6,500.00</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold font-sans text-[#2bb75c] mb-4 uppercase tracking-wider">4. IP & Confidentiality</h3>
            <p>
              Upon full payment, all intellectual property rights related to the deliverables transfer to the Client. 
              The Contractor agrees to maintain strict confidentiality regarding all proprietary information.
            </p>
          </section>
        </div>

        {/* Signature Block */}
        <div className="bg-surface dark:bg-surface-dark-secondary p-8 border-t border-gray-200 dark:border-surface-dark-border">
          <h3 className="text-lg font-bold text-surface-dark dark:text-white mb-6">Digital Signatures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Client Signature */}
            <div className="space-y-4">
              <p className="font-bold text-sm text-gray-500 uppercase">Client</p>
              <div className="p-4 border border-gray-200 dark:border-surface-dark-border rounded-xl bg-white dark:bg-surface-dark flex items-center justify-between">
                <div>
                  <p className="font-serif text-xl italic text-gray-800 dark:text-gray-200">TechCorp Authorized</p>
                  <p className="text-xs text-gray-500 mt-1">Signed via SSO • May 19, 2026</p>
                </div>
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>

            {/* Freelancer Signature */}
            <div className="space-y-4">
              <p className="font-bold text-sm text-gray-500 uppercase">Contractor</p>
              {!isSigned ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Edit3 className="w-5 h-5 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Type your full legal name to sign" 
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#2bb75c]/20 dark:border-[#2bb75c]/20/50 focus:border-[#2bb75c]/20 rounded-xl bg-white dark:bg-surface-dark outline-none font-serif text-lg italic"
                    />
                  </div>
                  <button 
                    onClick={() => { if(signature) setIsSigned(true); }}
                    disabled={!signature}
                    className="w-full py-3 bg-[#2bb75c] hover:bg-[#1d8d38] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-button font-bold transition-all shadow-lg shadow-[#2bb75c]/25/25"
                  >
                    Agree & Sign Contract
                  </button>
                  <p className="text-xs text-center text-gray-500">By signing, you agree to the Terms of Service.</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 border border-[#2bb75c]/20 dark:border-[#2bb75c]/20/50 rounded-xl bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10 flex items-center justify-between"
                >
                  <div>
                    <p className="font-serif text-xl italic text-[#2bb75c] dark:text-[#2bb75c]">{signature}</p>
                    <p className="text-xs text-[#2bb75c]/70 dark:text-[#2bb75c]/70 mt-1">Verified IP: 192.168.1.1 • Just now</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-[#2bb75c] dark:text-[#2bb75c]" />
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

