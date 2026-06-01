import { publicAPI } from '../../common/services/api';
import { proposalAPI } from '../../common/services/api';
import { gigAPI } from '../../common/services/api';

const listeners = new Set();

function notifyFindWorkListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribeToFindWorkData(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let CATEGORY_CONFIG = [];
let categoryLoadPromise = null;

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

export async function loadFindWorkCategories() {
  if (categoryLoadPromise) return categoryLoadPromise;
  if (CATEGORY_CONFIG.length > 0) return CATEGORY_CONFIG;

  categoryLoadPromise = (async () => {
    try {
      const res = await publicAPI.getCategoryTree();
      const tree = Array.isArray(res?.tree) ? res.tree : [];

      const result = tree
        .filter((node) => node.children?.length || node.name)
        .map((node) => {
          const accentPalette = [
            'bg-[#14a800]/10 text-[#14a800]',
            'bg-emerald-100 text-emerald-700',
            'bg-amber-100 text-amber-700',
            'bg-cyan-100 text-cyan-700',
            'bg-rose-100 text-rose-700',
            'bg-violet-100 text-violet-700',
          ];
          const accentClass = accentPalette[Math.floor(Math.random() * accentPalette.length)] || 'bg-[#14a800]/10 text-[#14a800]';

          return {
            id: node.slug || String(node.id),
            name: node.name || node.title,
            slug: node.slug,
            description: node.description || '',
            summary: node.description || '',
            longDescription: node.description || '',
            accentClass,
            specializations: (node.children || []).map((c) => c.name || c.title),
            stats: { openJobs: node.jobs?.count || 0 },
            _raw: node,
          };
        });

      CATEGORY_CONFIG = result;
      return result;
    } catch (err) {
      console.error('[findWorkData] Failed to load categories from API:', err.message);
      return [];
    }
  })();

  return categoryLoadPromise;
}

export function getLoadedFindWorkCategories() {
  return CATEGORY_CONFIG;
}

export function getFindWorkCategories() {
  return CATEGORY_CONFIG.length
    ? CATEGORY_CONFIG.map((category) => ({
        ...category,
        openJobs: category.stats?.openJobs || 0,
        openJobsLabel: formatCompactNumber(category.stats?.openJobs || 0),
        path: `/find-work/category/${category.id}`,
      }))
    : [];
}

export function getFindWorkCategoryById(categoryId) {
  return (
    CATEGORY_CONFIG.find((category) => category.id === categoryId || category.slug === categoryId || slugify(category.name) === categoryId) || null
  );
}

export function getFindWorkJobs(filters = {}) {
    const {
      query = '',
      categoryId = '',
      categoryIds = [],
      workMode = 'all',
      sortBy = 'recommended',
      limit = 50,
      budgetTypes = [],
      experienceLevels = [],
      urgentOnly = false,
      verifiedOnly = false,
      establishedClientsOnly = false,
      locationQuery = '',
    } = filters;

    const selectedCategoryIds = Array.isArray(categoryIds) ? categoryIds.filter(Boolean) : [];
    const normalizedBudgetTypes = Array.isArray(budgetTypes) ? budgetTypes.map(normalize) : [];
    const normalizedExperienceLevels = Array.isArray(experienceLevels) ? experienceLevels.map(normalize) : [];
    let jobs = [...FIND_WORK_JOBS];

   // Filter by query
   if (query) {
      jobs = jobs.filter(job => matchesQuery(job, query));
   }

   // Filter by category
    if (categoryId) {
       jobs = jobs.filter(job => job.categoryId === categoryId || job.category?.slug === categoryId || job.category?.id === categoryId);
    }

    if (selectedCategoryIds.length > 0) {
       jobs = jobs.filter((job) => selectedCategoryIds.includes(job.categoryId) || selectedCategoryIds.includes(job.category?.slug));
    }

   // Filter by work mode
    if (workMode !== 'all') {
       jobs = jobs.filter(job => job.workMode === workMode);
    }

    if (normalizedBudgetTypes.length > 0) {
       jobs = jobs.filter((job) => normalizedBudgetTypes.includes(normalize(job.budgetType)));
    }

    if (normalizedExperienceLevels.length > 0) {
       jobs = jobs.filter((job) => normalizedExperienceLevels.includes(normalize(job.experienceLevel)));
    }

    if (urgentOnly) {
       jobs = jobs.filter((job) => job.urgent);
    }

    if (verifiedOnly) {
       jobs = jobs.filter((job) => job.client?.verified);
    }

    if (establishedClientsOnly) {
       jobs = jobs.filter((job) => Number(job.client?.jobsPosted || 0) >= 10);
    }

    if (locationQuery) {
       const needle = String(locationQuery).toLowerCase();
       jobs = jobs.filter((job) => String(job.locationLabel || job.location || '').toLowerCase().includes(needle));
    }

    // Sort jobs
    const sorters = {
       recommended: (a, b) => (Number(b.featured) - Number(a.featured)) || (b.applicants - a.applicants) || (a.postedHoursAgo - b.postedHoursAgo),
       newest: (a, b) => (Number(a.postedHoursAgo) || Number.MAX_SAFE_INTEGER) - (Number(b.postedHoursAgo) || Number.MAX_SAFE_INTEGER),
       highestBudget: (a, b) => (b.budgetValue || 0) - (a.budgetValue || 0),
       mostApplicants: (a, b) => b.applicants - a.applicants,
       'highest-budget': (a, b) => (b.budgetValue || 0) - (a.budgetValue || 0),
       'most-applicants': (a, b) => b.applicants - a.applicants,
    };
   jobs = jobs.sort(sorters[sortBy] || sorters.recommended);

   // Apply limit
   if (limit > 0) {
      jobs = jobs.slice(0, limit);
   }

   return jobs;
}

export function getFindWorkJobById(jobId) {
   return FIND_WORK_JOBS.find(job => job.id === jobId) || null;
 }

export function getFeaturedFindWorkJobs(limit = 3) {
   return FIND_WORK_JOBS
      .filter(job => job.featured)
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, limit);
 }

export function getSavedFindWorkJobs() {
   return SAVED_JOBS.map(jobId => FIND_WORK_JOBS.find(job => job.id === jobId)).filter(Boolean);
 }

function extractApiList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

function normalizeProposalStatus(status) {
  const value = String(status || 'PENDING').toUpperCase();
  if (value === 'SHORTLISTED') return 'shortlisted';
  if (value === 'ACCEPTED') return 'accepted';
  if (value === 'REJECTED') return 'rejected';
  if (value === 'WITHDRAWN') return 'withdrawn';
  if (value === 'INTERVIEWING') return 'interviewing';
  return 'pending';
}

function formatSubmittedLabel(iso) {
  if (!iso) return 'Recently';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Recently';
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

function mapProviderApplication(application) {
  const jobId = String(application.jobId || application.requestId || '');
  const job = FIND_WORK_JOBS.find((entry) => entry.id === jobId);
  const bid = Number(application.bidAmount ?? application.amount ?? application.proposedPrice ?? 0);
  const currency = application.currency || job?.currency || 'KES';

  return {
    id: String(application.id),
    status: normalizeProposalStatus(application.status),
    orderId: application.contractId || application.orderId || null,
    amountLabel: `${currency} ${bid.toLocaleString()}`,
    typeLabel: application.billingType || application.type || 'Fixed price',
    submittedLabel: formatSubmittedLabel(application.createdAt || application.submittedAt),
    job: {
      title: job?.title || application.jobTitle || 'Job posting',
      detailPath: job?.detailPath || `/find-work/work/${jobId}`,
      client: {
        name: job?.client?.name || application.clientName || 'Client',
      },
    },
  };
}

export function getProviderApplications() {
  return [...APPLICATIONS];
}

function normalizePostingStatus(status) {
  const value = String(status || 'OPEN').toUpperCase();
  if (value === 'COMPLETED') return 'completed';
  if (value === 'CLOSED' || value === 'CANCELLED') return 'closed';
  if (value === 'ACTIVE' || value === 'IN_PROGRESS') return 'in_progress';
  return 'open';
}

function buildPostingFromJob(job) {
  const jobId = String(job.id);
  const cached = FIND_WORK_JOBS.find((entry) => entry.id === jobId);
  const jobView =
    cached ||
    {
      id: jobId,
      title: job.title || 'Job posting',
      budgetLabel:
        job.budgetMin && job.budgetMax
          ? `${job.currency || 'KES'} ${Number(job.budgetMin).toLocaleString()} - ${Number(job.budgetMax).toLocaleString()}`
          : job.budget
            ? `${job.currency || 'KES'} ${Number(job.budget).toLocaleString()}`
            : 'TBD',
      budgetValue: Number(job.budgetMin || job.budget || 0),
      applicants: job.proposalsCount || job.applicants || 0,
      postedLabel: job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Recently',
      detailPath: `/find-work/work/${jobId}`,
    };

  return {
    job: jobView,
    status: normalizePostingStatus(job.status),
    views: Number(job.views || job.viewCount || 0),
    hire: job.hiredFreelancerName || job.hiredName || null,
    orderId: job.contractId || job.orderId || null,
  };
}

export function getClientPostedJobs() {
  return [...POSTINGS];
}

export function getRelatedFindWorkJobs(job, limit = 3) {
   if (!job || !job.categoryId) return [];
   
   // Find jobs in the same category, excluding the current job
   const related = FIND_WORK_JOBS
      .filter(j => j.id !== job.id && j.categoryId === job.categoryId)
      // Sort by relevance (simple approach: featured first, then by applicants)
      .sort((a, b) => {
         if (a.featured !== b.featured) return b.featured ? -1 : 1;
         return b.applicants - a.applicants;
      })
      .slice(0, limit);
   
   return related;
 }

export function getFindWorkStats() {
   const totalJobs = FIND_WORK_JOBS.length;
   const onlineJobs = FIND_WORK_JOBS.filter(job => job.workMode === 'online').length;
   const localJobs = FIND_WORK_JOBS.filter(job => job.workMode === 'local').length;
   const verifiedJobs = FIND_WORK_JOBS.filter(job => job.client?.verified).length;
   const urgentJobs = FIND_WORK_JOBS.filter(job => job.urgent).length;
   const totalApplicants = FIND_WORK_JOBS.reduce((sum, job) => sum + (job.applicants || 0), 0);
   
   return {
      totalJobs,
      onlineJobs,
      localJobs,
      verifiedJobs,
      urgentJobs,
      totalApplicants,
   };
 }

export function formatCompactNumber(value) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

const CLIENTS = {};
const FIND_WORK_JOBS = [];
const SAVED_JOBS = [];
const APPLICATIONS = [];
const POSTINGS = [];

function matchesQuery(job, query) {
  if (!query) return true;
  const haystack = [job.title, job.summary || job.description, job.specialization, job.category?.name, job.client?.name, job.locationLabel, ...(job.skills || [])]
    .join(' ')
    .toLowerCase();
  return query.toLowerCase().split(/\s+/).every((token) => haystack.includes(token));
}

async function fetchBackendJobs(filters = {}) {
  const { query = '', categoryId = '', workMode = 'all', limit = 50, sortBy = 'recommended' } = filters;
  const params = { limit };

  if (query) params.q = query;
  if (categoryId) params.category = categoryId;
  if (workMode !== 'all') params.type = workMode === 'local' ? 'ONSITE' : 'REMOTE';

  switch (sortBy) {
    case 'newest':
      params.sort = 'newest';
      break;
    case 'highest-budget':
      params.sort = 'budget_desc';
      break;
    case 'most-applicants':
      params.sort = 'applicants';
      break;
    default:
      params.sort = 'recommended';
  }

  const res = await publicAPI.searchJobs(params);
  return Array.isArray(res?.jobs) ? res.jobs : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
}

export async function syncJobsWithBackend(filters = {}) {
  try {
    const backendJobs = await fetchBackendJobs(filters);

    if (backendJobs.length === 0) return;

    const mappedJobs = backendJobs.map((job) => {
      const category = CATEGORY_CONFIG.find((c) => c.id === job.category || c.slug === job.category) || {
        id: job.category || 'general',
        name: job.category || 'General',
      };

      let skillsArray = [];
      try {
        skillsArray = typeof job.skills === 'string' ? JSON.parse(job.skills) : Array.isArray(job.skills) ? job.skills : [];
      } catch (_) {
        skillsArray = Array.isArray(job.skills) ? job.skills : [];
      }

      const clientKey = String(job.clientId || 'anon');
      if (!CLIENTS[clientKey]) {
        CLIENTS[clientKey] = {
          name: job.client?.name || 'Verified Client',
          verified: !!job.client?.verified,
          rating: job.client?.rating || 4.9,
          location: job.location || 'Remote',
          country: job.client?.country || 'Global',
          localTime: 'Active now',
          jobsPosted: job.client?.jobsPosted || 1,
          openJobs: 1,
          hireRate: '80%',
          totalSpent: '$10K+',
          activeHires: 1,
        };
      }

      const workMode =
        String(job.type || '').toUpperCase() === 'ONSITE' ||
        String(job.workMode || '').toLowerCase() === 'onsite'
          ? 'local'
          : 'online';
      const budgetLabel = job.budget && job.budgetMin && job.budgetMax
        ? `$${job.budgetMin} - $${job.budgetMax}`
        : job.budget
          ? `$${job.budget}`
          : 'TBD';

      return {
        ...job,
        id: String(job.id),
        title: job.title,
        summary: (job.description || job.summary || '').slice(0, 180),
        description: job.description || job.summary || '',
        specialization: skillsArray[0] || category.name || 'General',
        categoryId: category.id,
        category,
        clientId: clientKey,
        client: CLIENTS[clientKey],
        workMode,
        workModeLabel: workMode === 'local' ? 'Local / Onsite' : 'Remote / Online',
        budgetType: job.budgetType || (job.budgetMin && job.budgetMax ? 'Fixed' : 'Hourly'),
        budgetLabel,
        budgetValue: job.budgetMin || job.budget || 0,
        durationLabel: job.durationLabel || job.duration || 'Open',
        locationLabel: job.location || job.locationLabel || 'Remote',
        postedHoursAgo: job.postedHoursAgo || Math.max(1, (Date.now() - (new Date(job.createdAt).getTime() || Date.now())) / 3600000),
        applicants: job.proposalsCount || job.applicants || 0,
        proposalsCount: job.proposalsCount || 0,
        experienceLevel: job.experienceLevel || 'Expert',
        skills: skillsArray,
        featured: !!job.featured,
        urgent: !!job.urgent,
        saved: false,
        detailPath: `/find-work/work/${job.id}`,
        proposalPath: `/find-work/work/${job.id}/apply`,
        categoryPath: `/find-work/category/${category.id}`,
      };
    });

    FIND_WORK_JOBS.length = 0;
    FIND_WORK_JOBS.push(...mappedJobs);

    const categories = CATEGORY_CONFIG.map((cat) => ({
      ...cat,
      stats: {
        ...cat.stats,
        openJobs: FIND_WORK_JOBS.filter((job) => job.categoryId === cat.id).length,
      },
    }));

    CATEGORY_CONFIG.length = 0;
    CATEGORY_CONFIG.push(...categories);

    notifyFindWorkListeners();
   } catch (err) {
      console.error('[Live Sync] Failed to sync jobs with database:', err.message);
   }
}

export async function syncApplicationsWithBackend() {
   try {
      await syncJobsWithBackend({ limit: 100 });
      const backendApplications = await proposalAPI.getMyProposals({ limit: 100 });
      const applicationsData = extractApiList(backendApplications);

      APPLICATIONS.length = 0;
      APPLICATIONS.push(...applicationsData.map((application) => mapProviderApplication(application)));

      notifyFindWorkListeners();
   } catch (err) {
      console.error('[Live Sync] Failed to sync applications with backend:', err.message);
   }
}

export async function syncPostedJobsWithBackend() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const base = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${base}/jobs?mine=true&limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json().catch(() => ({}));
    const postedJobsData = extractApiList(body?.data ?? body);

    await syncJobsWithBackend({ limit: 100 });

    POSTINGS.length = 0;
    POSTINGS.push(...postedJobsData.map((job) => buildPostingFromJob(job)));
    notifyFindWorkListeners();
  } catch (err) {
    console.error('[Live Sync] Failed to sync posted jobs with backend:', err.message);
  }
}

export async function syncSavedJobsWithBackend() {
  try {
    const token =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token');
    if (!token) return;

    await syncJobsWithBackend({ limit: 100 });

    const base = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${base}/search/find-work/saved`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json().catch(() => ({}));
    const items = body?.data?.items ?? body?.data ?? body?.items ?? [];
    const ids = items.map((j) => String(j.id || j)).filter(Boolean);

    SAVED_JOBS.length = 0;
    SAVED_JOBS.push(...ids);
    notifyFindWorkListeners();
  } catch (err) {
    console.error('[Live Sync] Failed to sync saved jobs with backend:', err.message);
  }
}

export async function ensureFindWorkSynced(filters = {}) {
   if (FIND_WORK_JOBS.length === 0) {
      await syncJobsWithBackend(filters);
   }
   // Sync user-specific data when needed
   // These would typically be called when user context is available
   // await syncApplicationsWithBackend(filters);
   // await syncPostedJobsWithBackend(filters);
   // await syncSavedJobsWithBackend(filters);
}

if (typeof window !== 'undefined') {
   loadFindWorkCategories().then(() => {
      ensureFindWorkSynced();
   });
}
