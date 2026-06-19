import { useEffect, useState } from 'react';
import { gigAPI, orderAPI, publicAPI, reviewAPI } from '../services/api';
import { extractList, gigCardFromApi } from '../utils/apiHelpers';

export function useFeaturedGigs(params = { limit: 12 }) {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        let raw;
        try {
          raw = await publicAPI.searchGigs(params);
        } catch {
          raw = await gigAPI.getGigs(params);
        }
        if (cancelled) return;
        setGigs(extractList(raw).map(gigCardFromApi));
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setGigs([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(params)]);

  return { gigs, loading, error };
}

export function useGigCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicAPI
      .getCategoryTree()
      .then((raw) => {
        if (cancelled) return;
        const tree = extractList(raw?.sections || raw?.data || raw);
        const flat = [];
        for (const section of tree) {
          for (const group of section.groups || []) {
            for (const role of group.roles || []) {
              flat.push({
                id: role.slug || role.id,
                name: role.name,
                count: role.openJobs || 0,
              });
            }
          }
        }
        setCategories(flat.slice(0, 24));
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}

export function useMyGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    gigAPI
      .getMyGigs()
      .then((raw) => {
        if (!cancelled) setGigs(extractList(raw).map(gigCardFromApi));
      })
      .catch(() => {
        if (!cancelled) setGigs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { gigs, loading };
}

export function useMyOrders(role = 'seller') {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    orderAPI
      .getMyOrders({ limit: 50 })
      .then((raw) => {
        if (!cancelled) setOrders(extractList(raw));
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [role]);

  return { orders, loading };
}

export function useGigReviews(gigId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gigId) return undefined;
    let cancelled = false;
    reviewAPI
      .getReviews(gigId, { limit: 30 })
      .then((raw) => {
        if (!cancelled) setReviews(extractList(raw));
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [gigId]);

  return { reviews, loading };
}

export function useTopSellers(limit = 10) {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicAPI
      .searchFreelancers({ limit, sortBy: 'rating' })
      .then((raw) => {
        if (!cancelled) {
          const list = extractList(raw?.talents || raw?.data || raw);
          setSellers(list);
        }
      })
      .catch(() => {
        if (!cancelled) setSellers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { sellers, loading };
}
