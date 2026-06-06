// src/pages/freelancer/WorkHistoryPage.jsx
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Grid, List, Clock3, Star, ChevronDown, ChevronUp,
  X, Filter, Calendar, FileText, CheckCircle, ArrowUpRight,
  LayoutList, TrendingUp, DollarSign, Users, SlidersHorizontal
} from 'lucide-react';
import { useFreelancerOrders } from '../services/freelancerHooks';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ---------- Shared UI Components ----------
const Button = ({ children, variant = 'primary', disabled = false, className = '', onClick, type = 'button', icon: Icon }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 disabled:opacity-40',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted disabled:opacity-40',
    outline: 'border border-border text-ink-primary hover:bg-surface-muted disabled:opacity-40',
    success: 'bg-accent text-white hover:bg-accent-dark disabled:opacity-40',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
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

const Input = ({ value, onChange, placeholder, type = 'text', className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent bg-white ${className}`}
  />
);

// ---------- Work History Helpers ----------
const mapOrderToProject = (order) => {
  const clientName = order.client?.name || order.customer?.name || order.buyer?.name || order.customerName || 'Client';
  const title = order.title || order.gig?.title || order.description || `Order #${order.id}`;
  const amount = Number(order.totalAmount || order.amount || order.price || order.budget || 0);
  const date = order.createdAt || order.updatedAt || order.date || '';
  const category = order.category || order.gig?.category || 'General';
  const rating = Number(order.rating || order.review?.rating || 0);
  return {
    id: order.id,
    title,
    client: clientName,
    category,
    budget: amount,
    date,
    duration: order.deliveryDays ? `${order.deliveryDays} days` : order.duration || '',
    rating,
    skills: order.skills || order.gig?.skills || [],
    status: order.status || 'Completed',
    month: date ? new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' }) : '',
    description: order.summary || order.description || '',
    feedback: order.review?.comment || '',
    milestones: order.milestones || [],
    color: 'from-accent to-brand-900',
  };
};

const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'Writing', 'Legal'];

const CATEGORY_VARIANTS = {
  Development: 'info',
  Design: 'info',
  Marketing: 'warning',
  Writing: 'danger',
  Legal: 'default',
};

// ---------- Sub-components ----------
const StarRating = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size} className={s <= rating ? 'fill-warn text-warn' : 'text-border'} />
    ))}
  </div>
);

const EarningsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-ink-primary">{label}</p>
        <p className="text-accent font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const InvoiceModal = ({ project, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-accent to-brand-700 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-display font-bold">INVOICE</h2>
            <p className="text-accent-light text-sm mt-0.5">#{String(project.id).padStart(5, '0')}</p>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-accent-light text-xs">Billed to</p>
            <p className="font-semibold">{project.client}</p>
          </div>
          <div className="text-right">
            <p className="text-accent-light text-xs">Date</p>
            <p className="font-semibold">{new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="border-b border-border pb-4">
          <p className="text-xs text-ink-tertiary mb-1">Description</p>
          <p className="font-medium text-ink-primary">{project.title}</p>
          <p className="text-sm text-ink-secondary mt-1">Duration: {project.duration} · Category: {project.category}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-ink-secondary text-sm">Subtotal</span>
          <span className="font-medium text-ink-primary">${project.budget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-ink-secondary text-sm">Platform fee (5%)</span>
          <span className="font-medium text-ink-primary">-${(project.budget * 0.05).toFixed(0)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-border pt-3">
          <span className="font-bold text-ink-primary">Total Paid</span>
          <span className="text-xl font-mono font-bold text-accent">${(project.budget * 0.95).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-center py-2">
          <span className="border-2 border-accent text-accent font-bold text-lg px-6 py-1.5 rounded-lg rotate-[-5deg] tracking-widest">PAID</span>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="success" onClick={onClose} icon={Download}>Download PDF</Button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const ProjectCard = ({ project, onExpand, expanded, onInvoice }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.25 }}
    className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden group cursor-pointer"
  >
    <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />
    <div className="p-5" onClick={() => onExpand(project.id)}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-display font-semibold text-brand-900 text-sm leading-snug group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <Badge variant={CATEGORY_VARIANTS[project.category] || 'default'}>{project.category}</Badge>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${project.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {project.client.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <span className="text-sm text-ink-secondary">{project.client}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-ink-secondary mb-3">
        <span className="flex items-center gap-1"><DollarSign size={11} className="text-accent" />${project.budget.toLocaleString()}</span>
        <span className="flex items-center gap-1"><Calendar size={11} />{new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>
        <span className="flex items-center gap-1"><Clock3 size={11} />{project.duration}</span>
        <span className="flex items-center gap-1"><CheckCircle size={11} className="text-accent" />Completed</span>
      </div>
      <div className="mb-3"><StarRating rating={project.rating} /></div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.skills.map(skill => (
          <span key={skill} className="px-2 py-0.5 bg-surface-muted text-ink-secondary rounded-full text-xs">{skill}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={e => { e.stopPropagation(); onInvoice(project); }}
          className="text-xs text-accent hover:text-accent-dark font-medium flex items-center gap-1 hover:underline"
        >
          <Download size={12} /> Invoice
        </button>
        <button className="text-xs text-ink-tertiary flex items-center gap-1">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Details
        </button>
      </div>
    </div>
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="border-t border-border overflow-hidden"
        >
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-ink-secondary">{project.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-2">Milestones</p>
              <div className="space-y-1.5">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-accent flex-shrink-0" />
                    <span className="text-ink-secondary">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-soft rounded-xl p-3">
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-1.5">Client Feedback</p>
              <p className="text-sm text-ink-secondary italic">{project.feedback}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const ListRow = ({ project, onExpand, expanded, onInvoice, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.04 }}
    className="bg-white border-b border-border last:border-0"
  >
    <div
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-soft transition-colors cursor-pointer"
      onClick={() => onExpand(project.id)}
    >
      <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${project.color} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink-primary text-sm truncate">{project.title}</p>
        <p className="text-xs text-ink-tertiary">{project.client}</p>
      </div>
      <div className="hidden sm:block w-24 text-xs text-ink-tertiary">
        {new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
      </div>
      <div className="hidden md:block w-20"><StarRating rating={project.rating} size={11} /></div>
      <div className="hidden lg:block w-24">
        <Badge variant={CATEGORY_VARIANTS[project.category] || 'default'}>{project.category}</Badge>
      </div>
      <div className="font-mono font-semibold text-ink-primary text-sm w-20 text-right">${project.budget.toLocaleString()}</div>
      <button
        onClick={e => { e.stopPropagation(); onInvoice(project); }}
        className="p-1.5 hover:bg-surface-muted rounded-lg transition-colors ml-1"
      >
        <Download size={14} className="text-ink-tertiary hover:text-accent" />
      </button>
      {expanded ? <ChevronUp size={14} className="text-ink-tertiary flex-shrink-0" /> : <ChevronDown size={14} className="text-ink-tertiary flex-shrink-0" />}
    </div>
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border overflow-hidden"
        >
          <div className="px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-ink-secondary">{project.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-1.5">Milestones</p>
              <div className="space-y-1">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-ink-secondary">
                    <CheckCircle size={11} className="text-accent" /> {m.label}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-1.5">Client Feedback</p>
              <p className="text-sm text-ink-secondary italic">{project.feedback}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const TimelineView = ({ projects, onExpand, expandedId, onInvoice }) => {
  const grouped = useMemo(() => {
    const map = {};
    projects.forEach(p => {
      if (!map[p.month]) map[p.month] = [];
      map[p.month].push(p);
    });
    return map;
  }, [projects]);

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} className="mb-8">
          <div className="sticky top-16 z-10 flex items-center gap-3 mb-4 bg-surface-soft py-1">
            <div className="w-12 flex justify-center z-10">
              <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-white" />
            </div>
            <span className="text-sm font-semibold text-accent bg-accent-light px-3 py-1 rounded-full">{month}</span>
          </div>
          <div className="space-y-4">
            {items.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4"
              >
                <div className="w-12 flex justify-center flex-shrink-0 mt-4">
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${project.color} ring-2 ring-white`} />
                </div>
                <div className="flex-1 bg-white border border-border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`h-1 bg-gradient-to-r ${project.color}`} />
                  <div className="p-4 cursor-pointer" onClick={() => onExpand(project.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-semibold text-brand-900 text-sm">{project.title}</h3>
                        <p className="text-xs text-ink-tertiary mt-0.5">{project.client} · {new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono font-bold text-brand-900 text-sm">${project.budget.toLocaleString()}</p>
                        <StarRating rating={project.rating} size={11} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {project.skills.slice(0, 2).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-surface-muted rounded-full text-xs text-ink-tertiary">{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => { e.stopPropagation(); onInvoice(project); }}
                          className="text-xs text-accent flex items-center gap-1 hover:underline"
                        >
                          <Download size={11} /> Invoice
                        </button>
                        {expandedId === project.id ? <ChevronUp size={14} className="text-ink-tertiary" /> : <ChevronDown size={14} className="text-ink-tertiary" />}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedId === project.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          <p className="text-sm text-ink-secondary">{project.description}</p>
                          <p className="text-sm italic text-ink-tertiary">{project.feedback}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------- Main Component ----------
export default function WorkHistoryPage() {
  const { data: orderData = {} } = useFreelancerOrders({ limit: 100, status: 'COMPLETED' });
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(20000);
  const [minRating, setMinRating] = useState(0);
  const [sortCol, setSortCol] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedId, setExpandedId] = useState(null);
  const [invoiceProject, setInvoiceProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const projects = useMemo(() => {
    const items = Array.isArray(orderData)
      ? orderData
      : orderData.orders || orderData.items || [];
    return items.map(mapOrderToProject);
  }, [orderData]);

  const earningsData = useMemo(() => {
    const totals = {};
    projects.forEach(project => {
      if (!project.month) return;
      totals[project.month] = (totals[project.month] || 0) + project.budget;
    });
    return Object.entries(totals)
      .map(([month, earnings]) => ({ month, earnings }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [projects]);

  const repeatClientRate = useMemo(() => {
    const clients = projects.map(p => p.client).filter(Boolean);
    if (!clients.length) return 0;
    const unique = new Set(clients);
    return Math.round(100 * (1 - unique.size / clients.length));
  }, [projects]);

  const handleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const filtered = useMemo(() => {
    let res = projects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || p.category === category;
      const matchBudget = p.budget >= minBudget && p.budget <= maxBudget;
      const matchRating = p.rating >= minRating;
      const matchClient = p.client.toLowerCase().includes(clientSearch.toLowerCase());
      return matchSearch && matchCategory && matchBudget && matchRating && matchClient;
    });
    res = [...res].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (sortCol === 'date') { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === 'desc' ? 1 : -1;
      if (av > bv) return sortDir === 'desc' ? -1 : 1;
      return 0;
    });
    return res;
  }, [search, category, minBudget, maxBudget, minRating, sortCol, sortDir, clientSearch, projects]);

  const totalEarnings = useMemo(() => projects.reduce((s, p) => s + p.budget, 0), [projects]);
  const avgRating = useMemo(() => projects.length ? (projects.reduce((s, p) => s + p.rating, 0) / projects.length).toFixed(1) : '0.0', [projects]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronDown size={12} className="text-ink-tertiary" />;
    return sortDir === 'desc' ? <ChevronDown size={12} className="text-accent" /> : <ChevronUp size={12} className="text-accent" />;
  };

  const clearFilters = () => {
    setSearch(''); setCategory('All'); setMinBudget(0);
    setMaxBudget(20000); setMinRating(0); setClientSearch('');
  };

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-surface-soft">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-900 tracking-tight">Work History</h1>
          <p className="text-ink-secondary mt-1 text-sm">Your complete track record of completed projects</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-white border border-border rounded-xl p-1 gap-1">
            {[
              { v: 'grid', icon: Grid },
              { v: 'list', icon: LayoutList },
              { v: 'timeline', icon: Clock3 },
            ].map(({ v, icon: Icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`p-2 rounded-lg transition-all duration-200 ${view === v ? 'bg-accent text-white shadow-sm' : 'text-ink-tertiary hover:bg-surface-muted'}`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <Button variant="primary" icon={Download}>Export</Button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: projects.length.toString(), icon: FileText, color: 'text-accent', bg: 'bg-accent-light' },
          { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-accent', bg: 'bg-accent-light' },
          { label: 'Avg Rating', value: `${avgRating}★`, icon: Star, color: 'text-warn', bg: 'bg-warn-light' },
          { label: 'Repeat Clients', value: `${repeatClientRate}%`, icon: Users, color: 'text-accent', bg: 'bg-accent-light' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={cardVariants} whileHover={{ y: -3 }}
              className="bg-white rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <Icon size={20} className={stat.color} />
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-brand-900">{stat.value}</div>
                <div className="text-xs text-ink-tertiary">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Earnings Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-brand-900">Earnings Timeline</h2>
          <span className="flex items-center gap-1.5 text-xs text-accent font-medium"><TrendingUp size={13} /> Last 12 months</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={earningsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#57534E' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#57534E' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<EarningsTooltip />} />
            <Area type="monotone" dataKey="earnings" name="Earnings" stroke="#16A34A" strokeWidth={2.5}
              fill="url(#earningsGrad)" dot={{ r: 3, fill: '#16A34A', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#16A34A' }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." />
          </div>
          <button onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-accent border-accent text-white' : 'bg-white border-border text-ink-secondary hover:border-accent/50'}`}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${category === cat ? 'bg-accent text-white border-accent' : 'bg-white text-ink-secondary border-border hover:border-accent/50'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-5 bg-white border border-border rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider block mb-2">Client Name</label>
                  <Input value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Search client..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider block mb-2">
                    Min Budget: ${minBudget.toLocaleString()}
                  </label>
                  <input type="range" min={0} max={20000} step={500} value={minBudget} onChange={e => setMinBudget(Number(e.target.value))}
                    className="w-full accent-accent" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider block mb-2">
                    Max Budget: ${maxBudget.toLocaleString()}
                  </label>
                  <input type="range" min={0} max={20000} step={500} value={maxBudget} onChange={e => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-accent" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider block mb-2">Min Rating</label>
                  <div className="flex gap-1.5">
                    {[0, 3, 4, 5].map(r => (
                      <button key={r} onClick={() => setMinRating(r)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${minRating === r ? 'bg-warn text-white border-warn' : 'bg-white text-ink-secondary border-border hover:border-warn/50'}`}>
                        {r === 0 ? 'All' : `${r}+★`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button onClick={clearFilters}
                  className="text-xs text-ink-tertiary hover:text-danger flex items-center gap-1 transition-colors">
                  <X size={12} /> Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Views */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-border">
            <div className="w-24 h-24 rounded-full bg-surface-muted flex items-center justify-center mb-4">
              <Search size={36} className="text-ink-tertiary" />
            </div>
            <h3 className="text-xl font-display font-semibold text-brand-900 mb-2">No projects found</h3>
            <p className="text-ink-secondary text-sm mb-6 text-center max-w-xs">No work history matches your current filters. Try adjusting your search criteria.</p>
            <Button variant="primary" onClick={clearFilters} icon={X}>Clear filters</Button>
          </motion.div>
        ) : view === 'grid' ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project}
                onExpand={handleExpand} expanded={expandedId === project.id} onInvoice={setInvoiceProject} />
            ))}
          </motion.div>
        ) : view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-3 bg-surface-muted border-b border-border text-xs font-semibold text-ink-tertiary uppercase tracking-wider">
              <div className="w-1 flex-shrink-0 opacity-0">|</div>
              <div className="flex-1">Project</div>
              <div className="hidden sm:block w-24 cursor-pointer hover:text-ink-primary" onClick={() => handleSort('date')}>
                <span className="flex items-center gap-1">Date <SortIcon col="date" /></span>
              </div>
              <div className="hidden md:block w-20 cursor-pointer hover:text-ink-primary" onClick={() => handleSort('rating')}>
                <span className="flex items-center gap-1">Rating <SortIcon col="rating" /></span>
              </div>
              <div className="hidden lg:block w-24">Category</div>
              <div className="w-20 text-right cursor-pointer hover:text-ink-primary" onClick={() => handleSort('budget')}>
                <span className="flex items-center gap-1 justify-end">Earned <SortIcon col="budget" /></span>
              </div>
              <div className="w-8" />
            </div>
            {filtered.map((project, i) => (
              <ListRow key={project.id} project={project} index={i}
                onExpand={handleExpand} expanded={expandedId === project.id} onInvoice={setInvoiceProject} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TimelineView projects={filtered} onExpand={handleExpand} expandedId={expandedId} onInvoice={setInvoiceProject} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Modal */}
      <AnimatePresence>
        {invoiceProject && <InvoiceModal project={invoiceProject} onClose={() => setInvoiceProject(null)} />}
      </AnimatePresence>
    </div>
  );
}
