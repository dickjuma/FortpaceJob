import React, { useState } from 'react';
import { Copy, Plus, MoreVertical, FileCode2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_TEMPLATES = [
  { id: 1, title: 'Standard React Developer', category: 'Web Development', lastUsed: '2 weeks ago', uses: 12 },
  { id: 2, title: 'UI/UX Designer (Figma)', category: 'Design', lastUsed: '1 month ago', uses: 5 },
  { id: 3, title: 'SEO Content Writer', category: 'Marketing', lastUsed: 'Never', uses: 0 },
];

const WorkTemplates = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-success rounded-xl flex items-center justify-center shadow-sm">
                <FileCode2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-zinc-900">Job Templates</h1>
                <p className="text-zinc-600 font-medium">Save time by reusing job descriptions for recurring roles.</p>
              </div>
            </div>

            <button className="px-6 py-3 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" /> Create Template
            </button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface border-b border-zinc-200">
                <tr>
                  <th className="p-6 font-bold text-zinc-500 text-sm">Template Name</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm hidden sm:table-cell">Category</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm hidden md:table-cell">Last Used</th>
                  <th className="p-6 font-bold text-zinc-500 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {MOCK_TEMPLATES.map(template => (
                  <tr key={template.id} className="hover:bg-surface transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-zinc-900 text-lg mb-1">{template.title}</div>
                      <div className="text-xs font-medium text-zinc-500">Used {template.uses} times</div>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                      <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm font-medium rounded-lg border border-zinc-200">
                        {template.category}
                      </span>
                    </td>
                    <td className="p-6 hidden md:table-cell">
                      <div className="text-sm font-medium text-zinc-600">{template.lastUsed}</div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link to={`/post-job?template=${template.id}`} className="px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold rounded-lg transition-colors text-sm flex items-center gap-2">
                          <Copy className="w-4 h-4" /> Use
                        </Link>
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default WorkTemplates;
