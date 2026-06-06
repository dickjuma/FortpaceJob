import React from 'react';
import { Star, MapPin, ShieldCheck, Wrench, Clock, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OnsiteWorkerCard = ({ worker }) => {
  const profilePath = `/talent/${worker.id}`;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col h-full group"
    >
      <div className="relative h-32 bg-zinc-100 overflow-hidden">
        {/* Placeholder for map background or work background */}
        <img 
          src={worker.coverUrl || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt="Work context"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-zinc-900 shadow-sm flex items-center gap-1">
            <Navigation className="w-3 h-3 text-success" />
            {worker.distance} mi
          </div>
          {worker.availableNow && (
            <div className="bg-success/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Available Now
            </div>
          )}
        </div>
      </div>

      <div className="p-5 flex-grow relative -mt-10">
        <img 
          src={worker.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=random`} 
          alt={worker.name} 
          className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-md bg-white mb-3"
        />
        
        <div className="flex items-center gap-1 mb-1">
          <Link to={profilePath} className="text-lg font-bold text-zinc-900 leading-tight hover:text-[#4C1D95] transition-colors">
            {worker.name}
          </Link>
          {worker.verified && (
            <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" title="Background Checked" />
          )}
        </div>
        
        <p className="text-sm font-medium text-zinc-600 mb-3 flex items-center gap-1">
          <Wrench className="w-3.5 h-3.5" />
          {worker.title}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="font-semibold text-zinc-900">{worker.rating}</span>
            <span className="text-zinc-500">({worker.reviews})</span>
          </div>
          <div className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md">
            ETA: {worker.eta}
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-zinc-600 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{worker.serviceArea}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-zinc-100 bg-emerald-50/30 flex items-center justify-between mt-auto">
        <div>
          <div className="text-xs text-zinc-500 mb-0.5">Est. Price</div>
          <div className="font-bold text-zinc-900">${worker.hourlyRate}<span className="text-xs font-normal text-zinc-500">/hr</span></div>
        </div>
        <Link to={profilePath} className="px-4 py-2 bg-success hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-emerald-600/20">
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default OnsiteWorkerCard;


