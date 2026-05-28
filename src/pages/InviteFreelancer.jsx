import React, { useState } from 'react';
import { Briefcase, ChevronRight, FileText, LayoutTemplate, Mail, Paperclip, Zap } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getClientOpenings, getFeaturedTalent, getTalentById } from './find-talent/talentMarketplaceData';

const InviteFreelancer = () => {
  const { talentId } = useParams();
  const talent = getTalentById(talentId) || getFeaturedTalent()[0];
  const openings = getClientOpenings();
  const [selectedJob, setSelectedJob] = useState(openings[0]?.id || 'new');

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="mb-8">
            <Link className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mb-4" to={`/talent/${talent.id}`}>
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Invite {talent.name} to a job</h1>
            <p className="text-zinc-600">This invite flow now stays tied to the selected talent and to your real marketplace openings.</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 bg-surface-dark text-white flex items-center gap-4">
              <img
                alt={talent.name}
                className="w-12 h-12 rounded-full border-2 border-white/20"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=random`}
              />
              <div>
                <h3 className="font-bold text-lg">{talent.name}</h3>
                <p className="text-brand-200 text-sm">Responds in about {talent.responseTime}</p>
              </div>
              <div className="ml-auto bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-100">{talent.jobSuccess}% job success</span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div>
                <label className="block font-bold text-zinc-900 mb-3">Which job do you want to invite {talent.name.split(' ')[0]} to?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {openings.map((job) => (
                    <div
                      className={`p-4 border rounded-xl cursor-pointer transition-colors flex gap-3 ${selectedJob === job.id ? 'border-brand-500 bg-brand-50/50' : 'border-zinc-200 hover:border-brand-300'}`}
                      key={job.id}
                      onClick={() => setSelectedJob(job.id)}
                    >
                      <Briefcase className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedJob === job.id ? 'text-brand-600' : 'text-zinc-400'}`} />
                      <div>
                        <h4 className="font-semibold text-zinc-900 text-sm mb-1">{job.title}</h4>
                        <p className="text-xs text-zinc-500">{job.budgetLabel}</p>
                      </div>
                    </div>
                  ))}
                  <div
                    className={`p-4 border rounded-xl cursor-pointer transition-colors flex gap-3 ${selectedJob === 'new' ? 'border-brand-500 bg-brand-50/50' : 'border-zinc-200 hover:border-brand-300'}`}
                    onClick={() => setSelectedJob('new')}
                  >
                    <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedJob === 'new' ? 'text-brand-600' : 'text-zinc-400'}`} />
                    <div>
                      <h4 className="font-semibold text-zinc-900 text-sm mb-1">Create a new job</h4>
                      <p className="text-xs text-zinc-500">Draft a new project description</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedJob === 'new' ? (
                <div className="bg-surface border border-zinc-200 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-semibold text-zinc-700">Project description</label>
                    <button className="text-xs font-medium text-brand-600 flex items-center gap-1 hover:text-brand-700" type="button">
                      <LayoutTemplate className="w-3.5 h-3.5" /> Use template
                    </button>
                  </div>
                  <input className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-2 text-sm mb-3" placeholder="Project title" type="text" />
                  <textarea className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-sm" placeholder="Describe the project scope, required skills, and timeline..." rows="6" />
                </div>
              ) : (
                <div className="bg-surface border border-zinc-200 rounded-xl p-5">
                  {openings
                    .filter((job) => job.id === selectedJob)
                    .map((job) => (
                      <div key={job.id}>
                        <div className="font-semibold text-zinc-900">{job.title}</div>
                        <div className="text-sm text-zinc-500 mt-1">{job.budgetLabel} • {job.location}</div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.requiredSkills.map((skill) => (
                            <span className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-medium text-zinc-600" key={skill}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div>
                <label className="block font-bold text-zinc-900 mb-3">
                  Personal message <span className="text-zinc-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                  <textarea
                    className="w-full bg-white border border-zinc-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder={`Hi ${talent.name.split(' ')[0]}, I think you'd be a strong fit for this project because...`}
                    rows="4"
                  />
                </div>
              </div>

              <div>
                <button className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-surface border border-zinc-200 px-4 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors" type="button">
                  <Paperclip className="w-4 h-4" /> Attach files or requirements
                </button>
              </div>

              <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-zinc-500">{talent.name.split(' ')[0]} will be notified via email and in-app notification.</p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Link className="flex-1 sm:flex-none text-center px-6 py-2.5 border border-zinc-300 text-zinc-700 font-bold rounded-xl hover:bg-surface transition-colors" to={`/talent/${talent.id}`}>
                    Cancel
                  </Link>
                  <button className="flex-1 sm:flex-none text-center px-8 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors" type="button">
                    Send invitation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteFreelancer;
