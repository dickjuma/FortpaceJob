import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useHomepageData } from '../../common/hooks/useHomepageData';
import {
  StatCardSkeleton,
  FreelancerCardSkeleton,
  CategoryPillSkeleton,
  TestimonialSkeleton,
  Skeleton,
} from '../../components/ui/Skeleton';
import {
  ArrowRight, ShieldCheck, Zap, BrainCircuit, TrendingUp, Users, Star,
  CheckCircle2, ChevronRight, Menu, X, Briefcase, Building2,
  Globe, Lock, Award, Clock, DollarSign, MessageSquare, ChevronLeft,
  Play, Sparkles, BarChart3, Code2, Palette, PenTool, Camera, Headphones,
  BadgeCheck, Flame, Activity,
} from 'lucide-react';

// ─── Utility ─────────────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const isFloat = !Number.isInteger(target);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? parseFloat((target * ease).toFixed(1))
        : Math.floor(target * ease);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ─── Floating Tilt Card ───────────────────────────────────────────────────────
function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Find Talent', href: '/find-talent', isRoute: true },
  { label: 'Find Work', href: '/find-work', isRoute: true },
  { label: 'Gigs', href: '/gigs', isRoute: true },
  { label: 'Features', href: '#features', isRoute: false },
  { label: 'How It Works', href: '#how-it-works', isRoute: false },
];

const ACTIVITY_ICONS = {
  job: Briefcase,
  talent: Users,
  platform: Activity,
};

const AVATAR_GRADIENTS = [
  'from-[#14a800] to-[#118a00]',
  'from-sky-400 to-cyan-600',
  'from-amber-400 to-orange-500',
];

const BENEFITS = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered Matching',
    desc: 'Our engine analyses 200+ data points to connect you with the perfect match in under 60 seconds.',
    gradient: 'from-[#14a800] to-[#118a00]',
    delay: 0,
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security',
    desc: 'Military-grade encryption, KYC verification, and real-time fraud monitoring on every transaction.',
    gradient: 'from-sky-400 to-cyan-600',
    delay: 0.1,
  },
  {
    icon: DollarSign,
    title: 'Smart Escrow',
    desc: 'Funds are held securely and released only when milestones are approved — zero risk for both parties.',
    gradient: 'from-emerald-400 to-teal-600',
    delay: 0.2,
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'Access talent and clients from 180+ countries with multi-currency support and instant payouts.',
    gradient: 'from-amber-400 to-orange-500',
    delay: 0.3,
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Track every project, payment, and performance metric on a live dashboard built for clarity.',
    gradient: 'from-rose-400 to-pink-600',
    delay: 0.4,
  },
  {
    icon: MessageSquare,
    title: 'Built-In Workspace',
    desc: 'Chat, video calls, file sharing, and milestones — everything in one seamless workspace.',
    gradient: 'from-blue-400 to-[#118a00]',
    delay: 0.5,
  },
];

const PATHS = [
  {
    type: 'freelancer',
    icon: Briefcase,
    title: 'I want to Freelance',
    tagline: 'Earn by offering your skills',
    description: 'Join 150,000+ freelancers earning top dollar on Forte. Set your rates, choose your projects, and build your reputation on the world\'s most trusted marketplace.',
    cta: 'Continue as Freelancer',
    gradient: 'from-violet-600 to-[#118a00]',
    glow: 'shadow-[#14a800]/30',
    border: 'border-[#14a800]/30',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    perks: [
      'Zero commission for first 30 days',
      'Get paid within 24 hours',
      'Verified badge boosts visibility 3x',
      'Access to $50M+ in annual contracts',
    ],
  },
  {
    type: 'client',
    icon: Building2,
    title: 'I want to Hire',
    tagline: 'Find top talent instantly',
    description: 'Post your job in minutes and receive qualified proposals from vetted professionals. From startups to Fortune 500s, Forte powers world-class project delivery.',
    cta: 'Continue as Client',
    gradient: 'from-sky-500 to-teal-600',
    glow: 'shadow-sky-500/30',
    border: 'border-sky-500/30',
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    perks: [
      'Free to post, only pay when hired',
      'Proposals in under 1 hour',
      'Satisfaction guarantee on all work',
      'Dedicated account manager',
    ],
  },
];

const DEFAULT_PAYMENT_METHODS = ['M-Pesa', 'Paystack', 'Visa', 'Mastercard', 'Bank transfer', 'Escrow'];

const HOW_IT_WORKS_STEPS = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up free and build your verified profile in minutes. AI-assisted portfolio import available.', icon: Users },
  { step: '02', title: 'Post or Browse', desc: 'Clients post jobs, freelancers browse opportunities. AI matches both sides instantly.', icon: Globe },
  { step: '03', title: 'Collaborate Securely', desc: 'Use our built-in workspace with milestone tracking, messaging, and file sharing.', icon: MessageSquare },
  { step: '04', title: 'Get Paid Instantly', desc: 'Funds released via smart escrow within 24 hours of milestone approval.', icon: DollarSign },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Navbar({ scrolled, mobileOpen, onToggleMobile }) {
  const navigate = useNavigate();
  return (
    <nav className={cn(
      'fixed top-0 w-full z-[100] transition-all duration-500 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm',
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14a800] to-blue-700 flex items-center justify-center shadow-lg shadow-[#14a800]/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Forte<span className="text-[#14a800]">.</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href, isRoute }) => (
              isRoute ? (
                <Link
                  key={label}
                  to={href}
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-[#14a800] dark:hover:text-[#14a800] transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-[#14a800] dark:hover:text-[#14a800] transition-colors"
                >
                  {label}
                </a>
              )
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/auth/login')}
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-[#14a800] dark:hover:text-[#14a800] transition-colors px-4 py-2"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/auth/register')}
              className="px-5 py-2.5 rounded-full bg-[#14a800] text-white text-sm font-semibold hover:bg-[#118a00] transition-all shadow-lg shadow-[#14a800]/25 hover:shadow-[#14a800]/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={onToggleMobile}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map(({ label, href, isRoute }) => (
                isRoute ? (
                  <Link
                    key={label}
                    to={href}
                    onClick={onToggleMobile}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    onClick={onToggleMobile}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {label}
                  </a>
                )
              ))}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
                <button onClick={() => navigate('/auth/login')} className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-800 transition-colors">
                  Log in
                </button>
                <button onClick={() => navigate('/auth/register')} className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#14a800] hover:bg-[#118a00] transition-colors">
                  Get Started Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function LiveTicker({ activity = [], loading = false }) {
  const items = activity.length
    ? activity
    : [{ type: 'platform', text: 'Marketplace activity updates in real time' }];

  if (loading) {
    return (
      <div className="w-full border-y border-zinc-200/60 dark:border-zinc-800/60 py-3 px-4">
        <Skeleton className="h-8 w-full max-w-3xl mx-auto" />
      </div>
    );
  }

  const loop = [...items, ...items, ...items];

  return (
    <div className="w-full border-y border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm overflow-hidden py-3">
      <div className="flex items-center gap-3 px-4 mb-0">
        <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          LIVE
        </div>
        <motion.div
          className="flex whitespace-nowrap gap-0"
          animate={{ x: [0, -2400] }}
          transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
        >
          {loop.map((item, i) => {
            const Icon = ACTIVITY_ICONS[item.type] || Activity;
            return (
              <span key={i} className="inline-flex items-center gap-2 mx-10 text-sm text-zinc-500 dark:text-zinc-400">
                <Icon className="w-4 h-4 text-[#14a800] shrink-0" />
                <span>{item.text}</span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
              </span>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

function HeroSection({ stats, categories = [], openJobs = 0, loading = false }) {
  const navigate = useNavigate();

  const heroStats = [
    {
      label: 'Active professionals',
      value: stats?.talentCount || 0,
      suffix: '+',
      icon: Users,
      color: 'text-[#14a800]',
    },
    {
      label: 'Open jobs',
      value: stats?.openJobs ?? openJobs,
      suffix: '',
      icon: Briefcase,
      color: 'text-teal-500',
    },
    {
      label: 'Categories',
      value: stats?.categoriesCount || categories.length,
      suffix: '',
      icon: Globe,
      color: 'text-[#14a800]',
    },
    {
      label: 'Avg. rating',
      value: stats?.avgRating || 4.9,
      suffix: '',
      isFloat: true,
      icon: Star,
      color: 'text-amber-500',
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
      {/* Announcement badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14a800]/5 dark:bg-[#14a800]/10 text-[#14a800] dark:text-[#14a800] text-xs sm:text-sm font-semibold mb-8 border border-[#14a800]/20 dark:border-[#14a800]/20/20 shadow-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>AI-Powered Matching Engine 2.0 — Now Live</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#14a800] animate-pulse" />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
      >
        <span className="text-zinc-900 dark:text-white">Build, Hire &amp; </span>
        <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
          Grow Without Limits
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10"
      >
        Connect with top freelancers and clients worldwide. Powered by AI that finds the right match in seconds — not days.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/auth/register', { state: { role: 'FREELANCER' } })}
          className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-base font-bold shadow-2xl shadow-[#14a800]/30 hover:shadow-[#14a800]/50 transition-all"
        >
          <Briefcase className="w-5 h-5" />
          Continue as Freelancer
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/auth/register', { state: { role: 'CLIENT' } })}
          className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-base font-bold border border-zinc-200 dark:border-zinc-700 hover:border-[#14a800]/50 dark:hover:border-[#14a800]/20 shadow-sm hover:shadow-md transition-all"
        >
          <Building2 className="w-5 h-5" />
          Continue as Client
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Hero Floating Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative max-w-5xl mx-auto"
      >
        {/* Glassmorphism Hero Card */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 bg-white/60 dark:bg-surface-dark/60 backdrop-blur-xl p-6 sm:p-8">
          {/* Inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#14a800]/5 via-[#14a800]/5 to-cyan-500/5 pointer-events-none" />

          {/* Floating stat badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {loading
              ? [0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)
              : heroStats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
                      className="flex flex-col items-center p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700 shadow-sm"
                    >
                      <Icon className={cn('w-5 h-5 mb-2', stat.color)} />
                      <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                        {stat.isStatic ? (
                          stat.value
                        ) : stat.isFloat ? (
                          stat.value
                        ) : (
                          <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                        )}
                      </div>
                      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 text-center">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {loading
              ? [0, 1, 2, 3, 4, 5].map((i) => <CategoryPillSkeleton key={i} />)
              : categories.map((cat, i) => (
                  <Link
                    key={cat.slug || cat.id}
                    to={`/find-talent?section=${encodeURIComponent(cat.slug || cat.id)}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.06 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm cursor-pointer hover:border-[#14a800]/50 transition-all"
                    >
                      <Briefcase className="w-4 h-4 text-[#14a800]" />
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{cat.label}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">{cat.count}</span>
                    </motion.div>
                  </Link>
                ))}
          </div>
        </div>

        {/* Floating badge — top left */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-5 -left-4 sm:-left-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700 px-4 py-3 flex items-center gap-2.5 hidden sm:flex"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">JD</div>
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-white">$5,200 Earned</div>
            <div className="text-[10px] text-zinc-500">This week · 5★</div>
          </div>
        </motion.div>

        {/* Floating badge — top right */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -top-5 -right-4 sm:-right-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700 px-4 py-3 hidden sm:flex items-center gap-2.5"
        >
          <Activity className="w-5 h-5 text-[#14a800]" />
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-white">847 Matches</div>
            <div className="text-[10px] text-zinc-500">Made today</div>
          </div>
        </motion.div>

        {/* Floating badge — bottom */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700 px-5 py-3 flex items-center gap-2.5 whitespace-nowrap"
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-bold text-zinc-900 dark:text-white">
            {openJobs > 0 ? `${openJobs} open jobs right now` : 'Open jobs posted daily'}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14a800] dark:text-[#14a800] mb-4">
          <Sparkles className="w-4 h-4" /> Platform Benefits
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
          Everything you need to{' '}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            succeed
          </span>
        </h2>
        <p className="max-w-2xl mx-auto text-zinc-500 dark:text-zinc-400 text-lg">
          Forte is built for professionals who demand the best — from AI matching to enterprise security.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BENEFITS.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: benefit.delay }}
              whileHover={{ y: -6 }}
              className="group relative bg-white dark:bg-zinc-800/60 rounded-2xl p-6 border border-zinc-200/70 dark:border-zinc-700/50 shadow-card hover:shadow-xl transition-all overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${benefit.gradient} opacity-10 rounded-bl-[60px] pointer-events-none group-hover:opacity-20 transition-opacity`} />
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{benefit.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function FreelancersSection({ freelancers = [], loading = false, talentCount = 0 }) {
  const navigate = useNavigate();

  return (
    <section id="freelancers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">
            <Award className="w-4 h-4" /> Top Talent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
            Elite Talent, Quantified.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Our trust-scoring engine surfaces only professionals with proven delivery track records.
          </p>
        </div>
        <Link
          to="/find-talent"
          className="mt-6 md:mt-0 text-sm font-semibold text-[#14a800] flex items-center gap-1.5 hover:gap-3 transition-all group"
        >
          View all {talentCount > 0 ? `${talentCount}+` : ''} professionals
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading
          ? [0, 1, 2].map((i) => <FreelancerCardSkeleton key={i} />)
          : freelancers.length === 0
            ? (
              <p className="col-span-full text-center text-zinc-500 py-12">
                No featured profiles yet. Complete onboarding to appear here.
              </p>
            )
            : freelancers.map((f, i) => (
          <TiltCard key={f.id || f.userId || i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-card hover:shadow-2xl transition-all overflow-hidden h-full"
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} opacity-10 rounded-bl-[80px] pointer-events-none`} />

              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {f.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{f.name}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{f.role}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    f.available
                      ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20'
                      : 'text-zinc-500 bg-surface dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600'
                  )}>
                    {f.available ? '● Available' : '○ Busy'}
                  </span>
                </div>
              </div>

              {/* Trust Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Trust Score</span>
                  <span className="text-sm font-extrabold text-success dark:text-success">{f.score}/100</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${f.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {f.skills.map(s => (
                  <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700/70 text-zinc-600 dark:text-zinc-300">
                    {s}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-700/50 p-3 text-center">
                  <div className="text-sm font-extrabold text-zinc-900 dark:text-white">{f.projects}</div>
                  <div className="text-[10px] text-zinc-500">Projects</div>
                </div>
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-700/50 p-3 text-center">
                  <div className="text-sm font-extrabold text-zinc-900 dark:text-white">{f.score}/100</div>
                  <div className="text-[10px] text-zinc-500">Trust score</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-700">
                <div className="text-base font-extrabold text-zinc-900 dark:text-white">{f.rate}</div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/freelancer/${f.userId || f.id}`)}
                  className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 rounded-xl shadow-md shadow-[#14a800]/20 hover:shadow-[#14a800]/40 transition-all"
                >
                  View Profile
                </motion.button>
              </div>
            </motion.div>
          </TiltCard>
            ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4">
            <Play className="w-4 h-4" /> How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
            Up and running in{' '}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              minutes
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px border-t-2 border-dashed border-zinc-200 dark:border-zinc-700" />
                )}
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg flex items-center justify-center">
                    <Icon className="w-8 h-8 text-[#14a800] dark:text-[#14a800]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#14a800] text-white text-xs font-extrabold flex items-center justify-center shadow-md">
                    {step.step.slice(1)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PathSection() {
  const navigate = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
          Choose your path
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto">
          Forte adapts to you — whether you're building a business or offering world-class skills.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PATHS.map((path, i) => {
          const Icon = path.icon;
          return (
            <motion.div
              key={path.type}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={cn(
                'relative rounded-3xl p-8 border overflow-hidden transition-all',
                path.bg, path.border
              )}
            >
              {/* BG Gradient */}
              <div className={`absolute top-0 right-0 w-56 h-56 bg-gradient-to-br ${path.gradient} opacity-10 rounded-bl-[100px] pointer-events-none`} />

              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${path.gradient} mb-6 shadow-xl ${path.glow}`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">{path.title}</h3>
              <p className={`text-sm font-semibold bg-gradient-to-r ${path.gradient} bg-clip-text text-transparent mb-4`}>
                {path.tagline}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                {path.description}
              </p>

              <ul className="space-y-2.5 mb-8">
                {path.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/auth/register', { state: { role: path.type.toUpperCase() } })}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${path.gradient} shadow-lg ${path.glow} hover:shadow-xl transition-all`}
              >
                {path.cta}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials = [], loading = false }) {
  const [active, setActive] = useState(0);
  const list = testimonials.length ? testimonials : [];
  const prev = () => setActive((a) => (a - 1 + list.length) % Math.max(list.length, 1));
  const next = () => setActive((a) => (a + 1) % Math.max(list.length, 1));

  useEffect(() => {
    if (list.length < 2) return undefined;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [list.length]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-4">
            <Star className="w-4 h-4 fill-current" /> Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Trusted by thousands worldwide
          </h2>
        </motion.div>

        <div className="relative">
          {loading ? (
            <TestimonialSkeleton />
          ) : list.length === 0 ? (
            <p className="text-center text-zinc-500 py-12">Reviews from completed work will appear here.</p>
          ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-zinc-800 rounded-3xl p-8 sm:p-10 border border-zinc-200 dark:border-zinc-700 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex-shrink-0 flex flex-col items-center sm:items-start gap-3">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[active % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white font-extrabold text-xl shadow-xl`}>
                    {list[active].avatar}
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-white">{list[active].name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{list[active].role}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(list[active].rating || 5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-3xl text-[#14a800] font-serif leading-none mb-3">&ldquo;</div>
                  <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-200 leading-relaxed mb-6">
                    {list[active].text}
                  </p>
                  {list[active].highlight && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 text-xs font-bold text-emerald-700">
                      <TrendingUp className="w-3 h-3" />
                      {list[active].highlight}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          )}

          {list.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center hover:border-[#14a800]/50 dark:hover:border-[#14a800]/20 hover:text-[#14a800] transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === active ? 'w-8 bg-[#14a800]' : 'w-2 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400'
                  )}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center hover:border-[#14a800]/50 dark:hover:border-[#14a800]/20 hover:text-[#14a800] transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="trust" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14a800] dark:text-[#14a800] mb-4">
            <Lock className="w-4 h-4" /> Trust & Safety
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-6">
            Enterprise-Grade Trust & Safety
          </h2>
          <div className="space-y-6">
            {[
              {
                icon: ShieldCheck,
                color: 'bg-[#14a800]/10 dark:bg-[#14a800]/30 text-[#14a800] dark:text-[#14a800]',
                title: 'Identity & Fraud Protection',
                desc: 'Every user undergoes rigorous KYC and real-time fraud monitoring — absolute safety guaranteed.',
              },
              {
                icon: CheckCircle2,
                color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
                title: 'Smart Escrow Payments',
                desc: 'Funds held securely and released only upon milestone approval — zero risk, full transparency.',
              },
              {
                icon: Lock,
                color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
                title: 'End-to-End Encryption',
                desc: 'All communications and transactions are protected with AES-256 military-grade encryption.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', item.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Trust Score Widget */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#14a800]/20 to-teal-500/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-2xl">
            <div className="flex items-center gap-5 mb-8">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" className="text-zinc-100 dark:text-zinc-700" fill="none" />
                  <motion.circle
                    cx="40" cy="40" r="34"
                    stroke="url(#trustGrad)" strokeWidth="6" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 34 * 0.01 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-zinc-900 dark:text-white">99</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-zinc-900 dark:text-white">Trust Score Verified</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Based on 200+ data points</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <BadgeCheck className="w-4 h-4 text-[#14a800]" />
                  <span className="text-xs font-bold text-[#14a800]">Forte Certified Elite</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Identity Verified', value: 100, color: 'from-emerald-400 to-teal-500' },
                { label: 'Work History', value: 98, color: 'from-blue-400 to-[#14a800]' },
                { label: 'Client Reviews', value: 99, color: 'from-amber-400 to-orange-500' },
                { label: 'On-Time Delivery', value: 96, color: 'from-pink-400 to-rose-500' },
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    <span>{bar.label}</span>
                    <span>{bar.value}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                      className={`h-full bg-gradient-to-r ${bar.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-700 flex flex-wrap gap-2">
              {['SOC 2 Type II', 'GDPR Compliant', 'ISO 27001', 'PCI DSS'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PaymentSection({ methods = DEFAULT_PAYMENT_METHODS }) {
  return (
    <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-12 bg-white/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-6">
          Accepted Payment Methods
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {methods.map((name) => (
            <motion.div
              key={name}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"
            >
              <DollarSign className="w-4 h-4 text-[#14a800]" />
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoLTZ2LTZoNnYtNmg2djZoNnY2aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      {/* Floating orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold mb-6 border border-white/30">
            <Flame className="w-4 h-4" />
            Join 150,000+ professionals already on Forte
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
            Start building your future<br />
            <span className="text-[#14a800]">on Forte today.</span>
          </h2>
          <p className="text-lg text-[#14a800] mb-10 max-w-xl mx-auto leading-relaxed">
            Free to join. Zero risk. World-class talent and projects waiting for you right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth/register', { state: { role: 'FREELANCER' } })}
              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#14a800] text-base font-extrabold shadow-2xl hover:shadow-white/20 transition-all"
            >
              <Briefcase className="w-5 h-5" />
              Continue as Freelancer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth/register', { state: { role: 'CLIENT' } })}
              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white text-base font-bold border border-white/40 hover:bg-white/30 transition-all"
            >
              <Building2 className="w-5 h-5" />
              Continue as Client
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <p className="mt-8 text-[#14a800] text-sm">
            No credit card required · Cancel anytime · 30-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14a800] to-blue-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-zinc-900 dark:text-white">Forte<span className="text-[#14a800]">.</span></span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              The world's most trusted AI-powered freelance marketplace.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['How It Works', 'Find Talent', 'Post a Job', 'Pricing'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900 dark:text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <button type="button" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#14a800] dark:hover:text-[#14a800] transition-colors text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© 2026 Forte Platform, Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Lock className="w-3 h-3" />
            <span>Secured by enterprise-grade encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: homepage, isLoading, isError } = useHomepageData();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stats = homepage?.stats;
  const openJobs = stats?.openJobs ?? 0;

  return (
    <>
      <Navbar
        scrolled={scrolled}
        mobileOpen={mobileMenuOpen}
        onToggleMobile={() => setMobileMenuOpen((open) => !open)}
      />
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#14a800]/8 blur-[140px]" />
        <div className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#14a800]/8 blur-[140px]" />
        <div className="absolute bottom-0 left-[20%] w-[40%] h-[40%] rounded-full bg-teal-500/8 blur-[120px]" />
      </div>

      <main className="relative z-10 pt-24">
        {isError && (
          <div className="max-w-3xl mx-auto px-4 mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 text-center">
            Could not refresh live marketplace data. Showing cached layout.
          </div>
        )}
        <HeroSection
          stats={stats}
          categories={homepage?.categories}
          openJobs={openJobs}
          loading={isLoading}
        />
        <div className="mt-20" />
        <LiveTicker activity={homepage?.activity} loading={isLoading} />
        <BenefitsSection />
        <FreelancersSection
          freelancers={homepage?.featuredFreelancers}
          loading={isLoading}
          talentCount={stats?.talentCount}
        />
        <HowItWorksSection />
        <PathSection />
        <TestimonialsSection testimonials={homepage?.testimonials} loading={isLoading} />
        <TrustSection />
        <PaymentSection methods={homepage?.paymentMethods} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
