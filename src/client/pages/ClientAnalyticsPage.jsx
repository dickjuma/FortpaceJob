import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Download, Calendar, Lightbulb,
  Filter, X, ChevronDown, ChevronUp, ArrowUpRight, BarChart2,
  DollarSign, Clock, FileText, Star, Users, CheckCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const spendingData7 = [
  { label: 'Mon', budget: 4000, actual: 3200 },
  { label: 'Tue', budget: 4500, actual: 4100 },
  { label: 'Wed', budget: 3800, actual: 3600 },
  { label: 'Thu', budget: 5000, actual: 4800 },
  { label: 'Fri', budget: 4200, actual: 3900 },
  { label: 'Sat', budget: 2000, actual: 1800 },
  { label: 'Sun', budget: 1500, actual: 1200 },
];
const spendingData30 = Array.from({ length: 10 }, (_, i) => ({
  label: `W${i + 1}`,
  budget: 10000 + Math.random() * 5000,
  actual: 8000 + Math.random() * 5000,
}));
const spendingData90 = Array.from({ length: 9 }, (_, i) => ({
  label: `M${i + 1}`,
  budget: 30000 + Math.random() * 15000,
  actual: 25000 + Math.random() * 15000,
}));

const freelancers = [
  { name: 'Alex Morgan', project: 'E-Commerce Redesign', onTime: 98, quality: 96, repeat: true, spend: 8400 },
  { name: 'Sarah Chen', project: 'Mobile App Dev', onTime: 92, quality: 94, repeat: true, spend: 12000 },
  { name: 'James Okafor', project: 'SEO Campaign', onTime: 85, quality: 88, repeat: false, spend: 3200 },
  { name: 'Priya Sharma', project: 'Brand Identity', onTime: 100, quality: 99, repeat: true, spend: 6800 },
  { name: 'Luke Petersen', project: 'Legal Docs Review', onTime: 78, quality: 82, repeat: false, spend: 2100 },
];

const categoryData = [
  { name: 'Development', value: 40, color: '#2563eb' },
  { name: 'Design', value: 25, color: '#7c3aed' },
  { name: 'Writing', value: 15, color: '#059669' },
  { name: 'Marketing', value: 12, color: '#d97706' },
  { name: 'Other', value: 8, color: '#6b7280' },
];

const funnelStages = [
  { label: 'Jobs Posted', count: 24, color: '#2563eb' },
  { label: 'Proposals', count: 186, color: '#3b82f6' },
  { label: 'Shortlisted', count: 42, color: '#60a5fa' },
  { label: 'Interviews', count: 18, color: '#93c5fd' },
  { label: 'Hired', count: 8, color: '#bfdbfe' },
];

const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Legal', 'Finance'];

const insightCards = [
  { icon: Lightbulb, text: 'You hire 40% faster than average clients', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { icon: Star, text: 'Design projects have the highest ROI at 420%', color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
  { icon: Users, text: 'Consider expanding to 3 new freelancers this quarter', color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-900/20' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const generateHeatmap = () =>
  DAYS.map((day, di) =>
    HOURS.map((hour, hi) => {
      let base = Math.random() * 0.3;
      if (di === 2 && hi >= 14 && hi <= 16) base = 0.85 + Math.random() * 0.15;
      else if (di >= 1 && di <= 4 && hi >= 9 && hi <= 17) base += 0.4;
      return Math.min(1, base);
    })
  );

const heatmapData = generateHeatmap();

const kpiCards = [
  { label: 'Hiring Success Rate', value: '78%', trend: 12, up: true, icon: CheckCircle, color: 'text-green-500', sparkData: [60, 65, 70, 72, 74, 76, 78] },
  { label: 'Avg Project Cost', value: '$3,240', trend: 5, up: false, icon: DollarSign, color: 'text-brand-600', sparkData: [3600, 3500, 3400, 3350, 3300, 3260, 3240] },
  { label: 'Time-to-Hire', value: '2.4 days', trend: 18, up: true, icon: Clock, color: 'text-brand-500', sparkData: [4.1, 3.8, 3.5, 3.1, 2.9, 2.6, 2.4] },
  { label: 'Active Contracts', value: '7', trend: 2, up: true, icon: FileText, color: 'text-amber-500', sparkData: [3, 4, 5, 5, 6, 6, 7] },
  { label: 'Total Spend', value: '$84,200', trend: 8, up: true, icon: BarChart2, color: 'text-rose-500', sparkData: [60000, 65000, 70000, 74000, 78000, 81000, 84200] },
  { label: 'ROI Score', value: '340%', trend: 22, up: true, icon: TrendingUp, color: 'text-success', sparkData: [220, 250, 275, 295, 310, 328, 340] },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
const SparkLine = ({ data }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="w-2 rounded-sm bg-brand-600/30 transition-all duration-300"
          style={{ height: `${((v - min) / range) * 100}%`, minHeight: 4 }}
        />
      ))}
    </div>
  );
};

const ProgressBar = ({ value, color = 'bg-brand-600' }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{value}%</span>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: ${Number(p.value).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
        <p className="text-gray-600 dark:text-gray-300">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ClientAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30');
  const [activeDept, setActiveDept] = useState('All');
  const [sortCol, setSortCol] = useState('spend');
  const [sortDir, setSortDir] = useState('desc');
  const [activePie, setActivePie] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('CSV');

  const spendingDataMap = { '7': spendingData7, '30': spendingData30, '90': spendingData90 };
  const chartData = spendingDataMap[dateRange] || spendingData30;

  const sortedFreelancers = useMemo(() => {
    return [...freelancers].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'boolean') return sortDir === 'desc' ? (bv ? 1 : -1) : (av ? -1 : 1);
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronDown size={12} className="text-gray-300" />;
    return sortDir === 'desc'
      ? <ChevronDown size={12} className="text-brand-600" />
      : <ChevronUp size={12} className="text-brand-600" />;
  };

  const heatIntensity = (v) => {
    if (v < 0.15) return 'bg-gray-100 dark:bg-gray-800';
    if (v < 0.35) return 'bg-brand-100 dark:bg-brand-900/40';
    if (v < 0.55) return 'bg-brand-300 dark:bg-brand-700/50';
    if (v < 0.75) return 'bg-brand-500 dark:bg-brand-600';
    return 'bg-brand-700 dark:bg-brand-400';
  };

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans min-h-screen bg-surface dark:bg-gray-950">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Hiring Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Track your hiring performance and spending trends</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range pills */}
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 gap-1">
            {[{ label: '7D', value: '7' }, { label: '30D', value: '30' }, { label: '90D', value: '90' }, { label: 'Custom', value: 'custom' }].map(opt => (
              <button key={opt.value}
                onClick={() => setDateRange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${dateRange === opt.value ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {opt.label}
              </button>
            ))}
          </div>
          {/* Export button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(v => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Download size={15} /> Export <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  {['CSV', 'PDF'].map(fmt => (
                    <button key={fmt} onClick={() => { setExportFormat(fmt); setShowExportMenu(false); setShowExportModal(true); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-700 flex items-center gap-2">
                      <FileText size={14} /> {fmt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Department Filters ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 flex-wrap mb-8">
        <Filter size={16} className="text-gray-400 self-center" />
        {departments.map(dep => (
          <button key={dep} onClick={() => setActiveDept(dep)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${activeDept === dep ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-400'}`}>
            {dep}
          </button>
        ))}
      </motion.div>

      {/* ── KPI Cards ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}
              whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 flex flex-col gap-2 cursor-default">
              <div className="flex items-center justify-between">
                <Icon size={18} className={card.color} />
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${card.up ? 'text-green-500' : 'text-red-500'}`}>
                  {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {card.trend}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{card.label}</div>
              <SparkLine data={card.sparkData} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Spending Over Time ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Over Time</h2>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-brand-600 inline-block" /> Budget</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-brand-500 inline-block" /> Actual</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="budget" name="Budget" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="actual" name="Actual Spend" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── 2-column: Pie + Funnel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Category Spend Breakdown */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Spend Breakdown</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width={220} height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={(_, idx) => setActivePie(activePie === idx ? null : idx)}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color}
                      opacity={activePie === null || activePie === index ? 1 : 0.4}
                      stroke={activePie === index ? '#fff' : 'none'}
                      strokeWidth={activePie === index ? 2 : 0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {categoryData.map((cat, i) => (
                <button key={cat.name} onClick={() => setActivePie(activePie === i ? null : i)}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all text-sm text-left w-full ${activePie === i ? 'bg-surface dark:bg-gray-800' : 'hover:bg-surface dark:hover:bg-gray-800/50'}`}>
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="flex-1 text-gray-700 dark:text-gray-300">{cat.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{cat.value}%</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hiring Funnel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hiring Funnel</h2>
          <div className="flex flex-col gap-3">
            {funnelStages.map((stage, i) => {
              const pct = Math.round((stage.count / funnelStages[0].count) * 100);
              const conv = i > 0 ? Math.round((stage.count / funnelStages[i - 1].count) * 100) : 100;
              return (
                <div key={stage.label} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-gray-600 dark:text-gray-400 text-right">{stage.label}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{ backgroundColor: stage.color }}>
                        <span className="text-xs font-bold text-white">{stage.count}</span>
                      </motion.div>
                    </div>
                    {i > 0 && (
                      <span className="text-xs text-gray-400 w-10 text-right">{conv}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">Overall conversion: <span className="font-semibold text-brand-600">{Math.round((8 / 24) * 100)}%</span> of posted jobs result in a hire</p>
        </motion.div>
      </div>

      {/* ── Freelancer Performance Table ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Freelancer Performance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Based on completed contracts in selected period</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                <th className="text-left px-6 py-3 font-medium">Freelancer</th>
                <th className="text-left px-4 py-3 font-medium">Project</th>
                {[
                  { key: 'onTime', label: 'On-Time Rate' },
                  { key: 'quality', label: 'Quality Score' },
                  { key: 'repeat', label: 'Repeat Hire' },
                  { key: 'spend', label: 'Spend' },
                ].map(col => (
                  <th key={col.key} className="px-4 py-3 font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() => handleSort(col.key)}>
                    <div className="flex items-center gap-1">{col.label} <SortIcon col={col.key} /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {sortedFreelancers.map((f, i) => (
                <motion.tr key={f.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                  className="hover:bg-surface dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {f.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{f.project}</td>
                  <td className="px-4 py-3 w-40"><ProgressBar value={f.onTime} color="bg-green-500" /></td>
                  <td className="px-4 py-3 w-40"><ProgressBar value={f.quality} color="bg-brand-600" /></td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${f.repeat ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                      {f.repeat ? '✓ Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">${f.spend.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Heatmap ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hiring Activity Heatmap</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Activity by day of week and hour of day</p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full text-xs font-medium">
            <ArrowUpRight size={12} /> Most active: Tuesday 2–4 PM
          </span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="flex gap-0.5 mb-1 ml-10">
              {HOURS.filter((_, i) => i % 3 === 0).map(h => (
                <div key={h} className="w-[calc((100%-2.5rem)/8)] text-center text-xs text-gray-400" style={{ width: 24 * 3 + 2 }}>{h}</div>
              ))}
            </div>
            {DAYS.map((day, di) => (
              <div key={day} className="flex items-center gap-0.5 mb-0.5">
                <div className="w-10 text-right text-xs text-gray-400 pr-2">{day}</div>
                {HOURS.map((_, hi) => (
                  <div key={hi} title={`${day} ${hi}:00 — intensity ${Math.round(heatmapData[di][hi] * 100)}%`}
                    className={`w-5 h-5 rounded-sm transition-all duration-200 hover:ring-2 hover:ring-brand-400 hover:scale-110 ${heatIntensity(heatmapData[di][hi])}`} />
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3 ml-10">
              <span className="text-xs text-gray-400">Low</span>
              {['bg-gray-100 dark:bg-gray-800', 'bg-brand-100 dark:bg-brand-900/40', 'bg-brand-300 dark:bg-brand-700/50', 'bg-brand-500', 'bg-brand-700 dark:bg-brand-400'].map((cls, i) => (
                <div key={i} className={`w-5 h-5 rounded-sm ${cls}`} />
              ))}
              <span className="text-xs text-gray-400">High</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── AI Insight Cards ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {insightCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
              className={`${card.bg} rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-start gap-3 cursor-default`}>
              <div className={`mt-0.5 ${card.color}`}><Icon size={20} /></div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">{card.text}</p>
                <p className="text-xs text-gray-400 mt-1">AI Insight</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Export Modal ── */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowExportModal(false); }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Analytics</h3>
                <button onClick={() => setShowExportModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-surface dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={18} className="text-brand-600" />
                    <span className="font-medium text-gray-900 dark:text-white">Export as {exportFormat}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date range: {dateRange === '7' ? 'Last 7 Days' : dateRange === '30' ? 'Last 30 Days' : dateRange === '90' ? 'Last 90 Days' : 'Custom Range'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Department: {activeDept}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowExportModal(false)}
                    className="py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => setShowExportModal(false)}
                    className="py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Download size={15} /> Download {exportFormat}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
