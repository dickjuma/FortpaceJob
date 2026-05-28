import React from 'react';
import { Users, MapPin, Globe, CheckCircle2, Star, Mail, Briefcase, Award } from 'lucide-react';
import FreelancerCard from '../components/marketplace/FreelancerCard';

const AgencyProfile = () => {
  return (
    <>
      {/* Banner */}
      <div className="h-72 bg-surface-dark relative">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&w=2000&q=80" className="w-full h-full object-cover opacity-60" alt="Agency Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
      </div>

      <div className="bg-surface min-h-screen pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl -mt-24 relative z-10">
          
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 mb-8 flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 bg-white rounded-2xl border border-zinc-200 shadow-sm shrink-0 flex items-center justify-center p-2">
              <img src="https://ui-avatars.com/api/?name=TF&background=0D8ABC&color=fff&size=200" alt="TechFlow Logo" className="w-full h-full rounded-xl" />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                <div>
                  <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-2 mb-1">
                    TechFlow Agency <CheckCircle2 className="w-6 h-6 text-success" />
                  </h1>
                  <div className="text-zinc-500 font-medium text-lg">Enterprise Software & Cloud Architecture</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-black text-zinc-900 mb-1">$150/hr</div>
                  <div className="flex items-center gap-1 font-bold text-zinc-900 justify-start sm:justify-end">
                    <Star className="w-4 h-4 text-amber-500 fill-current" /> 4.9 <span className="text-zinc-500 font-normal">(145 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-600 mb-6 border-b border-zinc-100 pb-6">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-zinc-400" /> San Francisco, CA</div>
                <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-zinc-400" /> 10-50 Employees</div>
                <div className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-zinc-400" /> English, Spanish</div>
                <div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-500" /> Top Rated Plus</div>
              </div>

              <p className="text-zinc-700 leading-relaxed max-w-4xl mb-6">
                TechFlow is a full-stack development agency specializing in scalable React and Node.js enterprise applications. With over a decade of experience, our team of senior engineers, UX designers, and AWS-certified cloud architects handles complex migrations, modernizations, and new product builds from scratch. We act as your dedicated remote engineering department.
              </p>

              <div className="flex gap-4">
                <button className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-md">
                  Hire Agency
                </button>
                <button className="px-8 py-3 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                  <Mail className="w-4 h-4" /> Message
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              {/* Agency Members */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-500" /> Core Team Members
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-zinc-100 rounded-xl hover:border-brand-200 transition-colors">
                      <img src={`https://ui-avatars.com/api/?name=Member+${i}&background=random`} className="w-12 h-12 rounded-full" alt="member" />
                      <div>
                        <div className="font-bold text-zinc-900">Team Member {i}</div>
                        <div className="text-sm text-zinc-500">Senior Engineer</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Highlights */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-success" /> Agency Portfolio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: 'Fintech App', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&w=600&q=80' },
                    { title: 'SaaS Dashboard', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=600&q=80' }
                  ].map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="rounded-2xl overflow-hidden mb-3 h-48 border border-zinc-200">
                        <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                      </div>
                      <h3 className="font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">{item.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-8">
              <div className="bg-white border border-zinc-200 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Core Services</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'AWS', 'UI/UX Design', 'DevOps', 'System Architecture'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-zinc-100 text-zinc-700 text-sm font-bold rounded-lg border border-zinc-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-surface-dark rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-600 rounded-full blur-3xl opacity-50"></div>
                <h3 className="text-xl font-bold mb-4 relative z-10">Need a managed team?</h3>
                <p className="text-zinc-300 text-sm mb-6 relative z-10 leading-relaxed">
                  TechFlow can deploy a full squad of designers, developers, and project managers to your project within 48 hours.
                </p>
                <button className="w-full py-3 bg-white text-zinc-900 font-bold rounded-xl relative z-10 hover:bg-zinc-100 transition-colors">
                  Book Consultation
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AgencyProfile;
