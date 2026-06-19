import React from 'react';
import { FileSignature, ShieldCheck, Clock, CheckCircle2, AlertCircle, Briefcase, FileText } from 'lucide-react';
import { useNdaDocuments } from '../services/clientHooks';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4C1D95] to-[#22C55E] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{sub}</p>
    </div>
  );
}

export default function ClientNdaManagementPage() {
  const { data, isLoading, error, refetch } = useNdaDocuments({ limit: 100 });
  const items = data?.items || [];
  const pending = items.filter((item) => item.type !== 'SIGNED');
  const signed = items.filter((item) => item.type === 'SIGNED');
  const jobRequirements = items.filter((item) => item.source === 'job');

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#4C1D95] to-[#22C55E] p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  <FileSignature className="h-4 w-4" />
                  Client Workspace
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">NDA Management</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
                  Track project-level NDA requirements and contract NDA status before confidential work begins.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-gray-200 p-6 sm:grid-cols-3 sm:p-8">
            <StatCard icon={Clock} label="Pending Review" value={pending.length} sub="Requires signature or project setup" />
            <StatCard icon={CheckCircle2} label="Signed" value={signed.length} sub="NDA-backed agreements" />
            <StatCard icon={Briefcase} label="Job Requirements" value={jobRequirements.length} sub="Projects requiring NDA" />
          </div>

          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                <AlertCircle className="mb-3 h-10 w-10" />
                <p className="font-bold">Failed to load NDA data.</p>
                <button onClick={() => refetch()} className="mt-3 rounded-lg bg-[#4C1D95] px-4 py-2 text-sm font-bold text-white">Retry</button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
                <FileSignature className="mb-3 h-12 w-12 text-gray-400" />
                <h2 className="text-lg font-black text-gray-900">No NDA records found</h2>
                <p className="mt-2 max-w-md text-sm text-gray-500">Create a project or contract with an NDA requirement to start tracking it here.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Agreement</th>
                      <th className="px-5 py-4">Counterpart</th>
                      <th className="px-5 py-4">Source</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => {
                      const signedItem = item.type === 'SIGNED';
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <p className="font-bold text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.id}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FileText className="h-4 w-4" />
                              {item.counterpart || 'Freelancer'}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${item.source === 'job' ? 'bg-[#4C1D95]/10 text-[#4C1D95]' : 'bg-green-100 text-green-700'}`}>
                              {item.source === 'job' ? 'Project requirement' : 'Contract'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${signedItem ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {signedItem ? 'Signed' : item.type || item.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            {signedItem ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-500">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Stored
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-[#4C1D95]/10 px-3 py-2 text-xs font-bold text-[#4C1D95]">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Track
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
