/** Forte marketplace taxonomy — 10 pillars, sub-groups, and trade/role leaves */

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function roleLeaf(name, parentSlug, workMode) {
  const slug = slugify(name);
  return {
    id: `${parentSlug}--${slug}`,
    slug,
    name,
    title: name,
    isRole: true,
    workMode,
    featuredSkills: [name.split('/')[0].trim()],
  };
}

function groupNode(sectionSlug, groupName, roles, workMode) {
  const gSlug = slugify(groupName);
  return {
    id: `${sectionSlug}--${gSlug}`,
    slug: gSlug,
    name: groupName,
    title: groupName,
    workMode,
    children: roles.map((r) => roleLeaf(r, `${sectionSlug}--${gSlug}`, workMode)),
  };
}

function sectionNode(id, name, workMode, groups) {
  const slug = slugify(name);
  const isOnline = workMode === 'online' || workMode === 'hybrid';
  const isOffline = workMode === 'onsite' || workMode === 'hybrid';
  return {
    id,
    slug,
    name,
    title: name,
    description: name,
    workMode,
    isOnline,
    isOffline,
    sortOrder: Number(id),
    children: groups.map((g) => groupNode(slug, g.name, g.roles, workMode)),
    stats: { roles: groups.reduce((n, g) => n + g.roles.length, 0) },
  };
}

const TAXONOMY_SECTIONS = [
  sectionNode('1', 'Home & Infrastructure (Physical Spaces)', 'onsite', [
    { name: 'Construction, Trades & Structural Engineering', roles: [
      'Mason / Bricklayer', 'Roofer', 'Drywall Installer / Plasterer', 'Scaffolder / Rigger',
      'Plumber', 'Electrician', 'Carpenter & Joinery Specialist', 'Architect', 'Painter & Decorator',
      'Interior Designer', 'HVAC Technician / Air Conditioning Engineer', 'Locksmith',
      'Glazier / Window Installer', 'Solar Energy Installer',
    ]},
    { name: 'Domestic, Property & Cleaning Operations', roles: [
      'Nanny / Babysitter', 'Caretaker / Property Steward', 'House Cleaner / Deep Cleaning Specialist',
      'Carpet & Upholstery Cleaner', 'Window Cleaner', 'Exterminator / Pest Control Specialist',
      'Gardener / Landscaper', 'Water Tank Cleaning Specialist',
    ]},
    { name: 'Security, Automation & Smart Space Engineering', roles: [
      'CCTV & Security Network Technician', 'Electric Fence Installer',
      'Biometrics Access Control Installer', 'Security Guard',
    ]},
  ]),
  sectionNode('2', 'Transport, Logistics & Heavy Machinery', 'onsite', [
    { name: 'Delivery, Courier & Last-Mile Operations', roles: [
      'Motorbike Courier / Rider', 'Truck Driver / Haulage Operator', 'Delivery Driver',
    ]},
    { name: 'Material Handling & Industrial Plant Operators', roles: [
      'Forklift Operator', 'Reach-Truck Operator', 'Telehandler Operator',
      'Crane Operator / Heavy Rigging Specialist', 'Tractor Operator',
    ]},
    { name: 'Moving, Relocation & Chauffeur Services', roles: [
      'Household Mover / Packer', 'Office Relocation Specialist', 'Personal Driver / Chauffeur',
      'Valet Parking Attendant',
    ]},
    { name: 'Automotive Engineering & Field Recovery', roles: [
      'Car Mechanic', 'Diesel Technician', 'Auto-Electrician', 'Car Detailer', 'Breakdown Recovery Specialist',
    ]},
  ]),
  sectionNode('3', 'Digital, Tech & Creative', 'online', [
    { name: 'Software Engineering & Cloud Infrastructure', roles: [
      'Software Developer', 'Mobile App Developer', 'Full-Stack Marketplace Architect',
      'WordPress / CMS Customizer', 'QA Test Engineer', 'Cloud Architect / DevOps Engineer',
      'Database Administrator (DBA)', 'Data Scientist / Machine Learning Engineer',
    ]},
    { name: 'Creative Arts, Visuals & UI Designing', roles: [
      'UI/UX Designer', 'Graphic Designer / Brand Identity Specialist',
      'Digital Illustrator / Concept Artist', '3D Modeler / CAD Designer', 'Animator',
    ]},
    { name: 'Audio, Video & Digital Media', roles: [
      'Video Editor', 'Motion Graphics Artist', 'Voiceover Artist / Voice Actor',
      'Audio Engineer / Podcast Editor', 'Drone Operator / Aerial Videographer',
    ]},
    { name: 'Digital Marketing & Growth Hacking', roles: [
      'Social Media Manager', 'SEO Specialist', 'PPC Campaign Manager / Media Buyer',
      'Email Marketing Funnel Architect',
    ]},
  ]),
  sectionNode('4', 'Professional & Business Services', 'hybrid', [
    { name: 'Finance, Markets & Asset Management', roles: [
      'Accountant / Bookkeeper', 'Tax Consultant / KRA Specialist', 'Financial Advisor / Wealth Manager',
      'Stock Broker / Investment Analyst', 'Forensic Accountant',
    ]},
    { name: 'Legal, Compliance & Administrative Operations', roles: [
      'Lawyer / Advocate', 'Conveyancing Clerk', 'Project Manager / Scrum Master',
      'Personal Assistant / Executive Assistant', 'Virtual Assistant', 'Data Entry Clerk',
      'Translator / Localization Specialist',
    ]},
    { name: 'Human Capital & High-Level Advisory', roles: [
      'Management Consultant', 'Recruiter / Headhunter', 'HR Generalist',
    ]},
  ]),
  sectionNode('5', 'Medical & Health Services', 'hybrid', [
    { name: 'Clinical, Diagnostics & General Practice', roles: [
      'General Practitioner (GP) / Doctor', 'Dentist', 'Pediatrician', 'Optometrist',
      'Clinical Nurse', 'Physiotherapist',
    ]},
    { name: 'Mental Health & Cognitive Wellness', roles: [
      'Therapist / Counselor', 'Psychiatrist', 'Marriage Counselor / Relationship Therapist',
      'Addiction Counselor',
    ]},
  ]),
  sectionNode('6', 'Events, Entertainment & Media', 'hybrid', [
    { name: 'Coordination, Tech & Logistics', roles: [
      'Wedding Planner / Event Coordinator', 'Emcee / Event Host / Hostess', 'Bouncer / Bodyguard',
      'Stage Manager', 'Sound Engineer', 'Lighting Technician', 'Live Stream Broadcast Engineer',
    ]},
    { name: 'Creative Visuals & Live Talent', roles: [
      'Photographer', 'Videographer / Cinematographer', 'Disc Jockey / Deejay (DJ)',
      'Dancer / Choreographer', 'Singer / Vocalist', 'Instrumentalist / Session Musician',
    ]},
  ]),
  sectionNode('7', 'Beauty, Wellness & Personal Care', 'hybrid', [
    { name: 'Hair Design, Artistry & Grooming', roles: [
      'Hairdresser / Hair Stylist', 'Barber', 'Nail Artist / Tech', 'Makeup Artist',
    ]},
    { name: 'Body Therapies, Piercing & Art', roles: [
      'Masseuse / Massage Therapist', 'Esthetician / Facial Specialist', 'Tattoo Artist', 'Body Piercer',
    ]},
    { name: 'Fitness Coaching & Physical Prep', roles: [
      'Gym Instructor / Personal Trainer', 'Sports Coach', 'Yoga / Pilates Instructor',
      'Nutritionist / Dietitian',
    ]},
  ]),
  sectionNode('8', 'Education, Training & Lessons', 'hybrid', [
    { name: 'Academic & Language Mentorship', roles: [
      'Tutor / Academic Instructor / Teacher', 'Language Instructor', 'Special Needs Educator',
    ]},
    { name: 'Professional & Vocational Training', roles: [
      'Coding Coach / Software Instructor', 'Data Analytics Instructor', 'Driving Instructor',
      'Cooking Instructor / Coach',
    ]},
  ]),
  sectionNode('9', 'Hospitality, Food & Culinary', 'hybrid', [
    { name: 'Professional Kitchen & Beverage Production', roles: [
      'Chef', 'Meal Prep Chef / Specialist', 'Baker / Pastry Chef', 'Mixologist / Bartender', 'Barista',
    ]},
    { name: 'Hospitality Assets & Experiences', roles: [
      'AirBnB Property Manager', 'Tour Guide / Safari Leader', 'Waiter / Server / Waitstaff',
    ]},
  ]),
  sectionNode('10', 'Specialised & Industrial Services', 'hybrid', [
    { name: 'Agriculture & Animal Care', roles: [
      'Veterinary Doctor / Vet', 'Pet Groomer', 'Dog Trainer / Animal Behaviorist', 'Agronomist',
    ]},
    { name: 'Fabrication & Manufacturing', roles: [
      'Tailor / Fashion Designer', 'Welder / Metal Fabricator', 'Lathe Machinist',
    ]},
    { name: 'Technicians & Special Repair', roles: [
      'Device Repair Technician (Phone/Laptop Repairer)', 'Appliance Repairer',
    ]},
  ]),
];

function flattenRoles(nodes, ancestors = []) {
  const out = [];
  for (const node of nodes) {
    const path = [...ancestors, node];
    if (node.isRole) {
      const section = path[0];
      const group = path[1];
      out.push({
        id: node.id,
        slug: node.slug,
        name: node.name,
        roleSlug: node.slug,
        sectionId: section?.id,
        sectionSlug: section?.slug,
        sectionName: section?.name,
        groupId: group?.id,
        groupSlug: group?.slug,
        groupName: group?.name,
        workMode: node.workMode || section?.workMode,
      });
    }
    if (node.children?.length) {
      out.push(...flattenRoles(node.children, path));
    }
  }
  return out;
}

const ALL_ROLES = flattenRoles(TAXONOMY_SECTIONS);

function getCategoryTree() {
  return TAXONOMY_SECTIONS;
}

function findRoleBySlug(roleSlug) {
  return ALL_ROLES.find((r) => r.slug === roleSlug || r.id === roleSlug);
}

function findSectionBySlug(slug) {
  return TAXONOMY_SECTIONS.find((s) => s.slug === slug || s.id === slug);
}

export { getCategoryTree };
export const flattenRolesExport = () => ALL_ROLES;
export const findRoleBySlugExport = findRoleBySlug;
export const findSectionBySlugExport = findSectionBySlug;
export { slugify };

