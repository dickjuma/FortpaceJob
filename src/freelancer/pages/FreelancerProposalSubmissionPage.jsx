import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Sparkles, UploadCloud, Clock, 
  DollarSign, CheckSquare, Shield, ChevronLeft,
  Paperclip, Image as ImageIcon, Briefcase
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

export default function FreelancerProposalSubmissionPage() {
  const [coverLetter, setCoverLetter] = useState('');

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer w-max">
            <ChevronLeft className="w-4 h-4" /> Back to Job Details
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Submit a Proposal</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Proposal Form */}
        <div className="flex-1 space-y-8">
          
          {/* Job Summary Card */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Build a React Native E-Commerce App</h2>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-zinc-500 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Mobile Development</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Less than 1 month</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> $3,000 - $5,000</span>
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-2">
              We are looking for an experienced React Native developer to build out the mobile version of our existing web e-commerce platform. Must have experience with Redux, Stripe, and push notifications.
            </p>
          </div>

          {/* Pricing & Terms */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Terms & Pricing</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white">What is the full amount you'd like to bid?</h3>
                  <p className="text-xs font-medium text-zinc-500">Client's budget is $3,000 - $5,000</p>
                </div>
                <div className="relative w-full sm:w-48 shrink-0">
                  <DollarSign className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type="number" defaultValue={4500} className="w-full pl-10 pr-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:border-[#14a800]/20 text-right" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-500">10% Freelancer Service Fee</h3>
                  <p className="text-xs font-medium text-zinc-400">This fee helps us run the platform.</p>
                </div>
                <div className="w-full sm:w-48 text-right font-bold text-zinc-500">
                  -$450.00
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg">You'll Receive</h3>
                  <p className="text-xs font-medium text-zinc-500">The estimated amount you'll receive after fees.</p>
                </div>
                <div className="relative w-full sm:w-48 shrink-0">
                  <DollarSign className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-success" />
                  <input type="text" readOnly value="4050.00" className="w-full pl-10 pr-4 py-3 bg-emerald-50 dark:bg-success/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-success rounded-xl font-black outline-none text-right cursor-not-allowed" />
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-4">How long will this project take?</h3>
                <select className="w-full sm:w-1/2 px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#14a800]/20">
                  <option>Less than 1 month</option>
                  <option>1 to 3 months</option>
                  <option>3 to 6 months</option>
                  <option>More than 6 months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Cover Letter</h2>
              <button className="flex items-center gap-2 text-sm font-bold text-[#14a800] dark:text-[#14a800] hover:bg-[#14a800]/5 dark:hover:bg-[#14a800]/10 px-3 py-1.5 rounded-lg transition-colors">
                <Sparkles className="w-4 h-4" /> AI Enhance
              </button>
            </div>
            
            <div className="mb-6">
              <textarea 
                rows="10" 
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Hi! I am a senior React Native developer..."
                className="w-full p-4 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#14a800]/20 resize-y text-zinc-900 dark:text-white"
              ></textarea>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Attachments</h3>
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                <p className="text-sm font-bold text-[#14a800] mb-1">Upload files or drag and drop</p>
                <p className="text-xs font-medium text-zinc-500">PDF, JPG, PNG, DOCX up to 25MB</p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between">
            <button className="px-6 py-3 font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
            <button className="px-8 py-3 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl shadow-lg shadow-[#14a800]/25/20 transition-colors">
              Submit Proposal
            </button>
          </div>

        </div>

        {/* Right Sidebar: Tips & Safety */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          <div className="bg-surface-dark dark:bg-surface-dark rounded-3xl p-6 text-white border border-zinc-800 shadow-xl">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-success" /> Trust & Safety
            </h3>
            <p className="text-sm font-medium text-zinc-400 mb-4">
              Never share your personal contact information before a contract is started. Protect yourself by keeping all communication and payments on Forte.
            </p>
            <a href="#" className="text-xs font-bold text-success hover:underline">Read our Trust Policy</a>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Proposal Tips</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-[#14a800] shrink-0 mt-0.5" />
                <span>Read the job description carefully and reference specific details in your cover letter.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-[#14a800] shrink-0 mt-0.5" />
                <span>Attach relevant portfolio items that match the client's industry or tech stack.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-[#14a800] shrink-0 mt-0.5" />
                <span>End with a call to action or a question to encourage a response.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
