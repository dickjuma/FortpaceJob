import React, { useState } from 'react';
import { LayoutGrid, List, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSavedFolders, getSavedTalent } from './find-talent/talentMarketplaceData';

const SavedCollections = () => {
  const folders = getSavedFolders();
  const [activeFolder, setActiveFolder] = useState(folders[0]?.id || null);
  const [viewMode, setViewMode] = useState('grid');
  const savedTalent = getSavedTalent(activeFolder);
  const compareIds = savedTalent.slice(0, 4).map((talent) => talent.id).join(',');

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80">
            <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900">Saved collections</h1>
                  <p className="text-zinc-500 text-sm mt-1">Organized hiring benches for different roles.</p>
                </div>
              </div>

              <div className="space-y-3">
                {folders.map((folder) => (
                  <button
                    className={`w-full text-left rounded-2xl border px-4 py-4 transition-colors ${
                      activeFolder === folder.id ? 'border-[#14a800]/20 bg-[#14a800]/5/60' : 'border-zinc-200 bg-surface hover:bg-white'
                    }`}
                    key={folder.id}
                    onClick={() => setActiveFolder(folder.id)}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-zinc-900">{folder.name}</div>
                      <div className="text-xs font-semibold text-[#14a800]">{folder.count}</div>
                    </div>
                    <div className="text-sm text-zinc-500 mt-2">{folder.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">{folders.find((folder) => folder.id === activeFolder)?.name}</h2>
                <p className="text-zinc-500 mt-1">{savedTalent.length} saved profiles in this hiring bench</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-white border border-zinc-200 rounded-xl p-1">
                  <button className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-zinc-100 text-[#14a800]' : 'text-zinc-500'}`} onClick={() => setViewMode('grid')} type="button">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-zinc-100 text-[#14a800]' : 'text-zinc-500'}`} onClick={() => setViewMode('list')} type="button">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <Link className="px-4 py-2 bg-surface-dark hover:bg-zinc-800 text-white text-sm font-bold rounded-lg transition-colors" to={`/compare?ids=${compareIds}`}>
                  Compare top picks
                </Link>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedTalent.map((talent) => (
                  <div className="bg-white border border-zinc-200 rounded-3xl p-5 hover:border-[#14a800]/50 hover:shadow-lg transition-all" key={talent.id}>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        alt={talent.name}
                        className="w-14 h-14 rounded-full border border-zinc-200"
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=random`}
                      />
                      <div>
                        <Link className="font-bold text-zinc-900 text-lg hover:text-[#14a800] transition-colors" to={`/talent/${talent.id}`}>
                          {talent.name}
                        </Link>
                        <p className="text-sm text-zinc-500">{talent.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-zinc-900">${talent.hourlyRate}/hr</div>
                      <div className="text-sm text-amber-600 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" /> {talent.rating}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.slice(0, 4).map((skill) => (
                        <span className="px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {savedTalent.map((talent) => (
                  <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center" key={talent.id}>
                    <div className="flex-1">
                      <Link className="text-xl font-bold text-zinc-900 hover:text-[#14a800] transition-colors" to={`/talent/${talent.id}`}>
                        {talent.name}
                      </Link>
                      <div className="text-zinc-600 mt-1">{talent.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-zinc-900">${talent.hourlyRate}/hr</div>
                      <div className="text-sm text-zinc-500">{talent.availability}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SavedCollections;
