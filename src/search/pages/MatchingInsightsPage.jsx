import React from 'react';
import { Target, TrendingUp, Users, Activity, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function MatchingInsightsPage() {
  const radarData = [
    { subject: 'React', A: 100, fullMark: 100 },
    { subject: 'Node.js', A: 85, fullMark: 100 },
    { subject: 'System Design', A: 90, fullMark: 100 },
    { subject: 'Communication', A: 95, fullMark: 100 },
    { subject: 'AWS', A: 70, fullMark: 100 },
    { subject: 'UI/UX', A: 60, fullMark: 100 },
  ];

  const successData = [
    { name: '0-2 Yrs', success: 65 },
    { name: '3-5 Yrs', success: 85 },
    { name: '5-8 Yrs', success: 92 },
    { name: '8+ Yrs', success: 96 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Matching Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Deep-dive analytics on why these candidates are recommended for your job.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center text-[#4C1D95] mb-2"><Target className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Average Match Score</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">88%</div>
          <p className="text-sm text-gray-500 mt-1">For top 10 candidates</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center text-green-500 mb-2"><TrendingUp className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Historical Success</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">94%</div>
          <p className="text-sm text-gray-500 mt-1">Similar hires succeeded</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center text-[#4C1D95] mb-2"><Users className="w-5 h-5 mr-2" /> <span className="font-semibold text-gray-900 dark:text-white">Talent Pool</span></div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">245</div>
          <p className="text-sm text-gray-500 mt-1">Candidates analyzed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart: Skill Alignment */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-6">
            <Activity className="w-5 h-5 mr-2 text-[#4C1D95]" /> Skill Alignment Analysis
          </h2>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#374151" opacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#6B7280', fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Candidate Average" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-center text-gray-500 mt-4">
            The top 10 candidates over-index heavily in React and Communication, perfectly aligning with your job requirements.
          </p>
        </div>

        {/* Bar Chart: Historical Success by Experience */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-6">
            <BarChart2 className="w-5 h-5 mr-2 text-green-500" /> Success Correlation
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={successData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6', opacity: 0.4}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                <Bar dataKey="success" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-center text-gray-500 mt-4">
            Historical data shows that candidates with 5+ years of experience have a 92% project completion success rate for similar jobs.
          </p>
        </div>
      </div>
    </div>
  );
}


