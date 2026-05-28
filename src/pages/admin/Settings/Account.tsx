// @ts-nocheck
import React from 'react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Table, Column } from '../../../components/common/Table';

export const AccountSettings = () => {
  const billingHistory = [
    { id: 'INV-001', date: '2025-05-01', amount: '$49.00', status: 'Paid' },
    { id: 'INV-002', date: '2025-04-01', amount: '$49.00', status: 'Paid' },
    { id: 'INV-003', date: '2025-03-01', amount: '$49.00', status: 'Paid' },
  ];

  const columns: Column<typeof billingHistory[0]>[] = [
    { key: 'id', label: 'Invoice' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <Badge variant="success">{value}</Badge> 
    },
    { 
      key: 'actions', 
      label: '', 
      render: () => <Button variant="ghost" size="sm" className="text-accent-red">Download</Button> 
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Account Management</h1>
        <p className="text-text-secondary mt-1">Manage your subscription, billing, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Current Subscription">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-lg font-bold text-navy">Pro Plan</h4>
              <p className="text-sm text-text-secondary">Billed monthly</p>
            </div>
            <Badge variant="info">Active</Badge>
          </div>
          <div className="text-3xl font-bold text-navy mb-6">
            $49<span className="text-lg text-text-secondary font-normal">/mo</span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">Downgrade</Button>
            <Button variant="primary">Upgrade Plan</Button>
          </div>
        </Card>

        <Card title="Security">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <p className="font-semibold text-text-primary">Two-Factor Authentication</p>
                <p className="text-sm text-text-secondary">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-semibold text-text-primary">Active Sessions</p>
                <p className="text-sm text-text-secondary">Manage connected devices</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Billing History" className="overflow-hidden">
        <div className="-mx-6 -mb-6 -mt-4">
          <Table data={billingHistory} columns={columns} />
        </div>
      </Card>
    </div>
  );
};

export default AccountSettings;
