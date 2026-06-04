import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import toast from 'react-hot-toast';
import { Inbox, MessageSquare } from 'lucide-react';

async function fetchSubmissions(type, page) {
  const response = await apiClient.get(`/settings/submissions/${type}?page=${page}`);
  return unwrapAdminResponse(response).data;
}

export default function FormSubmissionsPage() {
  const [tab, setTab] = useState('contact');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['submissions', tab, page],
    queryFn: () => fetchSubmissions(tab, page),
  });

  const markRead = useMutation({
    mutationFn: async (id) => {
      await apiClient.patch(`/settings/submissions/${tab}/${id}`, { status: 'READ' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', tab] });
      toast.success('Marked as read');
    },
  });

  const rows = data?.data || [];

  return (
    <div className="space-y-6 max-w-5xl pb-10">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-zinc-800 text-white rounded-xl">
          <Inbox size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Form submissions</h1>
          <p className="text-sm text-zinc-500">Contact form and AI chatbot inquiries from the public site.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setTab('contact'); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'contact' ? 'bg-[#2bb75c] text-white' : 'bg-zinc-100'}`}
        >
          Contact
        </button>
        <button
          type="button"
          onClick={() => { setTab('chatbot'); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${tab === 'chatbot' ? 'bg-[#2bb75c] text-white' : 'bg-zinc-100'}`}
        >
          <MessageSquare size={16} /> Chatbot
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {isLoading ? (
          <p className="p-8 text-zinc-500">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-zinc-500">No submissions yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((row) => (
              <li key={row.id} className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <div className="flex justify-between gap-4 mb-2">
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {row.name || row.email || 'Anonymous'}
                  </span>
                  <span className="text-xs text-zinc-500">{new Date(row.createdAt).toLocaleString()}</span>
                </div>
                {row.email && <p className="text-sm text-zinc-600">{row.email}</p>}
                {row.subject && <p className="text-sm font-medium text-zinc-700 mt-1">{row.subject}</p>}
                <p className="text-sm text-zinc-600 mt-2 whitespace-pre-wrap">{row.message}</p>
                {row.status === 'NEW' && (
                  <button
                    type="button"
                    onClick={() => markRead.mutate(row.id)}
                    className="mt-3 text-xs font-bold text-[#2bb75c] hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {data?.totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40">Prev</button>
          <span className="text-sm text-zinc-500 py-1">Page {page} of {data.totalPages}</span>
          <button type="button" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}

