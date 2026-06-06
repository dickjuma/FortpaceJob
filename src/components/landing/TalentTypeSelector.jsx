import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TalentTypeSelector = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
            How do you want to hire?
          </h2>
          <p className="text-lg text-zinc-500">
            Choose the hiring model that fits your project needs. We seamlessly integrate remote digital experts with local onsite professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Online Talent Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="group relative bg-surface rounded-3xl p-8 border border-zinc-100 hover:border-[#4C1D95]/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe className="w-32 h-32" />
            </div>
            
            <div className="w-14 h-14 bg-[#4C1D95]/10 text-[#4C1D95] rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7" />
            </div>
            
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">Online Freelancers</h3>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              Hire global digital experts for software development, design, marketing, and more. Perfect for remote collaboration.
            </p>
            
            <ul className="space-y-3 mb-8 text-sm text-zinc-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4C1D95]"></div>
                Global talent pool
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4C1D95]"></div>
                Flexible hourly or fixed-price contracts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4C1D95]"></div>
                Integrated milestone tracking
              </li>
            </ul>
            
            <Link to="/online" className="inline-flex items-center font-semibold text-[#4C1D95] group-hover:text-[#4C1D95] transition-colors">
              Find Online Talent <ArrowRight className="w-4 h-4 ml-2 group-hover:tranzinc-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Onsite Talent Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="group relative bg-surface rounded-3xl p-8 border border-zinc-100 hover:border-emerald-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <MapPin className="w-32 h-32" />
            </div>
            
            <div className="w-14 h-14 bg-emerald-100 text-success rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7" />
            </div>
            
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">Onsite Professionals</h3>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              Book verified local professionals for home repair, IT setup, event staff, and other physical services in your area.
            </p>
            
            <ul className="space-y-3 mb-8 text-sm text-zinc-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                Location-based matching
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                Real-time availability and ETA tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                Background checked professionals
              </li>
            </ul>
            
            <Link to="/onsite" className="inline-flex items-center font-semibold text-success group-hover:text-emerald-700 transition-colors">
              Find Local Professionals <ArrowRight className="w-4 h-4 ml-2 group-hover:tranzinc-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TalentTypeSelector;


