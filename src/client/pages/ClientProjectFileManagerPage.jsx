import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, File, Image as ImageIcon, FileText, Video, 
  MoreVertical, UploadCloud, Download, Trash2, 
  Share2, Clock, Search, Grid, List as ListIcon,
  ChevronRight, Plus, PieChart, Users
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const FOLDERS = [
  { id: 1, name: 'Brand Assets', files: 12, date: 'May 12, 2026', shared: 3 },
  { id: 2, name: 'UI Mockups', files: 45, date: 'May 15, 2026', shared: 2 },
  { id: 3, name: 'Source Code', files: 128, date: 'Today', shared: 4 },
];

const FILES = [
  { id: 1, name: 'logo-final-v2.svg', type: 'image', size: '1.2 MB', date: 'May 18', uploader: 'Alex R.', version: 'v2', icon: ImageIcon, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/5' },
  { id: 2, name: 'homepage-wireframe.pdf', type: 'pdf', size: '4.5 MB', date: 'May 17', uploader: 'Sarah M.', version: 'v1', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 3, name: 'promo-animation.mp4', type: 'video', size: '24.8 MB', date: 'May 16', uploader: 'Alex R.', version: 'v3', icon: Video, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/5' },
  { id: 4, name: 'brand-guidelines.pdf', type: 'pdf', size: '8.1 MB', date: 'May 10', uploader: 'Sarah M.', version: 'v1', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export default function ClientProjectFileManagerPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-2">
                <a href="#" className="hover:text-[#4C1D95] transition-colors">Projects</a> <ChevronRight className="w-3 h-3" />
                <a href="#" className="hover:text-[#4C1D95] transition-colors">E-Commerce App</a>
              </div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Project Files</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl shadow-sm hover:bg-surface dark:hover:bg-zinc-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Folder
              </button>
              <button className="px-5 py-2 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2">
                <UploadCloud className="w-4 h-4" /> Upload
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search files and folders..." 
                className="w-full pl-10 pr-4 py-2.5 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#4C1D95]/20 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-lg transition-colors", viewMode === 'grid' ? "bg-white dark:bg-surface-dark shadow-sm text-[#4C1D95]" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white")}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={cn("p-2 rounded-lg transition-colors", viewMode === 'list' ? "bg-white dark:bg-surface-dark shadow-sm text-[#4C1D95]" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white")}>
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Files & Folders */}
        <div className="flex-1 min-w-0">
          
          {/* Folders Section */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Folders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {FOLDERS.map(folder => (
                <div key={folder.id} className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#4C1D95]/50 dark:hover:border-[#4C1D95]/50 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10 rounded-xl flex items-center justify-center">
                      <Folder className="w-5 h-5 text-[#4C1D95]" />
                    </div>
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white truncate mb-1">{folder.name}</h3>
                  <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
                    <span>{folder.files} files</span>
                    <span>{folder.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Files Section */}
          <div>
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Recent Files</h2>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {FILES.map(file => (
                  <div key={file.id} className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative">
                    <div className={cn("w-full aspect-square rounded-xl mb-4 flex items-center justify-center", file.bg)}>
                      <file.icon className={cn("w-10 h-10", file.color)} />
                    </div>
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-zinc-700 hover:text-[#4C1D95]">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm truncate mb-1" title={file.name}>{file.name}</h3>
                    <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
                      <span>{file.size}</span>
                      <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-bold">{file.version}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Size</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Uploaded By</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FILES.map(file => (
                      <tr key={file.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-surface dark:hover:bg-zinc-800/20 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", file.bg)}><file.icon className={cn("w-4 h-4", file.color)} /></div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white text-sm">{file.name}</p>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">{file.version}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">{file.size}</td>
                        <td className="px-6 py-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">{file.uploader}</td>
                        <td className="px-6 py-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">{file.date}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-zinc-400 hover:text-[#4C1D95] transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><Download className="w-4 h-4" /></button>
                            <button className="p-2 text-zinc-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Analytics & Dropzone */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* Storage Analytics */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-[#4C1D95]" /> Storage Usage
            </h3>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Circle for progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="12" fill="none" />
                  <circle cx="64" cy="64" r="56" className="stroke-#4C1D95]" strokeWidth="12" fill="none" strokeDasharray="351.8" strokeDashoffset="140.7" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-zinc-900 dark:text-white leading-none">60%</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Used</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-zinc-500">Storage Used</span>
                  <span className="font-bold text-zinc-900 dark:text-white">12.4 GB</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4C1D95] w-[60%]"></div>
                </div>
              </div>
              <p className="text-xs font-medium text-zinc-400 text-center">7.6 GB remaining of 20 GB total</p>
            </div>
          </div>

          {/* Quick Dropzone */}
          <div className="bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10 border-2 border-dashed border-[#4C1D95]/20 dark:border-[#4C1D95]/20/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#4C1D95]/10 dark:hover:bg-[#4C1D95]/20 transition-colors group">
            <div className="w-16 h-16 bg-white dark:bg-surface-dark shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:-tranzinc-y-1 transition-transform">
              <UploadCloud className="w-8 h-8 text-[#4C1D95]" />
            </div>
            <h3 className="font-bold text-[#4C1D95] dark:text-[#4C1D95] mb-1">Upload Files</h3>
            <p className="text-xs font-medium text-[#4C1D95] dark:text-[#4C1D95]">Drag & drop or click to browse</p>
          </div>

          {/* Collaboration Activity */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-zinc-400" /> Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white"><span className="font-bold">Alex R.</span> uploaded <span className="font-bold">logo-v2.svg</span></p>
                  <p className="text-xs font-medium text-zinc-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white"><span className="font-bold">Sarah M.</span> shared a folder</p>
                  <p className="text-xs font-medium text-zinc-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


