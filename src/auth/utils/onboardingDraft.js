const STORAGE_KEY = 'forte-auth-onboarding-draft';

const safeParse = (value) => {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
};

export const loadOnboardingDraft = () => safeParse(sessionStorage.getItem(STORAGE_KEY));

export const saveOnboardingDraft = (updates) => {
  const nextDraft = {
    ...loadOnboardingDraft(),
    ...updates,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextDraft));
  return nextDraft;
};

export const clearOnboardingDraft = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

const EXPERIENCE_TO_PROFILE = {
  BEGINNER: { skillLevel: 'JUNIOR', yearsOfExperience: 1 },
  INTERMEDIATE: { skillLevel: 'MID', yearsOfExperience: 3 },
  EXPERT: { skillLevel: 'EXPERT', yearsOfExperience: 8 },
  AGENCY: { skillLevel: 'SENIOR', yearsOfExperience: 10 },
};

const WORK_TYPE_TO_PROFILE = {
  remote: 'ONLINE',
  onsite: 'ONSITE',
  hybrid: 'HYBRID',
};

const COMMITMENT_TO_PROFILE = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  project: 'PROJECT_BASED',
};

export const buildProfilePayloadFromDraft = (draft, profileOverrides = {}) => {
  const normalizedSkills = Array.isArray(draft.skills)
    ? draft.skills
        .map((skill) => {
          if (typeof skill === 'string') return skill.trim();
          return skill?.name?.trim() || '';
        })
        .filter(Boolean)
    : [];

  const experience = EXPERIENCE_TO_PROFILE[draft.experienceLevel] || {};

  return {
    professionalTitle: profileOverrides.headline?.trim() || draft.headline?.trim() || undefined,
    bio: profileOverrides.bio?.trim() || draft.bio?.trim() || undefined,
    skills: normalizedSkills.length ? normalizedSkills : undefined,
    industriesOfInterest:
      Array.isArray(draft.industries) && draft.industries.length ? draft.industries : undefined,
    skillLevel: experience.skillLevel,
    yearsOfExperience: experience.yearsOfExperience,
    hourlyRate: draft.hourlyRate ? Number(draft.hourlyRate) : undefined,
    currency: draft.currency || undefined,
    availability: WORK_TYPE_TO_PROFILE[draft.workType] || undefined,
    availabilityType: COMMITMENT_TO_PROFILE[draft.commitment] || undefined,
    availableHours: draft.hours ? Number(draft.hours) : undefined,
    timezone: draft.timezone || undefined,
  };
};
