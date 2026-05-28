import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_FREELANCERS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    title: 'Senior Full Stack Developer',
    rating: 4.9,
    reviews: 124,
    hourlyRate: 85,
    location: 'Remote (US)',
    type: 'online',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: 2,
    name: 'David Chen',
    title: 'Master Electrician',
    rating: 5.0,
    reviews: 89,
    hourlyRate: 120,
    location: 'San Francisco, CA',
    type: 'onsite',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    skills: ['Wiring', 'Panel Upgrades', 'Smart Home']
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    title: 'UX/UI Designer',
    rating: 4.8,
    reviews: 210,
    hourlyRate: 65,
    location: 'Remote (Spain)',
    type: 'online',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    skills: ['Figma', 'Prototyping', 'User Research']
  },
  {
    id: 4,
    name: 'Michael Chang',
    title: 'IT Network Specialist',
    rating: 4.9,
    reviews: 45,
    hourlyRate: 95,
    location: 'New York, NY',
    type: 'hybrid',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    skills: ['Cisco', 'Network Setup', 'Security']
  }
];

const FeaturedFreelancers = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
              Top-rated talent, ready to work
            </h2>
            <p className="text-lg text-zinc-600">
              Discover professionals trusted by thousands of clients worldwide.
            </p>
          </div>
          <Link to="/search" className="hidden md:inline-flex items-center font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            View all talent <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_FREELANCERS.map((freelancer, index) => (
            <motion.div 
              key={freelancer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <img 
                    src={freelancer.imageUrl} 
                    alt={freelancer.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-zinc-100"
                  />
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    freelancer.type === 'online' ? 'bg-brand-100 text-brand-700' :
                    freelancer.type === 'onsite' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-brand-100 text-brand-700'
                  }`}>
                    {freelancer.type}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 mb-1 flex items-center gap-1">
                  {freelancer.name}
                  <ShieldCheck className="w-4 h-4 text-brand-500" />
                </h3>
                <p className="text-sm text-zinc-500 mb-4 line-clamp-1">{freelancer.title}</p>
                
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="font-semibold text-zinc-900">{freelancer.rating}</span>
                    <span className="text-zinc-400">({freelancer.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-600">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span className="truncate max-w-[100px]">{freelancer.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-surface/50 mt-auto">
                <div className="font-semibold text-zinc-900">
                  ${freelancer.hourlyRate}<span className="text-sm font-normal text-zinc-500">/hr</span>
                </div>
                <button className="px-4 py-2 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-900 text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/search" className="inline-flex items-center justify-center w-full py-3 bg-zinc-100 font-medium text-zinc-900 rounded-xl">
            View all talent
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFreelancers;
