import React, { useEffect, useState } from 'react';
import { Bookmark, CheckCircle2, ChevronRight, Clock, FileText, MapPin, Share2, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getFindWorkJobById, getRelatedFindWorkJobs, subscribeToFindWorkData, syncJobsWithBackend } from './findWorkData';

export default function WorkDetail() {
  const { id } = useParams();
  const [, setDataVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToFindWorkData(() => setDataVersion((version) => version + 1));
    syncJobsWithBackend();
    return unsubscribe;
  }, []);

  const job = getFindWorkJobById(id);

  if (!job) {
    return (
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <FileText className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
          <h1 className="text-3xl font-black text-zinc-900 mb-2">Job not found</h1>
          <p className="text-zinc-600 mb-6">This opportunity no longer exists or the link is no longer valid.</p>
          <Link to="/find-work" className="px-6 py-3 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl">
            Back to Find Work
          </Link>
        </div>
      </div>
    );
  }

  const relatedJobs = getRelatedFindWorkJobs(job, 3);

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 mb-6 flex-wrap">
            <Link to="/find-work" className="hover:text-[#14a800]">Find Work</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={job.workMode === 'local' ? '/find-work/local' : '/find-work/online'} className="hover:text-[#14a800]">
              {job.workMode === 'local' ? 'Local' : 'Online'}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={job.categoryPath} className="hover:text-[#14a800]">{job.category.name}</Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 border-b border-zinc-100 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-lg mb-4">
                      <MapPin className="w-3.5 h-3.5" /> {job.workModeLabel}
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 mb-4 leading-tight">{job.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {job.postedLabel}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {job.locationLabel}
                      </span>
                      <span className="px-2 py-1 bg-zinc-100 rounded-lg text-zinc-700 font-bold">{job.experienceLevel}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Link to="/find-work/saved" className="p-3 bg-white border border-zinc-200 text-zinc-600 hover:text-[#14a800] hover:border-[#14a800]/50 rounded-xl transition-colors shadow-sm">
                      <Bookmark className="w-5 h-5" />
                    </Link>
                    <button type="button" className="p-3 bg-white border border-zinc-200 text-zinc-600 hover:text-[#14a800] hover:border-[#14a800]/50 rounded-xl transition-colors shadow-sm">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-zinc-900 mb-4">Job Description</h3>
                  <div className="text-zinc-700 leading-relaxed space-y-4">
                    {job.description.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    <p><strong>Responsibilities:</strong></p>
                    <ul className="list-disc pl-5 space-y-2">
                      {job.responsibilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <hr className="border-zinc-100 mb-8" />

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-zinc-900 mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="px-4 py-2 bg-surface text-zinc-700 font-bold text-sm rounded-xl border border-zinc-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#14a800]/5 border border-[#14a800]/20 rounded-2xl p-6 flex items-start gap-4">
                  <FileText className="w-6 h-6 text-[#14a800] shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-bold text-zinc-900 mb-1">Attachments (1)</h4>
                    <button type="button" className="text-[#14a800] text-sm font-bold hover:underline text-left">
                      {job.attachment.name}
                    </button>
                    <p className="text-xs text-zinc-500 mt-1">Attachment preview is represented here as structured job metadata.</p>
                  </div>
                </div>
              </div>

              {relatedJobs.length > 0 ? (
                <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex justify-between items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900">Related opportunities</h3>
                      <p className="text-zinc-500 text-sm">More work from the same classification.</p>
                    </div>
                    <Link to={`/find-work/search?type=${job.workMode}&q=${encodeURIComponent(job.category.name)}`} className="text-[#14a800] font-bold text-sm hover:underline">
                      See all
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedJobs.map((relatedJob) => (
                      <Link key={relatedJob.id} to={relatedJob.detailPath} className="border border-zinc-200 rounded-2xl p-5 hover:border-[#14a800]/50 hover:shadow-sm transition-all group">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#14a800] mb-2">{relatedJob.specialization}</div>
                        <h4 className="font-bold text-zinc-900 group-hover:text-[#14a800] transition-colors mb-2">{relatedJob.title}</h4>
                        <p className="text-sm text-zinc-500 mb-3">{relatedJob.summary}</p>
                        <div className="text-sm font-black text-zinc-900">{relatedJob.budgetLabel}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl sticky top-24">
                <div className="mb-6 pb-6 border-b border-zinc-100">
                  <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Budget ({job.budgetType})</div>
                  <div className="text-4xl font-black text-zinc-900">{job.budgetLabel}</div>
                  <div className="text-sm text-zinc-500 mt-2">Estimated timeline: {job.durationLabel}</div>
                </div>

                <Link to={job.proposalPath} className="w-full py-4 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-xl shadow-md transition-colors text-lg mb-4 block text-center">
                  Submit a Proposal
                </Link>
                <div className="text-center text-sm font-bold text-zinc-500">{job.applicants} proposals submitted so far</div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-6">About the Client</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 font-bold text-zinc-900">
                    <CheckCircle2 className="w-5 h-5 text-success" /> {job.client.verified ? 'Payment method verified' : 'Growing client'}
                  </div>
                  <div className="flex items-center gap-2 font-bold text-zinc-900">
                    <Star className="w-5 h-5 text-amber-500 fill-current" /> {job.client.rating} of 5 reviews
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900">{job.client.country}</div>
                    <div className="text-sm text-zinc-500">{job.client.location} ({job.client.localTime})</div>
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900">{job.client.jobsPosted} Jobs Posted</div>
                    <div className="text-sm text-zinc-500">{job.client.hireRate} Hire Rate, {job.client.openJobs} Open Jobs</div>
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900">{job.client.totalSpent} Total Spent</div>
                    <div className="text-sm text-zinc-500">{job.client.activeHires} Active Hires</div>
                  </div>
                </div>

                <Link to="/client-profile" className="text-[#14a800] text-sm font-bold hover:underline block text-center pt-4 border-t border-zinc-100">
                  View Full Client Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
