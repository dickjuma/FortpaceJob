import React from 'react';
import { Smartphone, Download, Star, CheckCircle2, Search } from 'lucide-react';

const MobileFindTalent = () => {
  return (
    <>
      <div className="bg-surface-dark text-white min-h-screen pt-20 pb-24 relative overflow-hidden flex items-center">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-zinc-900 to-zinc-900"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Hire world-class talent from anywhere.
              </h1>
              <p className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Download the Fortspace mobile app to review proposals, chat with freelancers, and approve milestones on the go.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <button className="px-8 py-4 bg-white text-zinc-900 font-bold rounded-2xl hover:bg-zinc-100 transition-colors flex items-center justify-center gap-3 text-lg">
                  <Smartphone className="w-6 h-6" /> App Store
                </button>
                <button className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-3 text-lg border border-zinc-700">
                  <Download className="w-6 h-6" /> Google Play
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8">
                <div>
                  <div className="text-3xl font-black text-white mb-1">4.9</div>
                  <div className="flex text-amber-500 mb-1"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                  <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold">10k+ Reviews</div>
                </div>
                <div className="w-px h-12 bg-zinc-800"></div>
                <div>
                  <div className="text-3xl font-black text-white mb-1">500k+</div>
                  <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold mt-3">Downloads</div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center relative">
              {/* Mock iPhone Frame */}
              <div className="relative w-[300px] h-[600px] bg-zinc-800 rounded-[3rem] border-8 border-zinc-800 shadow-2xl overflow-hidden shadow-blue-900/50">
                <div className="absolute top-0 w-full h-7 bg-zinc-800 rounded-b-3xl z-20"></div>
                
                {/* Mock App UI */}
                <div className="w-full h-full bg-surface flex flex-col">
                  <div className="bg-white p-6 pt-10 pb-4 shadow-sm z-10">
                    <h2 className="text-xl font-bold text-zinc-900">Messages</h2>
                  </div>
                  <div className="flex-1 p-4 space-y-4">
                    <div className="bg-[#4C1D95] text-white p-3 rounded-2xl rounded-tr-sm ml-8 text-sm shadow-sm">
                      Can you start the React dashboard rebuild tomorrow?
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-zinc-200 text-zinc-800 rounded-tl-sm mr-8 text-sm shadow-sm">
                      Yes! I have reviewed the wireframes. Sending the milestone proposal now.
                    </div>
                    
                    <div className="bg-white border border-zinc-200 rounded-xl p-4 mt-8 shadow-sm">
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Proposal Received</div>
                      <div className="font-bold text-zinc-900 mb-1">Milestone 1: Architecture</div>
                      <div className="text-lg font-black text-[#4C1D95] mb-3">$1,200.00</div>
                      <button className="w-full py-2 bg-[#4C1D95] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Approve & Fund
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white border-t border-zinc-200 p-4 pb-6 flex justify-around text-zinc-400">
                    <Search className="w-6 h-6" />
                    <Smartphone className="w-6 h-6 text-[#4C1D95]" />
                    <Star className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFindTalent;


