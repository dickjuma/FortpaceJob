import React, { useState } from 'react';
import { Calendar, ChevronRight, Clock, Lock, MapPin, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getClientOpenings, getFeaturedTalent, getTalentById } from './find-talent/talentMarketplaceData';
import { useAuthRedirect } from '../common/utils/authRedirect';
import CheckoutFeeBreakdown from '../components/payments/CheckoutFeeBreakdown';
import { useCheckoutFees } from '../common/hooks/useCheckoutFees';

const HireFreelancer = () => {
  const { talentId } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const talent = getTalentById(talentId) || getFeaturedTalent()[0];
  const openings = getClientOpenings();
  const [contractType, setContractType] = useState('fixed');
  const [selectedJobId, setSelectedJobId] = useState(openings[0]?.id || '');
  const [milestones, setMilestones] = useState([
    { id: 1, name: 'Discovery and planning', amount: 1200, date: 'Week 1' },
    { id: 2, name: 'Implementation and QA', amount: 3200, date: 'Week 3' },
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now(), name: '', amount: 0, date: '' }]);
  };

  const removeMilestone = (id) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id));
  };

  const totalAmount = milestones.reduce((sum, milestone) => sum + Number(milestone.amount || 0), 0);
  const { breakdown } = useCheckoutFees(totalAmount, 'HIRE_COMMITMENT');
  const platformFee = Math.round(breakdown.platformFee);
  const estimatedTax = Math.round(totalAmount * 0.02);
  const selectedJob = openings.find((job) => job.id === selectedJobId) || openings[0];

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-8">
            <Link className="text-sm font-medium text-[#4C1D95] hover:text-[#4C1D95] flex items-center gap-1 mb-4" to={`/talent/${talent.id}`}>
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Hire {talent.name}</h1>
            <p className="text-zinc-600">Configure the contract, attach it to a live opening, and move straight into secure hiring.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex items-center gap-6">
                <img
                  alt={talent.name}
                  className="w-16 h-16 rounded-full border-2 border-zinc-100"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=random`}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                    {talent.name} <ShieldCheck className="w-4 h-4 text-[#4C1D95]" />
                  </h3>
                  <p className="text-sm text-zinc-600">{talent.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                    <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {talent.location}</div>
                    <div className="flex items-center gap-1 text-success font-medium"><Clock className="w-3.5 h-3.5" /> {talent.availability}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Attach to job</h3>
                <select
                  className="w-full bg-surface border border-zinc-200 rounded-xl px-4 py-3 text-zinc-700 font-medium outline-none"
                  onChange={(event) => setSelectedJobId(event.target.value)}
                  value={selectedJobId}
                >
                  {openings.map((opening) => (
                    <option key={opening.id} value={opening.id}>
                      {opening.title}
                    </option>
                  ))}
                </select>
                {selectedJob ? (
                  <div className="mt-4 rounded-2xl bg-surface p-4 border border-zinc-200">
                    <div className="font-semibold text-zinc-900">{selectedJob.title}</div>
                    <div className="text-sm text-zinc-600 mt-1">{selectedJob.budgetLabel} • {selectedJob.location}</div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedJob.requiredSkills.map((skill) => (
                        <span className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-medium text-zinc-600" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 mb-4">Contract terms</h3>
                <div className="flex p-1 bg-zinc-100 rounded-xl mb-6">
                  <button
                    className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${contractType === 'fixed' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
                    onClick={() => setContractType('fixed')}
                    type="button"
                  >
                    Fixed price
                  </button>
                  <button
                    className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${contractType === 'hourly' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}
                    onClick={() => setContractType('hourly')}
                    type="button"
                  >
                    Hourly (${talent.hourlyRate}/hr)
                  </button>
                </div>

                {contractType === 'fixed' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-zinc-800">Project milestones</h4>
                      <button className="text-sm font-medium text-[#4C1D95] hover:text-[#4C1D95] flex items-center gap-1" onClick={addMilestone} type="button">
                        <Plus className="w-4 h-4" /> Add milestone
                      </button>
                    </div>

                    {milestones.map((milestone, index) => (
                      <div className="p-4 border border-zinc-200 rounded-xl bg-surface flex flex-col md:flex-row gap-4 items-end group" key={milestone.id}>
                        <div className="flex-1 w-full">
                          <label className="block text-xs font-medium text-zinc-500 mb-1">Milestone {index + 1}</label>
                          <input className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm" defaultValue={milestone.name} type="text" />
                        </div>
                        <div className="w-full md:w-32">
                          <label className="block text-xs font-medium text-zinc-500 mb-1">Due date</label>
                          <div className="relative">
                            <Calendar className="absolute left-2.5 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                            <input className="w-full bg-white border border-zinc-300 rounded-lg pl-8 pr-3 py-2 text-sm" defaultValue={milestone.date} type="text" />
                          </div>
                        </div>
                        <div className="w-full md:w-32">
                          <label className="block text-xs font-medium text-zinc-500 mb-1">Amount</label>
                          <input className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm" defaultValue={milestone.amount} type="number" />
                        </div>
                        {milestones.length > 1 ? (
                          <button className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" onClick={() => removeMilestone(milestone.id)} type="button">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-[#4C1D95]/20 bg-[#4C1D95]/5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-zinc-900">Hourly contract</div>
                        <div className="text-sm text-zinc-600">Based on {talent.name}'s current marketplace rate.</div>
                      </div>
                      <div className="text-2xl font-black text-zinc-900">${talent.hourlyRate}/hr</div>
                    </div>
                    <textarea className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm min-h-[120px]" placeholder="Describe deliverables, reporting expectations, weekly capacity, and communication cadence." />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                  <h3 className="font-bold text-zinc-900 mb-5">Contract summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Talent</span>
                      <span className="font-semibold text-zinc-900">{talent.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Job</span>
                      <span className="font-semibold text-zinc-900 text-right max-w-[220px]">{selectedJob?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Contract type</span>
                      <span className="font-semibold text-zinc-900 capitalize">{contractType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Talent amount</span>
                      <span className="font-semibold text-zinc-900">${totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Platform fee ({breakdown.platformPercent}%)</span>
                      <span className="font-semibold text-zinc-900">${platformFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Estimated tax</span>
                      <span className="font-semibold text-zinc-900">${estimatedTax}</span>
                    </div>
                  </div>
                  <div className="border-t border-zinc-100 mt-5 pt-5 flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Due today</span>
                    <span className="text-2xl font-black text-zinc-900">${totalAmount + platformFee + estimatedTax}</span>
                  </div>
                  <button
                    className="w-full mt-6 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold py-3 px-4 rounded-xl transition-colors"
                    onClick={() =>
                      requireAuth(() => {
                        navigate(`/talent/${talent.id}/invite`);
                      }, {
                        returnTo: `/talent/${talent.id}/hire`,
                        state: { intent: 'hire-talent', talentId: talent.id, jobId: selectedJob?.id || '' },
                      })
                    }
                    type="button"
                  >
                    Fund and send offer
                  </button>
                  <p className="text-xs text-center text-zinc-500 mt-4 flex items-center justify-center gap-2">
                    <Lock className="w-3.5 h-3.5" /> Secure escrow and contract setup
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                  <h3 className="font-bold text-zinc-900 mb-3">Why this flow is marketplace-ready</h3>
                  <div className="text-sm text-zinc-600 space-y-2">
                    <p>This screen now preserves the selected talent and selected job opening in one contract workflow.</p>
                    <p>It no longer drops the user into a generic hire page with hardcoded profile data.</p>
                  </div>
                  <Link className="inline-flex items-center gap-2 text-[#4C1D95] font-bold mt-4" to={`/talent/${talent.id}/invite`}>
                    Invite instead <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HireFreelancer;


