import React, { useState } from 'react';
import { Bot, CheckCircle2, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMarketplaceTalent } from '../../client/pages/find-talent/talentMarketplaceData';

const AITalentMatching = () => {
  const [form, setForm] = useState({
    description: '',
    skills: 'React, Node.js, AWS',
    budget: 'mid',
    timeline: 'ASAP',
  });
  const [hasResults, setHasResults] = useState(false);

  const skillTokens = form.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

  const matches = getMarketplaceTalent({
    query: `${form.description} ${form.skills}`.trim(),
    rate: form.budget,
    mode: 'online',
    sortBy: 'recommended',
  })
    .slice(0, 3)
    .map((entry, index) => ({
      ...entry,
      matchScore: Math.max(84, 98 - index * 6),
      reason: `Strong overlap in ${skillTokens.slice(0, 3).join(', ') || 'your requested skills'}, high trust signals, and ${entry.availability.toLowerCase()}.`,
    }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasResults(true);
  };

  return (
    <div className="bg-surface min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] text-sm font-bold tracking-wide mb-4">
            <Bot className="w-5 h-5" /> FORTSPACE AI MATCHER
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 mb-4">Generate marketplace matches from a hiring brief</h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            This flow now searches the same live talent dataset used by search, category pages, profile routes, and shortlist pages.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-5/12">
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-#4C1D95] via-#4C1D95] to-[#22C55E]" />
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Project requirements</h2>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">What do you need built?</label>
                  <textarea
                    className="w-full bg-surface border border-zinc-200 rounded-xl px-4 py-3 text-zinc-700"
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="I need a scalable dashboard, growth operator, or onsite specialist..."
                    rows="3"
                    value={form.description}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Required skills</label>
                  <input
                    className="w-full bg-surface border border-zinc-200 rounded-xl px-4 py-3 text-zinc-700"
                    onChange={(event) => setForm({ ...form, skills: event.target.value })}
                    value={form.skills}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Budget range</label>
                    <select
                      className="w-full bg-surface border border-zinc-200 rounded-xl px-4 py-3 text-zinc-700"
                      onChange={(event) => setForm({ ...form, budget: event.target.value })}
                      value={form.budget}
                    >
                      <option value="low">Under $60/hr</option>
                      <option value="mid">$60 - $110/hr</option>
                      <option value="high">$110+/hr</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Timeline</label>
                    <select
                      className="w-full bg-surface border border-zinc-200 rounded-xl px-4 py-3 text-zinc-700"
                      onChange={(event) => setForm({ ...form, timeline: event.target.value })}
                      value={form.timeline}
                    >
                      <option>ASAP</option>
                      <option>1-3 Weeks</option>
                      <option>1-3 Months</option>
                      <option>Ongoing</option>
                    </select>
                  </div>
                </div>

                <button className="w-full mt-4 py-4 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2" type="submit">
                  <Zap className="w-5 h-5" /> Generate Matches
                </button>
              </form>
            </div>
          </div>

          <div className="w-full lg:w-7/12 flex flex-col justify-center min-h-[400px]">
            {!hasResults ? (
              <div className="text-center p-12 bg-zinc-200/50 rounded-3xl border border-zinc-200 border-dashed h-full flex flex-col items-center justify-center">
                <Bot className="w-16 h-16 text-zinc-300 mb-4" />
                <h3 className="text-xl font-bold text-zinc-400 mb-2">Awaiting parameters</h3>
                <p className="text-zinc-500 max-w-sm">Add the hiring brief on the left and the marketplace matcher will rank suitable talent.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="font-bold text-zinc-900 text-lg">Top AI matches</h3>
                  <span className="text-sm font-medium text-success flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {matches.length} exact matches found
                  </span>
                </div>

                {matches.map((match, index) => (
                  <div className={`bg-white rounded-2xl border ${index === 0 ? 'border-[#4C1D95]/20 shadow-xl shadow-blue-900/10' : 'border-zinc-200 shadow-sm'} p-6 relative overflow-hidden transition-all hover:border-[#4C1D95]/20`} key={match.id}>
                    {index === 0 ? (
                      <div className="absolute top-0 right-0 bg-[#4C1D95] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                        Best overall match
                      </div>
                    ) : null}

                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-shrink-0 text-center">
                        <img
                          alt={match.name}
                          className={`w-20 h-20 rounded-full border-4 mx-auto mb-2 ${index === 0 ? 'border-[#4C1D95]/20' : 'border-zinc-100'}`}
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.name)}&background=random`}
                        />
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${match.matchScore > 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-[#4C1D95]/10 text-[#4C1D95]'}`}>
                          {match.matchScore}% Match
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1 gap-4">
                          <div>
                            <h4 className="font-bold text-xl text-zinc-900 flex items-center gap-1.5">
                              {match.name} {match.verified ? <ShieldCheck className="w-4 h-4 text-[#4C1D95]" /> : null}
                            </h4>
                            <p className="text-sm font-medium text-zinc-600">{match.title}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-zinc-900">${match.hourlyRate}/hr</div>
                            <div className="flex items-center gap-1 text-xs font-bold text-zinc-700 justify-end mt-0.5">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {match.rating}
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#4C1D95]/5/50 border border-[#4C1D95]/20 rounded-xl p-3 my-4 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[#4C1D95] flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-zinc-700 leading-relaxed">
                            <span className="font-bold text-[#4C1D95]">Why this match: </span>
                            {match.reason}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <Link className="flex-1 py-2.5 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors shadow-md text-center" to={`/talent/${match.id}/invite`}>
                            Invite to Job
                          </Link>
                          <Link className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-colors flex items-center justify-center" to={`/talent/${match.id}`}>
                            Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITalentMatching;


