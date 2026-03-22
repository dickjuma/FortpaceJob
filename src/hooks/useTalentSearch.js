import { useState, useEffect, useCallback } from "react";
import { talentAPI } from "../Services/talentAPI";

export const useTalentSearch = (initialParams = {}) => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState(initialParams);

  const searchTalents = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = { ...filters, ...params };
      const result = await talentAPI.searchTalents(searchParams);
      
      if (result.data) {
        setTalents(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch talents");
      console.error("Talent search error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const goToPage = useCallback((page) => {
    searchTalents({ page });
  }, [searchTalents]);

  useEffect(() => {
    searchTalents();
  }, [filters]);

  return {
    talents,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    clearFilters,
    goToPage,
    search: searchTalents,
  };
};

export default useTalentSearch;
