import React from 'react';
import { 
  Download, 
  Plus
} from 'lucide-react';
import { useUsers } from '../../hooks/users/useUsers';
import UserTable from '../../components/users/table/UserTable';
import UserTableFilters from '../../components/users/table/UserTableFilters';
import TablePagination from '../../components/users/table/TablePagination';
import BulkActionsBar from '../../components/users/table/BulkActionsBar';
import Button from '../../components/ui/Button';
import { Activity } from 'lucide-react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

import useUserManagementStore from '../../store/userManagementStore';
import UserManagementModals from '../../components/users/modals/UserManagementModals';

/**
 * The primary directory view for all platform users.
 */
const AllUsersPage = () => {
  const [activeTab, setActiveTab] = React.useState('directory');
  const { data, isLoading, error } = useUsers();
  const openModal = useUserManagementStore(s => s.openModal);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">User Directory</h1>
             <span className="h-7 px-3 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-black rounded-full border border-zinc-200 dark:border-zinc-700">
               {data?.total || 0} Total
             </span>
          </div>
          <p className="text-zinc-500 font-medium mt-1">Manage and audit all account types across the Forte platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant={activeTab === 'audit' ? 'primary' : 'secondary'}
            leftIcon={<Activity size={18} />}
            onClick={() => setActiveTab(activeTab === 'directory' ? 'audit' : 'directory')}
          >
            {activeTab === 'directory' ? 'View Audit Logs' : 'Back to Directory'}
          </Button>
          <Button variant="secondary" leftIcon={<Download size={18} />}>Export Data</Button>
          <Button 
            variant="primary" 
            leftIcon={<Plus size={18} />}
            onClick={() => openModal('CREATE_ADMIN')}
          >
            Create Admin
          </Button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="AUTH,PROFILE,FRAUD" 
             title="User & Security Audit"
             description="Comprehensive trail of account creations, profile updates, and moderation actions."
           />
        </div>
      ) : (
        <>
          {/* Table Section - Full Width */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
               <UserTableFilters section="all" />
               <BulkActionsBar />
             </div>
             <div className="overflow-x-auto custom-scrollbar">
               <UserTable 
                 users={data?.data} 
                 loading={isLoading} 
                 error={error} 
                 section="all" 
               />
             </div>
             <TablePagination section="all" totalCount={data?.total || 0} />
          </div>
        </>
      )}

      {/* Admin Action Modals Overlay */}
      <UserManagementModals />
    </div>
  );
};

export default AllUsersPage;
