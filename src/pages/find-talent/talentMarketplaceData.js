const TALENT_CATEGORIES = [
  {
    id: 'development',
    name: 'Development & IT',
    kind: 'online',
    description: 'Software engineers, product builders, DevOps specialists, and technical consultants.',
    heroTitle: 'Development & IT Talent',
    heroDescription: 'Build products faster with senior engineers, cloud architects, and technical leads.',
    hourlyRange: '$55 - $180/hr',
    featuredSkills: ['React', 'Node.js', 'AWS', 'TypeScript', 'Python'],
    subcategories: ['Web Development', 'Mobile Apps', 'Backend', 'DevOps', 'Cybersecurity'],
  },
  {
    id: 'design',
    name: 'Design & Creative',
    kind: 'online',
    description: 'Brand designers, product designers, illustrators, video editors, and creative strategists.',
    heroTitle: 'Design & Creative Talent',
    heroDescription: 'Hire designers who can take a product from concept to polished launch assets.',
    hourlyRange: '$45 - $150/hr',
    featuredSkills: ['Figma', 'Design Systems', 'Motion', 'Branding', 'Video Editing'],
    subcategories: ['Product Design', 'Brand Design', 'Motion Design', 'Video Editing', 'Creative Direction'],
  },
  {
    id: 'marketing',
    name: 'Marketing & Growth',
    kind: 'online',
    description: 'Performance marketers, SEO strategists, content leads, and lifecycle specialists.',
    heroTitle: 'Marketing & Growth Talent',
    heroDescription: 'Scale acquisition, retention, and conversion with proven growth experts.',
    hourlyRange: '$40 - $140/hr',
    featuredSkills: ['SEO', 'Paid Media', 'Lifecycle Marketing', 'Analytics', 'Content Strategy'],
    subcategories: ['SEO', 'Paid Media', 'Email Marketing', 'Content Strategy', 'Growth Ops'],
  },
  {
    id: 'data-ai',
    name: 'Data & AI',
    kind: 'online',
    description: 'Data engineers, ML practitioners, analysts, and AI product consultants.',
    heroTitle: 'Data & AI Talent',
    heroDescription: 'Turn raw data into insights, predictive workflows, and production-ready AI systems.',
    hourlyRange: '$65 - $190/hr',
    featuredSkills: ['Python', 'SQL', 'TensorFlow', 'LLM Ops', 'Data Visualization'],
    subcategories: ['Analytics', 'Machine Learning', 'Data Engineering', 'BI Dashboards', 'AI Automation'],
  },
  {
    id: 'electrical',
    name: 'Electrical & Smart Systems',
    kind: 'onsite',
    description: 'Licensed electricians, smart-home installers, and infrastructure technicians.',
    heroTitle: 'Electrical & Smart Systems Pros',
    heroDescription: 'Book licensed professionals for installations, repairs, diagnostics, and upgrades.',
    hourlyRange: '$85 - $165/hr',
    featuredSkills: ['Panel Upgrades', 'Wiring', 'Smart Home Setup', 'EV Chargers', 'Diagnostics'],
    subcategories: ['Residential Wiring', 'Commercial Installations', 'Smart Homes', 'EV Chargers', 'Emergency Repairs'],
  },
  {
    id: 'repairs',
    name: 'Home Repair & Field Services',
    kind: 'onsite',
    description: 'Plumbers, maintenance crews, HVAC technicians, and on-call repair specialists.',
    heroTitle: 'Repair & Field Service Talent',
    heroDescription: 'Find dependable local pros for urgent repairs, scheduled maintenance, and installations.',
    hourlyRange: '$70 - $150/hr',
    featuredSkills: ['Plumbing', 'HVAC', 'Appliance Repair', 'Preventive Maintenance', 'Inspections'],
    subcategories: ['Plumbing', 'HVAC', 'Appliance Repair', 'Maintenance', 'Emergency Visits'],
  },
  {
    id: 'operations',
    name: 'Operations & Support',
    kind: 'hybrid',
    description: 'Project managers, coordinators, customer support leads, and implementation specialists.',
    heroTitle: 'Operations & Support Talent',
    heroDescription: 'Hire operational talent that keeps projects, clients, and internal systems running smoothly.',
    hourlyRange: '$35 - $120/hr',
    featuredSkills: ['Project Management', 'Customer Support', 'Vendor Coordination', 'SOPs', 'Reporting'],
    subcategories: ['Project Management', 'Implementation', 'Support', 'Operations', 'Admin'],
  },
];

const CLIENT_OPENINGS = [
  {
    id: 'job-frontend-replatform',
    title: 'Frontend Replatform for B2B SaaS',
    categoryId: 'development',
    budgetLabel: '$12k - $18k fixed',
    workType: 'Remote',
    location: 'Global',
    requiredSkills: ['React', 'TypeScript', 'Design Systems', 'GraphQL'],
  },
  {
    id: 'job-ai-analytics',
    title: 'AI Analytics Dashboard MVP',
    categoryId: 'data-ai',
    budgetLabel: '$90 - $130/hr',
    workType: 'Remote',
    location: 'North America',
    requiredSkills: ['Python', 'SQL', 'Dashboards', 'LLM Ops'],
  },
  {
    id: 'job-smart-building',
    title: 'Smart Building Electrical Upgrade',
    categoryId: 'electrical',
    budgetLabel: '$4k - $7k project',
    workType: 'Onsite',
    location: 'San Francisco, CA',
    requiredSkills: ['Panel Upgrades', 'Smart Home Setup', 'Diagnostics'],
  },
];

const TALENT = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    providerType: 'freelancer',
    title: 'Senior Full Stack Developer',
    headline: 'Scalable React and Node.js systems for SaaS and marketplace teams.',
    categoryId: 'development',
    modes: ['online', 'hybrid'],
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    localTime: '9:42 AM',
    hourlyRate: 95,
    rating: 4.9,
    reviews: 128,
    jobSuccess: 99,
    verified: true,
    topRated: true,
    risingTalent: false,
    responseTime: '10 minutes',
    availability: 'Available now',
    workType: 'Remote or hybrid',
    completedJobs: 36,
    totalEarned: 184000,
    englishLevel: 'Native',
    languages: ['English', 'French'],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'GraphQL'],
    serviceArea: 'San Francisco Bay Area',
    distance: 6.5,
    eta: 'Tomorrow',
    availableNow: true,
    bio: [
      'I help B2B and marketplace teams ship modern web products with strong architecture, clean delivery processes, and measurable performance gains.',
      'Over the past eight years I have led replatforms, launch squads, and product rebuilds for high-growth startups and enterprise teams.',
    ],
    description: 'Senior engineer trusted for roadmap-critical frontend and full-stack builds.',
    badges: ['Top Rated Plus', 'Identity Verified', 'Enterprise Ready'],
    certifications: [
      { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
      { title: 'Professional Scrum Master I', issuer: 'Scrum.org' },
    ],
    verifications: ['Identity Verified', 'Payment Verified', 'Phone Verified'],
    services: [
      { id: 'svc-react-platform', title: 'React Platform Build', price: 2400, delivery: '14 days', summary: 'Production-grade frontend architecture, implementation, and QA handoff.' },
      { id: 'svc-node-apis', title: 'Node API Architecture', price: 3200, delivery: '21 days', summary: 'Scalable APIs, auth flows, data modeling, and cloud deployment guidance.' },
    ],
    portfolio: [
      { title: 'Marketplace Replatform', summary: 'Reduced checkout drop-off by 18% after a full React migration.', impact: '18% conversion lift' },
      { title: 'Enterprise Billing Dashboard', summary: 'Built a multi-tenant billing admin used by 40+ finance operators.', impact: '40% faster reconciliation' },
    ],
    experience: [
      { company: 'Northline Labs', role: 'Lead Full Stack Engineer', period: '2022 - Present' },
      { company: 'BluePeak Commerce', role: 'Senior Frontend Engineer', period: '2019 - 2022' },
    ],
    reviewsList: [
      { author: 'Acme Cloud', rating: 5, quote: 'Sarah brought calm, senior judgment and hit every milestone on time.' },
      { author: 'Vertex Health', rating: 5, quote: 'Our team trusted her with core architecture after the first week.' },
    ],
    savedFolderIds: ['folder-product', 'folder-engineering'],
    recentViewedHoursAgo: 1,
    matchKeywords: ['react', 'node', 'marketplace', 'saas', 'graphql'],
  },
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    providerType: 'freelancer',
    title: 'Principal Product Designer',
    headline: 'Design systems, UX strategy, and polished interfaces for complex products.',
    categoryId: 'design',
    modes: ['online'],
    location: 'Barcelona, Spain',
    timezone: 'CET (UTC+1)',
    localTime: '6:42 PM',
    hourlyRate: 88,
    rating: 5,
    reviews: 94,
    jobSuccess: 100,
    verified: true,
    topRated: true,
    risingTalent: false,
    responseTime: '25 minutes',
    availability: 'Available this week',
    workType: 'Remote only',
    completedJobs: 29,
    totalEarned: 152000,
    englishLevel: 'Fluent',
    languages: ['English', 'Spanish'],
    skills: ['Figma', 'Design Systems', 'UX Research', 'Product Strategy', 'Prototyping'],
    bio: [
      'I partner with product teams to turn fuzzy ideas into cohesive user journeys, documented systems, and production-ready interfaces.',
      'My work spans SaaS, fintech, and health products where usability and trust matter deeply.',
    ],
    description: 'Product designer for high-stakes web apps and premium customer journeys.',
    badges: ['Top Rated Plus', 'Identity Verified'],
    certifications: [{ title: 'NN/g UX Certification', issuer: 'Nielsen Norman Group' }],
    verifications: ['Identity Verified', 'Payment Verified'],
    services: [
      { id: 'svc-design-system', title: 'Design System Sprint', price: 1800, delivery: '10 days', summary: 'Audit, component spec, and foundation tokens for product teams.' },
      { id: 'svc-ux-audit', title: 'UX Conversion Audit', price: 950, delivery: '5 days', summary: 'Heuristic analysis plus prioritized improvements for acquisition flows.' },
    ],
    portfolio: [
      { title: 'Enterprise Design System', summary: 'Designed a 160-component system for a global HR platform.', impact: '2x faster design delivery' },
      { title: 'Fintech Onboarding Redesign', summary: 'Redesigned onboarding and KYC for a B2B fintech product.', impact: '26% activation lift' },
    ],
    experience: [
      { company: 'Studio Orbit', role: 'Principal Product Designer', period: '2021 - Present' },
      { company: 'Luma Finance', role: 'Senior UX Designer', period: '2017 - 2021' },
    ],
    reviewsList: [
      { author: 'Helio HR', rating: 5, quote: 'Alex gave us the rare mix of strategy and hands-on craft.' },
    ],
    savedFolderIds: ['folder-design'],
    recentViewedHoursAgo: 3,
    matchKeywords: ['ux', 'design system', 'figma', 'saas', 'conversion'],
  },
  {
    id: 'maya-patel',
    name: 'Maya Patel',
    providerType: 'freelancer',
    title: 'Growth Marketing Strategist',
    headline: 'Performance acquisition, SEO, and lifecycle systems that compound growth.',
    categoryId: 'marketing',
    modes: ['online'],
    location: 'London, United Kingdom',
    timezone: 'BST (UTC+1)',
    localTime: '5:42 PM',
    hourlyRate: 72,
    rating: 4.9,
    reviews: 163,
    jobSuccess: 98,
    verified: true,
    topRated: true,
    risingTalent: false,
    responseTime: '35 minutes',
    availability: 'Available now',
    workType: 'Remote only',
    completedJobs: 44,
    totalEarned: 141000,
    englishLevel: 'Native',
    languages: ['English', 'Hindi'],
    skills: ['SEO', 'Paid Media', 'Lifecycle Marketing', 'Analytics', 'Content Strategy'],
    bio: [
      'I help product-led companies build growth systems that move beyond one-channel dependency.',
      'My work usually combines acquisition, retention, and reporting into one accountable roadmap.',
    ],
    description: 'Growth partner for startups scaling acquisition and retention.',
    badges: ['Top Rated', 'Identity Verified'],
    certifications: [{ title: 'Google Ads Search Certification', issuer: 'Google' }],
    verifications: ['Identity Verified', 'Phone Verified'],
    services: [
      { id: 'svc-growth-audit', title: 'Full Funnel Growth Audit', price: 1200, delivery: '7 days', summary: 'Acquisition, conversion, lifecycle, and reporting review with a 90-day plan.' },
    ],
    portfolio: [
      { title: 'SEO Recovery Program', summary: 'Recovered organic traffic after a site migration for a health SaaS team.', impact: '63% traffic rebound' },
    ],
    experience: [
      { company: 'Northstar Growth', role: 'Independent Growth Lead', period: '2020 - Present' },
    ],
    reviewsList: [
      { author: 'PulseBoard', rating: 5, quote: 'Maya gave us an operator-level growth plan, not vague marketing advice.' },
    ],
    savedFolderIds: ['folder-growth'],
    recentViewedHoursAgo: 5,
    matchKeywords: ['seo', 'paid media', 'email', 'growth', 'analytics'],
  },
  {
    id: 'david-chen',
    name: 'David Chen',
    providerType: 'freelancer',
    title: 'Licensed Master Electrician',
    headline: 'Residential and commercial electrical work with fast emergency response.',
    categoryId: 'electrical',
    modes: ['onsite', 'hybrid'],
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    localTime: '9:42 AM',
    hourlyRate: 125,
    rating: 5,
    reviews: 91,
    jobSuccess: 100,
    verified: true,
    topRated: true,
    risingTalent: false,
    responseTime: '15 minutes',
    availability: 'Available now',
    workType: 'Onsite specialist',
    completedJobs: 58,
    totalEarned: 208000,
    englishLevel: 'Native',
    languages: ['English', 'Mandarin'],
    skills: ['Panel Upgrades', 'Wiring', 'Diagnostics', 'Smart Home Setup', 'EV Chargers'],
    serviceArea: 'San Francisco, Oakland, Daly City',
    distance: 1.8,
    eta: '30 minutes',
    availableNow: true,
    bio: [
      'I handle fast-response diagnostics, rewiring, smart-home upgrades, and code-compliant installations for homes and small commercial spaces.',
      'Clients usually bring me in when they need clean work, strong communication, and dependable follow-through.',
    ],
    description: 'Fast-response electrical expert for residential and commercial work.',
    badges: ['Background Checked', 'License Verified', 'Emergency Ready'],
    certifications: [{ title: 'California C-10 Electrical License', issuer: 'State of California' }],
    verifications: ['Identity Verified', 'Background Checked', 'License Verified'],
    services: [
      { id: 'svc-electrical-inspection', title: 'Electrical Inspection Visit', price: 280, delivery: 'Same day', summary: 'Onsite diagnostics, risk review, and next-step estimate.' },
    ],
    portfolio: [
      { title: 'Smart Office Retrofit', summary: 'Upgraded lighting, access, and smart controls for a 9,000 sq ft office.', impact: '22% lower energy use' },
    ],
    experience: [
      { company: 'Bay Current Electric', role: 'Owner-Operator', period: '2018 - Present' },
    ],
    reviewsList: [
      { author: 'Foundry Labs', rating: 5, quote: 'David solved an urgent panel issue faster than any local vendor we called.' },
    ],
    savedFolderIds: ['folder-local'],
    recentViewedHoursAgo: 2,
    matchKeywords: ['electrician', 'smart home', 'onsite', 'emergency', 'wiring'],
  },
  {
    id: 'sarah-miller',
    name: 'Sarah Miller',
    providerType: 'freelancer',
    title: 'Plumbing and Maintenance Specialist',
    headline: 'Reliable onsite plumbing, maintenance, and repair support for homes and retail spaces.',
    categoryId: 'repairs',
    modes: ['onsite'],
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    localTime: '9:42 AM',
    hourlyRate: 98,
    rating: 4.8,
    reviews: 146,
    jobSuccess: 97,
    verified: true,
    topRated: false,
    risingTalent: false,
    responseTime: '20 minutes',
    availability: 'Available now',
    workType: 'Onsite specialist',
    completedJobs: 63,
    totalEarned: 132000,
    englishLevel: 'Native',
    languages: ['English'],
    skills: ['Plumbing', 'Leak Repair', 'Fixture Install', 'Maintenance', 'Emergency Visits'],
    serviceArea: 'San Francisco Metro',
    distance: 3.1,
    eta: '45 minutes',
    availableNow: true,
    bio: [
      'I help homeowners and business operators solve repair issues quickly without sacrificing clean workmanship or communication.',
    ],
    description: 'Trusted local pro for urgent plumbing and maintenance work.',
    badges: ['Background Checked', 'Fast Response'],
    certifications: [{ title: 'Journeyman Plumber License', issuer: 'State of California' }],
    verifications: ['Identity Verified', 'Background Checked'],
    services: [
      { id: 'svc-plumbing-emergency', title: 'Emergency Plumbing Dispatch', price: 220, delivery: 'Same day', summary: 'Rapid-response diagnostics and stabilization for urgent issues.' },
    ],
    portfolio: [
      { title: 'Restaurant Repair Program', summary: 'Managed urgent fixes and preventive maintenance for a three-location group.', impact: '40% fewer downtime incidents' },
    ],
    experience: [
      { company: 'Harbor Home Services', role: 'Field Specialist', period: '2019 - Present' },
    ],
    reviewsList: [
      { author: 'Main Street Retail', rating: 5, quote: 'Clear, punctual, and great with tenants and staff.' },
    ],
    savedFolderIds: ['folder-local'],
    recentViewedHoursAgo: 7,
    matchKeywords: ['plumbing', 'repair', 'onsite', 'emergency', 'maintenance'],
  },
  {
    id: 'marcus-johnson',
    name: 'Marcus Johnson',
    providerType: 'freelancer',
    title: 'Cloud and DevOps Architect',
    headline: 'Infrastructure, observability, and delivery pipelines for scaling teams.',
    categoryId: 'development',
    modes: ['online'],
    location: 'New York, NY',
    timezone: 'EST (UTC-5)',
    localTime: '12:42 PM',
    hourlyRate: 140,
    rating: 4.8,
    reviews: 76,
    jobSuccess: 96,
    verified: true,
    topRated: false,
    risingTalent: false,
    responseTime: '45 minutes',
    availability: 'Available next week',
    workType: 'Remote only',
    completedJobs: 25,
    totalEarned: 198000,
    englishLevel: 'Native',
    languages: ['English'],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Observability'],
    bio: [
      'I help engineering teams harden delivery pipelines, simplify infrastructure, and reduce firefighting.',
    ],
    description: 'Senior infrastructure partner for cloud modernization and delivery reliability.',
    badges: ['Identity Verified', 'Enterprise Ready'],
    certifications: [{ title: 'AWS DevOps Engineer - Professional', issuer: 'Amazon Web Services' }],
    verifications: ['Identity Verified', 'Payment Verified'],
    services: [
      { id: 'svc-devops-audit', title: 'DevOps and Cloud Audit', price: 2600, delivery: '7 days', summary: 'Architecture review, risks, and a prioritized remediation roadmap.' },
    ],
    portfolio: [
      { title: 'Kubernetes Migration', summary: 'Led a phased migration from ECS to Kubernetes with zero downtime.', impact: '34% infrastructure savings' },
    ],
    experience: [
      { company: 'Altitude Systems', role: 'Cloud Architect', period: '2021 - Present' },
    ],
    reviewsList: [
      { author: 'Summit Billing', rating: 5, quote: 'Marcus gave us the senior platform discipline we were missing.' },
    ],
    savedFolderIds: ['folder-engineering'],
    recentViewedHoursAgo: 9,
    matchKeywords: ['devops', 'aws', 'cloud', 'terraform', 'kubernetes'],
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    providerType: 'agency',
    title: 'Enterprise UX/UI Design Agency',
    headline: 'Senior design squad for product strategy, UX research, and systems.',
    categoryId: 'design',
    modes: ['online', 'hybrid'],
    location: 'Austin, TX',
    timezone: 'CST (UTC-6)',
    localTime: '11:42 AM',
    hourlyRate: 150,
    rating: 5,
    reviews: 218,
    jobSuccess: 100,
    verified: true,
    topRated: true,
    risingTalent: false,
    responseTime: '30 minutes',
    availability: 'Available now',
    workType: 'Agency team',
    completedJobs: 62,
    totalEarned: 412000,
    teamSize: '6 specialists',
    englishLevel: 'Native',
    languages: ['English', 'Spanish'],
    skills: ['Product Strategy', 'UX Research', 'Figma', 'Design Systems', 'Creative Direction'],
    bio: [
      'We are a senior design studio that helps companies redesign critical customer and operational workflows.',
      'Clients bring us in when they need a polished interface, better system thinking, and a team that can work with engineering directly.',
    ],
    description: 'High-trust design agency for enterprise UX and digital product systems.',
    badges: ['Top Rated Plus', 'Identity Verified', 'Agency Verified'],
    certifications: [{ title: 'Enterprise Design Partner', issuer: 'Fortspace Verified' }],
    verifications: ['Identity Verified', 'Payment Verified', 'Agency Verified'],
    services: [
      { id: 'svc-product-squad', title: 'Dedicated Product Design Squad', price: 5800, delivery: 'Monthly retainer', summary: 'Embedded design leadership, execution, and handoff support.' },
    ],
    portfolio: [
      { title: 'Healthcare Portal Redesign', summary: 'Redesigned patient and provider workflows for a regional care network.', impact: '31% lower task time' },
      { title: 'Banking Backoffice UX', summary: 'Unified fragmented internal tools into one design system and workflow layer.', impact: '2.3x faster onboarding' },
    ],
    experience: [
      { company: 'Studio Ladera', role: 'Agency Founder', period: '2018 - Present' },
    ],
    reviewsList: [
      { author: 'Northwell Systems', rating: 5, quote: 'Elena and her team operate like a seasoned in-house design org.' },
    ],
    savedFolderIds: ['folder-design'],
    recentViewedHoursAgo: 4,
    matchKeywords: ['design agency', 'ux', 'research', 'figma', 'systems'],
  },
  {
    id: 'michael-chang',
    name: 'Michael Chang',
    providerType: 'freelancer',
    title: 'IT Network and Support Specialist',
    headline: 'Hybrid IT support, office deployments, and secure infrastructure rollouts.',
    categoryId: 'operations',
    modes: ['hybrid', 'onsite'],
    location: 'San Jose, CA',
    timezone: 'PST (UTC-8)',
    localTime: '9:42 AM',
    hourlyRate: 105,
    rating: 4.9,
    reviews: 49,
    jobSuccess: 100,
    verified: true,
    topRated: false,
    risingTalent: true,
    responseTime: '20 minutes',
    availability: 'Available this week',
    workType: 'Hybrid support',
    completedJobs: 18,
    totalEarned: 74000,
    englishLevel: 'Native',
    languages: ['English', 'Mandarin'],
    skills: ['Network Setup', 'Office IT', 'Security', 'Vendor Coordination', 'Documentation'],
    serviceArea: 'San Jose and Peninsula',
    distance: 12,
    eta: 'Tomorrow',
    availableNow: false,
    bio: [
      'I support scaling teams with office setups, secure network rollouts, device policies, and ongoing hybrid support operations.',
    ],
    description: 'Hybrid infrastructure and IT support specialist for fast-moving teams.',
    badges: ['Rising Talent', 'Identity Verified'],
    certifications: [{ title: 'Cisco CCNA', issuer: 'Cisco' }],
    verifications: ['Identity Verified', 'Phone Verified'],
    services: [
      { id: 'svc-it-rollout', title: 'Office IT Rollout', price: 1600, delivery: '3 days', summary: 'Plan and deploy networking, endpoint setup, and support documentation.' },
    ],
    portfolio: [
      { title: 'Hybrid HQ Rollout', summary: 'Coordinated office networking and support processes for a 120-person team.', impact: 'Launch completed in 2 weeks' },
    ],
    experience: [
      { company: 'Peninsula TechOps', role: 'Independent IT Specialist', period: '2022 - Present' },
    ],
    reviewsList: [
      { author: 'Orbit Labs', rating: 5, quote: 'Michael is calm, organized, and excellent onsite with staff.' },
    ],
    savedFolderIds: ['folder-local'],
    recentViewedHoursAgo: 8,
    matchKeywords: ['it support', 'network', 'hybrid', 'office', 'security'],
  },
  {
    id: 'aisha-bello',
    name: 'Aisha Bello',
    providerType: 'freelancer',
    title: 'Machine Learning and Analytics Engineer',
    headline: 'Applied ML, analytics pipelines, and AI workflow automation.',
    categoryId: 'data-ai',
    modes: ['online'],
    location: 'Nairobi, Kenya',
    timezone: 'EAT (UTC+3)',
    localTime: '7:42 PM',
    hourlyRate: 82,
    rating: 4.9,
    reviews: 58,
    jobSuccess: 97,
    verified: true,
    topRated: false,
    risingTalent: true,
    responseTime: '30 minutes',
    availability: 'Available now',
    workType: 'Remote only',
    completedJobs: 22,
    totalEarned: 86000,
    englishLevel: 'Native',
    languages: ['English', 'Swahili'],
    skills: ['Python', 'SQL', 'Machine Learning', 'Data Visualization', 'LLM Ops'],
    bio: [
      'I help teams move from scattered reporting and experiments into reliable data products and AI-enabled workflows.',
    ],
    description: 'AI and analytics engineer who bridges experimentation and production delivery.',
    badges: ['Rising Talent', 'Identity Verified'],
    certifications: [{ title: 'Google Professional Data Engineer', issuer: 'Google Cloud' }],
    verifications: ['Identity Verified', 'Payment Verified'],
    services: [
      { id: 'svc-analytics-mvp', title: 'Analytics MVP Build', price: 2400, delivery: '14 days', summary: 'Dashboards, data pipelines, and actionable KPI views for product teams.' },
    ],
    portfolio: [
      { title: 'LLM Routing Workflow', summary: 'Built a support triage workflow that reduced manual tagging time.', impact: '62% faster triage' },
    ],
    experience: [
      { company: 'Signal Bridge', role: 'Data and ML Engineer', period: '2021 - Present' },
    ],
    reviewsList: [
      { author: 'Quantive Retail', rating: 5, quote: 'Aisha combines technical depth with very clear stakeholder communication.' },
    ],
    savedFolderIds: ['folder-product', 'folder-growth'],
    recentViewedHoursAgo: 6,
    matchKeywords: ['ai', 'ml', 'python', 'analytics', 'llm'],
  },
  {
    id: 'techflow-inc',
    name: 'TechFlow Inc.',
    providerType: 'agency',
    title: 'Full Stack Development Squad',
    headline: 'Cross-functional product team for roadmap-critical builds and launches.',
    categoryId: 'development',
    modes: ['online', 'hybrid'],
    location: 'Toronto, Canada',
    timezone: 'EST (UTC-5)',
    localTime: '12:42 PM',
    hourlyRate: 185,
    rating: 4.9,
    reviews: 112,
    jobSuccess: 99,
    verified: true,
    topRated: true,
    risingTalent: false,
    responseTime: '40 minutes',
    availability: 'Available this week',
    workType: 'Agency team',
    completedJobs: 39,
    totalEarned: 520000,
    teamSize: '10 specialists',
    englishLevel: 'Native',
    languages: ['English'],
    skills: ['Product Delivery', 'React', 'Node.js', 'QA', 'Product Management'],
    bio: [
      'We provide an embedded squad model for companies that need senior engineering velocity without building a full in-house pod first.',
    ],
    description: 'Delivery-focused product squad for startups and enterprise innovation teams.',
    badges: ['Top Rated Plus', 'Agency Verified', 'Enterprise Ready'],
    certifications: [{ title: 'SOC 2 Delivery Workflow', issuer: 'Fortspace Verified' }],
    verifications: ['Identity Verified', 'Payment Verified', 'Agency Verified'],
    services: [
      { id: 'svc-launch-squad', title: 'Launch Squad Retainer', price: 9800, delivery: 'Monthly retainer', summary: 'Design, engineering, QA, and PM support for critical launches.' },
    ],
    portfolio: [
      { title: 'B2B Platform Launch', summary: 'Delivered v1 with product, design, engineering, and QA alignment.', impact: 'Go-live in 11 weeks' },
    ],
    experience: [
      { company: 'TechFlow Inc.', role: 'Delivery Agency', period: '2019 - Present' },
    ],
    reviewsList: [
      { author: 'Mapline Commerce', rating: 5, quote: 'TechFlow gave us a reliable senior squad when hiring in-house was too slow.' },
    ],
    savedFolderIds: ['folder-engineering'],
    recentViewedHoursAgo: 12,
    matchKeywords: ['agency', 'squad', 'react', 'node', 'delivery'],
  },
  {
    id: 'nina-okafor',
    name: 'Nina Okafor',
    providerType: 'freelancer',
    title: 'Customer Support and Implementation Lead',
    headline: 'Client onboarding, SOPs, support operations, and cross-functional coordination.',
    categoryId: 'operations',
    modes: ['online', 'hybrid'],
    location: 'Austin, TX',
    timezone: 'CST (UTC-6)',
    localTime: '11:42 AM',
    hourlyRate: 58,
    rating: 4.8,
    reviews: 71,
    jobSuccess: 96,
    verified: true,
    topRated: false,
    risingTalent: true,
    responseTime: '18 minutes',
    availability: 'Available now',
    workType: 'Remote or hybrid',
    completedJobs: 31,
    totalEarned: 91000,
    englishLevel: 'Native',
    languages: ['English'],
    skills: ['Implementation', 'Customer Support', 'Project Coordination', 'SOPs', 'Reporting'],
    bio: [
      'I help teams stabilize onboarding, support delivery, and operational handoffs during fast growth.',
    ],
    description: 'Operations-focused partner for client onboarding and delivery coordination.',
    badges: ['Rising Talent', 'Identity Verified'],
    certifications: [{ title: 'Certified Customer Success Manager', issuer: 'SuccessCOACHING' }],
    verifications: ['Identity Verified', 'Phone Verified'],
    services: [
      { id: 'svc-onboarding-sop', title: 'Onboarding SOP Sprint', price: 900, delivery: '5 days', summary: 'Audit and document onboarding workflows, templates, and escalation paths.' },
    ],
    portfolio: [
      { title: 'Implementation Playbook', summary: 'Created onboarding and handoff templates for a B2B logistics startup.', impact: '31% faster activation' },
    ],
    experience: [
      { company: 'Juniper Ops', role: 'Implementation Lead', period: '2020 - Present' },
    ],
    reviewsList: [
      { author: 'Helix Ops', rating: 5, quote: 'Nina immediately improved our client onboarding rhythm.' },
    ],
    savedFolderIds: ['folder-product'],
    recentViewedHoursAgo: 10,
    matchKeywords: ['support', 'implementation', 'operations', 'coordination', 'onboarding'],
  },
];

const SAVED_FOLDERS = [
  { id: 'folder-engineering', name: 'Engineering Bench', description: 'Senior builders for roadmap-critical work.' },
  { id: 'folder-design', name: 'Design Bench', description: 'Product and brand specialists under consideration.' },
  { id: 'folder-growth', name: 'Growth Operators', description: 'Experts for acquisition, retention, and analytics.' },
  { id: 'folder-local', name: 'Local Field Pros', description: 'Nearby onsite specialists for urgent work.' },
  { id: 'folder-product', name: 'Product Ops', description: 'Cross-functional support for launches and onboarding.' },
];

const SHORTLIST = [
  { talentId: 'sarah-jenkins', status: 'interviewing', match: 97, jobId: 'job-frontend-replatform' },
  { talentId: 'techflow-inc', status: 'shortlisted', match: 93, jobId: 'job-frontend-replatform' },
  { talentId: 'alex-rivera', status: 'offered', match: 90, jobId: 'job-frontend-replatform' },
];

const RECENT_ACTIVITY = [
  { actor: 'Acme Cloud', action: 'invited Sarah Jenkins to a React platform rebuild', time: '4 minutes ago' },
  { actor: 'Vertex Health', action: 'hired Elena Rodriguez for a design system sprint', time: '22 minutes ago' },
  { actor: 'Foundry Labs', action: 'booked David Chen for an emergency electrical visit', time: '53 minutes ago' },
];

const CITY_DIRECTORY = [
  { city: 'San Francisco', count: 412, specialties: ['Electrical', 'IT Support', 'Product Design'] },
  { city: 'Austin', count: 265, specialties: ['Product Design', 'Operations', 'Marketing'] },
  { city: 'Toronto', count: 198, specialties: ['Engineering Teams', 'Data & AI'] },
  { city: 'London', count: 224, specialties: ['Growth', 'Design', 'Analytics'] },
];

const INDUSTRY_SPOTLIGHTS = [
  { id: 'saas', name: 'SaaS', summary: 'Product, growth, support, and analytics specialists for modern SaaS teams.' },
  { id: 'healthcare', name: 'Healthcare', summary: 'Secure product, design, support, and compliance-aware operators.' },
  { id: 'real-estate', name: 'Real Estate', summary: 'Growth, operations, and local field specialists for property businesses.' },
  { id: 'retail', name: 'Retail & Commerce', summary: 'Conversion-minded product builders, marketers, and repair crews.' },
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function matchesQuery(talent, query) {
  if (!query) {
    return true;
  }

  const haystack = [
    talent.name,
    talent.title,
    talent.headline,
    talent.categoryId,
    talent.location,
    talent.workType,
    ...(talent.skills || []),
    ...(talent.matchKeywords || []),
  ]
    .join(' ')
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .every((token) => haystack.includes(token));
}

function matchesFilters(talent, filters = {}) {
  const {
    query = '',
    mode = 'all',
    categoryIds = [],
    location = '',
    badges = [],
    rate = 'all',
    availability = 'all',
    provider = 'all',
    urgent = false,
    verifiedOnly = false,
  } = filters;

  if (!matchesQuery(talent, query)) {
    return false;
  }

  if (mode !== 'all' && !(talent.modes || []).includes(mode)) {
    return false;
  }

  if (categoryIds.length && !categoryIds.includes(talent.categoryId)) {
    return false;
  }

  if (location && !normalizeText(talent.location).includes(normalizeText(location)) && !normalizeText(talent.serviceArea).includes(normalizeText(location))) {
    return false;
  }

  if (verifiedOnly && !talent.verified) {
    return false;
  }

  if (badges.length && !badges.every((badge) => (talent.badges || []).some((item) => normalizeText(item).includes(normalizeText(badge))))) {
    return false;
  }

  if (availability !== 'all') {
    const currentAvailability = normalizeText(talent.availability);
    if (availability === 'now' && !currentAvailability.includes('available now')) {
      return false;
    }
    if (availability === 'week' && !(currentAvailability.includes('week') || currentAvailability.includes('now'))) {
      return false;
    }
  }

  if (provider !== 'all' && talent.providerType !== provider) {
    return false;
  }

  if (rate !== 'all') {
    if (rate === 'low' && talent.hourlyRate >= 60) {
      return false;
    }
    if (rate === 'mid' && (talent.hourlyRate < 60 || talent.hourlyRate > 110)) {
      return false;
    }
    if (rate === 'high' && talent.hourlyRate <= 110) {
      return false;
    }
  }

  if (urgent && !(talent.availableNow || normalizeText(talent.availability).includes('available now'))) {
    return false;
  }

  return true;
}

function sortTalent(talentList, sortBy = 'recommended') {
  const list = [...talentList];

  const sorters = {
    recommended: (a, b) => (b.topRated === a.topRated ? b.jobSuccess - a.jobSuccess : Number(b.topRated) - Number(a.topRated)),
    rating: (a, b) => (b.rating === a.rating ? b.reviews - a.reviews : b.rating - a.rating),
    rate_low: (a, b) => a.hourlyRate - b.hourlyRate,
    rate_high: (a, b) => b.hourlyRate - a.hourlyRate,
    response: (a, b) => a.responseTime.localeCompare(b.responseTime),
    recent: (a, b) => a.recentViewedHoursAgo - b.recentViewedHoursAgo,
  };

  return list.sort(sorters[sortBy] || sorters.recommended);
}

export function getTalentCategories(kind = 'all') {
  return kind === 'all' ? TALENT_CATEGORIES : TALENT_CATEGORIES.filter((category) => category.kind === kind);
}

export function getTalentCategoryById(categoryId) {
  return TALENT_CATEGORIES.find((category) => category.id === categoryId || slugify(category.name) === categoryId);
}

export function getTalentById(talentId) {
  return TALENT.find((talent) => talent.id === talentId);
}

export function getTalentByIds(talentIds = []) {
  return talentIds.map((talentId) => getTalentById(talentId)).filter(Boolean);
}

export function getMarketplaceTalent(filters = {}) {
  return sortTalent(TALENT.filter((talent) => matchesFilters(talent, filters)), filters.sortBy);
}

export function getFeaturedTalent() {
  return TALENT.filter((talent) => talent.topRated).slice(0, 4);
}

export function getRecommendedTalent(jobId = CLIENT_OPENINGS[0].id) {
  const job = CLIENT_OPENINGS.find((opening) => opening.id === jobId) || CLIENT_OPENINGS[0];
  const ranked = TALENT.map((talent) => {
    const overlap = talent.skills.filter((skill) => job.requiredSkills.includes(skill)).length;
    const matchScore = Math.min(99, 80 + overlap * 5 + (talent.topRated ? 4 : 0) + (talent.verified ? 2 : 0));
    return { ...talent, matchScore };
  });

  return sortTalent(ranked, 'recommended').sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
}

export function getRelatedTalent(talentId) {
  const current = getTalentById(talentId);
  if (!current) {
    return [];
  }

  return TALENT.filter((talent) => talent.id !== talentId)
    .map((talent) => {
      const sharedSkills = talent.skills.filter((skill) => current.skills.includes(skill)).length;
      const score = sharedSkills + (talent.categoryId === current.categoryId ? 3 : 0);
      return { talent, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.talent);
}

export function getSavedFolders() {
  return SAVED_FOLDERS.map((folder) => ({
    ...folder,
    count: TALENT.filter((talent) => (talent.savedFolderIds || []).includes(folder.id)).length,
  }));
}

export function getSavedTalent(folderId = null) {
  return folderId
    ? TALENT.filter((talent) => (talent.savedFolderIds || []).includes(folderId))
    : TALENT.filter((talent) => (talent.savedFolderIds || []).length);
}

export function getShortlist() {
  return SHORTLIST.map((entry) => ({
    ...entry,
    talent: getTalentById(entry.talentId),
    job: CLIENT_OPENINGS.find((opening) => opening.id === entry.jobId),
  }));
}

export function getClientOpenings() {
  return CLIENT_OPENINGS;
}

export function getRecentMarketplaceActivity() {
  return RECENT_ACTIVITY;
}

export function getRecentlyViewedTalent() {
  return [...TALENT]
    .filter((talent) => talent.recentViewedHoursAgo !== undefined)
    .sort((a, b) => a.recentViewedHoursAgo - b.recentViewedHoursAgo)
    .slice(0, 6);
}

export function getCityDirectory() {
  return CITY_DIRECTORY;
}

export function getIndustrySpotlights() {
  return INDUSTRY_SPOTLIGHTS;
}

export function getMarketplaceStats() {
  const onlineCount = TALENT.filter((talent) => talent.modes.includes('online')).length;
  const onsiteCount = TALENT.filter((talent) => talent.modes.includes('onsite')).length;
  const hybridCount = TALENT.filter((talent) => talent.modes.includes('hybrid')).length;

  return {
    totalTalent: TALENT.length,
    verifiedTalent: TALENT.filter((talent) => talent.verified).length,
    topRatedTalent: TALENT.filter((talent) => talent.topRated).length,
    onlineCount,
    onsiteCount,
    hybridCount,
    categories: TALENT_CATEGORIES.length,
  };
}

export function formatCompactNumber(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`;
  }
  return String(value);
}
