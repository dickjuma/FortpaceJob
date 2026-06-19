import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../platform/common/authStore';
import { profileAPI } from '../../platform/common/services/api';
import { normalizeWorkMode, workModeToFlags } from '../../platform/common/constants/accountTypes';

const FreelancerContext = createContext();

export function FreelancerProvider({ children }) {
  const { user, updateUser } = useAuthStore();
  const [accountType, setAccountType] = useState('INDIVIDUAL');
  const [workMode, setWorkMode] = useState('ONLINE');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const profile = user?.profile || user || {};
    const type = String(profile.accountType || user?.accountType || 'INDIVIDUAL').toUpperCase();
    const mode = normalizeWorkMode(profile.workMode || profile.freelancerMode || (profile.isOfflineProvider ? 'OFFLINE' : 'ONLINE'));
    setAccountType(type);
    setWorkMode(mode);
    setHydrated(true);
  }, [user?.id, user?.accountType, user?.profile]);

  const persistProfile = useCallback(
    async (patch) => {
      const flags = patch.workMode ? workModeToFlags(patch.workMode) : {};
      const payload = {
        accountType: patch.accountType ?? accountType,
        workMode: patch.workMode ?? workMode,
        isOfflineProvider: flags.isOffline ?? patch.isOfflineProvider,
        isOnline: flags.isOnline,
        ...patch,
      };
      const res = await profileAPI.updateMyProfile(payload);
      if (res?.user) {
        updateUser(res.user);
      }
      return res;
    },
    [accountType, workMode, updateUser]
  );

  const switchAccountType = async (type) => {
    const upper = String(type).toUpperCase();
    setAccountType(upper);
    try {
      await persistProfile({ accountType: upper });
    } catch {
      // UI still updates locally
    }
  };

  const setWorkModeAndPersist = async (mode) => {
    const normalized = normalizeWorkMode(mode);
    setWorkMode(normalized);
    const flags = workModeToFlags(normalized);
    try {
      await persistProfile({
        workMode: normalized,
        isOfflineProvider: flags.isOffline,
        isOnline: flags.isOnline,
      });
    } catch {
      // keep local state
    }
  };

  const isOfflineProvider = workMode === 'OFFLINE' || workMode === 'HYBRID';

  const toggleOfflineProvider = () => {
    const next = workMode === 'OFFLINE' ? 'ONLINE' : workMode === 'ONLINE' ? 'OFFLINE' : 'HYBRID';
    setWorkModeAndPersist(next);
  };

  return (
    <FreelancerContext.Provider
      value={{
        accountType,
        workMode,
        isOfflineProvider,
        hydrated,
        switchAccountType,
        setWorkMode: setWorkModeAndPersist,
        toggleOfflineProvider,
        persistProfile,
      }}
    >
      {children}
    </FreelancerContext.Provider>
  );
}

export function useFreelancer() {
  const context = useContext(FreelancerContext);
  if (!context) {
    throw new Error('useFreelancer must be used within a FreelancerProvider');
  }
  return context;
}
