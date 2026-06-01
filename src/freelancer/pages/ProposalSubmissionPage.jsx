import React, { useState } from 'react';
import { Send, DollarSign, Clock, FileText, CheckCircle, ChevronRight, Briefcase } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  validateCoverLetter,
  validatePositiveNumber,
} from '../../common/utils/validation';

export default function ProposalSubmissionPage() {
  const { jobId } = useParams();
  const [step, setStep] = useState(1);
  const [hourlyRate, setHourlyRate] = useState('85');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const goToCoverLetter = () => {
    const rateErr = validatePositiveNumber(hourlyRate, 'Hourly rate');
    if (rateErr) {
      toast.error(rateErr);
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    const coverErr = validateCoverLetter(coverLetter, 50);
    if (coverErr) {
      toast.error(coverErr);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <Link to="/search/jobs" className="text-sm font-medium text-[#14a800] hover:text-[#14a800] mb-4 inline-block">
          ← Back to Job Search
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submit Proposal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit your bid for "Senior React Developer for Enterprise Dashboard".</p>
      </div>

      <div className="bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-gray-400" /> Client's Budget
        </h3>
        <p className="text-gray-600 dark:text-gray-400">The client has specified an hourly budget of <strong className="text-gray-900 dark:text-white">$80.00 - $120.00/hr</strong>.</p>
      </div>

      <div className="flex mb-8 space-x-2">
        {[1, 2].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-[#14a800]' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Terms & Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Hourly Rate ($)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-surface dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-[#14a800] focus:border-[#14a800]/20 font-bold"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Total amount the client will see.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Estimated Duration</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <select className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-surface dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-[#14a800] focus:border-[#14a800]/20 font-medium">
                      <option>Less than 1 month</option>
                      <option>1 to 3 months</option>
                      <option>3 to 6 months</option>
                      <option>More than 6 months</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900 dark:text-white">10% Platform Fee</span>
                <span className="text-gray-500">-$8.50/hr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white text-lg">You'll Receive</span>
                <span className="font-bold text-green-600 text-xl">$76.50/hr</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Cover Letter</label>
              <textarea 
                rows="8"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Introduce yourself and explain why you're a strong candidate for this job. Highlight relevant experience..."
                className="w-full border border-gray-300 dark:border-gray-700 bg-surface dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-[#14a800] focus:border-[#14a800]/20"
              ></textarea>
            </div>

            <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-surface dark:bg-gray-800 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-900 dark:text-white">Attach Portfolio Items or Resume</p>
              <p className="text-xs text-gray-500 mt-1">Drag & drop or click to upload (Max 25MB)</p>
              <button className="mt-4 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium shadow-sm">
                Select Files
              </button>
            </div>
          </div>
        )}

        {step === 2 && isSubmitted && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Proposal Submitted!</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
              Your proposal has been sent to the client. You can track its status in your Bidding Dashboard.
            </p>
            <Link to="/freelancer/proposals">
              <button className="px-6 py-2.5 bg-[#14a800] text-white font-bold rounded-xl hover:bg-[#118a00] transition-colors shadow-sm">
                View Bidding Dashboard
              </button>
            </Link>
          </div>
        )}

        {!isSubmitted && (
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm ${step === 1 ? 'invisible' : 'text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'} ${isSubmitting ? 'opacity-50' : ''}`}
            >
              Back
            </button>
            
            {step < 2 ? (
              <button 
                onClick={goToCoverLetter}
                className="flex items-center px-6 py-2.5 bg-[#14a800] text-white font-bold rounded-xl hover:bg-[#118a00] transition-colors shadow-sm"
              >
                Write Cover Letter <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center px-8 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm shadow-green-500/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'} {isSubmitting ? <Clock className="w-4 h-4 ml-2 animate-spin" /> : <Send className="w-4 h-4 ml-2" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
