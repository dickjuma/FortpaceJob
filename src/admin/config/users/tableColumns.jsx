export const ALL_USERS_COLUMNS = [
  { id: 'identity', label: 'User Identity', sortable: true },
  { id: 'group', label: 'Group / Role', sortable: true },
  { id: 'status', label: 'Account Status', sortable: true },
  { id: 'verification', label: 'Verification', sortable: true },
  { id: 'metric', label: 'Metric Performance', sortable: true },
  { id: 'lastActive', label: 'Last Active', sortable: true, hideOnMobile: true },
  { id: 'risk', label: 'Risk Level', sortable: true, hideOnMobile: true },
];

export const FREELANCER_COLUMNS = [
  ...ALL_USERS_COLUMNS.filter(c => c.id !== 'metric'),
  { id: 'earnings', label: 'Total Earnings', sortable: true },
  { id: 'rating', label: 'Rating', sortable: true },
  { id: 'contracts', label: 'Active Contracts', sortable: true },
];

export const CLIENT_COLUMNS = [
  ...ALL_USERS_COLUMNS.filter(c => c.id !== 'metric'),
  { id: 'spend', label: 'Total Spend', sortable: true },
  { id: 'industry', label: 'Industry', sortable: true },
];
