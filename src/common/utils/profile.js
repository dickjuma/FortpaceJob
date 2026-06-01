const clean = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim() || fallback;
  return value;
};

export const normalizeAccountType = (user = {}, profile = {}) => {
  const raw = clean(user.accountType || profile.accountType || profile.businessStructure || 'INDIVIDUAL', 'INDIVIDUAL');
  const upper = String(raw).toUpperCase();
  if (['INDIVIDUAL', 'SME', 'CORPORATE', 'AGENCY'].includes(upper)) return upper;
  return 'INDIVIDUAL';
};

export const getProfilePersona = (user = {}, profile = {}) => {
  const accountType = normalizeAccountType(user, profile);
  if (accountType === 'CORPORATE') return 'Corporate';
  if (accountType === 'SME' || accountType === 'AGENCY') return 'Business';
  return 'Individual';
};

export const getProfileDisplayName = (user = {}, profile = {}) => {
  const name =
    clean(profile.companyName) ||
    clean(profile.name) ||
    clean(user.companyName) ||
    clean(user.name) ||
    [clean(user.firstName), clean(user.lastName)].filter(Boolean).join(' ') ||
    clean(user.email, 'Member');
  return name || 'Member';
};

export const getProfileTitle = (user = {}, profile = {}) => {
  return clean(
    profile.professionalTitle ||
      profile.title ||
      profile.companyTagline ||
      profile.tagline ||
      profile.headline ||
      '',
    ''
  );
};

export const getProfileLocation = (user = {}, profile = {}) =>
  clean(profile.location || profile.city || user.location || user.city || 'Remote', 'Remote');

export const getProfileSummary = (user = {}, profile = {}) => {
  const accountType = normalizeAccountType(user, profile);
  const persona = getProfilePersona(user, profile);
  const displayName = getProfileDisplayName(user, profile);
  const title = getProfileTitle(user, profile);
  const location = getProfileLocation(user, profile);
  const companySize = clean(profile.companySize || user.companySize || '', '');
  const teamSize = clean(profile.teamSize || '', '');
  const industry = clean(profile.industry || '', '');
  const isBusiness = ['SME', 'CORPORATE', 'AGENCY'].includes(accountType);

  return {
    accountType,
    persona,
    displayName,
    title,
    location,
    industry,
    companySize,
    teamSize,
    isBusiness,
    companyName: clean(profile.companyName || user.companyName || '', ''),
    registrationNumber: clean(profile.registrationNumber || '', ''),
    website: clean(profile.website || user.website || '', ''),
    bio: clean(profile.bio || profile.description || user.bio || user.description || '', ''),
    hourlyRate: clean(profile.hourlyRate || user.hourlyRate || '', ''),
    availability: clean(profile.availability || 'ACTIVE', 'ACTIVE'),
    skills: Array.isArray(profile.skills) ? profile.skills : Array.isArray(user.skills) ? user.skills : [],
    languages: Array.isArray(profile.languages) ? profile.languages : [],
  };
};

export const getTalentTypeLabel = (item = {}) => {
  const accountType = normalizeAccountType(item, item.profile || {});
  if (accountType === 'CORPORATE') return 'Corporate';
  if (accountType === 'SME' || accountType === 'AGENCY') return 'SME / Studio';
  return 'Individual';
};
