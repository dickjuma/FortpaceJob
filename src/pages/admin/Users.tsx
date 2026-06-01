// @ts-nocheck
import React, { useState } from 'react';
import { Table, Column } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Search, Download, Trash2, Edit } from 'lucide-react';



const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Provider', status: 'Active', joinDate: '2025-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Client', status: 'Active', joinDate: '2025-02-20' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Provider', status: 'Suspended', joinDate: '2024-11-10' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Client', status: 'Active', joinDate: '2025-03-05' },
  { id: '5', name: 'David Brown', email: 'david@example.com', role: 'Provider', status: 'Pending', joinDate: '2025-05-20' },
];

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <Avatar name={row.name} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium text-[#222222]">{row.name}</span>
            <span className="text-xs text-text-secondary">{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : value === 'Suspended' ? 'error' : 'warning'}>
          {value}
        </Badge>
      )
    },
    { key: 'joinDate', label: 'Join Date', sortable: true },
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
      )
    }
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Button variant="primary">
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <Input 
            placeholder="Search users..." 
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-0" // override default margin
          />
        </div>
        {selectedUsers.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-[#222222]">
              {selectedUsers.length} selected
            </span>
            <Button variant="outline" size="sm" className="text-error border-error hover:bg-error hover:text-white">
              Delete Selected
            </Button>
          </div>
        )}
      </div>

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
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
};

export default UsersPage;
