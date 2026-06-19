// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card } from '../../../platform/components/common/Card';
import { Button } from '../../../platform/components/common/Button';
import { Badge } from '../../../platform/components/common/Badge';
import { Table, Column } from '../../../platform/components/common/Table';
import { api } from '../../../platform/common/services/api';

export const AccountSettings = () => {
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    api
      .get('/admin_rbc/account')
      .then(({ data }) => {
        if (!active) return;
        setAccountData(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load account settings.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const billingHistory = accountData?.billingHistory || [];

  const columns: Column<any>[] = [
    { key: 'id', label: 'Invoice' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <Badge variant={value === 'Paid' ? 'success' : 'warning'}>{value}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: () => <Button variant="ghost" size="sm" className="text-[#e63946]">Download</Button>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#222222]">Account Management</h1>
        <p className="text-text-secondary mt-1">Manage your subscription, billing, and security.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Current Subscription">
          {isLoading ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
              Loading subscription...
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-bold text-[#222222]">{accountData?.subscription?.plan || 'Pro Plan'}</h4>
                  <p className="text-sm text-text-secondary">Billed {accountData?.subscription?.interval?.toLowerCase() || 'monthly'}</p>
                </div>
                <Badge variant="info">{accountData?.subscription?.status || 'Active'}</Badge>
              </div>
              <div className="text-3xl font-bold text-[#222222] mb-6">
                {accountData?.subscription?.currency || '$'}{accountData?.subscription?.price ?? 49}
                <span className="text-lg text-text-secondary font-normal">/{accountData?.subscription?.interval?.toLowerCase() || 'mo'}</span>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">Downgrade</Button>
                <Button variant="primary">Upgrade Plan</Button>
              </div>
            </>
          )}
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
          {isLoading ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
              Loading billing history...
            </div>
          ) : (
            <Table data={billingHistory} columns={columns} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default AccountSettings;
