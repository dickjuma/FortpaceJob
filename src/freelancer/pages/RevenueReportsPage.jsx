import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Filter, Search, BarChart3, TrendingUp, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Award, Clock, DollarSign, Users, Briefcase
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Customized Reusable Area Chart using SVG ---
const DynamicRevenueAreaChart = () => (
  <div className="h-56 w-full relative pt-4 flex flex-col justify-between">
    <div className="flex-1 w-full flex items-end gap-2 px-2">
      {[45, 60, 50, 75, 90, 85, 110, 95, 120, 135, 115, 140].map((val, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end">
          <div 
            className="w-full bg-success/20 group-hover:bg-success rounded-t-lg transition-all duration-300 relative"
            style={{ height: `${(val / 150) * 100}%` }}
          >
            <div className="absolute -top-8 left-1/2 -tranzinc-x-1/2 bg-navy text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow z-30 pointer-events-none">
              KES {val * 1000}
            </div>
          </div>
          <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">M{idx + 1}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function RevenueReportsPage() {
  const [selectedService, setSelectedService] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All');
  const [dateRange, setDateRange] = useState('This Year');

  const earnings = {
    total: 1620000,
    monthly: 145000,
    pending: 45000,
    escrow: 125000,
    gigRevenue: 850000,
    offlineJobs: 420000,
    bookings: 350000
  };

  const records = [
    { id: 'REC-901', client: 'Global Finance Corp', service: 'Fullstack App', amount: 150000, type: 'Gig Revenue', status: 'Cleared', date: 'May 20, 2026' },
    { id: 'REC-902', client: 'Symmetric Telecom', service: 'Fibre Inspection', amount: 45000, type: 'Offline Job', status: 'Pending', date: 'May 18, 2026' },
    { id: 'REC-903', client: 'Nexus Tech Solutions', service: 'Video Consultation', amount: 80000, type: 'Consultation Booking', status: 'Escrow Lock', date: 'May 12, 2026' },
    { id: 'REC-904', client: 'Apex Labs Inc', service: 'UI Redesign Contract', amount: 120000, type: 'Gig Revenue', status: 'Cleared', date: 'May 01, 2026' }
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      const serviceMatch = selectedService === 'All' || rec.type === selectedService;
      const clientMatch = selectedClient === 'All' || rec.client === selectedClient;
      return serviceMatch && clientMatch;
    });
  }, [selectedService, selectedClient]);

  const handleExportPDF = () => {
    toast.success('Procurement Earnings PDF statement exported successfully!', { icon: '📄' });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-success/15 text-success rounded-xl border border-success/20 shadow-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Earnings Dashboard</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 font-semibold">
            Evaluate performance metrics, monitor contract allocations, and analyze service performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleExportPDF}
            variant="primary" 
            className="bg-accent-purple hover:bg-accent-purple/95 font-bold text-xs rounded-xl"
            icon={<FileText size={14} />}
          >
            Export Procurement PDF
          </Button>
        </div>
      </div>

      {/* KPI metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <Card className="p-5 border border-border bg-white shadow-sm">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-black text-text-primary mt-1">KES {earnings.total.toLocaleString()}</h3>
        </Card>
        
        <Card className="p-5 border border-border bg-white shadow-sm">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Monthly Revenue</p>
          <h3 className="text-2xl font-black text-text-primary mt-1">KES {earnings.monthly.toLocaleString()}</h3>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Escrow Lock</p>
          <h3 className="text-2xl font-black text-accent-purple mt-1">KES {earnings.escrow.toLocaleString()}</h3>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Offline Jobs</p>
          <h3 className="text-2xl font-black text-text-primary mt-1">KES {earnings.offlineJobs.toLocaleString()}</h3>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Consultation Booking</p>
          <h3 className="text-2xl font-black text-success mt-1">KES {earnings.bookings.toLocaleString()}</h3>
        </Card>
      </div>

      {/* Main Grid: Graph and top contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="p-6 border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div>
                <h3 className="font-black text-text-primary text-sm uppercase tracking-wider">Net Income Growth Chart</h3>
                <p className="text-[10px] font-semibold text-text-secondary">Yearly historical earnings representation</p>
              </div>
              <span className="text-xs font-black text-success flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4%
              </span>
            </div>
            <DynamicRevenueAreaChart />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 border border-border bg-white shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3 mb-4">
                Service Performance
              </h3>
              <div className="space-y-4 text-xs font-bold text-text-secondary">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Gig Packages</span>
                    <span className="text-text-primary">KES {earnings.gigRevenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-light-gray rounded-full overflow-hidden">
                    <div className="h-full bg-accent-purple rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Offline Contracts</span>
                    <span className="text-text-primary">KES {earnings.offlineJobs.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-light-gray rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Consultation Scheduler</span>
                    <span className="text-text-primary">KES {earnings.bookings.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-light-gray rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-6">
              <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                <span>Refund Ratio</span>
                <span className="text-success">0.8% Passed</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filter and Breakdown section */}
      <Card className="p-6 border border-border bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
          <h3 className="font-black text-text-primary text-sm uppercase tracking-wider">
            Detailed Ledger Records
          </h3>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="text-xs font-bold text-text-primary border border-border bg-light-gray rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-accent-purple"
            >
              <option value="All">All Services</option>
              <option value="Gig Revenue">Gigs</option>
              <option value="Offline Job">Offline Jobs</option>
              <option value="Consultation Booking">Bookings</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-light-gray/50 border-b border-border text-text-secondary text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Record ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4 text-right">Net Value</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-light-gray/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-text-secondary uppercase">{rec.id}</td>
                  <td className="px-6 py-5 font-bold text-text-primary">{rec.client}</td>
                  <td className="px-6 py-5 font-semibold text-text-secondary">{rec.service}</td>
                  <td className="px-6 py-5 font-black text-accent-purple uppercase tracking-wider text-[9px]">{rec.type}</td>
                  <td className="px-6 py-5 text-right font-black text-text-primary">KES {rec.amount.toLocaleString()}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                      rec.status === 'Cleared' ? "bg-success/10 text-success border-success/20" :
                      rec.status === 'Pending' ? "bg-warning/10 text-warning border-warning/20" :
                      "bg-accent-purple/10 text-accent-purple border-accent-purple/20"
                    )}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
