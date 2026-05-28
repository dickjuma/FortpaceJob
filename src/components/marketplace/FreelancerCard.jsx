import React from 'react';
import { Star, MapPin, ShieldCheck, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const FreelancerCard = ({ freelancer }) => {
  const profilePath = `/talent/${freelancer.id}`;
  const invitePath = `/talent/${freelancer.id}/invite`;

  return (
    <div className="group relative bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 hover:-tranzinc-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Top Banner & Profile Pic */}
      <div className="h-20 bg-gradient-to-r from-zinc-100 to-zinc-200 relative">
        {/* Verification Badge top right */}
        {freelancer.verified && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur shadow-sm px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold text-zinc-700 uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-brand-500" /> Pro Verified
          </div>
        )}
      </div>
      
      <div className="px-6 relative flex-1 flex flex-col">
        {/* Avatar overlapping banner */}
        <div className="relative w-16 h-16 -mt-8 mb-3">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=random`} 
            alt={freelancer.name} 
            className="w-full h-full rounded-full border-4 border-white shadow-sm object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-success border-2 border-white rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="mb-3">
          <Link to={profilePath} className="font-bold text-lg text-zinc-900 hover:text-brand-600 transition-colors line-clamp-1">
            {freelancer.name}
          </Link>
          <p className="text-sm text-zinc-600 font-medium mb-1.5">{freelancer.title}</p>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {freelancer.location || 'Remote'}
            </div>
            <div className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">
              {freelancer.teamSize || freelancer.workType || 'Remote Available'}
            </div>
          </div>
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 font-bold text-zinc-900">
              <Star className="w-4 h-4 text-amber-400 fill-current" /> {freelancer.rating}
            </div>
            <span className="text-xs text-zinc-500">({freelancer.reviews} reviews)</span>
          </div>
          <div className="w-px h-8 bg-zinc-200"></div>
          <div className="flex flex-col">
            <div className="font-bold text-zinc-900">{freelancer.jobSuccess || 100}%</div>
            <span className="text-xs text-zinc-500">Job Success</span>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-zinc-600 line-clamp-2 mb-4 leading-relaxed flex-1">
          {freelancer.description || "I help startups and businesses create world-class user experiences, scalable products, and conversion-focused interfaces."}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {freelancer.skills?.slice(0, 4).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-surface border border-zinc-100 text-zinc-600 text-xs font-medium rounded-md">
              {skill}
            </span>
          ))}
          {freelancer.skills?.length > 4 && (
            <span className="px-2 py-1 bg-surface border border-zinc-100 text-zinc-500 text-xs font-medium rounded-md">
              +{freelancer.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metrics & Actions */}
      <div className="px-6 py-4 border-t border-zinc-100 bg-surface/50 mt-auto flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-black text-zinc-900">${freelancer.hourlyRate}<span className="text-sm font-medium text-zinc-500">/hr</span></div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-success bg-emerald-50 px-2 py-1 rounded-md mb-1">
              <Clock className="w-3 h-3" /> Available Now
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Responds in ~10m</div>
          </div>
        </div>
        
        {/* Hover Actions - Visible on Hover */}
        <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to={profilePath} className="flex-1 text-center py-2 bg-white border border-zinc-200 text-zinc-700 font-bold text-sm rounded-lg hover:bg-surface hover:text-zinc-900 transition-colors shadow-sm">
            View Profile
          </Link>
          <Link to={invitePath} className="flex-1 text-center py-2 bg-surface-dark text-white font-bold text-sm rounded-lg hover:bg-zinc-800 transition-colors shadow-sm">
            Invite
          </Link>
          <button className="p-2 bg-white border border-zinc-200 text-zinc-400 rounded-lg hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerCard;
