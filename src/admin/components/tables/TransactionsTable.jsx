import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from './DataTable';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Copy, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TransactionsTable = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['transactions_recent'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return [
        { id: 'TX-901842', user: { name: 'Kennedy Ochieng', email: 'ken@dev.ke' }, type: 'WITHDRAWAL', amount: 125000, status: 'SUCCESS', date: new Date().toISOString(), provider: 'M-Pesa' },
        { id: 'TX-829104', user: { name: 'Zahra Mwangi', email: 'zahra@art.ke' }, type: 'ESCROW', amount: 45000, status: 'PENDING', date: new Date().toISOString(), provider: 'Flutterwave' },
        { id: 'TX-104829', user: { name: 'Brian Koech', email: 'brian@code.ke' }, type: 'DEPOSIT', amount: 200000, status: 'SUCCESS', date: new Date().toISOString(), provider: 'Airtel Money' },
        { id: 'TX-749201', user: { name: 'Anita Kerubo', email: 'anita@design.ke' }, type: 'REFUND', amount: 12000, status: 'FAILED', date: new Date().toISOString(), provider: 'M-Pesa' },
        { id: 'TX-829105', user: { name: 'David Mutua', email: 'david@build.ke' }, type: 'WITHDRAWAL', amount: 85000, status: 'SUCCESS', date: new Date().toISOString(), provider: 'Bank Transfer' },
      ];
    }
  });

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    toast.success('Transaction ID copied!');
  };

  const columns = [
    {
      key: 'id',
      header: 'Transaction ID',
      width: '180px',
      render: (item) => (
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-zinc-400 group-hover:text-brand-600 transition-colors">
          <span>{item.id}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); copyToClipboard(item.id); }}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded opacity-0 group-hover:opacity-100 transition-all"
          >
            <Copy size={12} />
          </button>
        </div>
      )
    },
    {
      key: 'user',
      header: 'User',
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar name={item.user.name} src={item.user.avatar} size="sm" />
          <div>
            <p className="text-xs font-bold text-zinc-900 dark:text-white leading-none">{item.user.name}</p>
            <p className="text-[10px] text-zinc-500 mt-1">{item.user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <Badge variant="outline" size="sm" className="bg-surface dark:bg-surface-dark">
           {item.type}
        </Badge>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (item) => (
        <div className={"flex items-center gap-1 font-black " + (item.type === 'DEPOSIT' ? "text-success" : "text-rose-600")}>
          {item.type === 'DEPOSIT' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
          {formatCurrency(item.amount)}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge 
          variant={item.status === 'SUCCESS' ? 'success' : item.status === 'PENDING' ? 'warning' : 'danger'} 
          size="sm"
        >
          {item.status}
        </Badge>
      )
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (item) => (
        <span className="text-xs font-medium text-zinc-500">
          {formatRelativeTime(item.date)}
        </span>
      )
    }
  ];

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Recent Ledger</h3>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Real-time view of platform financial movements.</p>
        </div>
        <Button variant="secondary" size="sm">View All Ledger</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={data} 
        loading={isLoading} 
        onRowClick={(item) => toast.loading(`Opening details for ${item.id}...`, { duration: 1000 })}
      />
    </Card>
  );
};

export default TransactionsTable;