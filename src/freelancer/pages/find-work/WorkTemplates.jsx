import React, { useCallback, useEffect, useState } from 'react';
import { Copy, Plus, Trash2, FileCode2, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../platform/common/context/ConfirmContext';
import { extractList, workAPI } from './findWorkWorkflow';

function formatLastUsed(template) {
  if (!template.updatedAt && !template.createdAt) return 'Never';
  const date = new Date(template.updatedAt || template.createdAt);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

const WorkTemplates = () => {
  const { confirm } = useConfirm();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', categoryId: '', workMode: 'online' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await workAPI.getTemplates();
      setTemplates(extractList(response));
    } catch (err) {
      toast.error(err.message || 'Could not load templates.');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    try {
      await workAPI.createTemplate(form);
      toast.success('Template created.');
      setForm({ title: '', description: '', categoryId: '', workMode: 'online' });
      setShowForm(false);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Could not create template.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (templateId) => {
    const approved = await confirm({
      title: 'Delete template?',
      message: 'This template will be permanently removed.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!approved) return;

    setDeletingId(templateId);
    try {
      await workAPI.deleteTemplate(templateId);
      toast.success('Template deleted.');
      setTemplates((current) => current.filter((t) => t.id !== templateId));
    } catch (err) {
      toast.error(err.message || 'Could not delete template.');
    } finally {
      setDeletingId(null);
    }
  };

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

            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="px-6 py-3 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? 'Cancel' : 'Create Template'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-zinc-900 mb-4">New Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  required
                  placeholder="Template name"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="px-4 py-3 bg-surface border border-zinc-200 rounded-xl font-medium text-zinc-900"
                />
                <select
                  value={form.workMode}
                  onChange={(e) => setForm((f) => ({ ...f, workMode: e.target.value }))}
                  className="px-4 py-3 bg-surface border border-zinc-200 rounded-xl font-bold text-zinc-700 cursor-pointer"
                >
                  <option value="online">Online</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <textarea
                rows="4"
                placeholder="Job description template..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full p-4 bg-surface border border-zinc-200 rounded-xl font-medium text-zinc-900 mb-4 resize-y"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Save Template
              </button>
            </form>
          )}

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin text-[#4C1D95] mb-4" />
                <p className="font-medium">Loading templates…</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="p-12 text-center text-zinc-600 font-medium">No templates yet. Create one to speed up job posting.</div>
            ) : (
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
                  {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-surface transition-colors">
                      <td className="p-6">
                        <div className="font-bold text-zinc-900 text-lg mb-1">{template.title}</div>
                        <div className="text-xs font-medium text-zinc-500 capitalize">{template.workMode || 'online'} work</div>
                      </td>
                      <td className="p-6 hidden sm:table-cell">
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm font-medium rounded-lg border border-zinc-200">
                          {template.categoryId || 'General'}
                        </span>
                      </td>
                      <td className="p-6 hidden md:table-cell">
                        <div className="text-sm font-medium text-zinc-600">{formatLastUsed(template)}</div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link to={`/post-job?template=${template.id}`} className="px-4 py-2 bg-[#4C1D95]/5 text-[#4C1D95] hover:bg-[#4C1D95]/10 font-bold rounded-lg transition-colors text-sm flex items-center gap-2">
                            <Copy className="w-4 h-4" /> Use
                          </Link>
                          <button
                            type="button"
                            disabled={deletingId === template.id}
                            onClick={() => handleDelete(template.id)}
                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-60"
                            title="Delete template"
                          >
                            {deletingId === template.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkTemplates;


