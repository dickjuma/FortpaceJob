import React from 'react';
import { ShieldAlert, UserCheck, Download, Trash2, X } from 'lucide-react';
import useUserManagementStore from '../../../store/userManagementStore';
import Button from '../../../components/ui/Button';

/**
 * Animated slide-down bar for performing actions on multiple selected users.
 */
const BulkActionsBar = () => {
  const { selectedUserIds, clearSelection, openModal } = useUserManagementStore();
  const count = selectedUserIds.length;

  if (count === 0) return null;

  return (
    <div className="sticky top-20 z-40 px-4 py-3 bg-surface-dark text-white rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top duration-500 mx-4 border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={clearSelection}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
        <span className="text-sm font-black tracking-tight">
          {count} users selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10 h-9"
          leftIcon={<ShieldAlert size={16} />}
          onClick={() => openModal('BULK_SUSPEND', selectedUserIds)}
        >
          Suspend
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10 h-9"
          leftIcon={<UserCheck size={16} />}
          onClick={() => openModal('BULK_ACTIVATE', selectedUserIds)}
        >
          Activate
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10 h-9"
          leftIcon={<Download size={16} />}
          onClick={() => openModal('BULK_EXPORT', selectedUserIds)}
        >
          Export CSV
        </Button>
        <div className="w-px h-6 bg-white/20 mx-1" />
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-rose-400 hover:bg-rose-500/20 h-9"
          leftIcon={<Trash2 size={16} />}
          onClick={() => openModal('BULK_BAN', selectedUserIds)}
        >
          Ban Selected
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
