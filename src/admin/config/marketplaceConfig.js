import {
  Briefcase, ShoppingBag, Send, FileText, CheckCircle, Clock,
  AlertCircle, Lock, AlertTriangle,
  Ban, Award, Zap
} from 'lucide-react';

export const JOB_STATUSES = {
  open: { label: 'Open', icon: Clock, color: 'text-[#4C1D95] dark:text-[#4C1D95]', bg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', dot: 'bg-[#4C1D95]' },
  in_progress: { label: 'In Progress', icon: Briefcase, color: 'text-success dark:text-success', bg: 'bg-emerald-100 dark:bg-emerald-900/30', dot: 'bg-success' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30', dot: 'bg-teal-500' },
  cancelled: { label: 'Cancelled', icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', dot: 'bg-red-500' },
  disputed: { label: 'Disputed', icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', dot: 'bg-orange-500' },
  flagged: { label: 'Flagged', icon: AlertTriangle, color: 'text-[#4C1D95] dark:text-[#4C1D95]', bg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', dot: 'bg-[#4C1D95]' },
};

export const GIG_STATUSES = {
  active: { label: 'Active', icon: ShoppingBag, color: 'text-success dark:text-success', bg: 'bg-emerald-100 dark:bg-emerald-900/30', dot: 'bg-success' },
  inactive: { label: 'Inactive', icon: Lock, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30', dot: 'bg-gray-400' },
  paused: { label: 'Paused', icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', dot: 'bg-amber-500' },
  delisted: { label: 'Delisted', icon: Ban, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', dot: 'bg-red-500' },
  flagged: { label: 'Flagged', icon: AlertTriangle, color: 'text-[#4C1D95] dark:text-[#4C1D95]', bg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', dot: 'bg-[#4C1D95]' },
};

export const PROPOSAL_STATUSES = {
  draft: { label: 'Draft', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30' },
  submitted: { label: 'Submitted', color: 'text-[#4C1D95] dark:text-[#4C1D95]', bg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30' },
  under_review: { label: 'Under Review', color: 'text-[#4C1D95] dark:text-[#4C1D95]', bg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30' },
  shortlisted: { label: 'Shortlisted', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  interview: { label: 'Interview', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  accepted: { label: 'Accepted', color: 'text-success dark:text-success', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  withdrawn: { label: 'Withdrawn', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  expired: { label: 'Expired', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30' },
};

export const CONTRACT_STATUSES = {
  draft: { label: 'Draft', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30' },
  pending_signatures: { label: 'Pending Signatures', color: 'text-[#4C1D95] dark:text-[#4C1D95]', bg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30' },
  active: { label: 'Active', color: 'text-success dark:text-success', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  in_progress: { label: 'In Progress', color: 'text-[#4C1D95] dark:text-[#4C1D95]', bg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30' },
  completed: { label: 'Completed', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  terminated: { label: 'Terminated', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  disputed: { label: 'Disputed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
};

export const PRICING_MODELS = {
  fixed: { label: 'Fixed Price', icon: Zap, description: 'One-time project fee' },
  hourly: { label: 'Hourly Rate', icon: Clock, description: 'Billed by hours worked' },
  milestone: { label: 'Milestone Based', icon: Award, description: 'Payment per milestone' },
};

export const JOB_CATEGORIES = [
  'Web Development', 'Mobile App Development', 'UI/UX Design', 'Graphic Design',
  'Content Writing', 'SEO', 'Social Media Marketing', 'Video Production',
  'Data Analysis', 'Cybersecurity', 'Machine Learning', 'DevOps',
  'Business Consulting', 'Legal Services', 'Finance', 'HR & Recruitment'
];

export const EXPERIENCE_LEVELS = {
  entry_level: { label: 'Entry Level', color: 'text-[#4C1D95]', icon: '●' },
  intermediate: { label: 'Intermediate', color: 'text-amber-600', icon: '●●' },
  expert: { label: 'Expert', color: 'text-success', icon: '●●●' },
};

export const QUALITY_TIERS = {
  excellent: { label: 'Excellent', color: 'text-success dark:text-success', bg: 'bg-emerald-100 dark:bg-emerald-900/30', score: 85 },
  good: { label: 'Good', color: 'text-[#4C1D95] dark:text-[#4C1D95]', bg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', score: 70 },
  average: { label: 'Average', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', score: 50 },
  poor: { label: 'Poor', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', score: 30 },
};

export const FLAG_REASONS = [
  { id: 'spam', label: 'Spam Content', severity: 'high' },
  { id: 'duplicate', label: 'Duplicate Listing', severity: 'medium' },
  { id: 'inappropriate', label: 'Inappropriate Content', severity: 'high' },
  { id: 'misleading', label: 'Misleading Information', severity: 'high' },
  { id: 'low_quality', label: 'Low Quality', severity: 'medium' },
  { id: 'suspected_fraud', label: 'Suspected Fraud', severity: 'critical' },
  { id: 'incomplete', label: 'Incomplete Details', severity: 'low' },
  { id: 'policy_violation', label: 'Policy Violation', severity: 'high' },
];

export const REVIEW_FILTERS = {
  all: { label: 'All Reviews', count: null },
  pending: { label: 'Pending Approval', count: null },
  flagged: { label: 'Flagged', count: null },
  verified: { label: 'Verified', count: null },
  fake_suspected: { label: 'Fake Suspected', count: null },
};

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'most_proposals', label: 'Most Proposals' },
  { id: 'least_proposals', label: 'Least Proposals' },
  { id: 'highest_budget', label: 'Highest Budget' },
  { id: 'lowest_budget', label: 'Lowest Budget' },
  { id: 'trending', label: 'Trending' },
  { id: 'completion_rate', label: 'Completion Rate' },
  { id: 'rating', label: 'Best Rated' },
  { id: 'most_active', label: 'Most Active' },
];

export const MARKETPLACE_METRICS = [
  { id: 'total_jobs', label: 'Total Jobs Posted', icon: Briefcase, color: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', textColor: 'text-[#4C1D95] dark:text-[#4C1D95]' },
  { id: 'active_jobs', label: 'Active Jobs', icon: Clock, color: 'bg-emerald-100 dark:bg-emerald-900/30', textColor: 'text-success dark:text-success' },
  { id: 'total_gigs', label: 'Total Gigs', icon: ShoppingBag, color: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', textColor: 'text-[#4C1D95] dark:text-[#4C1D95]' },
  { id: 'active_gigs', label: 'Active Gigs', icon: Zap, color: 'bg-violet-100 dark:bg-violet-900/30', textColor: 'text-violet-600 dark:text-violet-400' },
  { id: 'pending_proposals', label: 'Pending Proposals', icon: Send, color: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'total_proposals', label: 'Total Proposals', icon: FileText, color: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-600 dark:text-orange-400' },
  { id: 'active_contracts', label: 'Active Contracts', icon: CheckCircle, color: 'bg-teal-100 dark:bg-teal-900/30', textColor: 'text-teal-600 dark:text-teal-400' },
  { id: 'avg_proposal_response', label: 'Avg Response Time', icon: Clock, color: 'bg-cyan-100 dark:bg-cyan-900/30', textColor: 'text-cyan-600 dark:text-cyan-400' },
];


