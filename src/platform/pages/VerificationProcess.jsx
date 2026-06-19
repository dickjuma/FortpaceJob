import React from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck, AlertCircle, FileText, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerificationProcess = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-emerald-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Fingerprint className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">The Fortspace Verification Standard</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              We employ a rigorous 4-step vetting process to ensure every professional on our platform is exactly who they say they are, and possesses the skills they claim.
            </p>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-10 before:-tranzinc-x-px md:before:mx-auto md:before:tranzinc-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
            
            {[
              {
                step: 1,
                title: 'Identity Verification (KYC)',
                icon: Fingerprint,
                desc: 'Government-issued ID matching combined with live biometric facial recognition ensures the person behind the screen is the person on the ID.'
              },
              {
                step: 2,
                title: 'Background & Credential Check',
                icon: FileText,
                desc: 'We verify educational degrees, professional certifications (e.g., AWS, Cisco), and conduct basic criminal background checks where legally applicable.'
              },
              {
                step: 3,
                title: 'Technical Skill Assessments',
                icon: CheckCircle2,
                desc: 'Timed, proctored exams for technical roles. Candidates must score in the 80th percentile or above in their primary skills to qualify for Pro status.'
              },
              {
                step: 4,
                title: 'Live Video Interview',
                icon: Video,
                desc: 'A final 15-minute live interview with our talent success team to assess communication skills, English proficiency, and professional etiquette.'
              }
            ].map((phase, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-white bg-zinc-100 text-zinc-400 group-hover:bg-emerald-100 group-hover:text-success transition-colors shadow-sm shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 z-10 relative left-0 md:left-1/2 -ml-10 md:ml-0">
                  <phase.icon className="w-8 h-8" />
                </div>
                
                <div className="w-[calc(100%-5rem)] md:w-[calc(50%-4rem)] bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm group-hover:border-emerald-300 transition-colors ml-4 md:ml-0">
                  <div className="text-sm font-bold text-success mb-2">Phase {phase.step}</div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{phase.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{phase.desc}</p>
                </div>

              </div>
            ))}

          </div>

          <div className="mt-20 bg-surface-dark rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-zinc-800 opacity-50" />
            <h2 className="text-3xl font-black mb-4 relative z-10">Look for the Badge</h2>
            <p className="text-zinc-300 max-w-2xl mx-auto mb-8 relative z-10">
              When you see the Fortspace Verified Badge on a profile, you can hire with absolute confidence.
            </p>
            <Link to="/search" className="px-8 py-3 bg-success hover:bg-success text-white font-bold rounded-xl transition-colors inline-block shadow-lg relative z-10">
              Browse Verified Talent
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default VerificationProcess;
