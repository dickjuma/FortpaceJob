import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, Users, Star, MessageSquare, ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function JobDetailsPage() {
  const { id } = useParams();
  
  const [proposals, setProposals] = useState([
    { id: 1, name: 'Alex Johnson', title: 'Senior React Engineer', rate: '$85/hr', score: 98, bid: '$85/hr', time: '1-3 months', status: 'Pending' },
    { id: 2, name: 'Elena Rodriguez', title: 'Full Stack Architect', rate: '$110/hr', score: 94, bid: '$100/hr', time: '3-6 months', status: 'Shortlisted' },
    { id: 3, name: 'Marcus Chen', title: 'Frontend Developer', rate: '$65/hr', score: 82, bid: '$60/hr', time: 'Less than 1 month', status: 'Pending' },
  ]);

  const handleShortlist = (proposalId) => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId ? { ...p, status: 'Shortlisted' } : p
    ));
  };

  const handleDecline = (proposalId) => {
    setProposals(prev => prev.filter(p => p.id !== proposalId));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-6">
        <Link to="/client/jobs" className="text-sm font-medium text-[#14a800] hover:text-[#14a800] mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Jobs
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Senior React Developer for Enterprise Dashboard</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Posted 2 days ago</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Remote (Worldwide)</span>
              <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium text-xs">Active</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
              Edit Job
            </button>
            <button className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
              Close Job
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#14a800]" /> Review Proposals ({proposals.length})
              </h2>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {proposals.map((proposal) => (
                <li key={proposal.id} className="p-6 hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex items-start mb-4 sm:mb-0">
                      <div className="w-12 h-12 rounded-full bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] flex items-center justify-center font-bold text-xl mr-4 border border-[#14a800]/20 dark:border-[#14a800]/20">
                        {proposal.name[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                          {proposal.name}
                          {proposal.status === 'Shortlisted' && <span className="ml-3 px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-full border border-yellow-200">Shortlisted</span>}
                        </h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{proposal.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="font-bold text-gray-900 dark:text-white">Profile Rate: {proposal.rate}</span>
                          <span className="flex items-center text-green-600 dark:text-green-400 font-bold"><Star className="w-4 h-4 mr-1 fill-current" /> AI Score: {proposal.score}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500 mb-1">Bid Amount</p>
                      <p className="text-xl font-bold text-[#14a800] dark:text-[#14a800]">{proposal.bid}</p>
                      <p className="text-xs text-gray-500 mt-1">{proposal.time}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="flex items-center px-4 py-2 bg-[#14a800] text-white text-sm font-medium rounded-lg hover:bg-[#118a00] shadow-sm">
                      <MessageSquare className="w-4 h-4 mr-2" /> Message
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-surface">
                      View Cover Letter
                    </button>
                    {proposal.status !== 'Shortlisted' && (
                      <button 
                        onClick={() => handleShortlist(proposal.id)}
                        className="flex items-center px-4 py-2 text-green-600 bg-green-50 dark:bg-green-900/20 text-sm font-medium rounded-lg hover:bg-green-100 ml-auto transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Shortlist
                      </button>
                    )}
                    <button 
                      onClick={() => handleDecline(proposal.id)}
                      className="flex items-center px-4 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Job Overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Budget Range</p>
                <p className="font-bold text-gray-900 dark:text-white">$80 - $120 / hr</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Required Experience</p>
                <p className="font-bold text-gray-900 dark:text-white">Expert (5+ years)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Duration</p>
                <p className="font-bold text-gray-900 dark:text-white">3-6 Months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Required Skills</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-md">React</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-md">TypeScript</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-md">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
