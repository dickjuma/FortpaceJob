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
  accent = 'bg-[#effaf2] text-[#166534]',
  badge,
}) {
  const content = (
    <div className="group relative h-full overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2bb75c] via-[#4ade80] to-[#0ea5e9]" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <div>
          {badge && (
            <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-3">
              {badge}
            </span>
          )}
          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-[#0f766e] transition-colors leading-tight">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-zinc-500 mt-3 line-clamp-3">{subtitle}</p>}
        </div>
        <div className="flex items-center justify-between gap-3 mt-6">
          <span className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold ${accent}`}>
            {count != null ? `${count} ${countLabel}` : 'Explore'}
          </span>
          <ArrowRight className="w-5 h-5 text-zinc-300 transition-colors group-hover:text-[#2bb75c]" />
        </div>
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

