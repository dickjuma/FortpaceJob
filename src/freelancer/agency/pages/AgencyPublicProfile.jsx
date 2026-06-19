import React from 'react';
import { useParams } from 'react-router-dom';
import { Users, ShieldCheck, Star, MapPin, Briefcase, Award } from 'lucide-react';
import { useAgencyPublicProfile } from '../services/agencyHooks';

export default function AgencyPublicProfile() {
  const { agencyId } = useParams();
  const { data: response, isLoading } = useAgencyPublicProfile(agencyId);
  const apiData = response?.data || response;

  const fallbackData = {
    name: 'Elevate Digital Agency',
    tagline: 'Top-tier Web & Mobile Development Studio',
    location: 'Austin, TX',
    size: '10-49 employees',
    revenue: '$5M+ earned',
    successRate: 99,
    hourlyRate: '$120 - $250/hr',
    badges: ['Top Rated Plus', 'Enterprise Partner'],
    description: 'We are a collective of ex-FAANG engineers and designers building scalable, enterprise-grade applications. We specialize in React, Node.js, and Cloud Architecture.',
    teamMembers: [
      { name: 'Sarah J.', role: 'Lead Frontend', rating: 5.0 },
      { name: 'Mike T.', role: 'Cloud Architect', rating: 4.9 },
      { name: 'Elena R.', role: 'UI/UX Director', rating: 5.0 },
    ]
  };

  const agencyData = apiData || fallbackData;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-blue-700 to-[#22C55E]"></div>
        <div className="px-6 sm:px-10 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="flex items-end space-x-5">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center text-4xl font-bold text-gray-500 overflow-hidden shadow-sm">
                  ED
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-900 rounded-full p-1">
                  <ShieldCheck className="w-8 h-8 text-[#4C1D95]" />
                </div>
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  {agencyData.name}
                </h1>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mt-1">
                  {agencyData.tagline}
                </p>
              </div>
            </div>
            <div className="pb-2 flex space-x-3">
              <button className="px-6 py-2.5 bg-[#4C1D95] text-white font-bold text-sm rounded-lg shadow-sm shadow-[#4C1D95]/25/30 hover:bg-[#22C55E] transition-colors">
                Hire Agency
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {agencyData.location}</div>
              <div className="flex items-center"><Users className="w-4 h-4 mr-2" /> {agencyData.size}</div>
              <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> {agencyData.revenue}</div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Job Success Rate</p>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 dark:bg-gray-800 rounded-full h-2 mr-3">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${agencyData.successRate}%` }}></div>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{agencyData.successRate}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Agency Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{agencyData.hourlyRate}</p>
            </div>

            <div className="flex flex-wrap gap-2 items-start justify-end">
              {agencyData.badges.map(badge => (
                <span key={badge} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#4C1D95]/5 text-[#4C1D95] dark:bg-[#4C1D95]/30 dark:text-[#4C1D95] border border-[#4C1D95]/20 dark:border-[#4C1D95]/20">
                  <Award className="w-4 h-4 mr-1" /> {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About the Agency</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              {agencyData.description}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#4C1D95]" /> Agency Roster
            </h2>
            <ul className="space-y-4">
              {agencyData.teamMembers.map((member, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 hover:bg-surface dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#4C1D95]/10 dark:bg-[#4C1D95]/50 text-[#4C1D95] rounded-full flex items-center justify-center font-bold mr-3">
                      {member.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</h4>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{member.rating}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button className="w-full mt-4 py-2 text-sm font-bold text-[#4C1D95] bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20 rounded-lg hover:bg-[#4C1D95]/10 transition-colors">
              View All 24 Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


