import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * Fiverr-style top category strip — main marketplace pillars.
 */
export default function CategoryNavBar({
  categories = [],
  loading = false,
  basePath = '/find-talent',
  activeSlug = null,
  onSelect,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (cat, event) => {
    if (onSelect) {
      event.preventDefault();
      onSelect(cat);
      return;
    }
    const slug = cat.slug || cat.id;
    navigate(`${basePath}?section=${encodeURIComponent(slug)}`);
  };

  const currentSection =
    activeSlug ||
    new URLSearchParams(location.search).get('section') ||
    new URLSearchParams(location.search).get('category');

  if (loading) {
    return (
      <div className="border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex gap-4 py-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 w-28 rounded-full bg-zinc-100 animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <nav className="border-b border-zinc-200 bg-white/95 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
          <Link
            to={basePath}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              !currentSection
                ? 'bg-[#2bb75c] text-white shadow-sm'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => {
            const slug = cat.slug || cat.id;
            const active = currentSection === slug || currentSection === cat.id;
            return (
              <a
                key={slug}
                href={`${basePath}?section=${encodeURIComponent(slug)}`}
                onClick={(e) => handleClick(cat, e)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition duration-200 ${
                  active
                    ? 'bg-[#2bb75c] text-white shadow-sm'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {cat.name || cat.title}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

