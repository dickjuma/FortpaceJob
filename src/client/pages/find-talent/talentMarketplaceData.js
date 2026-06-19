import { publicAPI } from '../../../platform/common/services/api';

const listeners = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribeToTalentData(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let TALENT_CATEGORIES = [];
let TALENT_TOP_LEVEL = [];
let categoryLoadPromise = null;
let categoryLoadedAt = 0;
const CATEGORY_CACHE_MS = Number(process.env.REACT_APP_CATEGORY_CACHE_MS) || 30 * 60 * 1000;

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function flattenCategoryTree(nodes) {
  const out = [];
  for (const node of nodes) {
    const isOnline = node.isOnline !== false;
    const isOffline = node.isOffline !== false;
    const kind = isOnline && isOffline ? 'hybrid' : isOnline ? 'online' : 'onsite';

    out.push({
      id: String(node.id || node.slug),
      name: node.name || node.title,
      slug: node.slug,
      kind,
      description: node.description || '',
      heroTitle: node.name || node.title,
      heroDescription: node.description || '',
      hourlyRange: node.hourlyRange || '',
      featuredSkills: (node.featuredSkills || node.skills || []).map(s => typeof s === 'string' ? s : s?.name || ''),
      subcategories: (node.children || []).map(c => c.name || c.title),
      parentId: node.parentId,
      isOnline,
      isOffline,
      stats: node.stats || {},
      _raw: node,
    });

    if (node.children?.length) {
      out.push(...flattenCategoryTree(node.children));
    }
  }
  return out;
}

export async function loadTalentCategories() {
  if (TALENT_CATEGORIES.length > 0 && Date.now() - categoryLoadedAt < CATEGORY_CACHE_MS) {
    return TALENT_CATEGORIES;
  }
  if (categoryLoadPromise) return categoryLoadPromise;

  categoryLoadPromise = (async () => {
    try {
      const res = await publicAPI.getCategoryTree();
      const tree = Array.isArray(res?.tree) ? res.tree : [];
      TALENT_TOP_LEVEL = tree.map((node) => {
        const isOnline = node.isOnline !== false;
        const isOffline = node.isOffline !== false;
        const kind = isOnline && isOffline ? 'hybrid' : isOnline ? 'online' : 'onsite';
        return {
          id: String(node.id || node.slug),
          slug: node.slug,
          name: node.name || node.title,
          kind,
          workMode: node.workMode || kind,
          description: node.description || '',
          roleCount: node.stats?.roles || (node.children || []).length,
          stats: { talentCount: 0 },
          _raw: node,
        };
      });
      TALENT_CATEGORIES = flattenCategoryTree(tree);
      categoryLoadedAt = Date.now();
      return TALENT_CATEGORIES;
    } catch (err) {
      console.error('[talentMarketplaceData] Failed to load categories from API:', err.message);
      return [];
    } finally {
      categoryLoadPromise = null;
    }
  })();

  return categoryLoadPromise;
}

export function getLoadedTalentCategories() {
  return TALENT_CATEGORIES;
}

export function getTalentCategories(kind = 'all') {
  const cats = TALENT_TOP_LEVEL.length ? TALENT_TOP_LEVEL : TALENT_CATEGORIES.filter((c) => !c.parentId);
  if (!cats.length) return [];
  return kind === 'all' ? cats : cats.filter((c) => c.kind === kind || c.workMode === kind);
}

export function getTalentCategoryById(categoryId) {
  return TALENT_CATEGORIES.find(
    (category) => category.id === categoryId || category.slug === categoryId || slugify(category.name) === categoryId
  );
}

const TALENT = [];

export function getTalentById(talentId) {
  return TALENT.find((talent) => talent.id === talentId);
}

export function getTalentByIds(ids) {
  return ids.map((id) => getTalentById(id)).filter(Boolean);
}

function matchesQuery(talent, query) {
  if (!query) return true;
  const haystack = [
    talent.name,
    talent.title,
    talent.headline,
    talent.categoryId,
    talent.categoryName,
    talent.location,
    talent.workType,
    ...(talent.skills || []),
    ...(talent.matchKeywords || []),
  ]
    .join(' ')
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .every((token) => haystack.includes(token));
}

function matchesFilters(talent, filters = {}) {
  const {
    query = '',
    mode = 'all',
    categoryIds = [],
    location = '',
    badges = [],
    rate = 'all',
    availability = 'all',
    provider = 'all',
    urgent = false,
    verifiedOnly = false,
  } = filters;

  if (!matchesQuery(talent, query)) return false;
  if (mode !== 'all' && !(talent.modes || []).includes(mode)) return false;
  if (filters.sectionSlug) {
    const section = normalizeText(filters.sectionSlug);
    const talentSection = normalizeText(talent.sectionSlug || talent.categoryId);
    if (talentSection !== section && !normalizeText(talent.categoryId).includes(section)) return false;
  }
  if (categoryIds.length && !categoryIds.includes(talent.categoryId) && !categoryIds.includes(talent.sectionSlug)) return false;
  if (location && !normalizeText(talent.location).includes(normalizeText(location)) && !normalizeText(talent.serviceArea).includes(normalizeText(location))) return false;
  if (verifiedOnly && !talent.verified) return false;
  if (badges.length && !badges.every((badge) => (talent.badges || []).some((item) => normalizeText(item).includes(normalizeText(badge))))) return false;

  if (availability !== 'all') {
    const current = normalizeText(talent.availability);
    if (availability === 'now' && !current.includes('available now')) return false;
    if (availability === 'week' && !(current.includes('week') || current.includes('now'))) return false;
  }

  if (provider !== 'all' && talent.providerType !== provider) return false;

  if (rate !== 'all') {
    if (rate === 'low' && talent.hourlyRate >= 60) return false;
    if (rate === 'mid' && (talent.hourlyRate < 60 || talent.hourlyRate > 110)) return false;
    if (rate === 'high' && talent.hourlyRate <= 110) return false;
  }

  if (urgent && !(talent.availableNow || normalizeText(talent.availability).includes('available now'))) return false;

  return true;
}

function subscriptionTierBoost(talent) {
  const tier = talent.subscriptionPlanId || talent.subscriptionTier || 'basic';
  const explicit = Number(talent.matchingPriorityBoost) || 0;
  if (explicit > 0) return explicit;
  if (tier === 'corporate') return 45;
  if (tier === 'sme') return 18;
  return 0;
}

function recommendationScore(talent, context = {}) {
  let score = (talent.rating || 0) * 10 + (talent.jobSuccess || 0) * 0.5 + (talent.topRated ? 20 : 0);
  if (context.sectionSlug && talent.sectionSlug === context.sectionSlug) score += 25;
  if (context.roleSlug && talent.roleSlug === context.roleSlug) score += 35;
  if (context.skills?.length && talent.skills?.length) {
    const overlap = talent.skills.filter((s) =>
      context.skills.some((q) => normalizeText(s).includes(normalizeText(q)))
    ).length;
    score += overlap * 6;
  }
  score += subscriptionTierBoost(talent);
  if (talent.featuredProfile) score += 12;
  return score;
}

function sortTalent(talentList, sortBy = 'recommended', context = {}) {
  const list = [...talentList];
  const sorters = {
    recommended: (a, b) => recommendationScore(b, context) - recommendationScore(a, context),
    rating: (a, b) => (b.rating === a.rating ? b.reviews - a.reviews : b.rating - a.rating),
    rate_low: (a, b) => a.hourlyRate - b.hourlyRate,
    rate_high: (a, b) => b.hourlyRate - a.hourlyRate,
    response: (a, b) => a.responseTime.localeCompare(b.responseTime),
    recent: (a, b) => (a.recentViewedHoursAgo || 999) - (b.recentViewedHoursAgo || 999),
  };
  return list.sort(sorters[sortBy] || sorters.recommended);
}

export function getMarketplaceTalent(filters = {}) {
  return sortTalent(TALENT.filter((talent) => matchesFilters(talent, filters)), filters.sortBy, filters);
}

export function getFeaturedTalent(limit = 6) {
  const ranked = sortTalent(TALENT, 'recommended');
  const featured = ranked.filter((t) => t.topRated);
  const pool = featured.length ? featured : ranked;
  return pool.slice(0, limit);
}

export function getRecommendedTalent(context = {}) {
  return sortTalent(TALENT, 'recommended', context)
    .slice(0, 6)
    .map((talent) => ({
      ...talent,
      matchScore: Math.min(99, Math.round(recommendationScore(talent, context))),
    }));
}

export function getRelatedTalent(talentId) {
  const current = getTalentById(talentId);
  if (!current) return [];
  return TALENT.filter((talent) => talent.id !== talentId)
    .map((talent) => {
      const sharedSkills = talent.skills.filter((skill) => current.skills.includes(skill)).length;
      const score = sharedSkills + (talent.categoryId === current.categoryId ? 3 : 0);
      return { talent, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.talent);
}

export function getRecentlyViewedTalent() {
  return [...TALENT]
    .filter((talent) => talent.recentViewedHoursAgo !== undefined)
    .sort((a, b) => a.recentViewedHoursAgo - b.recentViewedHoursAgo)
    .slice(0, 6);
}

export function getMarketplaceStats() {
  return {
    totalTalent: TALENT.length,
    categories: TALENT_CATEGORIES.length,
  };
}

export function formatCompactNumber(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`;
  }
  return String(value);
}

const SAVED_FOLDERS = [
  { id: 'folder-engineering', name: 'Engineering Bench', description: 'Senior builders for roadmap-critical work.' },
  { id: 'folder-design', name: 'Design Bench', description: 'Product and brand specialists under consideration.' },
  { id: 'folder-growth', name: 'Growth Operators', description: 'Experts for acquisition, retention, and analytics.' },
  { id: 'folder-local', name: 'Local Field Pros', description: 'Nearby onsite specialists for urgent work.' },
  { id: 'folder-product', name: 'Product Ops', description: 'Cross-functional support for launches and onboarding.' },
];

export function getSavedFolders() {
  return SAVED_FOLDERS.map((folder) => ({
    ...folder,
    count: TALENT.filter((talent) => (talent.savedFolderIds || []).includes(folder.id)).length,
  }));
}

export function getSavedTalent(folderId = null) {
  return folderId
    ? TALENT.filter((talent) => (talent.savedFolderIds || []).includes(folderId))
    : TALENT.filter((talent) => (talent.savedFolderIds || []).length);
}

export function getShortlist() {
  return [];
}

export function getClientOpenings() {
  return [];
}

export function getRecentMarketplaceActivity() {
  return [];
}

export function getCityDirectory() {
  return [];
}

export function getIndustrySpotlights() {
  return [];
}

async function fetchBackendTalentsAndJobs(filters = {}) {
  const {
    query = '',
    categoryId = '',
    categoryIds = [],
    sectionSlug = '',
    mode = 'all',
    sortBy = 'recommended',
    limit = 50,
  } = filters;
  const params = { limit, sort: sortBy };

  if (filters.sectionSlug) params.section = filters.sectionSlug;
  if (categoryId) params.category = categoryId;
  if (categoryIds.length) params.categories = Array.from(new Set(categoryIds)).join(',');
  if (mode === 'online') params.onlineOnly = 'true';
  if (mode === 'onsite') params.offlineOnly = 'true';
  if (mode === 'hybrid') params.mode = 'hybrid';
  if (query) params.query = query;

  const res = await publicAPI.searchFreelancers(params);
  return Array.isArray(res?.talents) ? res.talents : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
}

export async function syncTalentWithBackend(filters = {}) {
  try {
    const backendTalent = await fetchBackendTalentsAndJobs(filters);

    const mappedTalent = backendTalent.map((freelancer) => {
      let skillsArray = [];
      try {
        skillsArray = freelancer.skills ? JSON.parse(freelancer.skills) : [];
        if (!Array.isArray(skillsArray)) skillsArray = [freelancer.skills];
      } catch (_) {
        skillsArray = freelancer.skills ? [freelancer.skills] : [];
      }

      const username =
        freelancer.user?.name ||
        freelancer.fullName ||
        [freelancer.firstName, freelancer.lastName].filter(Boolean).join(' ') ||
        'Forte Specialist';
      const slugId = freelancer.user?.username || freelancer.id || String(freelancer.userId);
      const categoryId = freelancer.category || freelancer.categoryId || freelancer.primaryCategoryId || '';
      const sectionSlug = freelancer.sectionSlug || categoryId;
      const roleSlug = freelancer.roleSlug || '';
      const matchedCategory =
        TALENT_TOP_LEVEL.find((c) => c.id === categoryId || c.slug === categoryId || c.slug === sectionSlug) ||
        TALENT_CATEGORIES.find((c) => c.id === categoryId || c.slug === categoryId);

      const wm = String(freelancer.workMode || matchedCategory?.workMode || matchedCategory?.kind || 'online').toLowerCase();
      const modes =
        wm === 'hybrid'
          ? ['online', 'onsite', 'hybrid']
          : wm === 'onsite' || wm === 'offline'
            ? ['onsite']
            : ['online'];

      return {
        id: String(slugId),
        name: username,
        providerType: 'freelancer',
        title: freelancer.professionalTitle || freelancer.title || 'Freelancer',
        headline: (freelancer.bio || '').slice(0, 80) || 'Marketplace certified professional.',
        categoryId: matchedCategory?.id || categoryId,
        categoryName: matchedCategory?.name || freelancer.roleName || '',
        sectionSlug,
        roleSlug,
        roleName: freelancer.roleName || '',
        subscriptionPlanId: freelancer.subscriptionPlanId || 'basic',
        subscriptionTier: freelancer.subscriptionTier || freelancer.subscriptionPlanId || 'basic',
        matchingPriorityBoost: freelancer.matchingPriorityBoost || 0,
        featuredProfile: freelancer.featuredProfile || false,
        modes,
        location: freelancer.location || 'Remote',
        timezone: freelancer.timezone || 'UTC+3',
        localTime: 'Active now',
        hourlyRate: freelancer.hourlyRate || 50,
        rating: freelancer.averageRating || 4.9,
        reviews: freelancer.completedJobs || freelancer.reviewCount || 12,
        jobSuccess: 99,
        verified: freelancer.paymentVerified || false,
        topRated: freelancer.topRated || false,
        risingTalent: freelancer.risingTalent || false,
        responseTime: freelancer.responseTime || '1 hour',
        availability: freelancer.availability || 'Available now',
        workType: modes.includes('hybrid') ? 'Remote or hybrid' : 'Remote only',
        completedJobs: freelancer.completedJobs || 12,
        totalEarned: (freelancer.completedJobs || 12) * (freelancer.hourlyRate || 50) * 10,
        englishLevel: 'Fluent',
        languages: ['English'],
        skills: skillsArray,
        serviceArea: freelancer.location || 'Global',
        distance: 5,
        eta: 'Today',
        availableNow: true,
        bio: freelancer.bio ? [freelancer.bio] : ['Experienced professional committed to delivery on Forte.'],
        description: freelancer.professionalTitle || 'Freelancer',
        badges: freelancer.topRated ? ['Top Rated Plus', 'Identity Verified'] : ['Identity Verified'],
        certifications: [],
        verifications: ['Identity Verified', 'Payment Verified'],
        services: [
          {
            id: `svc-${freelancer.id || slugId}-1`,
            title: freelancer.primaryGigTitle || 'Professional Service',
            price: (freelancer.hourlyRate || 50) * 20,
            delivery: '7 days',
            summary: 'High-quality delivery aligned with your requirements.',
          },
        ],
        portfolio: [],
        experience: [],
        reviewsList: [{ author: 'Verified Client', rating: 5, quote: 'Highly professional, great delivery.' }],
        savedFolderIds: [],
        recentViewedHoursAgo: 2,
        matchScore: freelancer.matchScore !== undefined ? freelancer.matchScore : (freelancer.topRated ? 92 : 85),
        matchKeywords: skillsArray.map((s) => (typeof s === 'string' ? s.toLowerCase() : '')),
      };
    });

    TALENT.length = 0;
    TALENT.push(...mappedTalent);

    const counts = mappedTalent.reduce((acc, talent) => {
      const key = talent.categoryId || talent.sectionSlug || talent.roleSlug || 'uncategorized';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const updateStats = (categoryList) => {
      categoryList.forEach((category) => {
        category.stats = {
          ...category.stats,
          talentCount: counts[category.id] || counts[category.slug] || 0,
        };
      });
    };

    updateStats(TALENT_TOP_LEVEL);
    updateStats(TALENT_CATEGORIES);

    notifyListeners();
  } catch (err) {
    console.error('[Live Sync] Failed to sync talent:', err.message);
  }
}

let isTalentSynced = false;
export async function ensureTalentSynced(filters = {}) {
  if (!isTalentSynced) {
    isTalentSynced = true;
    syncTalentWithBackend(filters);
  }
}

if (typeof window !== 'undefined') {
  loadTalentCategories().then(() => {
    ensureTalentSynced();
  });
}
