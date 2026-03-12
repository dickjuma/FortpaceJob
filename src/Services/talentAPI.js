/**
 * Talent API Service
 * Re-exports from main api.js for backwards compatibility
 */

import { userAPI } from "./api";

export const searchTalents = async (params) => {
  return userAPI.searchTalent(params);
};

export const getTalentProfile = async (userId) => {
  return userAPI.getProfile(userId);
};

export default {
  searchTalents,
  getTalentProfile,
};
