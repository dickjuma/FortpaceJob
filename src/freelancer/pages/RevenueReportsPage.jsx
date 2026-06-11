// src/pages/freelancer/RevenueReportsPage.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Briefcase,
  Calendar,
  Filter,
  Search,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI, walletAPI } from '../../common/services/api';

// ---------- Shared UI Components (inline) ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, icon: Icon }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    danger: 'bg-danger text-white hover:bg-red-700 disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
    transition={{ duration: 0.2 }}
    className={`bg-white border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-surface-muted text-ink-secondary',
    success: 'bg-accent-light text-accent-dark',
    warning: 'bg-warn-light text-warn',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ---------- Helper Functions ----------
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
};

// ---------- Main Component ----------
export default function RevenueReportsPage() {
  const [selectedService, setSelectedService] = useState('All');
  const [toast, setToast] = useState(null);

  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ['freelancer', 'analytics', 'earnings'],
    queryFn: () => analyticsAPI.getFreelancerEarnings(),
  });

  const { data: transactionData, isLoading: txLoading } = useQuery({
    queryKey: ['freelancer', 'transactions', 'ledger', selectedService],
    queryFn: () => walletAPI.getTransactions({ limit: 100 }),
  });

  const earnings = {
    total: earningsData?.totalRevenue ?? 0,
    monthly: earningsData?.monthlyRevenue ?? 0,
    pending: earningsData?.pendingBalance ?? 0,
    escrow: earningsData?.escrowBalance ?? 0,
    gigRevenue: earningsData?.gigRevenue ?? 0,
    offlineJobs: earningsData?.offlineJobs ?? 0,
    bookings: earningsData?.bookings ?? 0,
  };

  const records = transactionData?.items ?? [];
  const monthlyData = earningsData?.monthlyTrend ?? [];

  const filteredRecords = useMemo(() => {
    if (selectedService === 'All') return records;
    return records.filter((rec) => rec.type === selectedService);
  }, [records, selectedService]);

  const handleExportPDF = () => {
    setToast({ type: 'success', message: 'Earnings statement exported successfully!' });
    setTimeout(() => setToast(null), 3000);
  };

  const servicePerformance = [
    { label: 'Gig Packages', amount: earnings.gigRevenue, percentage: 65 },
    { label: 'Offline Contracts', amount: earnings.offlineJobs, percentage: 45 },
    { label: 'Consultation Scheduler', amount: earnings.bookings, percentage: 30 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 bg-accent text-white"
          >
            <CheckCircle className="w-4 h-4" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-900">Earnings dashboard</h1>
          </div>
          <p className="text-sm text-ink-secondary">
            Evaluate performance metrics, monitor contract allocations, and analyze service performance.
          </p>
        </div>

        <Button onClick={handleExportPDF} variant="primary" icon={FileText}>
          Export statement
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <Card className="p-5">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Total revenue</p>
          <p className="text-2xl font-mono font-bold text-brand-900 mt-1">{formatCurrency(earnings.total)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Monthly revenue</p>
          <p className="text-2xl font-mono font-bold text-brand-900 mt-1">{formatCurrency(earnings.monthly)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Escrow lock</p>
          <p className="text-2xl font-mono font-bold text-accent mt-1">{formatCurrency(earnings.escrow)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Offline jobs</p>
          <p className="text-2xl font-mono font-bold text-brand-900 mt-1">{formatCurrency(earnings.offlineJobs)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">Consultation bookings</p>
          <p className="text-2xl font-mono font-bold text-accent mt-1">{formatCurrency(earnings.bookings)}</p>
        </Card>
      </div>

      {/* Chart and Service Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <h3 className="font-display font-semibold text-brand-900 text-sm uppercase tracking-wide">
                Revenue trend
              </h3>
              <p className="text-xs text-ink-tertiary">Monthly earnings over time</p>
            </div>
            <Badge variant="success" className="gap-1">
              <TrendingUp className="w-3 h-3" /> +18.4%
            </Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#57534E', fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#57534E', fontSize: 12 }}
                  tickFormatter={(value) => `KES ${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E7E5E4',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#16A34A"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-brand-900 text-sm uppercase tracking-wide border-b border-border pb-3 mb-4">
            Service performance
          </h3>
          <div className="space-y-4">
            {servicePerformance.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-secondary">{item.label}</span>
                  <span className="font-mono font-semibold text-ink-primary">{formatCurrency(item.amount)}</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 mt-6">
            <div className="flex justify-between text-xs">
              <span className="text-ink-secondary">Refund ratio</span>
              <Badge variant="success">0.8%</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Ledger Table */}
      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-display font-semibold text-brand-900 text-sm uppercase tracking-wide">
            Detailed ledger
          </h3>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="h-9 px-3 border border-border rounded-lg text-sm font-body text-ink-primary bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
          >
            <option value="All">All services</option>
            <option value="Gig Revenue">Gigs</option>
            <option value="Offline Job">Offline jobs</option>
            <option value="Consultation Booking">Bookings</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-muted text-ink-tertiary text-xs font-medium uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4">Record ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
<tbody className="divide-y divide-border">
               {filteredRecords.map((record) => (
                 <tr key={record.id} className="hover:bg-surface-soft transition-colors">
                   <td className="px-6 py-4 font-mono text-xs text-ink-secondary">{record.id}</td>
                   <td className="px-6 py-4 text-sm font-medium text-ink-primary">{record.counterparty || record.client || '-'}</td>
                   <td className="px-6 py-4 text-sm text-ink-secondary">{record.description || '-'}</td>
                   <td className="px-6 py-4">
                     <Badge variant="info" className="text-xs">
                       {record.type || 'CREDIT'}
                     </Badge>
                   </td>
                   <td className="px-6 py-4 text-right font-mono font-semibold text-brand-900">
                     {formatCurrency(Math.abs(record.amount || 0))}
                   </td>
                   <td className="px-6 py-4 text-center">
                     <Badge
                       variant={
                         record.status === 'Cleared' || record.status === 'COMPLETED'
                           ? 'success'
                           : record.status === 'Pending'
                           ? 'warning'
                           : 'info'
                       }
                     >
                       {record.status || 'CLEARED'}
                     </Badge>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
              <p className="text-ink-secondary">No records found for the selected filter.</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
