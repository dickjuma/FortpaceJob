import React from 'react';
import { Target, CheckCircle2, Clock, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const SkillAssessment = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-[#14a800]/10 text-[#14a800] rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Target className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">Skill Assessments</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Prove your expertise to top enterprise clients. Pass these timed, proctored assessments to earn verified badges on your profile.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12 flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 mb-1">Proctoring Notice</h3>
              <p className="text-sm text-amber-700">All tests are actively proctored via webcam and screen sharing. Leaving the test window or attempting to use external resources will result in an automatic failure and a 3-month cooldown period.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {[
              { title: 'React Performance & Architecture', time: '45 mins', qs: 30, diff: 'Advanced' },
              { title: 'Node.js Security & Scaling', time: '60 mins', qs: 40, diff: 'Expert' },
              { title: 'UI/UX Principles (Figma)', time: '30 mins', qs: 25, diff: 'Intermediate' },
              { title: 'AWS Cloud Infrastructure', time: '90 mins', qs: 50, diff: 'Expert' }
            ].map((test, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-zinc-600" />
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${
                    test.diff === 'Expert' ? 'bg-[#14a800]/10 text-[#14a800]' :
                    test.diff === 'Advanced' ? 'bg-rose-100 text-rose-700' :
                    'bg-[#14a800]/10 text-[#14a800]'
                  }`}>
                    {test.diff}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-zinc-900 mb-4">{test.title}</h3>
                
                <div className="flex items-center gap-6 text-sm text-zinc-600 mb-8 border-y border-zinc-100 py-4">
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-zinc-400" /> {test.time}</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> {test.qs} Questions</div>
                </div>

                <button className="w-full py-3 bg-surface-dark hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors">
                  Start Assessment
                </button>
              </div>
            ))}

          </div>

        </div>
      </div>
    </>
  );
};

export default SkillAssessment;
