const CATEGORY_CONFIG = [
  {
    id: 'web-development',
    name: 'Web Development',
    summary: 'Frontend, backend, cloud, and product engineering roles from startups to enterprise teams.',
    longDescription: 'Browse engineering work across React, Node.js, cloud infrastructure, API development, and performance optimization.',
    specializations: [
      'Frontend Engineering',
      'Backend Engineering',
      'Full Stack Product Development',
      'DevOps & Cloud Architecture',
      'Data Visualization',
      'QA Automation',
    ],
    accentClass: 'bg-brand-100 text-brand-700',
  },
  {
    id: 'design-creative',
    name: 'Design & Creative',
    summary: 'Product design, brand systems, visual storytelling, and experience design projects.',
    longDescription: 'Find UI/UX, design systems, brand identity, and creative production work from fast-moving product teams.',
    specializations: [
      'Product Design',
      'Design Systems',
      'UX Research',
      'Brand Identity',
      'Motion Design',
      'Presentation Design',
    ],
    accentClass: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'marketing-sales',
    name: 'Marketing & Sales',
    summary: 'Growth, lifecycle, demand generation, content, and conversion-focused work.',
    longDescription: 'Explore retained and project-based marketing work spanning SEO, paid acquisition, CRM, and B2B growth operations.',
    specializations: [
      'Lifecycle Marketing',
      'Content Strategy',
      'Performance Marketing',
      'SEO & Organic Growth',
      'Sales Enablement',
      'Marketing Analytics',
    ],
    accentClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'data-ai',
    name: 'Data & AI',
    summary: 'Analytics, machine learning, automation, copilots, and data engineering roles.',
    longDescription: 'Find AI product, data science, analytics engineering, and workflow automation engagements with clear delivery scopes.',
    specializations: [
      'AI Integrations',
      'LLM Workflows',
      'Analytics Engineering',
      'Machine Learning',
      'BI Dashboards',
      'Data Pipelines',
    ],
    accentClass: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 'local-services',
    name: 'Local Services',
    summary: 'Onsite service work for IT support, photography, facilities, installations, and urgent dispatch.',
    longDescription: 'Search high-trust local gigs that require boots-on-the-ground execution, fast response time, and location-based availability.',
    specializations: [
      'IT Support',
      'Electrical',
      'Photography',
      'Facilities Maintenance',
      'Onsite Installations',
      'Emergency Dispatch',
    ],
    accentClass: 'bg-amber-100 text-amber-700',
  },
];

const CLIENTS = {
  vault: {
    name: 'Vault Finance',
    verified: true,
    rating: 4.9,
    location: 'San Francisco, CA',
    country: 'United States',
    localTime: '1:30 PM local time',
    jobsPosted: 45,
    openJobs: 12,
    hireRate: '82%',
    totalSpent: '$120K+',
    activeHires: 5,
  },
  acme: {
    name: 'Acme Corp',
    verified: true,
    rating: 4.8,
    location: 'Austin, TX',
    country: 'United States',
    localTime: '11:30 AM local time',
    jobsPosted: 28,
    openJobs: 6,
    hireRate: '88%',
    totalSpent: '$84K+',
    activeHires: 4,
  },
  northstar: {
    name: 'Northstar Health',
    verified: true,
    rating: 4.7,
    location: 'Chicago, IL',
    country: 'United States',
    localTime: '12:30 PM local time',
    jobsPosted: 17,
    openJobs: 3,
    hireRate: '79%',
    totalSpent: '$63K+',
    activeHires: 2,
  },
  brightlabs: {
    name: 'BrightLabs AI',
    verified: true,
    rating: 5,
    location: 'Remote First',
    country: 'United States',
    localTime: 'EST collaboration window',
    jobsPosted: 11,
    openJobs: 4,
    hireRate: '91%',
    totalSpent: '$41K+',
    activeHires: 3,
  },
  orbit: {
    name: 'Orbit Commerce',
    verified: true,
    rating: 4.9,
    location: 'New York, NY',
    country: 'United States',
    localTime: '2:30 PM local time',
    jobsPosted: 39,
    openJobs: 8,
    hireRate: '86%',
    totalSpent: '$98K+',
    activeHires: 6,
  },
  retailhq: {
    name: 'Retail HQ',
    verified: true,
    rating: 4.8,
    location: 'Brooklyn, NY',
    country: 'United States',
    localTime: '2:30 PM local time',
    jobsPosted: 22,
    openJobs: 5,
    hireRate: '84%',
    totalSpent: '$52K+',
    activeHires: 2,
  },
  summitlive: {
    name: 'Summit Live Events',
    verified: true,
    rating: 4.9,
    location: 'Jersey City, NJ',
    country: 'United States',
    localTime: '2:30 PM local time',
    jobsPosted: 9,
    openJobs: 2,
    hireRate: '77%',
    totalSpent: '$24K+',
    activeHires: 1,
  },
  civicgrid: {
    name: 'Civic Grid',
    verified: false,
    rating: 4.5,
    location: 'Queens, NY',
    country: 'United States',
    localTime: '2:30 PM local time',
    jobsPosted: 6,
    openJobs: 1,
    hireRate: '68%',
    totalSpent: '$12K+',
    activeHires: 1,
  },
};

const FIND_WORK_JOBS = [
  {
    id: 'react-dashboard-rebuild',
    title: 'Senior React Engineer for Enterprise Analytics Dashboard',
    workMode: 'online',
    categoryId: 'web-development',
    specialization: 'Frontend Engineering',
    budgetType: 'Fixed',
    budgetLabel: '$5,000 - $8,000',
    budgetValue: 8000,
    durationLabel: '1-3 months',
    locationLabel: 'Worldwide (Timezone overlap with EST preferred)',
    postedHoursAgo: 2,
    applicants: 12,
    experienceLevel: 'Expert',
    summary: 'Lead a React and TypeScript rebuild for a mission-critical analytics surface used by finance teams daily.',
    description: [
      'We are rebuilding our flagship B2B analytics dashboard and need a senior frontend engineer who is comfortable owning architecture decisions, data-heavy interfaces, and performance tuning.',
      'You will collaborate with our design system lead and backend platform team to create a polished, enterprise-ready experience with charts, filtering, permissions, and live updates.',
    ],
    responsibilities: [
      'Build scalable React components with Tailwind CSS and TypeScript.',
      'Own frontend integration with REST APIs and auth-protected workflows.',
      'Optimize rendering performance for large data tables and dashboard widgets.',
    ],
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'REST APIs', 'State Management'],
    clientId: 'vault',
    featured: true,
    saved: true,
    attachment: { name: 'Enterprise_Dashboard_Brief.pdf', type: 'brief' },
  },
  {
    id: 'mobile-banking-ux-redesign',
    title: 'Lead Product Designer for Mobile Banking Redesign',
    workMode: 'online',
    categoryId: 'design-creative',
    specialization: 'Product Design',
    budgetType: 'Hourly',
    budgetLabel: '$60 - $90/hr',
    budgetValue: 90,
    durationLabel: '6-8 weeks',
    locationLabel: 'Remote',
    postedHoursAgo: 5,
    applicants: 24,
    experienceLevel: 'Expert',
    summary: 'Reimagine onboarding, payments, and account surfaces for a rapidly growing mobile finance app.',
    description: [
      'We need a hands-on senior product designer to rethink our core banking flows and help ship polished UX across mobile surfaces.',
      'This role includes research synthesis, interaction design, stakeholder reviews, and delivery-ready Figma components.',
    ],
    responsibilities: [
      'Audit existing product flows and identify UX friction.',
      'Design high-fidelity mobile screens and reusable components.',
      'Collaborate with engineering during handoff and iteration.',
    ],
    skills: ['Figma', 'Mobile UX', 'Design Systems', 'Interaction Design', 'User Research'],
    clientId: 'acme',
    featured: true,
    saved: true,
    attachment: { name: 'Onboarding_Flow_Notes.docx', type: 'notes' },
  },
  {
    id: 'aws-migration-architect',
    title: 'AWS Architect for Multi-Database Migration',
    workMode: 'online',
    categoryId: 'data-ai',
    specialization: 'Data Pipelines',
    budgetType: 'Hourly',
    budgetLabel: '$110 - $150/hr',
    budgetValue: 150,
    durationLabel: '8-10 weeks',
    locationLabel: 'Remote with US business hours',
    postedHoursAgo: 18,
    applicants: 8,
    experienceLevel: 'Expert',
    summary: 'Design and execute a phased migration from legacy infrastructure to modern AWS data services.',
    description: [
      'We are consolidating fragmented data systems and need an architect who can plan a low-risk migration path across operational and analytics workloads.',
      'The engagement includes migration design, infrastructure recommendations, runbooks, and coordination with internal platform engineers.',
    ],
    responsibilities: [
      'Assess the current database topology and migration constraints.',
      'Design the target AWS architecture and cutover plan.',
      'Document rollback paths, observability, and handoff guidance.',
    ],
    skills: ['AWS', 'RDS', 'Data Migration', 'Terraform', 'Architecture', 'DevOps'],
    clientId: 'orbit',
    featured: true,
    attachment: { name: 'Current_State_Architecture.png', type: 'diagram' },
  },
  {
    id: 'seo-content-engineer',
    title: 'B2B SEO Content Strategist for Developer Product',
    workMode: 'online',
    categoryId: 'marketing-sales',
    specialization: 'SEO & Organic Growth',
    budgetType: 'Fixed',
    budgetLabel: '$2,500 - $3,500',
    budgetValue: 3500,
    durationLabel: '4 weeks',
    locationLabel: 'Remote',
    postedHoursAgo: 30,
    applicants: 17,
    experienceLevel: 'Intermediate',
    summary: 'Own keyword strategy and technical-content planning for a fast-growing API product.',
    description: [
      'We are launching a new developer-focused acquisition funnel and need a strategist who can connect keyword demand with credible technical content.',
      'You will define content clusters, editorial direction, and measurement plans for a 90-day SEO sprint.',
    ],
    responsibilities: [
      'Build a keyword and topic map around product use cases.',
      'Create content briefs for technical writers and SMEs.',
      'Recommend internal-linking and conversion improvements.',
    ],
    skills: ['SEO', 'Content Strategy', 'B2B SaaS', 'Keyword Research', 'Analytics'],
    clientId: 'brightlabs',
    saved: true,
    attachment: { name: 'Quarterly_Growth_Targets.xlsx', type: 'spreadsheet' },
  },
  {
    id: 'product-analytics-frontend',
    title: 'Frontend Engineer for Product Analytics Workspace',
    workMode: 'online',
    categoryId: 'web-development',
    specialization: 'Data Visualization',
    budgetType: 'Hourly',
    budgetLabel: '$70 - $100/hr',
    budgetValue: 100,
    durationLabel: '2 months',
    locationLabel: 'Remote',
    postedHoursAgo: 43,
    applicants: 19,
    experienceLevel: 'Expert',
    summary: 'Ship event funnels, cohort tables, and exploration tooling for a product analytics suite.',
    description: [
      'You will help extend a product analytics workspace used by PMs and growth teams to interpret customer behavior.',
      'The ideal contractor is strong in charts, complex filtering, and user-friendly data visualization patterns.',
    ],
    responsibilities: [
      'Build reusable analytics views and filter controls.',
      'Implement performant data-fetching and table virtualization.',
      'Partner closely with product and backend engineers.',
    ],
    skills: ['React', 'Data Visualization', 'TypeScript', 'TanStack Table', 'UX'],
    clientId: 'northstar',
    attachment: { name: 'Analytics_Backlog.pdf', type: 'brief' },
  },
  {
    id: 'ai-chatbot-integration',
    title: 'AI Support Copilot Integration for SaaS Help Center',
    workMode: 'online',
    categoryId: 'data-ai',
    specialization: 'LLM Workflows',
    budgetType: 'Fixed',
    budgetLabel: '$4,000 - $6,500',
    budgetValue: 6500,
    durationLabel: '5 weeks',
    locationLabel: 'Remote',
    postedHoursAgo: 56,
    applicants: 11,
    experienceLevel: 'Expert',
    summary: 'Design and implement an AI support copilot that connects knowledge-base content with ticketing workflows.',
    description: [
      'We want to deploy an internal support copilot that suggests answers, drafts replies, and routes tickets based on customer intent.',
      'This project includes prompt flows, retrieval quality, evaluation strategy, and safe integration patterns.',
    ],
    responsibilities: [
      'Design retrieval and response orchestration for support use cases.',
      'Integrate source-of-truth content and guardrails.',
      'Define evaluation metrics for response quality and escalation.',
    ],
    skills: ['LLMs', 'RAG', 'Node.js', 'API Integration', 'Prompt Design', 'Observability'],
    clientId: 'brightlabs',
    attachment: { name: 'Support_Workflow_Map.pdf', type: 'brief' },
  },
  {
    id: 'lifecycle-marketing-audit',
    title: 'Lifecycle Marketing Audit for Subscription Funnel',
    workMode: 'online',
    categoryId: 'marketing-sales',
    specialization: 'Lifecycle Marketing',
    budgetType: 'Fixed',
    budgetLabel: '$1,800 - $2,400',
    budgetValue: 2400,
    durationLabel: '2 weeks',
    locationLabel: 'Remote',
    postedHoursAgo: 72,
    applicants: 14,
    experienceLevel: 'Intermediate',
    summary: 'Audit lifecycle triggers, onboarding emails, and retention flows for a consumer subscription product.',
    description: [
      'We need a lifecycle expert to review our current onboarding and retention journeys and propose concrete improvements.',
      'The work includes messaging, segmentation, funnel insights, and a roadmap for quick wins.',
    ],
    responsibilities: [
      'Review email, push, and in-product lifecycle touchpoints.',
      'Identify high-impact onboarding and churn-reduction opportunities.',
      'Provide experiment ideas with estimated impact.',
    ],
    skills: ['Lifecycle Marketing', 'CRM', 'Retention', 'Copy Strategy', 'Experimentation'],
    clientId: 'acme',
  },
  {
    id: 'figma-design-system-audit',
    title: 'Figma Design System Audit for B2B Platform',
    workMode: 'online',
    categoryId: 'design-creative',
    specialization: 'Design Systems',
    budgetType: 'Fixed',
    budgetLabel: '$2,200 - $3,000',
    budgetValue: 3000,
    durationLabel: '3 weeks',
    locationLabel: 'Remote',
    postedHoursAgo: 96,
    applicants: 9,
    experienceLevel: 'Intermediate',
    summary: 'Audit a growing design system for consistency, scalability, and engineering handoff quality.',
    description: [
      'Our internal design system grew quickly and needs a cleanup pass to improve structure, tokens, and maintainability.',
      'You will review component patterns, naming, variants, and documentation gaps across our main workspace.',
    ],
    responsibilities: [
      'Audit library health and identify inconsistencies.',
      'Recommend token and component governance improvements.',
      'Create a prioritized cleanup roadmap for the product team.',
    ],
    skills: ['Figma', 'Design Systems', 'Documentation', 'UI Governance'],
    clientId: 'orbit',
  },
  {
    id: 'emergency-electrician-retail',
    title: 'Emergency Electrician for Retail Buildout',
    workMode: 'local',
    categoryId: 'local-services',
    specialization: 'Electrical',
    budgetType: 'Hourly',
    budgetLabel: '$150/hr',
    budgetValue: 150,
    durationLabel: 'Immediate dispatch',
    locationLabel: 'Brooklyn Heights, NY',
    distanceLabel: '3.5 mi away',
    postedHoursAgo: 1,
    applicants: 2,
    experienceLevel: 'Expert',
    summary: 'Urgent onsite electrical support needed to resolve failing circuits before store opening.',
    description: [
      'We need a licensed commercial electrician onsite today to inspect and restore a circuit issue impacting a retail fit-out.',
      'The scope includes diagnosing the fault, documenting the issue, and coordinating with the site manager on resolution steps.',
    ],
    responsibilities: [
      'Arrive onsite within the required response window.',
      'Diagnose the issue and restore safe operation where possible.',
      'Provide a short written summary for facilities records.',
    ],
    skills: ['Electrical', 'Commercial Fit-out', 'Troubleshooting', 'Compliance'],
    clientId: 'retailhq',
    featured: true,
    urgent: true,
    attachment: { name: 'Store_Electrical_Layout.jpg', type: 'photo' },
  },
  {
    id: 'onsite-it-support-hq',
    title: 'Onsite IT Support Specialist for Executive HQ',
    workMode: 'local',
    categoryId: 'local-services',
    specialization: 'IT Support',
    budgetType: 'Hourly',
    budgetLabel: '$45 - $65/hr',
    budgetValue: 65,
    durationLabel: '2-day engagement',
    locationLabel: 'Jersey City, NJ',
    distanceLabel: '8.0 mi away',
    postedHoursAgo: 9,
    applicants: 7,
    experienceLevel: 'Intermediate',
    summary: 'Provide white-glove desk-side support and conference room troubleshooting for an executive workspace move.',
    description: [
      'We need an experienced onsite IT professional to support executive workstations, conferencing setups, and move-day device checks.',
      'The role blends end-user support with a strong service mindset and attention to detail.',
    ],
    responsibilities: [
      'Support device setup, Wi-Fi checks, and A/V troubleshooting.',
      'Coordinate onsite with facilities and office management.',
      'Document resolved issues and escalation items.',
    ],
    skills: ['IT Support', 'A/V', 'Networking', 'Executive Support'],
    clientId: 'civicgrid',
    attachment: { name: 'Move_Day_Checklist.pdf', type: 'brief' },
  },
  {
    id: 'event-photographer-summit',
    title: 'Event Photographer for Executive Leadership Summit',
    workMode: 'local',
    categoryId: 'local-services',
    specialization: 'Photography',
    budgetType: 'Fixed',
    budgetLabel: '$800 - $1,200',
    budgetValue: 1200,
    durationLabel: 'Single-day event',
    locationLabel: 'Midtown Manhattan, NY',
    distanceLabel: '0.5 mi away',
    postedHoursAgo: 14,
    applicants: 5,
    experienceLevel: 'Intermediate',
    summary: 'Capture keynote, networking, and branded event moments for executive comms and social use.',
    description: [
      'We are hiring an event photographer for an executive summit and need polished, same-week delivery for internal and external channels.',
      'Experience with corporate events, direction, and fast post-production is preferred.',
    ],
    responsibilities: [
      'Capture keynote, networking, and sponsor moments.',
      'Deliver edited selects with light color correction.',
      'Provide both portrait and landscape formats.',
    ],
    skills: ['Photography', 'Event Coverage', 'Editing', 'Corporate Events'],
    clientId: 'summitlive',
    featured: true,
    saved: true,
    attachment: { name: 'Brand_Shot_List.pdf', type: 'brief' },
  },
  {
    id: 'commercial-plumber-dispatch',
    title: 'Commercial Plumber Needed for Same-Day Leak Containment',
    workMode: 'local',
    categoryId: 'local-services',
    specialization: 'Emergency Dispatch',
    budgetType: 'Hourly',
    budgetLabel: '$140 - $180/hr',
    budgetValue: 180,
    durationLabel: 'Today',
    locationLabel: 'Downtown Manhattan, NY',
    distanceLabel: '1.2 mi away',
    postedHoursAgo: 0.5,
    applicants: 1,
    experienceLevel: 'Expert',
    summary: 'Respond immediately to a commercial leak impacting a tenant suite and prevent further damage.',
    description: [
      'A water line issue is affecting an occupied tenant floor and we need a rapid-response plumber who can contain the issue and advise next steps.',
      'This is an urgent dispatch with facilities coordination required onsite.',
    ],
    responsibilities: [
      'Contain the leak and stabilize the affected area.',
      'Coordinate onsite with building management.',
      'Document recommendations for permanent repair.',
    ],
    skills: ['Plumbing', 'Emergency Response', 'Commercial Maintenance'],
    clientId: 'retailhq',
    urgent: true,
    attachment: { name: 'Building_Access_Instructions.txt', type: 'notes' },
  },
];

const SAVED_JOBS = [
  { jobId: 'react-dashboard-rebuild', savedAtLabel: '2 hours ago' },
  { jobId: 'mobile-banking-ux-redesign', savedAtLabel: '1 day ago' },
  { jobId: 'event-photographer-summit', savedAtLabel: '3 days ago' },
  { jobId: 'seo-content-engineer', savedAtLabel: '1 week ago' },
];

const APPLICATIONS = [
  {
    id: 'app-1001',
    jobId: 'react-dashboard-rebuild',
    status: 'pending',
    amountLabel: '$6,200',
    typeLabel: 'Fixed',
    submittedLabel: '2 days ago',
  },
  {
    id: 'app-1002',
    jobId: 'aws-migration-architect',
    status: 'interviewing',
    amountLabel: '$140/hr',
    typeLabel: 'Hourly',
    submittedLabel: '4 days ago',
  },
  {
    id: 'app-1003',
    jobId: 'product-analytics-frontend',
    status: 'accepted',
    amountLabel: '$85/hr',
    typeLabel: 'Hourly',
    submittedLabel: '1 week ago',
    orderId: 'ORD-2048',
  },
  {
    id: 'app-1004',
    jobId: 'seo-content-engineer',
    status: 'rejected',
    amountLabel: '$3,100',
    typeLabel: 'Fixed',
    submittedLabel: '2 weeks ago',
  },
];

const POSTINGS = [
  { jobId: 'react-dashboard-rebuild', status: 'open', views: 345 },
  { jobId: 'aws-migration-architect', status: 'in_progress', views: 120, hire: 'Sarah W.', orderId: 'ORD-2048' },
  { jobId: 'mobile-banking-ux-redesign', status: 'completed', views: 560, hire: 'Jordan M.' },
  { jobId: 'seo-content-engineer', status: 'closed', views: 190 },
];

function normalize(value) {
  return String(value || '').toLowerCase();
}

function formatHoursAgo(hours) {
  if (hours < 1) {
    return 'Posted just now';
  }
  if (hours < 24) {
    const rounded = Math.round(hours);
    return `Posted ${rounded} hour${rounded === 1 ? '' : 's'} ago`;
  }
  const days = Math.round(hours / 24);
  return `Posted ${days} day${days === 1 ? '' : 's'} ago`;
}

function getBudgetAverage(job) {
  return job.budgetValue;
}

function decorateJob(job) {
  const category = CATEGORY_CONFIG.find((item) => item.id === job.categoryId);
  const client = CLIENTS[job.clientId];

  return {
    ...job,
    category,
    client,
    postedLabel: formatHoursAgo(job.postedHoursAgo),
    workModeLabel: job.workMode === 'local' ? 'Local / Onsite' : 'Remote / Online',
    detailPath: `/find-work/work/${job.id}`,
    proposalPath: `/find-work/work/${job.id}/apply`,
    categoryPath: `/find-work/category/${job.categoryId}`,
  };
}

function matchesQuery(job, query) {
  if (!query) {
    return true;
  }

  const haystack = [
    job.title,
    job.summary,
    job.specialization,
    job.category.name,
    job.client.name,
    job.locationLabel,
    ...(job.skills || []),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalize(query));
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function getFindWorkCategories() {
  return CATEGORY_CONFIG.map((category) => {
    const openJobs = FIND_WORK_JOBS.filter((job) => job.categoryId === category.id).length;
    return {
      ...category,
      openJobs,
      openJobsLabel: formatCompactNumber(openJobs),
      path: `/find-work/category/${category.id}`,
    };
  });
}

export function getFindWorkCategoryById(categoryId) {
  return getFindWorkCategories().find((category) => category.id === categoryId) || null;
}

export function getFindWorkJobs(filters = {}) {
  const {
    query = '',
    workMode = 'all',
    categoryIds = [],
    categoryId = '',
    budgetTypes = [],
    experienceLevels = [],
    verifiedOnly = false,
    establishedClientsOnly = false,
    urgentOnly = false,
    locationQuery = '',
    featuredOnly = false,
    savedOnly = false,
    sortBy = 'recommended',
  } = filters;

  let jobs = FIND_WORK_JOBS.map(decorateJob);

  if (workMode !== 'all') {
    jobs = jobs.filter((job) => job.workMode === workMode);
  }

  if (categoryId) {
    jobs = jobs.filter((job) => job.categoryId === categoryId);
  }

  if (categoryIds.length > 0) {
    jobs = jobs.filter((job) => categoryIds.includes(job.categoryId));
  }

  if (budgetTypes.length > 0) {
    jobs = jobs.filter((job) => budgetTypes.includes(job.budgetType));
  }

  if (experienceLevels.length > 0) {
    jobs = jobs.filter((job) => experienceLevels.includes(job.experienceLevel));
  }

  if (verifiedOnly) {
    jobs = jobs.filter((job) => job.client.verified);
  }

  if (establishedClientsOnly) {
    jobs = jobs.filter((job) => job.client.jobsPosted >= 10);
  }

  if (urgentOnly) {
    jobs = jobs.filter((job) => job.urgent);
  }

  if (featuredOnly) {
    jobs = jobs.filter((job) => job.featured);
  }

  if (savedOnly) {
    jobs = jobs.filter((job) => job.saved);
  }

  if (locationQuery) {
    const locationNeedle = normalize(locationQuery);
    jobs = jobs.filter((job) => normalize(job.locationLabel).includes(locationNeedle));
  }

  jobs = jobs.filter((job) => matchesQuery(job, query));

  switch (sortBy) {
    case 'newest':
      jobs.sort((a, b) => a.postedHoursAgo - b.postedHoursAgo);
      break;
    case 'highest-budget':
      jobs.sort((a, b) => getBudgetAverage(b) - getBudgetAverage(a));
      break;
    case 'most-applicants':
      jobs.sort((a, b) => b.applicants - a.applicants);
      break;
    case 'recommended':
    default:
      jobs.sort((a, b) => {
        const scoreA =
          (a.featured ? 20 : 0) +
          (a.urgent ? 10 : 0) +
          (a.client.verified ? 5 : 0) +
          Math.max(0, 72 - a.postedHoursAgo);
        const scoreB =
          (b.featured ? 20 : 0) +
          (b.urgent ? 10 : 0) +
          (b.client.verified ? 5 : 0) +
          Math.max(0, 72 - b.postedHoursAgo);
        return scoreB - scoreA;
      });
      break;
  }

  return jobs;
}

export function getFindWorkJobById(jobId) {
  return getFindWorkJobs().find((job) => String(job.id) === String(jobId)) || null;
}

export function getFeaturedFindWorkJobs(limit = 3) {
  return getFindWorkJobs({ featuredOnly: true, sortBy: 'recommended' }).slice(0, limit);
}

export function getSavedFindWorkJobs() {
  return SAVED_JOBS.map((saved) => {
    const job = getFindWorkJobById(saved.jobId);
    return job ? { ...job, savedAtLabel: saved.savedAtLabel } : null;
  }).filter(Boolean);
}

export function getProviderApplications() {
  return APPLICATIONS.map((application) => {
    const job = getFindWorkJobById(application.jobId);
    return {
      ...application,
      job,
    };
  }).filter((application) => application.job);
}

export function getClientPostedJobs() {
  return POSTINGS.map((posting) => {
    const job = getFindWorkJobById(posting.jobId);
    return {
      ...posting,
      job,
    };
  }).filter((posting) => posting.job);
}

export function getRelatedFindWorkJobs(job, limit = 3) {
  if (!job) {
    return [];
  }

  return getFindWorkJobs({
    workMode: job.workMode,
    categoryId: job.categoryId,
    sortBy: 'recommended',
  })
    .filter((item) => item.id !== job.id)
    .slice(0, limit);
}

export function getFindWorkStats() {
  const jobs = getFindWorkJobs();
  const onlineJobs = jobs.filter((job) => job.workMode === 'online').length;
  const localJobs = jobs.filter((job) => job.workMode === 'local').length;
  const verifiedJobs = jobs.filter((job) => job.client.verified).length;
  const urgentJobs = jobs.filter((job) => job.urgent).length;

  return {
    totalJobs: jobs.length,
    onlineJobs,
    localJobs,
    verifiedJobs,
    urgentJobs,
    totalApplicants: jobs.reduce((sum, job) => sum + job.applicants, 0),
  };
}
