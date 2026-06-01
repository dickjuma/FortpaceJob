import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatRate(freelancer) {
  const raw = freelancer.hourlyRate ?? freelancer.rate;
  if (raw == null || raw === '') return null;
  const num = Number(String(raw).replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(num) || num <= 0) return null;
  const currency = freelancer.currency || 'KES';
  return `${currency} ${num.toLocaleString()}/hr`;
}

const FreelancerCard = ({ freelancer }) => {
  if (!freelancer?.id && !freelancer?._id) return null;

  const id = freelancer.id || freelancer._id;
  const profilePath = `/talent/${id}`;
  const name = freelancer.name || [freelancer.firstName, freelancer.lastName].filter(Boolean).join(' ') || 'Professional';
  const title = freelancer.title || freelancer.professionalTitle;
  const rateLabel = formatRate(freelancer);
  const skills = Array.isArray(freelancer.skills) ? freelancer.skills.slice(0, 3) : [];
  const rating = freelancer.rating;
  const reviews = freelancer.reviews ?? freelancer.reviewCount;
  const location = freelancer.location || freelancer.city;
  const avatar =
    freelancer.image ||
    freelancer.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=14a800&color=fff`;

  return (
    <article className="flex flex-col h-full bg-white border border-zinc-200 rounded-xl p-5 hover:border-[#14a800]/40 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3 mb-3">
        <img src={avatar} alt="" className="w-12 h-12 rounded-full object-cover border border-zinc-100 shrink-0" />
        <div className="min-w-0 flex-1">
          <Link to={profilePath} className="font-bold text-zinc-900 text-sm hover:text-[#14a800] line-clamp-1 block">
            {name}
          </Link>
          {title && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{title}</p>}
        </div>
      </div>

      {freelancer.description && (
        <p className="text-xs text-zinc-600 line-clamp-2 mb-3 flex-1">{freelancer.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-3">
        {rating != null && (
          <span className="flex items-center gap-1 font-semibold text-zinc-800">
            <Star className="w-3.5 h-3.5 text-[#14a800] fill-[#14a800]" />
            {Number(rating).toFixed(1)}
            {reviews != null && <span className="text-zinc-400 font-normal">({reviews})</span>}
          </span>
        )}
        {location && (
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            {location}
          </span>
        )}
        {freelancer.workMode && (
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-bold uppercase text-[10px]">
            {freelancer.workMode}
          </span>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {skills.map((skill) => (
            <span key={skill} className="px-2 py-0.5 bg-zinc-50 border border-zinc-100 text-zinc-600 text-[10px] font-medium rounded">
              {typeof skill === 'string' ? skill : skill?.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
        {rateLabel ? (
          <span className="text-sm font-bold text-zinc-900">{rateLabel}</span>
        ) : (
          <span className="text-xs text-zinc-400">Rate on profile</span>
        )}
        <Link
          to={profilePath}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-[#14a800] text-white text-xs font-bold rounded-lg transition-colors"
        >
          View
        </Link>
      </div>
    </article>
  );
};

export default FreelancerCard;
