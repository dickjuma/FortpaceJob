import React, { useState } from 'react';
import { AlertTriangle, Search, MoreVertical, Eye, Shield, RefreshCw } from 'lucide-react';
import { useFlaggedContent } from '../../hooks/useMarketplace';
import useMarketplaceStore from '../../store/marketplaceStore';
import { resolveFlaggedContentItem } from '../../api/marketplace.api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import MarketplaceDetailModal from '../../components/marketplace/MarketplaceDetailModal';

const StatusBadge = ({ status, severity }) => {
  const severityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
      severityColors[severity] || 'bg-zinc-100 text-zinc-700'
    )}>
      <AlertTriangle size={12} />
      {status || 'Flagged'}
    </span>
  );
};

export default function FlaggedContentPage() {
  const { data: contentData, isLoading, refetch } = useFlaggedContent();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const handleAction = async (action, item) => {
    if (action === 'Approve') {
      setActioningId(item.id);
      setActionType('approve');
    } else if (action === 'Remove') {
      setActioningId(item.id);
      setActionType('remove');
    } else if (action === 'View') {
      setSelectedItem(item);
      setIsViewModalOpen(true);
    }
  };

  const confirmAction = async () => {
    if (!actioningId || !actionType) return;

    try {
      await resolveFlaggedContentItem(actioningId, {
        action: actionType === 'approve' ? 'ALLOW' : 'REMOVE',
        reason: resolutionNote,
      });
      toast.success(`Content ${actionType === 'approve' ? 'approved' : 'removed'} successfully`);
      refetch();
    } catch (error) {
      toast.error(`Failed to ${actionType} content: ${error.message}`);
    } finally {
      setActioningId(null);
      setActionType(null);
      setResolutionNote('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Flagged Content</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Review and moderate flagged jobs, gigs, and proposals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-surface dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-300 border-t-[#4C1D95] rounded-full mx-auto mb-3"></div>
            <p className="text-zinc-500">Loading flagged content...</p>
          </div>
        ) : contentData?.data?.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No flagged content found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4">Content</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Flagged By</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {contentData?.data?.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white max-w-[250px] truncate">
                          {item.title || item.name || item.id}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">ID: {item.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium capitalize">{item.type}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm max-w-[200px] truncate" title={item.reason}>
                        {item.reason || 'No reason provided'}
                      </p>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status} severity={item.severity} />
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{item.flaggedBy || item.flaggedByName || 'System'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">
                        {item.flaggedAt ? new Date(item.flaggedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAction('View', item)}
                          className="p-2 text-[#4C1D95] bg-[#4C1D95]/5 hover:bg-[#4C1D95]/10 rounded-xl transition-all"
                          title="View Content"
                        >
                          <Eye size={16} />
                        </button>
                        {actioningId === item.id && actionType ? (
                          <>
                            <input
                              type="text"
                              placeholder="Resolution note..."
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                              className="px-2 py-1 text-xs border border-zinc-300 rounded"
                              autoFocus
                            />
                            <button 
                              onClick={confirmAction}
                              className="px-3 py-1 text-xs font-medium bg-[#4C1D95] text-white rounded"
                            >
                              Confirm
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleAction('Approve', item)}
                              className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleAction('Remove', item)}
                              className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MarketplaceDetailModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedItem}
        type="content"
      />
    </div>
  );
}
