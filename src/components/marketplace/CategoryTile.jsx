import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Minimal category tile — real data only (no placeholder images required).
 */
export default function CategoryTile({
  title,
  subtitle,
  count,
  countLabel = 'open',
  to,
  accent = 'bg-[#14a800]/8 text-[#14a800]',
  badge,
}) {
  const content = (
    <div className="group h-full min-h-[140px] p-5 rounded-xl border border-zinc-200 bg-white hover:border-[#14a800]/40 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 block">{badge}</span>
        )}
        <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#14a800] transition-colors leading-snug">
          {title}
        </h3>
        {subtitle && <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{subtitle}</p>}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${accent}`}>
          {count != null ? `${count} ${countLabel}` : 'Explore'}
        </span>
        <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-[#14a800] transition-colors" />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
