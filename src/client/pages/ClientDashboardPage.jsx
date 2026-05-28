import React from 'react';
import { 
  PlusCircle, 
  Briefcase, 
  Search,
  ChevronRight,
  TrendingUp,
  Star,
  CheckCircle,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Area & Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-zinc-900/50 p-6 rounded-[32px] border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vivid-lavender opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-dark-purple border border-vivid-lavender/30 shadow-lg flex items-center justify-center text-xl font-bold text-white shrink-0">
              JD
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, John Doe</h1>
              <p className="text-zinc-400 text-sm mt-1">Corporate Client &bull; Member since 2024</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 relative z-10">
            <Link to="/client-services/create-job" className="flex items-center gap-2 px-5 py-2.5 bg-vivid-lavender hover:bg-dark-purple text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-vivid-lavender/20">
              <PlusCircle className="w-4 h-4" />
              Post New Project
            </Link>
            <Link to="/client-services/my-jobs" className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-full text-sm font-bold transition-colors">
              <Briefcase className="w-4 h-4" />
              View My Projects
            </Link>
            <Link to="/client/talent-search" className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-full text-sm font-bold transition-colors">
              <Search className="w-4 h-4" />
              Browse Freelancers
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-vivid-lavender/30 transition-colors backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-vivid-lavender/10 border border-vivid-lavender/20 rounded-lg text-vivid-lavender">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">Total Projects Posted</h3>
            <div className="text-3xl font-bold text-white mt-1">124</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-vivid-lavender/30 transition-colors backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-vivid-green/10 border border-vivid-green/20 rounded-lg text-vivid-green">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-bold text-vivid-green bg-vivid-green/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> +2
              </span>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">Active Projects</h3>
            <div className="text-3xl font-bold text-white mt-1">14</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-vivid-lavender/30 transition-colors backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">Completed Projects</h3>
            <div className="text-3xl font-bold text-white mt-1">102</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-vivid-lavender/30 transition-colors backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">Total Spent</h3>
            <div className="text-3xl font-bold text-white mt-1">$452.5K</div>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Projects Table (Col Span 2) */}
          <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-[28px] overflow-hidden backdrop-blur-md flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80">
              <h2 className="font-bold text-white text-lg">Recent Projects</h2>
              <Link to="/client-services/my-jobs" className="text-sm text-vivid-lavender hover:text-white font-bold transition-colors">View All</Link>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                    <th className="p-4 font-semibold">Project Name</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Budget</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">Fullstack React Dashboard Build</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Updated 2 days ago</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-vivid-green/10 text-vivid-green border border-vivid-green/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-vivid-green"></span> In Progress
                      </span>
                    </td>
                    <td className="p-4 font-medium text-zinc-300">$4,500</td>
                    <td className="p-4 text-right">
                      <button className="text-vivid-lavender hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-vivid-lavender/10 transition-colors">Manage</button>
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">Security Audit & Pen Testing</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Updated 5 days ago</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Pending
                      </span>
                    </td>
                    <td className="p-4 font-medium text-zinc-300">$2,800</td>
                    <td className="p-4 text-right">
                      <button className="text-vivid-lavender hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-vivid-lavender/10 transition-colors">Manage</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">Brand Assets Design</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Updated 1 week ago</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Open
                      </span>
                    </td>
                    <td className="p-4 font-medium text-zinc-300">$850</td>
                    <td className="p-4 text-right">
                      <button className="text-vivid-lavender hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-vivid-lavender/10 transition-colors">View Bids</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Freelancers Recommended */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-[28px] overflow-hidden backdrop-blur-md flex flex-col">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/80">
              <h2 className="font-bold text-white text-lg">Top Recommended Talent</h2>
            </div>
            <div className="p-4 flex-1 space-y-3">
              
              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700 transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-10 h-10 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">Alex Rivera</h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">Senior React Developer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-[10px] font-bold text-orange-400"><Star className="w-3 h-3 fill-orange-400 mr-0.5" /> 4.9</span>
                    <span className="text-[10px] text-zinc-500">&bull; $65/hr</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-vivid-lavender group-hover:bg-vivid-lavender/10 transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700 transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Avatar" className="w-10 h-10 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">Sarah Chen</h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">UI/UX Designer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-[10px] font-bold text-orange-400"><Star className="w-3 h-3 fill-orange-400 mr-0.5" /> 5.0</span>
                    <span className="text-[10px] text-zinc-500">&bull; $55/hr</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-vivid-lavender group-hover:bg-vivid-lavender/10 transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700 transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Avatar" className="w-10 h-10 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">Michael Okafor</h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">Cybersecurity Expert</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-[10px] font-bold text-orange-400"><Star className="w-3 h-3 fill-orange-400 mr-0.5" /> 4.8</span>
                    <span className="text-[10px] text-zinc-500">&bull; $85/hr</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-vivid-lavender group-hover:bg-vivid-lavender/10 transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 text-center">
              <Link to="/client/talent-search" className="text-sm font-bold text-vivid-lavender hover:text-white transition-colors">Browse All Talent</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
