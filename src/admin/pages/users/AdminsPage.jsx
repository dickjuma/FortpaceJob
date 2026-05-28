import React from 'react';
import { Plus } from 'lucide-react';
import { useAdmins } from '../../hooks/users/useAdmins';
import UserTable from '../../components/users/table/UserTable';
import UserTableFilters from '../../components/users/table/UserTableFilters';
import TablePagination from '../../components/users/table/TablePagination';
import Button from '../../components/ui/Button';
import useUserManagementStore from '../../store/userManagementStore';

/**
 * Specialized directory for Administrative staff.
 */
const AdminsPage = () => {
  const { data, isLoading, error } = useAdmins();
  const openModal = useUserManagementStore(s => s.openModal);
  
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Admin Staff</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage internal access, audit governance actions, and assign roles.</p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus size={18} />}
          onClick={() => openModal('CREATE_ADMIN')}
        >
          Add New Admin
        </Button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
           <UserTableFilters section="admins" />
         </div>
         <div className="overflow-x-auto custom-scrollbar">
           <UserTable users={data?.data} loading={isLoading} error={error} section="admins" />
         </div>
         <TablePagination section="admins" totalCount={data?.total || 0} />
      </div>
    </div>
  );
};

export default AdminsPage;
