// ClientProcurementDashboardPage.jsx
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Download,
  Filter,
  Search,
  Users,
  Target,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');



export default function ClientProcurementDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vendorsData } = useQuery({
    queryKey: ['client', 'vendors'],
    queryFn: async () => {
      return [
        { id: 'V-001', name: 'Sarah Mitchell', category: 'Software Development', spend: 45200, status: 'Active', trend: 'up' },
        { id: 'V-002', name: 'Global Design LLC', category: 'Design', spend: 28450, status: 'Active', trend: 'down' },
        { id: 'V-003', name: 'Alex Rivera', category: 'Content Creation', spend: 12100, status: 'Pending Approval', trend: 'up' },
        { id: 'V-004', name: 'David Kim', category: 'Engineering', spend: 8500, status: 'Active', trend: 'neutral' }
      ];
    }
  });
  const VENDORS = vendorsData || [];

  const filteredVendors = VENDORS.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const tableRowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };
  const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    hover: {
      y: -3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body">
      {/* Sticky Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-accent" /> Procurement Dashboard
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Enterprise visibility into freelancer spending and budget allocation.
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileTap={buttonTap}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border text-ink-primary font-medium rounded-lg text-sm hover:bg-surface-soft transition-colors"
            >
              <Filter size={16} /> Filter
            </motion.button>
            <motion.button
              whileTap={buttonTap}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-medium rounded-lg text-sm hover:bg-accent-dark transition-colors shadow-sm"
            >
              <Download size={16} /> Export Report
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* YTD Spend */}
          <motion.div variants={itemVariants} whileHover={cardHover.hover} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-accent-light rounded-lg text-accent">
                <DollarSign size={20} />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-accent-dark bg-accent-light px-2 py-1 rounded-full">
                <ArrowDownRight size={12} /> 4.2%
              </span>
            </div>
            <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1">YTD Spend</p>
            <h3 className="text-3xl font-bold text-ink-primary">$248,500</h3>
            <p className="text-xs text-ink-tertiary mt-2">vs $259,400 last year</p>
          </motion.div>

          {/* Active Vendors */}
          <motion.div variants={itemVariants} whileHover={cardHover.hover} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-accent-light rounded-lg text-accent">
                <Users size={20} />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-accent-dark bg-accent-light px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> 12%
              </span>
            </div>
            <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1">Active Vendors</p>
            <h3 className="text-3xl font-bold text-ink-primary">42</h3>
            <p className="text-xs text-ink-tertiary mt-2">Freelancers & Agencies</p>
          </motion.div>

          {/* Budget Utilization */}
          <motion.div variants={itemVariants} whileHover={cardHover.hover} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-warn-light rounded-lg text-warn">
                <Target size={20} />
              </div>
              <span className="text-xs font-medium text-ink-tertiary bg-surface-muted px-2 py-1 rounded-full">On Track</span>
            </div>
            <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1">Budget Utilization</p>
            <h3 className="text-3xl font-bold text-ink-primary">68%</h3>
            <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-accent h-full w-[68%] rounded-full"></div>
            </div>
          </motion.div>

          {/* Cost Savings */}
          <motion.div variants={itemVariants} whileHover={cardHover.hover} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-danger-light rounded-lg text-danger">
                <AlertTriangle size={20} />
              </div>
            </div>
            <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-1">Cost Savings Opportunities</p>
            <h3 className="text-3xl font-bold text-ink-primary">$14,200</h3>
            <button className="text-xs font-medium text-accent hover:text-accent-dark mt-2">View Recommendations →</button>
          </motion.div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Spend Chart Mock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="font-display text-xl font-bold text-brand-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-accent" /> Spend Forecast vs Actual
                </h2>
                <select className="h-9 border border-border rounded-lg px-3 text-sm font-body bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-900">
                  <option>2026 (YTD)</option>
                  <option>2025</option>
                </select>
              </div>
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-surface-soft">
                <BarChart3 size={48} className="text-ink-tertiary mb-3" />
                <p className="text-sm font-medium text-ink-tertiary">Financial forecast chart renders here.</p>
              </div>
            </motion.div>

            {/* Vendor Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border flex flex-wrap justify-between items-center gap-4 bg-white">
                <h2 className="font-display text-xl font-bold text-brand-900">Top Vendors</h2>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 h-10 border border-border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-soft text-ink-tertiary">
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Vendor</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Category</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Spend (YTD)</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredVendors.map((vendor, idx) => (
                      <motion.tr
                        key={vendor.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-surface-soft transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-ink-primary">{vendor.name}</p>
                          <p className="text-xs font-mono text-ink-tertiary">{vendor.id}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-ink-secondary">{vendor.category}</td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-ink-primary flex items-center gap-2">
                            ${vendor.spend.toLocaleString()}
                            {vendor.trend === 'up' && <ArrowUpRight size={14} className="text-accent" />}
                            {vendor.trend === 'down' && <ArrowDownRight size={14} className="text-danger" />}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                              vendor.status === 'Active'
                                ? 'bg-accent-light text-accent-dark'
                                : 'bg-warn-light text-warn'
                            )}
                          >
                            {vendor.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredVendors.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-5 py-8 text-center text-ink-tertiary">
                          No vendors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-8">
            {/* Department Allocation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <h2 className="font-display text-xl font-bold text-brand-900 mb-5 flex items-center gap-2">
                <PieChart size={20} className="text-accent" /> Dept. Allocation
              </h2>
              <div className="flex justify-center mb-6">
                {/* Fixed pie chart using arbitrary Tailwind colors */}
                <div className="relative w-32 h-32 rounded-full border-[12px] border-surface-muted border-t-[#16A34A] border-r-[#16A34A] border-b-[#D97706]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-semibold text-ink-tertiary uppercase">Total</span>
                    <span className="text-lg font-bold text-ink-primary">$248k</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Engineering', amount: 120000, color: 'bg-[#16A34A]' },
                  { name: 'Marketing', amount: 85000, color: 'bg-[#16A34A]' },
                  { name: 'Design', amount: 43500, color: 'bg-[#D97706]' },
                ].map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded-full', dept.color)} />
                      <span className="text-sm font-medium text-ink-primary">{dept.name}</span>
                    </div>
                    <span className="text-sm font-bold text-ink-primary">${dept.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pending Approvals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-warn-light border border-warn/20 rounded-2xl p-6"
            >
              <h2 className="font-display text-xl font-bold text-warn mb-4 flex items-center gap-2">
                <AlertTriangle size={20} /> Pending Approvals
              </h2>
              <div className="space-y-3">
                <div className="bg-white border border-warn/30 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-warn">Budget Increase</span>
                    <span className="text-sm font-bold text-ink-primary">+$5,000</span>
                  </div>
                  <p className="text-sm text-ink-secondary mb-3">
                    Requested by Marketing for "Q3 Campaign Design"
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-warn text-white text-xs font-medium rounded-lg hover:bg-warn-dark transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 py-1.5 border border-border bg-white text-ink-primary text-xs font-medium rounded-lg hover:bg-surface-soft transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

