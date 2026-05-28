import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle2, AlertTriangle, MessageSquare, Download, UploadCloud, FileText, XCircle, Search } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Skeleton Loaders ---
const OrdersSkeleton = () => (
  <div className="space-y-6 animate-pulse pb-12">
    <div className="h-8 w-64 bg-light-gray rounded-md mb-2"></div>
    <div className="h-4 w-48 bg-light-gray rounded-md mb-8"></div>
    
    <div className="flex gap-4 mb-6 border-b border-border pb-2">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-6 w-24 bg-light-gray rounded-md"></div>)}
    </div>

    <div className="space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-40 bg-light-gray rounded-2xl"></div>)}
    </div>
  </div>
);

// --- Mock Data ---
const MOCK_ORDERS = [
  {
    id: 'ORD-589201',
    gigTitle: 'I will design a custom logo for your brand',
    buyer: 'Sarah Jenkins',
    amount: 'KES 25,000',
    status: 'Active',
    dueDate: 'Tomorrow, 14:00',
    progress: 80,
    requirementsMet: true,
  },
  {
    id: 'ORD-589198',
    gigTitle: 'I will write a technical blog post on AI',
    buyer: 'TechStart Inc',
    amount: 'KES 15,000',
    status: 'Revision',
    dueDate: 'Overdue by 2 hrs',
    progress: 90,
    requirementsMet: true,
  },
  {
    id: 'ORD-589150',
    gigTitle: 'I will build a React native prototype',
    buyer: 'Mobile First Agency',
    amount: 'KES 120,000',
    status: 'Delivered',
    dueDate: 'Oct 10, 2026',
    progress: 100,
    requirementsMet: true,
  },
  {
    id: 'ORD-589100',
    gigTitle: 'I will translate your English site to Swahili',
    buyer: 'Global NGO',
    amount: 'KES 40,000',
    status: 'Completed',
    dueDate: 'Sep 25, 2026',
    progress: 100,
    requirementsMet: true,
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 900));
      setOrders(MOCK_ORDERS);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    let filtered = orders;
    if (activeTab !== 'All') {
      if (activeTab === 'Active') {
        filtered = filtered.filter(o => o.status === 'Active' || o.status === 'Revision');
      } else {
        filtered = filtered.filter(o => o.status === activeTab);
      }
    }
    if (searchTerm) {
      filtered = filtered.filter(o => o.id.includes(searchTerm) || o.buyer.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered;
  };

  const handleDeliver = (id, e) => {
    e.stopPropagation();
    toast.success(`Opening delivery modal for ${id}`, { icon: '📦' });
  };

  const tabs = ['All', 'Active', 'Delivered', 'Completed', 'Cancelled'];

  if (loading && orders.length === 0) return <OrdersSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-red/10 text-accent-red rounded-xl shadow-sm border border-accent-red/20">
              <ShoppingCart size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Manage Orders</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Track your service deliveries, handle revisions, and ensure client satisfaction.
          </p>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-white p-2 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex overflow-x-auto custom-scrollbar gap-1 p-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-navy text-white shadow-sm" 
                  : "text-text-secondary hover:text-navy hover:bg-light-gray"
              )}
            >
              {tab} {tab === 'Active' && <span className="ml-1 px-1.5 py-0.5 bg-accent-red text-white rounded text-[9px]">2</span>}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64 group/search px-1 md:px-0">
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary group-focus-within/search:text-navy transition-colors" />
          <input 
            type="text" 
            placeholder="Search Order ID..." 
            className="w-full pl-9 pr-4 py-2 bg-light-gray/50 border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {getFilteredOrders().length === 0 ? (
          <Card className="text-center py-20 bg-white/50 backdrop-blur-md">
            <ShoppingCart className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-text-primary">No orders found</h3>
            <p className="text-sm text-text-secondary mt-1">There are no orders matching the current filter.</p>
          </Card>
        ) : (
          getFilteredOrders().map(order => (
            <Card key={order.id} className="p-0 overflow-hidden bg-white border-border shadow-sm hover:border-navy/50 transition-colors group">
              <div className="flex flex-col lg:flex-row">
                
                {/* Order Info */}
                <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 block">
                        {order.id}
                      </span>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-navy transition-colors">
                        {order.gigTitle}
                      </h3>
                      <p className="text-xs font-semibold text-text-secondary mt-1">
                        Buyer: <span className="text-text-primary font-bold">{order.buyer}</span>
                      </p>
                    </div>
                    <span className="text-xl font-black text-text-primary bg-light-gray/50 px-3 py-1 rounded-lg border border-border">
                      {order.amount}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1",
                      order.status === 'Active' ? 'bg-navy/10 text-navy' :
                      order.status === 'Revision' ? 'bg-accent-red/10 text-accent-red animate-pulse' :
                      order.status === 'Delivered' ? 'bg-warning/10 text-warning' :
                      order.status === 'Completed' ? 'bg-success/10 text-success' :
                      'bg-light-gray text-text-secondary'
                    )}>
                      {order.status === 'Revision' && <AlertTriangle size={12} />}
                      {order.status === 'Completed' && <CheckCircle2 size={12} />}
                      {order.status}
                    </span>
                    
                    {(order.status === 'Active' || order.status === 'Revision') && (
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 px-2.5 py-1 rounded-md border",
                        order.dueDate.includes('Overdue') ? "text-accent-red border-accent-red/20 bg-accent-red/5" : "text-text-secondary border-border"
                      )}>
                        <Clock size={12} /> {order.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="w-full lg:w-72 bg-light-gray/20 p-6 flex flex-col justify-center">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Progress</span>
                      <span className="text-[10px] font-black text-text-primary">{order.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        order.status === 'Completed' ? 'bg-success' : 
                        order.status === 'Revision' ? 'bg-accent-red' : 'bg-navy'
                      )} style={{ width: `${order.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    {(order.status === 'Active' || order.status === 'Revision') && (
                      <Button variant="primary" size="sm" className="w-full shadow-md" onClick={(e) => handleDeliver(order.id, e)}>
                        <UploadCloud size={14} className="mr-2" /> Deliver Now
                      </Button>
                    )}
                    {order.status === 'Delivered' && (
                      <Button variant="outline" size="sm" className="w-full border-warning text-warning hover:bg-warning/10" onClick={(e) => { e.stopPropagation(); toast('Buyer has 3 days to review'); }}>
                        Pending Approval
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); toast('Opening Order Requirements', { icon: '📄' }); }}>
                      View Requirements
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
