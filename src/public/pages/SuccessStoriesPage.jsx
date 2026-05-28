import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Quote } from 'lucide-react';

const FEATURED_STORY = {
  id: "feat_1",
  freelancer: {
    name: "Maria Gonzalez",
    role: "Senior UX Designer",
    avatar: "https://i.pravatar.cc/150?u=maria"
  },
  client: {
    name: "FinTech Innovators",
    logo: "https://ui-avatars.com/api/?name=FT&background=0D8ABC&color=fff"
  },
  title: "Redesigning the Future of Mobile Banking",
  summary: "How Maria transformed FinTech Innovators' mobile app, resulting in a 40% increase in user engagement and a 5-star app store rating within just 3 months.",
  metrics: [
    { label: "Increase in Engagement", value: "40%" },
    { label: "Faster Onboarding", value: "2.5x" },
    { label: "User Satisfaction", value: "98%" }
  ],
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  testimonial: "Maria didn't just redesign our app; she rethought our entire user journey. The results exceeded our wildest expectations and transformed how our users bank.",
  category: "Design & UX"
};

const SUCCESS_STORIES = [
  {
    id: "story_1",
    freelancer: { name: "James Wilson", role: "Full Stack Engineer", avatar: "https://i.pravatar.cc/150?u=james" },
    client: { name: "HealthTech Solutions" },
    title: "Scaling Telehealth Infrastructure for 1M+ Users",
    summary: "James architected a highly scalable backend that allowed HealthTech Solutions to handle a 500% surge in user traffic without any downtime.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
    category: "Engineering",
    stat: "500% Scale"
  },
  {
    id: "story_2",
    freelancer: { name: "Aisha Patel", role: "Digital Marketing Specialist", avatar: "https://i.pravatar.cc/150?u=aisha" },
    client: { name: "EcoWear Apparel" },
    title: "Driving Global E-commerce Expansion",
    summary: "Through targeted social media campaigns, Aisha helped an eco-friendly clothing brand expand into three new international markets.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    category: "Marketing",
    stat: "3x ROI"
  },
  {
    id: "story_3",
    freelancer: { name: "David Kim", role: "Data Scientist", avatar: "https://i.pravatar.cc/150?u=david" },
    client: { name: "Logistics Pro" },
    title: "Optimizing Delivery Routes with Machine Learning",
    summary: "David developed predictive models that reduced delivery times and cut fuel consumption by 15% across the entire fleet.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
    stat: "-15% Costs"
  }
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-brand-50 dark:bg-brand-900/10 -z-10 [clip-path:polygon(0_0,100%_0,100%_80%,0_100%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Ideas Realized.<br className="hidden sm:block" /> Businesses Transformed.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              Discover how top independent talent on Forte is helping companies innovate faster, scale smarter, and achieve exceptional results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Story */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col lg:flex-row"
          >
            <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full">
              <img 
                src={FEATURED_STORY.image} 
                alt="Featured Story" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                Featured Case Study
              </div>
            </div>
            
            <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-sm font-medium text-brand-600 dark:text-brand-400">{FEATURED_STORY.category}</span>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <div className="flex items-center space-x-2">
                  <img src={FEATURED_STORY.client.logo} alt="" className="w-5 h-5 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{FEATURED_STORY.client.name}</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">{FEATURED_STORY.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                {FEATURED_STORY.summary}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {FEATURED_STORY.metrics.map((metric, i) => (
                  <div key={i} className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-1">{metric.value}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">{metric.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-surface dark:bg-gray-800/50 rounded-2xl p-6 relative">
                <Quote className="absolute top-4 left-4 w-8 h-8 text-brand-100 dark:text-gray-700 -z-0" />
                <p className="text-gray-800 dark:text-gray-200 italic relative z-10 mb-4">
                  "{FEATURED_STORY.testimonial}"
                </p>
                <div className="flex items-center space-x-3">
                  <img src={FEATURED_STORY.freelancer.avatar} alt={FEATURED_STORY.freelancer.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-sm font-semibold">{FEATURED_STORY.freelancer.name}</div>
                    <div className="text-xs text-gray-500">{FEATURED_STORY.freelancer.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Grid */}
      <section className="py-16 md:py-24 bg-surface dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">More Success Stories</h2>
              <p className="text-gray-600 dark:text-gray-400">Explore how our talented community is making an impact across industries and specialties.</p>
            </div>
            <button className="hidden md:flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 transition-colors">
              <span>View all stories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full">
                    {story.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
                    <TrendingUp className="w-3 h-3" />
                    <span>{story.stat}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Client: {story.client.name}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1">
                    {story.summary}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-2">
                      <img src={story.freelancer.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <span className="text-sm font-medium">{story.freelancer.name}</span>
                    </div>
                    <button className="text-gray-400 group-hover:text-brand-600 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-8 md:hidden flex justify-center items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold py-4 border border-brand-200 dark:border-brand-800 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
            <span>View all stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-brand-600 dark:bg-brand-700 rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to write your own success story?</h2>
            <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of businesses finding exceptional talent on Forte, or apply to become a top-tier freelancer today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
              <button className="w-full sm:w-auto bg-white text-brand-600 hover:bg-surface px-8 py-3 rounded-xl font-bold transition-colors">
                Find Talent
              </button>
              <button className="w-full sm:w-auto bg-brand-700 dark:bg-brand-800 text-white hover:bg-brand-800 dark:hover:bg-brand-900 px-8 py-3 rounded-xl font-bold border border-brand-500 transition-colors">
                Become a Freelancer
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
