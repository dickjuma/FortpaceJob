import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Activity, RefreshCw, Filter } from 'lucide-react';
import { fetchUserActivity } from '../../api/users/users.api';
import { cn } from '../../utils/cn';

const ACTIVITY_TYPES = ['All', 'LOGIN', 'JOB_CREATED', 'GIG_CREATED', 'PROPOSAL_SUBMITTED', 'CONTRACT_SIGNED', 'PAYMENT', 'REFUND', 'SUSPENDED', 'VERIFIED'];

export default function UserActivityPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });

  const { data: activityData, isLoading, refetch } = useQuery({
    queryKey: ['users', userId, 'activity', { ...pagination, type: filter }],
    queryFn: () => fetchUserActivity(userId, { ...pagination, type: filter !== 'All' ? filter : undefined }),
    enabled: !!userId,
  });

  const filteredActivities = filter === 'All' 
    ? (activityData?.data || [])
    : (activityData?.data || []).filter(a => a.type === filter || a.action === filter);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse"></div>
        <div className="h-96 bg-zinc-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
              <Activity size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">User Activity Log</h1>
          </div>
          <p className="text-sm text-zinc-500">Activity history for user {userId}</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-surface-dark border border-zinc-200 rounded-xl text-sm"
          >
            {ACTIVITY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 shadow-sm">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <Activity size={48} className="mx-auto mb-4 text-zinc-300" />
            <p className="text-zinc-500">No activity found{filter !== 'All' ? ` for ${filter}` : ''}.</p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-800/50">
                <tr className="text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredActivities.map((activity, idx) => (
                  <tr key={activity.id || idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 text-sm">
                      {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-xs font-medium uppercase",
                        activity.type?.includes('ERROR') || activity.action?.includes('ERROR') 
                          ? "bg-red-100 text-red-700"
                          : "bg-zinc-100 text-zinc-700"
                      )}>
                        {activity.action || activity.type || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{activity.module || activity.category || 'General'}</td>
                    <td className="p-4 text-sm font-mono">{activity.ip || activity.ipAddress || 'N/A'}</td>
                    <td className="p-4 text-sm max-w-xs truncate">
                      {activity.details || activity.metadata 
                        ? JSON.stringify(activity.details || activity.metadata || {}).slice(0, 50)
                        : 'No details'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
