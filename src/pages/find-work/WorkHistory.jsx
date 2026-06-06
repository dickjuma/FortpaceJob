import React, { useEffect, useMemo, useState } from 'react';
import { Archive, Search, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contractAPI } from '../../common/services/api';

function extractList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

const WorkHistory = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;
    contractAPI
      .getMyContracts({ limit: 100 })
      .then((response) => {
        if (!mounted) return;
        const contracts = extractList(response).filter((contract) => {
          const status = String(contract.status || '').toUpperCase();
          return ['COMPLETED', 'CLOSED', 'CANCELLED'].includes(status);
        });
        setHistory(
          contracts.map((contract) => ({
            id: contract.id,
            title: contract.title || 'Contract',
            provider: contract.freelancerName || contract.freelancerId || 'Freelancer',
            date: contract.completedAt || contract.updatedAt || contract.createdAt,
            amount: Number(contract.totalAmount || 0),
            currency: contract.currency || 'KES',
            rating: contract.rating || null,
          }))
        );
      })
      .catch(() => {
        if (mounted) setHistory([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return history;
    return history.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.provider.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
  }, [history, search]);

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-200 text-zinc-700 rounded-xl flex items-center justify-center shadow-sm">
                <Archive className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-zinc-900">Work History</h1>
                <p className="text-zinc-600 font-medium">Access your past completed contracts and invoices.</p>
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <span className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400"><Search className="w-4 h-4" /></span>
              <input
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-[#4C1D95]/20 focus:outline-none font-medium text-sm text-zinc-900"
              />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="py-16 text-center text-zinc-500">
                <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-[#4C1D95]" />
                Loading contract history...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 font-medium">
                <Archive className="w-12 h-12 mx-auto mb-4 opacity-20" />
                No completed contracts in your history yet.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filtered.map((work) => (
                  <div key={work.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface transition-colors">
                    <div>
                      <div className="font-bold text-zinc-900 text-lg mb-1">{work.title}</div>
                      <div className="text-sm text-zinc-500 font-medium">
                        {work.provider} • {work.date ? new Date(work.date).toLocaleDateString() : '—'}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</div>
                        <div className="font-black text-success">
                          {work.currency} {work.amount.toLocaleString()}
                        </div>
                      </div>
                      <Link to={`/find-work/orders/${work.id}`} className="px-4 py-2 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4" /> View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkHistory;


