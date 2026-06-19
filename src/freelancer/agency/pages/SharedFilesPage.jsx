import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderTree, Upload, Download, Share2, ShieldCheck, Search, FileText, Image as ImageIcon, FileSpreadsheet, Archive, MoreVertical,
} from 'lucide-react';
import { useAgencySharedFiles } from '../services/agencyHooks';

const fileIcon = (type) => {
  if (type === 'image') return ImageIcon;
  if (type === 'sheet') return FileSpreadsheet;
  if (type === 'archive') return Archive;
  return FileText;
};

export default function SharedFilesPage() {
  const [path, setPath] = useState(['Agency Vault', 'Client Work', 'FinCorp']);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAgencySharedFiles({ folder: path.join('/') });
  const files = Array.isArray(data?.items) ? data.items : [
    { id: 1, name: 'brand_guidelines.pdf', type: 'document', size: '14 MB', updated: '2 hours ago', owner: 'Design Team', permission: 'Edit' },
    { id: 2, name: 'hero_mockup.png', type: 'image', size: '4 MB', updated: 'Yesterday', owner: 'UX Team', permission: 'View' },
    { id: 3, name: 'contract_scope.xlsx', type: 'sheet', size: '2 MB', updated: '3 days ago', owner: 'Operations', permission: 'Edit' },
    { id: 4, name: 'delivery_bundle.zip', type: 'archive', size: '128 MB', updated: '1 week ago', owner: 'Engineering', permission: 'View' },
  ];

  const filtered = files.filter((file) => file.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><FolderTree className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Shared files</h1>
          </div>
          <p className="text-ink-secondary">Manage folders, uploads, downloads, sharing, and file permissions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-ink-primary">New folder</button>
          <button className="rounded-xl bg-[#4C1D95] px-4 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2"><Upload className="w-4 h-4" /> Upload files</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="rounded-2xl border border-border bg-white p-5 h-fit shadow-sm">
          <h3 className="font-display font-bold text-lg text-brand-900 mb-4">Folder tree</h3>
          <div className="space-y-1">
            {['Agency Vault', 'Client Work', 'FinCorp', 'Nexis', 'Internal Docs'].map((folder, index) => (
              <button key={folder} onClick={() => setPath([folder])} className={`w-full text-left rounded-xl px-3 py-2 text-sm font-medium ${path[0] === folder ? 'bg-[#4C1D95]/10 text-[#4C1D95]' : 'text-ink-secondary hover:bg-surface-muted'}`}>
                {Array(index).fill('  ').join('')}📁 {folder}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3 md:items-center justify-between">
            <div className="text-sm text-ink-secondary overflow-x-auto whitespace-nowrap">{path.join(' / ')}</div>
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="w-full rounded-xl border border-border py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-36 rounded-2xl bg-surface-muted animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-12 text-center">
              <FileText className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
              <h3 className="font-display font-bold text-brand-900">No files found</h3>
              <p className="text-sm text-ink-secondary mt-1">Upload files or choose another folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((file) => {
                const Icon = fileIcon(file.type);
                return (
                  <motion.div key={file.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center"><Icon className="w-6 h-6" /></div>
                      <button className="rounded-lg p-2 text-ink-tertiary hover:bg-surface-muted"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                    <h3 className="font-body font-bold text-ink-primary mt-4 line-clamp-2">{file.name}</h3>
                    <p className="text-xs text-ink-secondary mt-2">{file.size} · {file.updated}</p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-surface-muted text-ink-secondary px-2.5 py-1 text-xs font-bold">{file.permission}</span>
                      <div className="flex items-center gap-1">
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><Share2 className="w-4 h-4" /></button>
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><Download className="w-4 h-4" /></button>
                        <button className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900"><ShieldCheck className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
