import React from 'react';
import { Building2, Star, CheckCircle2, MapPin, Globe, Clock, ShieldCheck } from 'lucide-react';

const ClientPublicProfile = () => {
  return (
    <>
      <div className="bg-surface min-h-screen pb-16">
        
        {/* Banner */}
        <div className="h-64 bg-surface-dark relative">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&w=2000&q=80" className="w-full h-full object-cover opacity-50" alt="Company Banner" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-5xl -mt-20 relative z-10">
          
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Acme+Corp&background=0D8ABC&color=fff&size=200" alt="AcmeCorp Logo" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-2 mb-1">
                      Acme Corporation <ShieldCheck className="w-6 h-6 text-success" />
                    </h1>
                    <div className="text-zinc-500 font-medium">Enterprise Software & Logistics</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-1 font-bold text-xl text-zinc-900 mb-1 justify-start sm:justify-end">
                      <Star className="w-5 h-5 text-amber-500 fill-current" /> 4.9
                    </div>
                    <div className="text-sm text-zinc-500">Based on 145 reviews</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-600 mb-6">
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-zinc-400" /> San Francisco, CA</div>
                  <div className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-zinc-400" /> Member since 2021</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Payment Verified</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-zinc-400" /> $450k+ Total Spent</div>
                </div>

                <p className="text-zinc-700 leading-relaxed max-w-3xl">
                  Acme Corporation is a leading provider of global logistics software. We regularly hire top-tier React developers, UI/UX designers, and AWS DevOps engineers to help scale our enterprise platforms. We value clear communication, strict deadlines, and high-quality code.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Open Jobs */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Open Jobs (3)</h2>
              
              {[
                { title: 'Senior React Developer for Dashboard Rebuild', type: 'Hourly', rate: '$60 - $90/hr', time: 'Est. 3-6 months' },
                { title: 'AWS Architect for Database Migration', type: 'Fixed Price', rate: '$5,000', time: 'Est. 2 weeks' },
                { title: 'Freelance UI/UX Designer', type: 'Hourly', rate: '$50 - $75/hr', time: 'Est. 1 month' }
              ].map((job, i) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer group">
                  <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-[#2bb75c] transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-zinc-600 font-medium">
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-lg">{job.type}</span>
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-lg font-bold text-zinc-900">{job.rate}</span>
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-lg">{job.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Past Reviews from Freelancers */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-900 mb-4">Freelancer Feedback</h2>
              
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <h4 className="font-bold text-zinc-900 text-sm mb-1">Excellent client, very clear requirements</h4>
                  <p className="text-zinc-600 text-sm italic mb-2">"Working with Acme was a breeze. They know exactly what they want and pay milestones on time."</p>
                  <div className="text-xs text-zinc-400 font-medium">— Frontend Developer</div>
                </div>
                <hr className="border-zinc-100" />
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <h4 className="font-bold text-zinc-900 text-sm mb-1">Great long-term contract</h4>
                  <p className="text-zinc-600 text-sm italic mb-2">"Completed a 6-month contract. Team is highly professional."</p>
                  <div className="text-xs text-zinc-400 font-medium">— DevOps Engineer</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default ClientPublicProfile;

