import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Grid, List, Clock3, Star, ChevronDown, ChevronUp,
  X, Filter, Calendar, FileText, CheckCircle, Circle, ArrowUpRight,
  LayoutList, TrendingUp, DollarSign, Users, SlidersHorizontal
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1, title: 'E-Commerce Platform Redesign', client: 'TechNova Inc.', category: 'Design',
    budget: 8400, date: '2024-11-15', duration: '6 weeks', rating: 5, ratingBreakdown: { communication: 5, quality: 5, timeliness: 5 },
    skills: ['Figma', 'UX Research', 'Prototyping'], status: 'Completed', month: 'November 2024',
    description: 'Complete redesign of TechNova\'s e-commerce platform including user research, wireframing, high-fidelity prototypes, and design system creation.',
    milestones: [
      { label: 'UX Research & Audit', done: true },
      { label: 'Wireframes (50 screens)', done: true },
      { label: 'High-fidelity Prototypes', done: true },
      { label: 'Design System Handoff', done: true },
    ],
    feedback: '"Priya delivered exceptional work. The new design increased our conversion rate by 32%. Highly recommend!"',
    color: 'from-[#14a800] to-pink-500',
  },
  {
    id: 2, title: 'Mobile App Development (iOS)', client: 'HealthTrack', category: 'Development',
    budget: 12000, date: '2024-10-30', duration: '10 weeks', rating: 5, ratingBreakdown: { communication: 5, quality: 5, timeliness: 4 },
    skills: ['Swift', 'SwiftUI', 'REST APIs', 'CoreData'], status: 'Completed', month: 'October 2024',
    description: 'Built a full-featured iOS health tracking app with real-time metrics, Apple Health integration, and custom charting library.',
    milestones: [
      { label: 'Architecture & Setup', done: true },
      { label: 'Core Features (MVP)', done: true },
      { label: 'Apple Health Integration', done: true },
      { label: 'App Store Submission', done: true },
    ],
    feedback: '"Outstanding iOS developer. The app launched on time and has 4.8 stars on the App Store. Will hire again."',
    color: 'from-#14a800] to-cyan-500',
  },
  {
    id: 3, title: 'SEO Content Campaign', client: 'GrowthPulse', category: 'Marketing',
    budget: 3200, date: '2024-10-05', duration: '4 weeks', rating: 4, ratingBreakdown: { communication: 4, quality: 4, timeliness: 4 },
    skills: ['SEO', 'Content Strategy', 'Keyword Research'], status: 'Completed', month: 'October 2024',
    description: '20-article SEO content campaign targeting high-value keywords in the SaaS marketing space. Included keyword research and competitor analysis.',
    milestones: [
      { label: 'Keyword & Competitor Research', done: true },
      { label: 'Content Calendar (20 articles)', done: true },
      { label: 'Article Writing & Editing', done: true },
      { label: 'Performance Report', done: true },
    ],
    feedback: '"Solid research and clear writing. Organic traffic up 28% after 3 months. Would work with again."',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4, title: 'Brand Identity & Logo Design', client: 'Maple Ventures', category: 'Design',
    budget: 4500, date: '2024-09-20', duration: '3 weeks', rating: 5, ratingBreakdown: { communication: 5, quality: 5, timeliness: 5 },
    skills: ['Adobe Illustrator', 'Brand Strategy', 'Typography'], status: 'Completed', month: 'September 2024',
    description: 'Comprehensive brand identity system including logo variants, color palette, typography, brand guidelines document, and social media kit.',
    milestones: [
      { label: 'Brand Discovery Workshop', done: true },
      { label: 'Logo Concepts (3 directions)', done: true },
      { label: 'Final Logo & Variants', done: true },
      { label: 'Brand Guidelines PDF', done: true },
    ],
    feedback: '"The brand identity exceeded all expectations. Our team loves the new look. Incredibly talented designer!"',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 5, title: 'React Dashboard Development', client: 'DataSync AI', category: 'Development',
    budget: 9800, date: '2024-09-01', duration: '7 weeks', rating: 5, ratingBreakdown: { communication: 5, quality: 5, timeliness: 5 },
    skills: ['React', 'TypeScript', 'Recharts', 'TailwindCSS'], status: 'Completed', month: 'September 2024',
    description: 'Built a complex analytics dashboard for an AI data platform with real-time charts, WebSocket integration, and a fully responsive layout.',
    milestones: [
      { label: 'Component Architecture', done: true },
      { label: 'Chart Integrations (12 charts)', done: true },
      { label: 'WebSocket Real-time Layer', done: true },
      { label: 'QA & Launch', done: true },
    ],
    feedback: '"One of the best developers I\'ve worked with. Clean code, great communication, delivered ahead of schedule."',
    color: 'from-[#14a800] to-#14a800]',
  },
  {
    id: 6, title: 'Legal Document Review', client: 'LegalEase Corp.', category: 'Legal',
    budget: 2100, date: '2024-08-14', duration: '2 weeks', rating: 4, ratingBreakdown: { communication: 4, quality: 5, timeliness: 3 },
    skills: ['Contract Law', 'NDA Review', 'IP Law'], status: 'Completed', month: 'August 2024',
    description: 'Review and annotation of 15 SaaS customer agreements, 3 partnership NDAs, and 2 IP assignment documents.',
    milestones: [
      { label: 'Initial Document Intake', done: true },
      { label: 'Customer Agreements Review', done: true },
      { label: 'NDA & IP Review', done: true },
      { label: 'Risk Summary Report', done: true },
    ],
    feedback: '"Thorough and knowledgeable. Found several risk clauses we had missed. Good value for the price."',
    color: 'from-zinc-500 to-gray-500',
  },
  {
    id: 7, title: 'Copywriting for SaaS Landing Pages', client: 'Launchpad Studio', category: 'Writing',
    budget: 1800, date: '2024-07-29', duration: '2 weeks', rating: 5, ratingBreakdown: { communication: 5, quality: 5, timeliness: 5 },
    skills: ['Copywriting', 'CRO', 'A/B Testing Strategy'], status: 'Completed', month: 'July 2024',
    description: 'Wrote high-converting copy for 5 SaaS landing pages including hero sections, feature blocks, testimonials, and CTAs with A/B testing variants.',
    milestones: [
      { label: 'Messaging & Tone Workshop', done: true },
      { label: 'Hero + Feature Copy (5 pages)', done: true },
      { label: 'A/B Variant Copy', done: true },
      { label: 'Final Review & Delivery', done: true },
    ],
    feedback: '"Copy that actually converts. Our lead form fill rate went up 41% after launch. Brilliant work!"',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 8, title: 'Backend API Development (Node.js)', client: 'FinFlow Systems', category: 'Development',
    budget: 6720, date: '2024-07-10', duration: '5 weeks', rating: 4, ratingBreakdown: { communication: 4, quality: 5, timeliness: 4 },
    skills: ['Node.js', 'PostgreSQL', 'GraphQL', 'Docker'], status: 'Completed', month: 'July 2024',
    description: 'Designed and built a scalable REST + GraphQL API for a FinTech payments platform. Includes auth, rate limiting, Stripe webhooks, and Docker deployment.',
    milestones: [
      { label: 'API Design & Schema', done: true },
      { label: 'Auth & Core Endpoints', done: true },
      { label: 'Stripe Integration', done: true },
      { label: 'Docker & Deployment', done: true },
    ],
    feedback: '"Highly skilled backend dev. The API is rock solid and well documented. Definitely recommend."',
    color: 'from-teal-500 to-green-500',
  },
];

const earningsData = [
  { month: 'Jun', earnings: 3200 },
  { month: 'Jul', earnings: 8520 },
  { month: 'Aug', earnings: 2100 },
  { month: 'Sep', earnings: 14300 },
  { month: 'Oct', earnings: 15200 },
  { month: 'Nov', earnings: 8400 },
  { month: 'Dec', earnings: 0 },
  { month: 'Jan', earnings: 2400 },
  { month: 'Feb', earnings: 3100 },
  { month: 'Mar', earnings: 4200 },
  { month: 'Apr', earnings: 5800 },
  { month: 'May', earnings: 4700 },
];

const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'Writing', 'Legal'];

const CATEGORY_COLORS = {
  Development: 'bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] dark:text-[#14a800]',
  Design: 'bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] dark:text-[#14a800]',
  Marketing: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Writing: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  Legal: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
};

// ─── Sub-components ────────────────────────────────────────────────────────────
const StarRating = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'} />
    ))}
  </div>
);

const EarningsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200">{label}</p>
        <p className="text-[#14a800] font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const InvoiceModal = ({ project, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-full max-w-md overflow-hidden">
      {/* Invoice header */}
      <div className="bg-gradient-to-r from-[#14a800] to-violet-600 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">INVOICE</h2>
            <p className="text-[#14a800] text-sm mt-0.5">#{String(project.id).padStart(5, '0')}</p>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-[#14a800] text-xs">Billed to</p>
            <p className="font-semibold">{project.client}</p>
          </div>
          <div className="text-right">
            <p className="text-[#14a800] text-xs">Date</p>
            <p className="font-semibold">{new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
      {/* Invoice body */}
      <div className="p-6 space-y-4">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
          <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Duration: {project.duration} · Category: {project.category}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Subtotal</span>
          <span className="font-medium text-gray-900 dark:text-white">${project.budget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Platform fee (5%)</span>
          <span className="font-medium text-gray-900 dark:text-white">-${(project.budget * 0.05).toFixed(0)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-3">
          <span className="font-bold text-gray-900 dark:text-white">Total Paid</span>
          <span className="text-xl font-bold text-[#14a800]">${(project.budget * 0.95).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-center py-2">
          <span className="border-2 border-green-500 text-green-600 dark:text-green-400 font-bold text-lg px-6 py-1.5 rounded-lg rotate-[-5deg] tracking-widest">PAID</span>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button onClick={onClose}
            className="py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors">
            Close
          </button>
          <button onClick={onClose}
            className="py-2.5 px-4 bg-[#14a800] hover:bg-[#118a00] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Download size={15} /> Download PDF
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const ProjectCard = ({ project, onExpand, expanded, onInvoice }) => (
  <motion.div layout
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.25 }}
    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group cursor-pointer">
    <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />
    <div className="p-5" onClick={() => onExpand(project.id)}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-[#14a800] dark:group-hover:text-[#14a800] transition-colors">{project.title}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${CATEGORY_COLORS[project.category]}`}>{project.category}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${project.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {project.client.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{project.client}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1"><DollarSign size={11} className="text-green-500" />${project.budget.toLocaleString()}</span>
        <span className="flex items-center gap-1"><Calendar size={11} />{new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>
        <span className="flex items-center gap-1"><Clock3 size={11} />{project.duration}</span>
        <span className="flex items-center gap-1"><CheckCircle size={11} className="text-green-500" />Completed</span>
      </div>
      <div className="mb-3"><StarRating rating={project.rating} /></div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.skills.map(skill => (
          <span key={skill} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">{skill}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button onClick={e => { e.stopPropagation(); onInvoice(project); }}
          className="text-xs text-[#14a800] hover:text-[#14a800] dark:text-[#14a800] font-medium flex items-center gap-1 hover:underline">
          <Download size={12} /> Invoice
        </button>
        <button className="text-xs text-gray-400 flex items-center gap-1">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Details
        </button>
      </div>
    </div>
    {/* Expanded details */}
    <AnimatePresence>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Milestones</p>
              <div className="space-y-1.5">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Client Feedback</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">{project.feedback}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Rating Breakdown</p>
              <div className="space-y-1.5">
                {Object.entries(project.ratingBreakdown).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 text-sm">
                    <span className="capitalize text-gray-600 dark:text-gray-400 w-28">{k}</span>
                    <StarRating rating={v} size={12} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const ListRow = ({ project, onExpand, expanded, onInvoice, index }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}
    className="bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 last:border-0 last:rounded-b-2xl first:rounded-t-2xl">
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface dark:hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => onExpand(project.id)}>
      <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${project.color} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{project.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{project.client}</p>
      </div>
      <div className="hidden sm:block w-24 text-xs text-gray-500 dark:text-gray-400">{new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</div>
      <div className="hidden md:block w-20"><StarRating rating={project.rating} size={11} /></div>
      <div className="hidden lg:block w-24">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[project.category]}`}>{project.category}</span>
      </div>
      <div className="font-semibold text-gray-900 dark:text-white text-sm w-20 text-right">${project.budget.toLocaleString()}</div>
      <button onClick={e => { e.stopPropagation(); onInvoice(project); }}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-1">
        <Download size={14} className="text-gray-400 hover:text-[#14a800]" />
      </button>
      {expanded ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
    </div>
    <AnimatePresence>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Milestones</p>
              <div className="space-y-1">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <CheckCircle size={11} className="text-green-500" /> {m.label}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Client Feedback</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">{project.feedback}</p>
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
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} className="mb-8">
          <div className="sticky top-16 z-10 flex items-center gap-3 mb-4 bg-surface dark:bg-gray-950 py-1">
            <div className="w-12 flex justify-center z-10">
              <div className="w-3 h-3 rounded-full bg-[#14a800] ring-4 ring-white dark:ring-gray-950" />
            </div>
            <span className="text-sm font-semibold text-[#14a800] dark:text-[#14a800] bg-[#14a800]/5 dark:bg-[#14a800]/20 px-3 py-1 rounded-full">{month}</span>
          </div>
          <div className="space-y-4">
            {items.map((project, i) => (
              <motion.div key={project.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex gap-4">
                <div className="w-12 flex justify-center flex-shrink-0 mt-4">
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${project.color} ring-2 ring-white dark:ring-gray-950`} />
                </div>
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`h-1 bg-gradient-to-r ${project.color}`} />
                  <div className="p-4 cursor-pointer" onClick={() => onExpand(project.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{project.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{project.client} · {new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">${project.budget.toLocaleString()}</p>
                        <StarRating rating={project.rating} size={11} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {project.skills.slice(0, 2).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={e => { e.stopPropagation(); onInvoice(project); }}
                          className="text-xs text-[#14a800] dark:text-[#14a800] flex items-center gap-1 hover:underline">
                          <Download size={11} /> Invoice
                        </button>
                        {expandedId === project.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedId === project.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-4 space-y-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                          <p className="text-sm italic text-gray-500 dark:text-gray-400">{project.feedback}</p>
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

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WorkHistoryPage() {
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

  const handleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const filtered = useMemo(() => {
    let res = PROJECTS.filter(p => {
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
  }, [search, category, minBudget, maxBudget, minRating, sortCol, sortDir, clientSearch]);

  const totalEarnings = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const avgRating = (PROJECTS.reduce((s, p) => s + p.rating, 0) / PROJECTS.length).toFixed(1);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronDown size={12} className="text-gray-300" />;
    return sortDir === 'desc' ? <ChevronDown size={12} className="text-[#14a800]" /> : <ChevronUp size={12} className="text-[#14a800]" />;
  };

  const clearFilters = () => {
    setSearch(''); setCategory('All'); setMinBudget(0);
    setMaxBudget(20000); setMinRating(0); setClientSearch('');
  };

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans min-h-screen bg-surface dark:bg-gray-950">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Work History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Your complete track record of completed projects</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* View toggle */}
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 gap-1">
            {[
              { v: 'grid', icon: Grid },
              { v: 'list', icon: LayoutList },
              { v: 'timeline', icon: Clock3 },
            ].map(({ v, icon: Icon }) => (
              <button key={v} onClick={() => setView(v)}
                className={`p-2 rounded-lg transition-all duration-200 ${view === v ? 'bg-[#14a800] text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Icon size={16} />
              </button>
            ))}
          </div>
          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2 bg-[#14a800] hover:bg-[#118a00] text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download size={15} /> Export
          </button>
        </div>
      </motion.div>

      {/* ── Summary Stats ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: '47', icon: FileText, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/20' },
          { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Avg Rating', value: `${avgRating}★`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Repeat Clients', value: '62%', icon: Users, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/20' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={cardVariants}
              whileHover={{ y: -3 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <Icon size={20} className={stat.color} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Earnings Timeline ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings Timeline</h2>
          <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
            <TrendingUp size={13} /> Last 12 months
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={earningsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<EarningsTooltip />} />
            <Area type="monotone" dataKey="earnings" name="Earnings" stroke="#2563eb" strokeWidth={2.5}
              fill="url(#earningsGrad)" dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#2563eb' }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Search & Filters ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14a800]/30 focus:border-[#14a800]/20" />
          </div>
          <button onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-[#14a800] border-[#14a800]/20 text-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#14a800]/20'}`}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          {/* Category pills */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${category === cat ? 'bg-[#14a800] text-white border-[#14a800]/20' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#14a800]/20'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden">
              <div className="mt-3 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Client Name</label>
                  <input value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Search client..."
                    className="w-full px-3 py-2 bg-surface dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14a800]/30 focus:border-[#14a800]/20 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                    Min Budget: ${minBudget.toLocaleString()}
                  </label>
                  <input type="range" min={0} max={20000} step={500} value={minBudget} onChange={e => setMinBudget(Number(e.target.value))}
                    className="w-full accent-brand-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                    Max Budget: ${maxBudget.toLocaleString()}
                  </label>
                  <input type="range" min={0} max={20000} step={500} value={maxBudget} onChange={e => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-brand-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Min Rating</label>
                  <div className="flex gap-1.5">
                    {[0, 3, 4, 5].map(r => (
                      <button key={r} onClick={() => setMinRating(r)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${minRating === r ? 'bg-amber-500 text-white border-amber-500' : 'bg-surface dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>
                        {r === 0 ? 'All' : `${r}+★`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button onClick={clearFilters}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                  <X size={12} /> Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Views ── */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          /* Empty state */
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Search size={36} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center max-w-xs">
              No work history matches your current filters. Try adjusting your search criteria.
            </p>
            <button onClick={clearFilters}
              className="px-5 py-2.5 bg-[#14a800] hover:bg-[#118a00] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <X size={15} /> Clear filters
            </button>
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
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* List header */}
            <div className="flex items-center gap-4 px-5 py-3 bg-surface dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="w-1 flex-shrink-0 opacity-0">|</div>
              <div className="flex-1">Project</div>
              <div className="hidden sm:block w-24 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" onClick={() => handleSort('date')}>
                <span className="flex items-center gap-1">Date <SortIcon col="date" /></span>
              </div>
              <div className="hidden md:block w-20 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" onClick={() => handleSort('rating')}>
                <span className="flex items-center gap-1">Rating <SortIcon col="rating" /></span>
              </div>
              <div className="hidden lg:block w-24">Category</div>
              <div className="w-20 text-right cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" onClick={() => handleSort('budget')}>
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

      {/* ── Invoice Modal ── */}
      <AnimatePresence>
        {invoiceProject && (
          <InvoiceModal project={invoiceProject} onClose={() => setInvoiceProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
