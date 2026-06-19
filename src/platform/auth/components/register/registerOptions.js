export const COUNTRY_OPTIONS = [
  { code: 'KE', label: 'Kenya', dialCode: '+254' },
  { code: 'UG', label: 'Uganda', dialCode: '+256' },
  { code: 'TZ', label: 'Tanzania', dialCode: '+255' },
  { code: 'RW', label: 'Rwanda', dialCode: '+250' },
  { code: 'NG', label: 'Nigeria', dialCode: '+234' },
  { code: 'ZA', label: 'South Africa', dialCode: '+27' },
  { code: 'GB', label: 'United Kingdom', dialCode: '+44' },
  { code: 'US', label: 'United States', dialCode: '+1' },
  { code: 'CA', label: 'Canada', dialCode: '+1' },
  { code: 'AE', label: 'United Arab Emirates', dialCode: '+971' },
  { code: 'IN', label: 'India', dialCode: '+91' },
  { code: 'DE', label: 'Germany', dialCode: '+49' },
];

export const COMPANY_SIZE_OPTIONS = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
];

export const TEAM_SIZE_OPTIONS = [
  { value: 'solo', label: 'Solo operator' },
  { value: '2-5', label: '2-5 team members' },
  { value: '6-20', label: '6-20 team members' },
  { value: '21-100', label: '21-100 team members' },
  { value: '100+', label: '100+ team members' },
];

export const INDUSTRY_OPTIONS = [
  'Software & Technology',
  'Design & Creative',
  'Construction & Onsite Services',
  'Marketing & Growth',
  'Finance & Accounting',
  'Legal & Compliance',
  'Healthcare & Wellness',
  'Education & Training',
  'Retail & Ecommerce',
  'Manufacturing & Operations',
].map((item) => ({ value: item, label: item }));

export const SKILL_CATEGORY_OPTIONS = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Brand Design',
  'Content Writing',
  'Digital Marketing',
  'Video Editing',
  'Virtual Assistance',
  'Construction Trades',
  'Electrical & Mechanical',
].map((item) => ({ value: item, label: item }));

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: 'entry', label: 'Entry level' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'senior', label: 'Senior' },
  { value: 'expert', label: 'Expert / Lead' },
];

export const HIRING_NEEDS_OPTIONS = [
  { value: 'single-project', label: 'Single project hiring' },
  { value: 'ongoing-freelancers', label: 'Ongoing freelancers' },
  { value: 'managed-team', label: 'Managed team or agency' },
  { value: 'enterprise-procurement', label: 'Enterprise procurement' },
];

export const RESERVED_USERNAMES = [
  'admin',
  'support',
  'forte',
  'marketplace',
  'billing',
  'security',
  'help',
  'jobs',
  'client',
  'freelancer',
];

export function getCountryOption(code) {
  return COUNTRY_OPTIONS.find((item) => item.code === code) || COUNTRY_OPTIONS[0];
}
