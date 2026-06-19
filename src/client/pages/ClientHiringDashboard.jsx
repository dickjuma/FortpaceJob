import React from 'react';
import { Briefcase, CreditCard, Users, AlertCircle, Clock, CheckCircle2, MoreVertical, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientHiringDashboard = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 mb-1">Hiring Command Center</h1>
              <p className="text-zinc-600 font-medium">Welcome back, AcmeCorp. You have 3 active projects.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/post-job" className="px-6 py-2.5 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl transition-colors shadow-sm">
                Post New Job
              </Link>
              <Link to="/search" className="px-6 py-2.5 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors shadow-sm">
                Find Talent
              </Link>
            </div>
          </div>

          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-[#4C1D95]/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center shrink-0"><Briefcase className="w-6 h-6" /></div>
              <div>
                <div className="text-sm font-bold text-zinc-500 mb-1">Active Contracts</div>
                <div className="text-2xl font-black text-zinc-900">12</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-emerald-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-success flex items-center justify-center shrink-0"><CreditCard className="w-6 h-6" /></div>
              <div>
                <div className="text-sm font-bold text-zinc-500 mb-1">Escrow Balance</div>
                <div className="text-2xl font-black text-zinc-900">$14,500</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 hover:border-[#4C1D95]/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#4C1D95]/5 text-[#4C1D95] flex items-center justify-center shrink-0"><Users className="w-6 h-6" /></div>
              <div>
                <div className="text-sm font-bold text-zinc-500 mb-1">Shortlisted</div>
                <div className="text-2xl font-black text-zinc-900">24</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm flex items-center gap-4 hover:border-rose-400 transition-colors cursor-pointer ring-1 ring-rose-100">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><AlertCircle className="w-6 h-6" /></div>
              <div>
                <div className="text-sm font-bold text-rose-600 mb-1">Action Required</div>
                <div className="text-2xl font-black text-zinc-900">3</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content Area */}
            <div className="lg:w-2/3 space-y-8">
              
              {/* Active Contracts */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-zinc-900">Active Contracts</h2>
                  <Link to="/contracts" className="text-[#4C1D95] text-sm font-bold hover:underline">View All</Link>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Sarah W.', role: 'Senior React Dev', project: 'Frontend Dashboard Rewrite', status: 'Milestone 2 Pending', progress: 40 },
                    { name: 'TechFlow Agency', role: 'DevOps Team', project: 'AWS Infrastructure Setup', status: 'In Progress', progress: 85 },
                  ].map((contract, i) => (
                    <div key={i} className="border border-zinc-100 rounded-2xl p-5 hover:border-[#4C1D95]/20 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contract.name)}&background=random`} className="w-12 h-12 rounded-xl border border-zinc-200" alt="avatar" />
                          <div>
                            <h3 className="font-bold text-zinc-900">{contract.project}</h3>
                            <div className="text-sm text-zinc-500">{contract.name} • {contract.role}</div>
                          </div>
                        </div>
                        <button className="text-zinc-400 hover:text-zinc-900"><MoreVertical className="w-5 h-5" /></button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div className={`h-full ${contract.progress > 80 ? 'bg-success' : 'bg-[#4C1D95]'}`} style={{ width: `${contract.progress}%` }}></div>
                        </div>
                        <div className="text-sm font-bold text-zinc-700 w-32 text-right">{contract.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-500" /> Pending Approvals
                  </h2>
                </div>
                
                <div className="border border-rose-100 bg-rose-50/50 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-zinc-200">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">Milestone 1 Submitted</h4>
                      <p className="text-sm text-zinc-600">David C. has submitted "Wireframes" for approval.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-zinc-300 text-zinc-700 font-bold rounded-lg text-sm hover:bg-surface">Review</button>
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-success text-white font-bold rounded-lg text-sm hover:bg-emerald-700">Approve & Pay</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar Area */}
            <div className="lg:w-1/3 space-y-8">
              
              {/* Job Postings */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-zinc-900">My Job Posts</h2>
                  <Link to="/jobs" className="text-[#4C1D95] text-sm font-bold hover:underline">Manage</Link>
                </div>
                
                <div className="space-y-4">
                  <div className="group cursor-pointer">
                    <div className="font-bold text-zinc-900 group-hover:text-[#4C1D95] transition-colors">Senior Mobile App Developer</div>
                    <div className="text-sm text-zinc-500 mb-2">Posted 2 days ago • Public</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">12 Proposals</span>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">3 Interviewing</span>
                    </div>
                  </div>
                  <hr className="border-zinc-100" />
                  <div className="group cursor-pointer">
                    <div className="font-bold text-zinc-900 group-hover:text-[#4C1D95] transition-colors">UI/UX Audit</div>
                    <div className="text-sm text-zinc-500 mb-2">Draft • Last saved 1 hr ago</div>
                    <button className="text-[#4C1D95] text-xs font-bold hover:underline">Finish posting</button>
                  </div>
                </div>
              </div>

              {/* AI Hiring Insights */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-[#4C1D95] rounded-full blur-2xl opacity-40"></div>
                <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4C1D95] animate-pulse"></span> AI Insights
                </h3>
                <p className="text-sm text-zinc-300 mb-4 relative z-10 leading-relaxed">
                  Based on your saved collections, we found 3 highly-rated React developers available to start immediately within your budget.
                </p>
                <Link to="/ai-match" className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors border border-white/20 block text-center relative z-10">
                  View Recommendations
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ClientHiringDashboard;


