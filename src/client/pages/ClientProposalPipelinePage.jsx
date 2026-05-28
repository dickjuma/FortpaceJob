import React, { useState } from 'react';
import { Users, Filter, Search, ChevronLeft, MoreVertical, MessageSquare, Star, CheckCircle, Video, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function ClientProposalPipelinePage() {
  const { id } = useParams();
  
  // ATS Pipeline State
  const [columns] = useState([
    { id: 'applied', title: 'New Proposals', count: 12 },
    { id: 'shortlisted', title: 'Shortlisted', count: 5 },
    { id: 'interviewing', title: 'Interviewing', count: 3 },
    { id: 'offered', title: 'Offered / Hired', count: 1 }
  ]);

  const [candidates] = useState([
    { id: 1, name: 'Alex Johnson', role: 'Senior React Dev', status: 'applied', score: 98, rate: '$85/hr', fraudRisk: 'Low' },
    { id: 2, name: 'Elena Rodriguez', role: 'Full Stack Architect', status: 'shortlisted', score: 94, rate: '$110/hr', fraudRisk: 'Low' },
    { id: 3, name: 'Marcus Chen', role: 'Frontend Specialist', status: 'interviewing', score: 88, rate: '$75/hr', fraudRisk: 'Low' },
    { id: 4, name: 'Sarah Dev', role: 'UI Developer', status: 'applied', score: 82, rate: '$60/hr', fraudRisk: 'Medium' },
    { id: 5, name: 'David Kim', role: 'React Native Expert', status: 'offered', score: 99, rate: '$95/hr', fraudRisk: 'Low' }
  ]);

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <Link to="/client/jobs" className="text-sm font-medium text-brand-600 hover:text-brand-500 mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Jobs
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Users className="w-8 h-8 mr-3 text-brand-600" /> ATS Hiring Pipeline
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Senior React Developer for Enterprise Dashboard</p>
          </div>
          <div className="flex space-x-3">
            <Link to={`/client/jobs/${id}/compare`}>
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-surface transition-colors shadow-sm">
                Compare Candidates
              </button>
            </Link>
            <button className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-sm">
              Schedule Interviews
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 flex-shrink-0 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search candidates by name or skill..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-surface dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-surface transition-colors text-sm font-medium">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </button>
        <div className="ml-auto flex items-center text-sm font-medium text-gray-500">
          <span className="flex items-center mr-4"><Star className="w-4 h-4 text-yellow-400 fill-current mr-1" /> AI Scored</span>
          <span className="flex items-center"><ShieldAlert className="w-4 h-4 text-red-400 mr-1" /> Fraud Checked</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar flex gap-6 pb-4">
        {columns.map(column => (
          <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-surface dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 rounded-t-2xl">
              <h3 className="font-bold text-gray-900 dark:text-white">{column.title}</h3>
              <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold">
                {candidates.filter(c => c.status === column.id).length}
              </span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3">
              {candidates.filter(c => c.status === column.id).map(candidate => (
                <div key={candidate.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center font-bold text-sm mr-2 border border-brand-200 dark:border-brand-800">
                        {candidate.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{candidate.name}</h4>
                        <p className="text-xs text-gray-500">{candidate.role}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 bg-surface dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      <Star className="w-3.5 h-3.5 text-yellow-500 mr-1 fill-current" /> {candidate.score}% Match
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      {candidate.rate}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex space-x-1">
                      <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-md transition-colors" title="Message">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {column.id === 'interviewing' && (
                        <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-md transition-colors" title="Video Interview">
                          <Video className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {column.id !== 'offered' && (
                      <button className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center">
                        Move Next <ChevronLeft className="w-3 h-3 ml-0.5 rotate-180" />
                      </button>
                    )}
                    {column.id === 'offered' && (
                      <button className="text-xs font-bold text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Hired
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
