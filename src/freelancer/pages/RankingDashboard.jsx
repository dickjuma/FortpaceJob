// src/pages/freelancer/RankingDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Eye,
  CheckCircle,
  Award,
  BarChart3,
  Clock,
  Zap,
} from 'lucide-react';
import { useSuccessScore } from '../services/freelancerHooks';

// ---------- Shared UI Components (inline) ----------
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

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800',
    ghost: 'border border-brand-900 text-brand-900 hover:bg-surface-muted',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// ---------- Main Component ----------
export default function RankingDashboard() {
  const { data: response, isLoading } = useSuccessScore();
  const rankData = response?.data || response || {};

  const fallbackScores = [
    { label: 'Overall rank score', value: 94, max: 100, color: 'brand' },
    { label: 'Visibility index', value: 88, max: 100, color: 'accent' },
    { label: 'Trust score', value: 99, max: 100, color: 'accent' },
    { label: 'Match rate', value: 76, max: 100, color: 'warn' },
  ];

  const scores = rankData.scores || fallbackScores;

  const getColorClass = (color) => {
    switch (color) {
      case 'brand': return 'bg-brand-900';
      case 'accent': return 'bg-accent';
      case 'warn': return 'bg-warn';
      default: return 'bg-brand-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-accent-light text-accent-dark rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-display font-bold text-brand-900">Ranking & visibility</h1>
        </div>
        <p className="text-sm text-ink-secondary">
          Understand your marketplace position and discover actionable improvements to win more contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main ranking card */}
        <Card className="lg:col-span-2 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular progress indicator */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E7E5E4"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * 0.94)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-mono font-bold text-brand-900">94</span>
                <span className="text-xs font-medium text-accent uppercase tracking-wide">Top 5%</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-display font-semibold text-brand-900 mb-2">
                Excellent marketplace position
              </h2>
              <p className="text-ink-secondary text-sm mb-4">
                Your profile is highly optimized. You appear on page 1 for 85% of relevant searches.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge variant="success" className="gap-1">
                  <TrendingUp className="w-3 h-3" /> +2 points this week
                </Badge>
                <Badge variant="info" className="gap-1">
                  <Eye className="w-3 h-3" /> 1,204 impressions
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Action items (non‑AI) */}
        <Card>
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="font-display font-semibold text-brand-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-warn" />
              Improvement opportunities
            </h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 border border-accent-light bg-accent-light/30 rounded-xl">
              <p className="text-sm font-semibold text-ink-primary mb-1">+5 score potential</p>
              <p className="text-xs text-ink-secondary mb-2">
                Adding "Next.js 14" to your skills matches current high‑demand searches.
              </p>
              <Button variant="ghost" className="text-xs py-1 px-3">
                Update profile →
              </Button>
            </div>
            <div className="p-3 border border-border rounded-xl bg-surface-soft">
              <p className="text-sm font-semibold text-ink-primary mb-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                Response rate optimal
              </p>
              <p className="text-xs text-ink-secondary">
                Your average response time of 15 minutes keeps you favored in the matching engine.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Score breakdown */}
      <h2 className="text-xl font-display font-semibold text-brand-900 mb-4">Score breakdown</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {scores.map((score, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">
                {score.label}
              </p>
              <span className="text-2xl font-mono font-bold text-brand-900">
                {score.value}
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className={`${getColorClass(score.color)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${score.value}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Optional: improvement note (non‑AI, actionable) */}
      <Card className="mt-6 bg-surface-soft border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-brand-900">Want to improve your match rate?</h3>
            <p className="text-sm text-ink-secondary mt-1">
              Complete your portfolio with case studies from similar industries to increase relevance.
            </p>
          </div>
          <Button variant="ghost" className="whitespace-nowrap">
            Complete portfolio
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
