import { useEffect, useState } from 'react';
import { publicAPI, workAPI } from '../services/api';
import { extractList, talentCardFromApi } from '../utils/apiHelpers';

export function usePublicFreelancers(params = {}) {
  const [talent, setTalent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicAPI
      .searchFreelancers({ limit: 24, ...params })
      .then((raw) => {
        if (!cancelled) {
          const list = extractList(raw?.talents || raw?.data || raw);
          setTalent(list.map(talentCardFromApi));
        }
      })
      .catch(() => {
        if (!cancelled) setTalent([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(params)]);

  return { talent, loading };
}

export function usePlatformReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicAPI
      .getPlatformReviews()
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
  }, []);

  return { reviews, loading };
}

export function useVideoFeed(limit = 20) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    workAPI
      .getVideoFeed({ limit })
      .then((raw) => {
        if (!cancelled) setVideos(extractList(raw));
      })
      .catch(() => {
        if (!cancelled) setVideos([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { videos, loading };
}
