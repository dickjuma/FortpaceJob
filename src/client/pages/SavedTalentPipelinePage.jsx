import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Bookmark, Star, MoreVertical, FileText, Check, X, Calendar, MessageSquare, LayoutGrid, List, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

const mockStages = ['Sourced', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

const mockCandidates = [
  {
    id: 'c1',
    name: 'Alice Johnson',
    role: 'Senior Frontend Engineer',
    stage: 'Interview',
    score: 92,
    location: 'Remote (US)',
    hourlyRate: '$85/hr',
    notes: 3,
    avatar: 'https://i.pravatar.cc/150?u=alice',
    skills: ['React', 'TypeScript', 'Node.js']
  },
  {
    id: 'c2',
    name: 'Bob Smith',
    role: 'UX/UI Designer',
    stage: 'Sourced',
    score: 88,
    location: 'London, UK',
    hourlyRate: '$65/hr',
    notes: 1,
    avatar: 'https://i.pravatar.cc/150?u=bob',
    skills: ['Figma', 'Prototyping', 'User Research']
  },
  {
    id: 'c3',
    name: 'Charlie Davis',
    role: 'DevOps Engineer',
    stage: 'Screening',
    score: 95,
    location: 'Berlin, DE',
    hourlyRate: '$90/hr',
    notes: 5,
    avatar: 'https://i.pravatar.cc/150?u=charlie',
    skills: ['AWS', 'Docker', 'Kubernetes']
  },
  {
    id: 'c4',
    name: 'Diana Prince',
    role: 'Product Manager',
    stage: 'Offer',
    score: 98,
    location: 'Remote (Global)',
    hourlyRate: '$110/hr',
    notes: 2,
    avatar: 'https://i.pravatar.cc/150?u=diana',
    skills: ['Agile', 'Strategy', 'Jira']
  }
];

export default function SavedTalentPipelinePage() {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState(mockCandidates);

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-brand-600" />
              Talent Pipeline
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your saved freelancers across hiring stages.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
            <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-2 ${viewMode === 'kanban' ? 'bg-gray-100 dark:bg-gray-800 text-brand-600' : 'text-gray-500 hover:bg-surface dark:hover:bg-gray-800'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800 text-brand-600' : 'text-gray-500 hover:bg-surface dark:hover:bg-gray-800'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Board / List Content */}
        {viewMode === 'kanban' ? (
          <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {mockStages.map(stage => {
              const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
              return (
                <div key={stage} className="flex-shrink-0 w-80 flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      {stage}
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                        {stageCandidates.length}
                      </span>
                    </h3>
                  </div>
                  <div className="flex-1 space-y-3 min-h-[200px] bg-gray-100/50 dark:bg-gray-900/50 p-2 rounded-xl">
                    <AnimatePresence>
                      {stageCandidates.map((candidate, idx) => (
                        <motion.div
                          key={candidate.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: idx * 0.05 }}
                          className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer hover:border-brand-500 transition-colors group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                <h4 className="font-medium text-sm">{candidate.name}</h4>
                                <p className="text-xs text-gray-500">{candidate.role}</p>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {candidate.skills.slice(0, 2).map(skill => (
                              <span key={skill} className="px-2 py-1 bg-surface dark:bg-gray-800 text-xs rounded-md text-gray-600 dark:text-gray-400">
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 2 && (
                              <span className="px-2 py-1 bg-surface dark:bg-gray-800 text-xs rounded-md text-gray-600 dark:text-gray-400">
                                +{candidate.skills.length - 2}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 font-medium">
                                <Star className="w-3 h-3 fill-current" /> {candidate.score}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> {candidate.notes}
                              </span>
                            </div>
                            <span className="font-medium">{candidate.hourlyRate}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {stageCandidates.length === 0 && (
                      <div className="h-full flex items-center justify-center text-sm text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
                        Drop candidates here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Candidate</th>
                    <th className="px-6 py-4 font-medium">Stage</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Rate</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredCandidates.map((candidate, idx) => (
                    <motion.tr 
                      key={candidate.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-surface dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{candidate.name}</div>
                            <div className="text-gray-500">{candidate.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-medium rounded-full">
                          {candidate.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 font-medium">
                          <Star className="w-4 h-4 fill-current" /> {candidate.score}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {candidate.hourlyRate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-brand-600 transition-colors p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No candidates found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
