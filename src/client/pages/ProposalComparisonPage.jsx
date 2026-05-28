import React from 'react';
import { ChevronLeft, Star, ShieldCheck, Download, CheckCircle, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function ProposalComparisonPage() {
  const { id } = useParams();

  const candidates = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Senior React Engineer',
      score: 98,
      rate: '$85/hr',
      timeline: '3 months',
      location: 'United States',
      timezone: 'PST (UTC-8)',
      fraudRisk: 'Low',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      badges: ['Top Rated Plus', 'Identity Verified'],
      summary: 'Expert React developer with 8+ years building enterprise dashboards. Proposed a scalable architecture using Redux Toolkit.'
    },
    {
      id: 2,
      name: 'Elena Rodriguez',
      role: 'Full Stack Architect',
      score: 94,
      rate: '$110/hr',
      timeline: '2.5 months',
      location: 'Spain',
      timezone: 'CET (UTC+1)',
      fraudRisk: 'Low',
      skills: ['React', 'Next.js', 'PostgreSQL', 'Docker'],
      badges: ['Top Rated', 'Identity Verified'],
      summary: 'Specializes in full-stack Next.js applications. Strong focus on performance and SEO. Slightly higher rate but faster timeline.'
    },
    {
      id: 3,
      name: 'Marcus Chen',
      role: 'Frontend Specialist',
      score: 88,
      rate: '$75/hr',
      timeline: '4 months',
      location: 'Canada',
      timezone: 'EST (UTC-5)',
      fraudRisk: 'Low',
      skills: ['React', 'Vue', 'TailwindCSS', 'Figma'],
      badges: ['Rising Talent', 'Identity Verified'],
      summary: 'Great eye for design and component structure. Good budget option, but estimated timeline is longer.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <Link to={`/client/jobs/${id}/pipeline`} className="text-sm font-medium text-brand-600 hover:text-brand-500 mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Pipeline
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compare Candidates</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Side-by-side evaluation for "Senior React Developer for Enterprise Dashboard"</p>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] flex gap-6">
          {/* Feature Labels Column */}
          <div className="w-48 flex-shrink-0 pt-[140px] space-y-6">
            <div className="h-12 flex items-center font-bold text-gray-900 dark:text-white text-sm">AI Match Score</div>
            <div className="h-12 flex items-center font-bold text-gray-900 dark:text-white text-sm">Proposed Rate</div>
            <div className="h-12 flex items-center font-bold text-gray-900 dark:text-white text-sm">Est. Timeline</div>
            <div className="h-24 flex items-start pt-3 font-bold text-gray-900 dark:text-white text-sm">Key Skills</div>
            <div className="h-12 flex items-center font-bold text-gray-900 dark:text-white text-sm">Timezone</div>
            <div className="h-32 flex items-start pt-3 font-bold text-gray-900 dark:text-white text-sm">AI Summary</div>
          </div>

          {/* Candidate Columns */}
          {candidates.map(candidate => (
            <div key={candidate.id} className="w-80 flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
              {/* Header Profile */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 text-center relative h-[140px]">
                {candidate.score > 95 && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-brand-500"></div>
                )}
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center font-bold text-xl mb-3 border border-brand-200 dark:border-brand-800">
                  {candidate.name[0]}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{candidate.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{candidate.role}</p>
              </div>

              {/* Data Rows */}
              <div className="p-6 space-y-6 flex-1 bg-surface/50 dark:bg-gray-900/50">
                <div className="h-12 flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${candidate.score >= 95 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200' : 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400 border border-brand-200'}`}>
                    <Star className="w-4 h-4 mr-1 fill-current" /> {candidate.score}% Match
                  </span>
                </div>
                
                <div className="h-12 flex items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{candidate.rate}</span>
                </div>

                <div className="h-12 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  {candidate.timeline}
                </div>

                <div className="h-24 flex items-start pt-3">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-12 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  {candidate.timezone}
                </div>

                <div className="h-32 flex items-start pt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {candidate.summary}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <button className="w-full mb-3 flex items-center justify-center px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                  <CheckCircle className="w-4 h-4 mr-2" /> Select for Interview
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-surface transition-colors">
                    <Download className="w-4 h-4 mr-1" /> Resume
                  </button>
                  <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                    <XCircle className="w-4 h-4 mr-1" /> Drop
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
