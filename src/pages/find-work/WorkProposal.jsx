import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Briefcase, Clock, DollarSign, Paperclip, Send } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getFindWorkJobById } from './findWorkData';

export default function WorkProposal() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const job = getFindWorkJobById(workId);
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState('1 - 2 weeks');
  const [message, setMessage] = useState('');

  if (!job) {
    return (
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <Briefcase className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
          <h1 className="text-3xl font-black text-zinc-900 mb-2">This job is no longer available</h1>
          <p className="text-zinc-600 mb-6">We could not load the job details required to submit a proposal.</p>
          <Link to="/find-work" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl">
            Back to Find Work
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/find-work/my-applications');
  };

  const fee = Number(bidAmount || 0) * 0.1;
  const payout = Number(bidAmount || 0) - fee;

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <Link to={job.detailPath} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Job Details
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Submit a Proposal</h1>
            <p className="text-zinc-600 font-medium">Create a compelling bid for a real job from the active find-work catalog.</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-600" /> Job Details
            </h2>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-zinc-900 text-lg">{job.title}</h3>
                <div className="text-zinc-500 text-sm font-medium mt-1">Client: {job.client.name}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-success text-lg">{job.budgetLabel}</div>
                <div className="text-zinc-500 text-sm font-medium mt-1">Expected timeline: {job.durationLabel}</div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {job.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Terms & Timeline</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Your Bid ({job.budgetType === 'Hourly' ? 'Hourly Rate' : 'Fixed Price'})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 font-bold text-zinc-400">
                      <DollarSign className="w-5 h-5" />
                    </span>
                    <input
                      type="number"
                      required
                      value={bidAmount}
                      onChange={(event) => setBidAmount(event.target.value)}
                      placeholder={job.budgetType === 'Hourly' ? 'e.g. 95' : 'e.g. 5500'}
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 font-bold text-zinc-900 text-lg"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm font-medium text-zinc-500">
                    <span>Platform Fee (10%)</span>
                    <span>-${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm font-bold text-success border-t border-zinc-100 pt-2">
                    <span>You'll Receive</span>
                    <span>${payout.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Estimated Delivery</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 font-bold text-zinc-400">
                      <Clock className="w-5 h-5" />
                    </span>
                    <select
                      value={deliveryEstimate}
                      onChange={(event) => setDeliveryEstimate(event.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 font-bold text-zinc-900 cursor-pointer appearance-none"
                    >
                      <option>Less than 1 week</option>
                      <option>1 - 2 weeks</option>
                      <option>1 month</option>
                      <option>2 - 3 months</option>
                      <option>More than 3 months</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Cover Letter</h2>

              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-700 mb-2">Why are you the best fit for this job?</label>
                <textarea
                  required
                  rows="8"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={`Reference the client's goal, your relevant experience in ${job.specialization}, and how you would approach delivery.`}
                  className="w-full p-4 bg-surface border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 font-medium text-zinc-900 resize-y"
                />
                <div className="flex justify-end mt-2 text-xs font-bold text-zinc-400">
                  {message.length} / 4000 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Attachments (Optional)</label>
                <button type="button" className="w-full border-2 border-dashed border-zinc-300 bg-surface rounded-xl p-8 text-center hover:bg-zinc-100 hover:border-brand-300 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Paperclip className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="font-bold text-zinc-700 mb-1">Upload Portfolio Samples</div>
                  <div className="text-xs text-zinc-500">PDF, DOC, JPG, PNG (Max 25MB)</div>
                </button>
              </div>
            </div>

            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex gap-4">
              <AlertCircle className="w-6 h-6 text-brand-600 shrink-0" />
              <div>
                <h4 className="font-bold text-brand-900">Safety & Protection</h4>
                <p className="text-sm text-brand-800 font-medium mt-1">
                  By submitting a proposal, you agree to Fortspace&apos;s Terms of Service. Never accept payment outside the platform if you want escrow protection.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link to={job.detailPath} className="px-6 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors">
                Cancel
              </Link>
              <button type="submit" className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2">
                <Send className="w-5 h-5" /> Submit Proposal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
