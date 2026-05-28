import React from 'react';
import { CheckCircle2, Star, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUCCESS_STORIES = [
  {
    id: 1,
    title: 'How AcmeCorp Scaled Their Engineering Team in 48 Hours',
    client: 'AcmeCorp',
    metric: '3x Faster Delivery',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&w=800&q=80',
    quote: "Fortspace allowed us to instantly tap into elite engineering talent when our internal team hit capacity. We delivered our Q3 roadmap ahead of schedule."
  },
  {
    id: 2,
    title: 'Vault Finance Rebrands with Fortspace Elite Designers',
    client: 'Vault Finance',
    metric: '+45% Conversion',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&w=800&q=80',
    quote: "The level of design talent on this platform is unmatched. We found our lead UI/UX designer within hours."
  },
  {
    id: 3,
    title: 'Emergency IT Recovery Saves Global Logistics Firm',
    client: 'Global Logistics',
    metric: '99.9% Uptime Restored',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&w=800&q=80',
    quote: "When our servers went down, we used the Fortspace Emergency dispatch. A local DevOps expert was onsite in 45 minutes."
  }
];

const SuccessStories = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">Customer Success Stories</h1>
            <p className="text-lg text-zinc-600">
              See how startups, SMEs, and Fortune 500 companies use Fortspace to scale their workforce, execute critical projects, and drive massive growth.
            </p>
          </div>

          <div className="space-y-12 mb-20">
            {SUCCESS_STORIES.map((story, index) => (
              <div key={story.id} className={`bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-surface-dark/20"></div>
                </div>

                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 w-max">
                    <CheckCircle2 className="w-4 h-4" /> {story.metric}
                  </div>
                  
                  <h2 className="text-3xl font-black text-zinc-900 mb-6 leading-tight hover:text-brand-600 transition-colors cursor-pointer">
                    {story.title}
                  </h2>
                  
                  <div className="bg-surface p-6 rounded-2xl border border-zinc-100 mb-8 relative">
                    <Quote className="absolute top-4 left-4 w-8 h-8 text-zinc-200" />
                    <p className="text-zinc-700 italic relative z-10 pl-8 leading-relaxed font-medium">
                      "{story.quote}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-bold text-zinc-900">{story.client}</div>
                    <Link to={`/case-study/${story.id}`} className="flex items-center gap-1 text-brand-600 font-bold hover:text-brand-700 transition-colors">
                      Read full story <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-brand-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-500 rounded-full blur-3xl opacity-50"></div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 relative z-10">Ready to write your success story?</h2>
            <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of forward-thinking companies building their dream teams on Fortspace.
            </p>
            <button className="px-8 py-4 bg-white text-brand-600 font-bold rounded-xl shadow-lg hover:bg-surface transition-colors relative z-10">
              Start Hiring Today
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default SuccessStories;
