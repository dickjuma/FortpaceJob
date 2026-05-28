import React from 'react';
import { Trophy, Medal, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_LEADERS = [
  { rank: 1, name: 'Sarah W.', role: 'Senior React Dev', rating: 5.0, jobs: 145, earnings: '$120k+', badge: 'text-amber-500' },
  { rank: 2, name: 'TechFlow Agency', role: 'Dev Team', rating: 4.9, jobs: 89, earnings: '$450k+', badge: 'text-zinc-400' },
  { rank: 3, name: 'Elena R.', role: 'UI/UX Designer', rating: 5.0, jobs: 62, earnings: '$80k+', badge: 'text-amber-700' },
  { rank: 4, name: 'David C.', role: 'Backend Engineer', rating: 4.8, jobs: 94, earnings: '$90k+', badge: 'text-zinc-300' },
  { rank: 5, name: 'Marcus T.', role: 'Electrician (Onsite)', rating: 5.0, jobs: 210, earnings: '$150k+', badge: 'text-zinc-300' }
];

const FreelancerLeaderboard = () => {
  return (
    <>
      <div className="bg-surface-dark text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/20 via-zinc-900 to-zinc-900"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Fortspace Leaderboard</h1>
          <p className="text-lg text-zinc-300">
            Celebrating the top-performing professionals and agencies on the platform based on job success, client ratings, and total earnings.
          </p>
        </div>
      </div>

      <div className="bg-surface min-h-screen py-16 -mt-10 rounded-t-[3rem] relative z-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">Global Rankings: All Categories</h2>
            <select className="bg-white border border-zinc-200 text-zinc-900 font-bold px-4 py-2 rounded-xl outline-none">
              <option>This Month</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface border-b border-zinc-200">
                <tr>
                  <th className="p-4 font-bold text-zinc-500 text-sm w-16 text-center">Rank</th>
                  <th className="p-4 font-bold text-zinc-500 text-sm">Professional</th>
                  <th className="p-4 font-bold text-zinc-500 text-sm hidden sm:table-cell">Category</th>
                  <th className="p-4 font-bold text-zinc-500 text-sm text-center">Rating</th>
                  <th className="p-4 font-bold text-zinc-500 text-sm text-right pr-6">Completed Jobs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_LEADERS.map((leader, i) => (
                  <tr key={leader.rank} className="hover:bg-surface transition-colors">
                    <td className="p-4 text-center">
                      {i < 3 ? (
                        <Medal className={`w-8 h-8 mx-auto ${leader.badge}`} />
                      ) : (
                        <span className="font-black text-xl text-zinc-400">{leader.rank}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=random`} className="w-12 h-12 rounded-full border border-zinc-200" alt="avatar" />
                        <div>
                          <Link to="/profile" className="font-bold text-zinc-900 hover:text-brand-600 transition-colors text-lg flex items-center gap-1">
                            {leader.name} <ShieldCheck className="w-4 h-4 text-brand-500" />
                          </Link>
                          <div className="text-sm text-zinc-500 sm:hidden">{leader.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg">{leader.role}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-zinc-900">
                        <Star className="w-4 h-4 text-amber-500 fill-current" /> {leader.rating}
                      </div>
                    </td>
                    <td className="p-4 text-right pr-6 font-bold text-zinc-900">
                      {leader.jobs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default FreelancerLeaderboard;
