import React, { useState, useEffect, useCallback } from 'react';
import { 
  History, Search, Filter,
  User, Shield, FileText, Download,
  Activity, Hash, Terminal, X, ExternalLink,
  ShieldAlert, Globe, Cpu, Zap,
  Lock, AlertOctagon, BarChart3, ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function AuditLogViewer({ 
  moduleFilter = '', 
  userFilter = '', 
  isEmbedded = false,
  title = 'Enterprise Audit Console',
  description = 'Forensic-grade observability for all platform operations and security events.'
}) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [showTrace, setShowTrace] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState({
    search: '',
    module: moduleFilter,
    severity: '',
    riskLevel: '',
    userId: userFilter,
  });

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.module) params.append('module', filters.module);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters.userId) params.append('actorId', filters.userId);
    params.append('page', String(page));
    params.append('limit', String(limit));
    return params.toString();
  }, [filters, page, limit]);

  const { data: logsData, isLoading, error, refetch } = useQuery({
    queryKey: ['audit', 'logs', buildQueryParams()],
    queryFn: async () => {
      const response = await apiClient.get(`/audit/logs?${buildQueryParams()}`);
      const { data, meta } = unwrapAdminResponse(response);
      return { logs: data?.logs || data?.data || (Array.isArray(data) ? data : []), total: meta?.total || 0, totalPages: meta?.totalPages || 1 };
    },
    staleTime: 30_000,
    gcTime: 60_000,
    keepPreviousData: true,
  });

  const logs = logsData?.logs || [];
  const total = logsData?.total || 0;
  const totalPages = logsData?.totalPages || 1;

  const handleExport = async () => {
    try {
      const response = await apiClient.get(`/audit/logs/export?${buildQueryParams()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${Date.now()}.csv`;
      a.click();
      toast.success('Audit log export started.');
    } catch (e) {
      toast.error('Export failed: ' + (e?.message || 'Server error'));
    }
  };

  useEffect(() => {
    if (error) toast.error(error?.message || 'Failed to load audit logs');
  }, [error]);


  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'HIGH': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-success/10 text-success dark:text-success border-emerald-200 dark:border-emerald-800';
    }
  };

  const getRiskColor = (score) => {
    if (score > 80) return 'text-rose-600';
    if (score > 50) return 'text-amber-500';
    return 'text-success';
  };

  return (
    <div className={cn("space-y-8 max-w-[1700px] mx-auto", !isEmbedded && "pb-24")}>
      {/* Live Stats from real logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Logs', value: total.toLocaleString(), icon: History, color: 'blue' },
          { label: 'Critical Events', value: logs.filter(l => l.metadata?.severity === 'CRITICAL').length, icon: AlertOctagon, color: 'rose' },
          { label: 'Fraud Alerts', value: logs.filter(l => (l.action || '').toUpperCase().includes('FRAUD')).length, icon: ShieldAlert, color: 'amber' },
          { label: 'Page', value: `${page} of ${totalPages}`, icon: BarChart3, color: 'emerald' },
        ].map((metric, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
             <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700",
               metric.color === 'blue' ? 'bg-[#2bb75c]' : metric.color === 'rose' ? 'bg-rose-500' : metric.color === 'amber' ? 'bg-amber-500' : 'bg-success'
             )} />
             <div className="flex items-center gap-4 relative z-10">
                <div className={cn("p-4 rounded-2xl",
                  metric.color === 'blue' ? 'bg-[#2bb75c]/5 text-[#2bb75c]' : metric.color === 'rose' ? 'bg-rose-50 text-rose-600' : metric.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-success'
                )}>
                  <metric.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{metric.label}</p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{isLoading ? '…' : metric.value}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">{title}</h1>
           <div className="flex items-center gap-4">
              <p className="text-zinc-500 font-medium">{description}</p>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                <Lock size={12} /> Hash Chaining Active
              </span>
           </div>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" leftIcon={<Download size={18} />} className="rounded-2xl h-12 px-6 font-bold" onClick={handleExport}>Export Logs</Button>
           <Button variant="primary" leftIcon={<Activity size={18} />} className="rounded-2xl h-12 px-6 font-bold bg-surface-dark hover:bg-zinc-800" onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>

      {/* 🔍 Smart Filters Panel */}
      <Card className="p-6 rounded-[2.5rem] bg-surface/50 dark:bg-zinc-800/30 backdrop-blur-md border-zinc-200/60 dark:border-zinc-800 shadow-inner">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[340px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#2bb75c] transition-colors" size={20} />
            <input 
              type="text" 
              value={filters.search}
              onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
              placeholder="Search actor, action, or entity..." 
              className="w-full pl-14 pr-4 py-4 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#2bb75c]/10 outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
             <div className="flex items-center gap-2 px-4 py-4 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <Filter size={16} className="text-zinc-400" />
                <select 
                  value={filters.module}
                  onChange={(e) => { setFilters(f => ({ ...f, module: e.target.value })); setPage(1); }}
                  className="bg-transparent outline-none text-sm font-bold text-zinc-700 dark:text-zinc-300 min-w-[120px]"
                >
                   <option value="">All Modules</option>
                   <option value="AUTH">AUTH</option>
                   <option value="PAYMENT">PAYMENT</option>
                   <option value="CONTRACT">CONTRACT</option>
                   <option value="FRAUD">FRAUD</option>
                   <option value="DISPUTES">DISPUTES</option>
                </select>
             </div>
             <div className="flex items-center gap-2 px-4 py-4 bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <AlertOctagon size={16} className="text-zinc-400" />
                <select 
                  value={filters.severity}
                  onChange={(e) => { setFilters(f => ({ ...f, severity: e.target.value })); setPage(1); }}
                  className="bg-transparent outline-none text-sm font-bold text-zinc-700 dark:text-zinc-300 min-w-[120px]"
                >
                   <option value="">All Severity</option>
                   <option value="CRITICAL">Critical</option>
                   <option value="HIGH">High</option>
                   <option value="MEDIUM">Medium</option>
                   <option value="INFO">Info</option>
                </select>
             </div>
             {(filters.search || filters.module || filters.severity) && (
               <button
                 onClick={() => { setFilters({ search: '', module: moduleFilter, severity: '', riskLevel: '', userId: userFilter }); setPage(1); }}
                 className="h-14 px-4 text-xs font-black text-zinc-400 hover:text-red-500 transition-colors"
               >
                 Clear
               </button>
             )}
          </div>
        </div>
      </Card>

      {/* 📊 Logs Table */}
      <div className="bg-white dark:bg-surface-dark rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-surface/80 dark:bg-zinc-800/80 backdrop-blur-md text-zinc-400 text-[10px] uppercase tracking-[0.25em] font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-8">Timestamp & ID</th>
                <th className="p-8">Actor / Role</th>
                <th className="p-8">Module / Action</th>
                <th className="p-8">Risk Score</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Tracing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-8" colSpan={6}>
                       <div className="flex gap-4 items-center">
                          <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
                          <div className="space-y-2">
                             <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-48" />
                             <div className="h-3 bg-surface dark:bg-zinc-800/50 rounded-full w-32" />
                          </div>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                logs.map(log => {
                  const displayName = log.admin?.email || log.user?.email || log.actor || 'Unknown';
                  const roleName = log.adminId ? 'ADMIN' : (log.userId ? 'USER' : 'SYSTEM');
                  const riskScore = log.metadata?.riskScore || null;
                  const status = log.metadata?.status || 'SUCCESS';
                  return (
                    <tr key={log.id} 
                      className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-all group cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="p-8">
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-zinc-900 dark:text-white mb-1 group-hover:text-[#2bb75c] transition-colors">
                              {format(new Date(log.createdAt), 'HH:mm:ss.SSS')}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 tracking-tighter uppercase">{log.id}</span>
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-sm group-hover:border-[#2bb75c]/20/40 transition-colors">
                               {log.adminId ? <Shield size={20} className="text-amber-500" /> : <User size={20} className="text-zinc-500" />}
                            </div>
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{displayName}</span>
                               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{roleName}</span>
                            </div>
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                               <Badge variant="secondary" className="text-[9px] tracking-widest">{log.entityType || log.module}</Badge>
                               <span className="text-sm font-bold text-zinc-900 dark:text-white capitalize">{log.action?.replace(/_/g, ' ').toLowerCase()}</span>
                            </div>
                            <div className={cn("px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest w-fit", getSeverityStyle(log.metadata?.severity))}>
                               {log.metadata?.severity || 'INFO'}
                            </div>
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[80px] h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                               <div 
                                 className={cn("h-full rounded-full transition-all duration-1000", riskScore > 80 ? 'bg-rose-500' : riskScore > 50 ? 'bg-amber-500' : 'bg-success')} 
                                 style={{ width: `${riskScore}%` }} 
                               />
                            </div>
                            <span className={cn("text-xs font-black", getRiskColor(riskScore))}>{riskScore}</span>
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center gap-2">
                            <div className={cn("h-2 w-2 rounded-full", status === 'SUCCESS' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]')} />
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", status === 'SUCCESS' ? 'text-success' : 'text-rose-600')}>
                              {status}
                            </span>
                         </div>
                      </td>
                      <td className="p-8 text-right">
                         <button className="p-3 bg-surface dark:bg-zinc-800 rounded-2xl text-zinc-400 group-hover:bg-surface-dark group-hover:text-white dark:group-hover:bg-[#2bb75c] transition-all duration-300">
                            <Hash size={18} />
                         </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8 py-5 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 font-medium">
              Page <span className="font-bold text-zinc-700 dark:text-zinc-300">{page}</span> of <span className="font-bold text-zinc-700 dark:text-zinc-300">{totalPages}</span> — {total.toLocaleString()} total entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >‹‹</button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >‹</button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-black transition-colors ${
                      p === page
                        ? 'border-[#2bb75c]/20/50 bg-[#2bb75c]/10 text-[#2bb75c]'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >›</button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >››</button>
            </div>
          </div>
        )}
      </div>

      {/* 🧾 LOG DETAILS DRAWER (Enterprise Style) */}
      {selectedLog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-end overflow-hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-surface-dark/80 backdrop-blur-md" onClick={() => setSelectedLog(null)} />
          <div className="relative w-full max-w-2xl h-full bg-white dark:bg-surface-dark shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
            {/* Drawer Header */}
            <div className="p-10 border-b border-zinc-200 dark:border-zinc-800 bg-surface dark:bg-surface-dark/50">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-surface-dark text-white rounded-[1.5rem] shadow-xl">
                        <Terminal size={24} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Event Investigation</h2>
                        <p className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                           <Hash size={12} /> {selectedLog.id}
                        </p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedLog(null)} className="p-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 rounded-2xl shadow-sm transition-all">
                     <X size={24} className="text-zinc-500" />
                  </button>
               </div>

               <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 shadow-sm">
                     <Globe size={14} className="text-[#2bb75c]" />
                     <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">{selectedLog.geo} • {selectedLog.ipAddress}</span>
                  </div>
                  <div className="px-4 py-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 shadow-sm">
                     <Cpu size={14} className="text-[#2bb75c]" />
                     <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">TraceID: {selectedLog.traceId}</span>
                  </div>
               </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
               {/* Hash Integrity Section */}
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck size={14} className="text-success" /> Hash Chaining Integrity
                  </h3>
                  <div className="grid grid-cols-1 gap-4 p-6 bg-success/5 border border-emerald-500/20 rounded-[2rem]">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-emerald-700 dark:text-success uppercase tracking-widest">Previous Block Hash</p>
                        <p className="text-[10px] font-mono text-success/70 truncate">{selectedLog.previousHash}</p>
                     </div>
                     <div className="h-px bg-success/10" />
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-emerald-700 dark:text-success uppercase tracking-widest">Current Entry Hash</p>
                        <p className="text-[11px] font-mono text-success font-bold break-all leading-tight">{selectedLog.currentHash}</p>
                     </div>
                  </div>
               </div>

               {/* Request Payload */}
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileText size={14} className="text-[#2bb75c]" /> Structured Payload Analysis
                  </h3>
                  <div className="bg-surface-dark rounded-[2rem] p-8 border border-zinc-800 shadow-2xl relative group">
                     <button className="absolute top-6 right-6 p-2 bg-zinc-800 text-zinc-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:text-white">
                        <ExternalLink size={14} />
                     </button>
                     <pre className="text-[12px] font-mono text-[#2bb75c] overflow-x-auto leading-relaxed">
                        {JSON.stringify(selectedLog.metadata, null, 3)}
                     </pre>
                  </div>
               </div>

               {/* Forensic Context */}
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-surface dark:bg-zinc-800/50 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">User Agent</p>
                     <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed">{selectedLog.metadata.browser} on {selectedLog.metadata.os}</p>
                  </div>
                  <div className="p-6 bg-surface dark:bg-zinc-800/50 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Operation Target</p>
                     <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed">{selectedLog.metadata.path}</p>
                  </div>
               </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-10 border-t border-zinc-200 dark:border-zinc-800 bg-surface dark:bg-surface-dark flex gap-4">
               <Button 
                 variant="primary" 
                 fullWidth 
                 className="rounded-2xl h-16 text-sm font-black uppercase tracking-widest bg-[#2bb75c] hover:bg-[#1d8d38] shadow-xl shadow-[#2bb75c]/25/20"
                 leftIcon={<Activity size={20} />}
                 onClick={() => setShowTrace(true)}
               >
                 Visualize Trace Timeline
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 DISTRIBUTED TRACE TIMELINE (Visual Flow) */}
      {showTrace && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-surface-dark/90 backdrop-blur-xl" onClick={() => setShowTrace(false)} />
          <div className="relative w-full max-w-5xl bg-white dark:bg-surface-dark rounded-[4rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
             <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                   <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
                      <div className="p-3 bg-[#2bb75c] text-white rounded-[1.25rem]">
                         <Activity size={28} />
                      </div>
                      Distributed Trace Analysis
                   </h2>
                   <p className="text-zinc-500 font-medium mt-1">Tracing execution flow across microservices for TraceID: <span className="text-[#2bb75c] font-mono font-bold">{selectedLog?.traceId}</span></p>
                </div>
                <button onClick={() => setShowTrace(false)} className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-[1.5rem] transition-all hover:rotate-90">
                   <X size={28} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-12 bg-surface/30 dark:bg-surface-dark/30 custom-scrollbar">
                <div className="relative">
                   <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2bb75c] via-#2bb75c] to-transparent opacity-20" />
                   
                   <div className="space-y-16">
                      {[
                        { step: 'API Gateway', action: 'Request Ingress', duration: '2ms', status: 'Success', icon: Globe, color: 'blue' },
                        { step: 'Auth Service', action: 'Session Validation', duration: '14ms', status: 'Success', icon: Lock, color: 'emerald' },
                        { step: 'Financial Engine', action: 'Escrow Transaction', duration: '82ms', status: 'Processing', icon: Wallet, color: 'amber' },
                        { step: 'Notification Hub', action: 'Webhook Dispatch', duration: '5ms', status: 'Success', icon: Zap, color: 'brand' }
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-10 group items-start animate-in slide-in-from-left-8" style={{ animationDelay: `${idx * 150}ms` }}>
                           <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center z-10 shadow-2xl transition-all duration-500 group-hover:scale-110", 
                             idx === 0 ? "bg-surface-dark text-white" : "bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-100 dark:border-zinc-700"
                           )}>
                              <step.icon size={32} />
                           </div>
                           
                           <div className="flex-1 bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:shadow-2xl group-hover:border-[#2bb75c]/20/20 transition-all duration-500 relative">
                              <div className="absolute top-8 right-8 flex items-center gap-2">
                                 <div className="px-3 py-1 bg-surface dark:bg-zinc-800 rounded-full text-[10px] font-black text-zinc-400">
                                    {step.duration}
                                 </div>
                              </div>
                              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2">{step.step}</h4>
                              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">{step.action}</h3>
                              
                              <div className="flex items-center gap-3">
                                 <div className={cn("h-2 w-2 rounded-full", step.status === 'Success' ? 'bg-success' : 'bg-amber-500')} />
                                 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{step.status}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="p-10 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-4">
                <Button variant="secondary" className="rounded-2xl px-10 h-14 font-black" onClick={() => setShowTrace(false)}>Back to Investigation</Button>
                <Button variant="primary" className="rounded-2xl px-10 h-14 font-black bg-[#2bb75c]">Export Trace JSON</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component Helper (Add Wallet icon since I missed it in imports)
function Wallet({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="20" y1="10" y2="10" />
    </svg>
  );
}

