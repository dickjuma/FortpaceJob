import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle, Clock, ChevronLeft, Download, AlertTriangle, Send } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function ContractDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('deliverables');
  const [isReleasing, setIsReleasing] = useState(false);
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [fundsReleased, setFundsReleased] = useState(false);
  const [revisionSent, setRevisionSent] = useState(false);

  const handleReleaseFunds = () => {
    setIsReleasing(true);
    setTimeout(() => {
      setIsReleasing(false);
      setFundsReleased(true);
    }, 1500);
  };

  const handleSendRevision = () => {
    setIsSubmittingRevision(true);
    setTimeout(() => {
      setIsSubmittingRevision(false);
      setRevisionSent(true);
      setTimeout(() => setActiveTab('deliverables'), 2000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-6">
        <Link to="/client/contracts" className="text-sm font-medium text-brand-600 hover:text-brand-500 mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Contracts
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center mb-2">
              <span className="bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400 px-2.5 py-0.5 rounded-full font-bold text-xs">
                In Progress
              </span>
              <span className="ml-3 text-sm text-gray-500 font-medium">Contract #ORD-84920</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Senior React Developer</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Freelancer: <span className="font-bold text-gray-900 dark:text-white">Alex Johnson</span></p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
              Message Alex
            </button>
            <button className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
              Dispute Resolution
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm col-span-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-500" /> Escrow Status
          </h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Total Contract Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$8,500.00</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Funds in Escrow</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">$6,000.00</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
            <span>$2,500 Released</span>
            <span>$6,000 Remaining</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center text-center">
          <Clock className="w-8 h-8 text-brand-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Next Milestone Due</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">Oct 24, 2026</p>
          <p className="text-sm font-medium text-brand-600 mt-2">Frontend Architecture</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <button onClick={() => setActiveTab('deliverables')} className={`px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'deliverables' ? 'border-b-2 border-brand-600 text-brand-600 bg-brand-50/50 dark:bg-brand-900/10' : 'text-gray-500 hover:bg-surface dark:hover:bg-gray-800'}`}>Deliverables & Milestones</button>
          <button onClick={() => setActiveTab('revisions')} className={`px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'revisions' ? 'border-b-2 border-brand-600 text-brand-600 bg-brand-50/50 dark:bg-brand-900/10' : 'text-gray-500 hover:bg-surface dark:hover:bg-gray-800'}`}>Revisions</button>
        </div>

        <div className="p-6">
          {activeTab === 'deliverables' && (
            <div className="space-y-6">
              {/* Milestone 1 - Completed */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-surface dark:bg-gray-800/30 opacity-75">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Milestone 1: UI/UX Figma Designs</h3>
                      <p className="text-xs text-gray-500 mt-1">Approved on Oct 10, 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">$2,500.00</p>
                    <span className="text-xs font-bold text-green-600">Fund Released</span>
                  </div>
                </div>
              </div>

              {/* Milestone 2 - Pending Review */}
              <div className="border-2 border-brand-500 rounded-xl p-5 bg-white dark:bg-gray-900 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full border-2 border-brand-500 mr-2 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-brand-500 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Milestone 2: Frontend Architecture</h3>
                      <p className="text-xs text-brand-600 font-medium mt-1">Awaiting Your Approval</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">$3,000.00</p>
                    <span className="text-xs font-bold text-gray-500">In Escrow</span>
                  </div>
                </div>
                
                <div className="bg-surface dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Delivery Note from Alex:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">"I've completed the initial React boilerplate with Redux Toolkit and TailwindCSS configured. The routing is set up. Please review the attached ZIP."</p>
                  
                  <div className="mt-3 flex items-center p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">frontend_v1.zip</p>
                      <p className="text-xs text-gray-500">12.4 MB</p>
                    </div>
                    <button className="p-2 text-brand-600 hover:bg-brand-50 rounded-md">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  {fundsReleased ? (
                    <div className="flex-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold py-2.5 rounded-lg border border-green-200 dark:border-green-800 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" /> Funds Released ($3,000)
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={handleReleaseFunds}
                        disabled={isReleasing}
                        className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center ${isReleasing ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isReleasing ? <Clock className="w-5 h-5 mr-2 animate-spin" /> : null}
                        {isReleasing ? 'Processing Escrow...' : 'Approve & Release $3,000'}
                      </button>
                      <button onClick={() => setActiveTab('revisions')} className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-lg hover:bg-surface transition-colors">
                        Request Revision
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revisions' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-500">Revision Requests</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-600 mt-1">If the delivery does not match the requirements, you can request changes here before releasing the escrow funds.</p>
                </div>
              </div>

              {revisionSent ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-green-800 dark:text-green-400">Revision Request Sent</h4>
                  <p className="text-sm text-green-700 dark:text-green-500 mt-1">The freelancer has been notified. Funds remain in Escrow.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">What needs to be changed?</label>
                    <textarea 
                      rows="4"
                      placeholder="Describe exactly what needs to be fixed..."
                      className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-brand-500 focus:border-brand-500"
                    ></textarea>
                  </div>

                  <button 
                    onClick={handleSendRevision}
                    disabled={isSubmittingRevision}
                    className={`flex items-center px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors ${isSubmittingRevision ? 'opacity-70' : ''}`}
                  >
                    {isSubmittingRevision ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    {isSubmittingRevision ? 'Sending...' : 'Send Revision Request'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
