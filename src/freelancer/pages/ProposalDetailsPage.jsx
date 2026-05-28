import React, { useState } from 'react';
import { Send, Clock, FileText, CheckCircle, ChevronLeft, Building, Pencil, Eye, XCircle, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const proposal = {
    jobTitle: 'Senior React Developer for Enterprise Dashboard',
    client: 'Acme Corp',
    clientHistory: '14 jobs posted • KES 12M+ spent',
    status: 'Viewed',
    submittedAt: '2 days ago',
    viewedAt: '5 hours ago',
    bid: 'KES 8,500/hr',
    duration: '3 to 6 months',
    coverLetter: "Hi there,\n\nI am extremely interested in your project for building the enterprise React dashboard. With over 8 years of experience building scalable SaaS platforms using React, Redux Toolkit, and TailwindCSS, I am confident I can deliver a pixel-perfect, highly performant UI.\n\nI have attached my portfolio featuring similar enterprise dashboards.",
    attachments: ['portfolio_dashboard.pdf'],
    aiOptimizationScore: 92
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" />
      <div className="mb-8">
        <Link to="/freelancer/proposals" className="text-sm font-medium text-brand-600 hover:text-brand-500 mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Bidding Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proposal Details</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review your submitted bid and track client engagement.</p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
                  <Pencil className="w-4 h-4 mr-2" /> Edit Proposal
                </button>
                <button onClick={() => toast('Proposal withdrawn', { icon: '🗑️' })} className="flex items-center px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">
                  Withdraw
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(false)} className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button onClick={() => { setIsEditing(false); toast('Changes saved successfully!', { icon: '✅' }); }} className="flex items-center px-6 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-sm">
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Job Info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{proposal.jobTitle}</h2>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Building className="w-4 h-4 mr-1 text-gray-400" />
              <span className="font-medium mr-3">{proposal.client}</span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{proposal.clientHistory}</span>
            </div>
            <Link to={`/jobs/preview`} onClick={() => toast('Loading original job posting...', { icon: '🔍' })} className="text-sm font-bold text-brand-600 hover:text-brand-700">
              View Original Job Posting →
            </Link>
          </div>

          {/* Proposal Content */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Proposed Terms</h3>
              <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> AI Optimized: {proposal.aiOptimizationScore}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-surface dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold text-gray-500 mb-1">Bid Amount</p>
                {isEditing ? (
                  <input type="text" defaultValue={proposal.bid} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white font-bold" />
                ) : (
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{proposal.bid}</p>
                )}
              </div>
              <div className="p-4 bg-surface dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold text-gray-500 mb-1">Estimated Duration</p>
                {isEditing ? (
                  <select defaultValue={proposal.duration} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white font-medium">
                    <option>1 to 3 months</option>
                    <option>3 to 6 months</option>
                  </select>
                ) : (
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{proposal.duration}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Cover Letter</p>
              {isEditing ? (
                <textarea 
                  rows="8" 
                  defaultValue={proposal.coverLetter}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white text-sm leading-relaxed focus:ring-brand-500 focus:border-brand-500"
                />
              ) : (
                <div className="p-4 bg-surface dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                    {proposal.coverLetter}
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Attachments</p>
              <div className="flex flex-wrap gap-3">
                {proposal.attachments.map(file => (
                  <div key={file} className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm font-medium">
                    <FileText className="w-4 h-4 text-brand-600 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{file}</span>
                    {isEditing && <button className="ml-3 text-gray-400 hover:text-red-500"><XCircle className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Application Status</h3>
            
            <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 space-y-8">
              <div className="relative">
                <div className="absolute -left-3.5 mt-1.5 w-7 h-7 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="ml-6">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Submitted</h4>
                  <p className="text-xs text-gray-500 mt-1">{proposal.submittedAt}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-3.5 mt-1.5 w-7 h-7 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <Eye className="w-4 h-4 text-brand-600" />
                </div>
                <div className="ml-6">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Viewed by Client</h4>
                  <p className="text-xs text-gray-500 mt-1">{proposal.viewedAt}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-3.5 mt-1.5 w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="ml-6">
                  <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500">Interview/Shortlist</h4>
                  <p className="text-xs text-gray-400 mt-1">Awaiting client action</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 rounded-xl text-center">
              <AlertCircle className="w-5 h-5 text-brand-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-brand-800 dark:text-brand-400">
                You cannot edit your proposal once the client initiates an interview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
