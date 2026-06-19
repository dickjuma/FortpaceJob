/**
 * Shared API response helpers — use everywhere instead of mock fallbacks.
 */
export function extractList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.gigs)) return payload.gigs;
  if (Array.isArray(payload.jobs)) return payload.jobs;
  if (Array.isArray(payload.talents)) return payload.talents;
  return [];
}

export function unwrapRecord(payload) {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
}

export function gigCardFromApi(gig, index = 0) {
  const id = gig.id || gig._id || `gig-${index}`;
  return {
    id,
    title: gig.title || 'Service',
    seller: gig.sellerName || gig.freelancer?.name || gig.owner?.name || 'Seller',
    rating: Number(gig.rating || gig.averageRating || 0),
    reviews: gig.totalReviews || gig.reviewsCount || gig.reviewCount || 0,
    price: Number(gig.price || gig.minPrice || gig.packages?.[0]?.price || 0),
    img: gig.coverImage || gig.thumbnail || gig.gallery?.[0]?.url || gig.image || '',
    slug: gig.slug || id,
    category: gig.category || gig.categoryId,
  };
}

export function talentCardFromApi(profile, index = 0) {
  return {
    id: profile.userId || profile.id || `talent-${index}`,
    name: profile.displayName || profile.name || 'Professional',
    title: profile.professionalTitle || profile.roleName || 'Freelancer',
    rating: Number(profile.rating || 0),
    reviews: Number(profile.reviewCount || profile.reviews || 0),
    hourlyRate: Number(profile.hourlyRate || 0),
    location: profile.location || 'Kenya',
    type: profile.workMode || 'online',
    imageUrl: profile.avatar || profile.avatarUrl || '',
    skills: profile.skills || [],
    verified: !!(profile.paymentVerified || profile.topRated),
  };
}
