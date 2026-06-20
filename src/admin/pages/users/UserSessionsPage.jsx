import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Monitor, RefreshCw, Trash2, Shield } from 'lucide-react';
import { fetchUserSessions, revokeSessionApi } from '../../api/users/users.api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function UserSessionsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [revokingId, setRevokingId] = useState(null);

  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ['users', userId, 'sessions'],
    queryFn: () => fetchUserSessions(userId),
    enabled: !!userId,
  });

  const handleRevokeSession = async (sessionId) => {
    setRevokingId(sessionId);
    try {
      await revokeSessionApi(sessionId);
      toast.success('Session revoked successfully');
      refetch();
    } catch (error) {
      toast.error(`Failed to revoke session: ${error.message}`);
    } finally {
      setRevokingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse"></div>
        <div className="h-96 bg-zinc-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="p-8 text-center bg-white dark:bg-surface-dark rounded-2xl">
          <Monitor size={48} className="mx-auto mb-4 text-zinc-300" />
          <p className="text-zinc-600">No active sessions found for this user.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Monitor size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">User Sessions</h1>
          </div>
          <p className="text-sm text-zinc-500">Manage active sessions for user {userId}</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4">Session ID</th>
              <th className="p-4">Device</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Created</th>
              <th className="p-4">Last Active</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="p-4 font-mono text-xs">{session.id}</td>
                <td className="p-4">
                  <span className="text-sm">{session.device || session.userAgent || 'Unknown'}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-mono">{session.ip || session.ipAddress || 'N/A'}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm">
                    {session.createdAt ? new Date(session.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm">
                    {session.lastActive ? new Date(session.lastActive).toLocaleString() : 'N/A'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={revokingId === session.id}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                      "bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                    )}
                  >
                    {revokingId === session.id ? 'Revoking...' : 'Revoke'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
