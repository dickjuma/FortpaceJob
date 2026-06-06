import React from 'react';
import { Star, ShieldCheck, ArrowRight, Building2, ExternalLink, ThumbsUp, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const RECENT_PROJECTS = [
  {
    id: 1,
    title: 'Enterprise E-commerce Migration to React & Node',
    client: 'Acme Corp',
    freelancer: 'Sarah W.',
    freelancerTitle: 'Senior React Developer',
    amount: '$14,500',
    duration: '6 Weeks',
    rating: 5.0,
    feedback: "Sarah is an absolute professional. She migrated our entire legacy frontend to a modern React stack flawlessly. The site is now 3x faster.",
    tags: ['React', 'Node.js', 'Enterprise', 'Migration'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=800&q=80'
  },
  {
    id: 2,
    title: 'Brand Identity & UI Design for Fintech Startup',
    client: 'Vault Finance',
    freelancer: 'Elena R.',
    freelancerTitle: 'UI/UX Specialist',
    amount: '$6,200',
    duration: '3 Weeks',
    rating: 5.0,
    feedback: "Elena captured our vision perfectly. The new UI is sleek, trustworthy, and our conversion rates are already up 15%. Highly recommend.",
    tags: ['UI/UX', 'Figma', 'Branding', 'Fintech'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&w=800&q=80'
  },
  {
    id: 3,
    title: 'Emergency Server Recovery & AWS Optimization',
    client: 'Global Logistics',
    freelancer: 'TechFlow Agency',
    freelancerTitle: 'DevOps SME',
    amount: '$8,900',
    duration: '1 Week',
    rating: 4.9,
    feedback: "TechFlow responded instantly to our outage, recovered the data, and optimized our AWS architecture to prevent future failures.",
    tags: ['AWS', 'DevOps', 'Emergency', 'Infrastructure'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&w=800&q=80'
  }
];

const PublicProjectShowcase = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4C1D95] animate-pulse"></span> Live Feed
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">Work Delivered Daily</h1>
            <p className="text-lg text-zinc-600">
              See the latest high-quality projects completed by our top professionals and enterprise agencies. Real work, real clients, real results.
            </p>
          </div>

          <div className="space-y-12">
            {RECENT_PROJECTS.map(project => (
              <div key={project.id} className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Left: Project Image/Visual */}
                  <div className="lg:w-2/5 relative h-64 lg:h-auto">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="text-xl font-bold bg-surface-dark/50 backdrop-blur px-3 py-1 rounded-lg inline-block border border-white/10 mb-2">
                        {project.amount}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4" /> Delivered in {project.duration}
                      </div>
                    </div>
                  </div>

                  {/* Right: Details & Feedback */}
                  <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link to={`/portfolio/case-study/${project.id}`} className="text-zinc-400 hover:text-[#4C1D95] transition-colors p-2">
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      </div>

                      <h2 className="text-2xl font-bold text-zinc-900 mb-6 leading-tight hover:text-[#4C1D95] transition-colors cursor-pointer">
                        {project.title}
                      </h2>

                      {/* Collaboration Block */}
                      <div className="flex items-center gap-6 bg-surface border border-zinc-100 rounded-2xl p-4 mb-6">
                        <div className="flex-1">
                          <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Client</div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#4C1D95]/10 text-[#4C1D95] rounded-lg flex items-center justify-center font-bold border border-[#4C1D95]/20">
                              {project.client.charAt(0)}
                            </div>
                            <span className="font-bold text-zinc-900">{project.client}</span>
                          </div>
                        </div>
                        <div className="text-zinc-300">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Delivered By</div>
                          <div className="flex items-center gap-2">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.freelancer)}&background=random`} className="w-8 h-8 rounded-full border border-zinc-200" alt="avatar" />
                            <div>
                              <div className="font-bold text-zinc-900 flex items-center gap-1 leading-tight">
                                {project.freelancer} <ShieldCheck className="w-3 h-3 text-[#4C1D95]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Block */}
                    <div className="border-t border-zinc-100 pt-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className="w-4 h-4 text-amber-500 fill-current" />
                        ))}
                        <span className="ml-2 font-bold text-zinc-900">{project.rating}</span>
                      </div>
                      <p className="text-zinc-600 italic leading-relaxed text-sm">
                        "{project.feedback}"
                      </p>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center gap-4 mt-6">
                      <button className="flex items-center gap-1.5 text-zinc-500 hover:text-[#4C1D95] font-medium text-sm transition-colors">
                        <ThumbsUp className="w-4 h-4" /> 124
                      </button>
                      <button className="flex items-center gap-1.5 text-zinc-500 hover:text-[#4C1D95] font-medium text-sm transition-colors">
                        <MessageSquare className="w-4 h-4" /> 12
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-surface text-zinc-900 font-bold rounded-xl transition-all shadow-sm">
              View More Success Stories
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PublicProjectShowcase;


