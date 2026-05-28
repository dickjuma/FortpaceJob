import React from 'react';
import { 
  Star, MapPin, ShieldCheck, Clock, Zap, 
  Award, MessageCircle,
  Heart, Share2, FileText, Video, ImageIcon
} from 'lucide-react';

const PORTFOLIO = [
  { id: 1, title: 'Fintech Dashboard UI', type: 'image', icon: ImageIcon, src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },
  { id: 2, title: 'E-commerce React App', type: 'video', icon: Video, src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80' },
  { id: 3, title: 'Brand Identity Guidelines', type: 'pdf', icon: FileText, src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80' },
];

const REVIEWS = [
  { id: 1, client: 'Acme Corp', rating: 5.0, date: 'May 12, 2026', comment: 'Alex is an absolute professional. Delivered the React application ahead of schedule and the code quality is pristine. Will definitely hire again.' },
  { id: 2, client: 'TechFlow Startup', rating: 5.0, date: 'Apr 28, 2026', comment: 'Great communication and excellent technical skills. Integrated complex Stripe flows seamlessly into our Next.js project.' }
];

export default function PublicFreelancerProfilePage() {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header Profile Hero */}
      <div className="bg-surface-dark dark:bg-surface-dark text-white pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end">
          
          <div className="relative shrink-0">
            <img src="https://i.pravatar.cc/300?u=a1" alt="Alex Rivera" className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-zinc-900 shadow-2xl object-cover" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-zinc-900 bg-success"></div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black mb-2">Alex Rivera</h1>
                <p className="text-xl text-zinc-300 font-medium">Senior React Developer & UI Architect</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><Share2 className="w-5 h-5" /></button>
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><Heart className="w-5 h-5" /></button>
                <button className="px-8 py-3 bg-brand-500 hover:bg-brand-600 font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Contact Me
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-zinc-300">
              <span className="flex items-center gap-1.5 bg-success/20 text-success px-3 py-1 rounded-full"><ShieldCheck className="w-4 h-4" /> Top Rated Plus</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> San Francisco, CA</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 (124 reviews)</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 1 hr response time</span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-8">
          
          {/* Stats Bar */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl flex flex-wrap gap-8 justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Hourly Rate</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">$45.00<span className="text-sm text-zinc-500">/hr</span></p>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Job Success</p>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-success w-[98%]"></div></div>
                <p className="text-xl font-black text-zinc-900 dark:text-white">98%</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Earned</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">$100k+</p>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Jobs</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">82</p>
            </div>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">About Me</h2>
            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              <p>Hi, I'm Alex. I am a Senior Frontend Engineer with 8+ years of experience specializing in React, Next.js, and modern CSS frameworks like Tailwind.</p>
              <p className="mt-4">My focus is on creating highly performant, accessible, and pixel-perfect user interfaces for SaaS platforms and e-commerce applications. I believe in clean code, strong typing (TypeScript), and scalable architectures.</p>
              <p className="mt-4">Services I offer:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Custom React / Next.js web application development</li>
                <li>Figma to React pixel-perfect conversions</li>
                <li>Frontend performance optimization</li>
                <li>API Integrations (GraphQL, REST, Stripe)</li>
              </ul>
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Portfolio Showcase</h2>
              <button className="text-sm font-bold text-brand-600 hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PORTFOLIO.map(item => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-3 border border-zinc-200 dark:border-zinc-800">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
                      <item.icon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                    </div>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-brand-600 transition-colors">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Work History & Reviews */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Recent Work History</h2>
            
            <div className="space-y-6">
              {REVIEWS.map(review => (
                <div key={review.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-lg hover:text-brand-600 transition-colors cursor-pointer">Frontend Dashboard Build (React)</h3>
                    <div className="text-right">
                      <p className="font-black text-zinc-900 dark:text-white">$3,200</p>
                      <p className="text-xs font-bold text-zinc-400">Fixed Price</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{review.rating}</span>
                    <span className="text-xs font-medium text-zinc-500">• {review.date}</span>
                  </div>
                  
                  <p className="text-sm italic text-zinc-600 dark:text-zinc-400 mb-3">"{review.comment}"</p>
                  
                  <p className="text-xs font-bold text-zinc-500">Client: {review.client}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 border border-zinc-200 dark:border-zinc-700 font-bold text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-surface dark:hover:bg-zinc-800 transition-colors">
              Load More Reviews
            </button>
          </div>

        </div>

        {/* Right Column: Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-6">
          
          {/* Invite Action Widget */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Hire Alex for your project</h3>
            <div className="space-y-3">
              <button className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm">
                Invite to Job
              </button>
              <button className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl transition-all text-sm">
                Book a Consultation
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-medium text-zinc-500 text-center flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Usually replies within 1 hour
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Redux', 'GraphQL', 'Framer Motion'].map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Certifications</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">React Native Expert</h4>
                  <p className="text-xs font-medium text-zinc-500">Issued by Meta • 2025</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">AWS Cloud Practitioner</h4>
                  <p className="text-xs font-medium text-zinc-500">Issued by AWS • 2024</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
