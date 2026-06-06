// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Table, Column } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Search, Download, Trash2, Edit } from 'lucide-react';
import { api } from '../../common/services/api';

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    api
      .get('/admin_rbc/users')
      .then((response) => {
        if (!active) return;
        const payload = response?.data ?? response;
        const loadedUsers = payload.items || payload.users || [];
        setUsers(loadedUsers);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load users.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <Avatar name={row.name} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium text-[#222222]">{row.name || row.email}</span>
            <span className="text-xs text-text-secondary">{row.email}</span>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : value === 'Suspended' ? 'error' : 'warning'}>
          {value || 'Unknown'}
        </Badge>
      ),
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value: string, row) => row.joinDate || row.createdAt || 'Unknown',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-text-secondary hover:text-[#222222] hover:bg-light-gray rounded-md transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-1.5 text-text-secondary hover:text-error hover:bg-red-50 rounded-md transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.role, user.id]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">Users Management</h1>
          <p className="text-text-secondary mt-1">Manage user accounts and permissions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={<Download size={16} />}>
            Export
          </Button>
          <Button variant="primary">Add User</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search users..."
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-0"
          />
        </div>
        {selectedUsers.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-[#222222]">{selectedUsers.length} selected</span>
            <Button variant="outline" size="sm" className="text-error border-error hover:bg-error hover:text-white">
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
          Loading users...
        </div>
      ) : (
        <Table
          data={filteredUsers}
          columns={columns}
          selectable
          selectedRows={selectedUsers}
          onRowSelect={setSelectedUsers}
          onSort={(key, dir) => console.log('Sort by', key, dir)}
          pagination={{
            total: filteredUsers.length,
            page: currentPage,
            pageSize: 10,
            onPageChange: setCurrentPage,
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;
