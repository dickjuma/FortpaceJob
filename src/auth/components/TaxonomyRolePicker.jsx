import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Loader2, Search } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { publicAPI } from '../../common/services/api';

function flattenRoles(nodes, section) {
  const out = [];
  for (const node of nodes || []) {
    if (node.isRole) {
      out.push({
        id: node.id,
        slug: node.slug,
        name: node.name,
        sectionSlug: section?.slug,
        sectionName: section?.name || section?.title,
        workMode: node.workMode || section?.workMode,
      });
    } else if (node.children?.length) {
      out.push(...flattenRoles(node.children, section));
    }
  }
  return out;
}

export default function TaxonomyRolePicker({ value, onChange }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await publicAPI.getCategoryTree();
        const tree = Array.isArray(res?.tree) ? res.tree : Array.isArray(res?.data?.tree) ? res.data.tree : [];
        if (!cancelled) {
          setSections(tree);
          if (value?.sectionSlug) {
            const match = tree.find((s) => s.slug === value.sectionSlug);
            if (match) setActiveSection(match);
          }
        }
      } catch (err) {
        console.error('[TaxonomyRolePicker]', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value?.sectionSlug]);

  const roles = useMemo(() => {
    if (!activeSection) return [];
    return flattenRoles(activeSection.children || [], activeSection);
  }, [activeSection]);

  const filteredRoles = useMemo(() => {
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(q));
  }, [roles, search]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#14a800]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Your industry</p>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.slug || section.id}
              type="button"
              onClick={() => {
                setActiveSection(section);
                setSearch('');
              }}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold border transition-colors',
                activeSection?.slug === section.slug
                  ? 'bg-[#14a800] text-white border-[#14a800]'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:border-[#14a800]'
              )}
            >
              {section.name || section.title}
            </button>
          ))}
        </div>
      </div>

      {activeSection && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your role (e.g. Electrician, UI Designer…)"
              className="w-full pl-10 pr-4 py-3 border-2 border-zinc-200 rounded-xl text-sm font-medium"
            />
          </div>
          <div className="max-h-56 overflow-y-auto grid sm:grid-cols-2 gap-2">
            {filteredRoles.map((role) => {
              const selected = value?.roleSlug === role.slug;
              return (
                <button
                  key={role.slug}
                  type="button"
                  onClick={() =>
                    onChange({
                      roleSlug: role.slug,
                      roleName: role.name,
                      sectionSlug: activeSection.slug,
                      sectionName: activeSection.name,
                      primaryCategoryId: activeSection.id,
                      workMode: role.workMode || activeSection.workMode,
                    })
                  }
                  className={cn(
                    'text-left px-3 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-between gap-2',
                    selected
                      ? 'border-[#14a800] bg-[#14a800]/5 text-[#14a800]'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-800'
                  )}
                >
                  <span className="line-clamp-2">{role.name}</span>
                  {selected && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
