export const categories = [
  { title: "Electrical Services", slug: "electrical", desc: "Wiring, installation, troubleshooting", badge: "Physical", count: 320 },
  { title: "Mechanical Services", slug: "mechanical", desc: "Repairs, maintenance, diagnostics", badge: "Physical", count: 280 },
  { title: "Auto Repair", slug: "auto-repair", desc: "Brakes, suspension, AC service", badge: "Physical", count: 190 },
  { title: "Home Services", slug: "home-services", desc: "Plumbing, carpentry, painting", badge: "Physical", count: 410 },
  { title: "Design & UX", slug: "design-ux", desc: "UI/UX, branding, product design", badge: "Online", count: 520 },
  { title: "Web & Dev", slug: "web-dev", desc: "Frontend, backend, full-stack", badge: "Online", count: 760 }
];

export const talents = [
  {
    id: "amina-k",
    name: "Amina K.",
    title: "Electrical Technician",
    rating: 4.9,
    reviews: 212,
    location: "Nairobi, Kenya",
    price: "$25/hr",
    tags: ["Panel upgrades", "Solar", "Wiring"],
    badge: "Top Rated",
    category: "electrical",
    about: "Licensed electrician specializing in residential and commercial wiring, panel upgrades, and solar installations.",
    skills: ["Wiring", "Solar install", "Troubleshooting", "Panel upgrades"],
    packages: [
      { name: "Basic", price: "$120", delivery: "2 days", revisions: "1", features: ["Inspection", "Safety report", "Minor fixes"] },
      { name: "Standard", price: "$260", delivery: "4 days", revisions: "2", features: ["Panel check", "Wiring fixes", "Up to 6 outlets"] },
      { name: "Premium", price: "$480", delivery: "7 days", revisions: "3", features: ["Full diagnostics", "Up to 12 outlets", "Priority support"] }
    ]
  },
  {
    id: "marcus-t",
    name: "Marcus T.",
    title: "Auto Repair Specialist",
    rating: 4.8,
    reviews: 168,
    location: "Austin, USA",
    price: "$35/hr",
    tags: ["Diagnostics", "Brakes", "Suspension"],
    badge: "Pro",
    category: "auto-repair",
    about: "ASE-certified auto technician with 10+ years of diagnostics and repair experience.",
    skills: ["Diagnostics", "Brake service", "Suspension", "Engine tune-up"],
    packages: [
      { name: "Basic", price: "$90", delivery: "1 day", revisions: "1", features: ["Diagnostics", "Estimate", "Quick fix"] },
      { name: "Standard", price: "$210", delivery: "3 days", revisions: "2", features: ["Brake service", "Fluid check", "Diagnostics"] },
      { name: "Premium", price: "$420", delivery: "5 days", revisions: "3", features: ["Full service", "Tune-up", "Priority slot"] }
    ]
  },
  {
    id: "rita-o",
    name: "Rita O.",
    title: "UI/UX Designer",
    rating: 5.0,
    reviews: 94,
    location: "Remote",
    price: "$40/hr",
    tags: ["Figma", "Prototyping", "UX"],
    badge: "Verified",
    category: "design-ux",
    about: "Product designer focused on clean interfaces, design systems, and UX research.",
    skills: ["Figma", "UX research", "Design systems", "Prototyping"],
    packages: [
      { name: "Basic", price: "$150", delivery: "2 days", revisions: "1", features: ["2 screens", "Style guide", "Figma file"] },
      { name: "Standard", price: "$350", delivery: "5 days", revisions: "2", features: ["6 screens", "Prototype", "Design system"] },
      { name: "Premium", price: "$720", delivery: "8 days", revisions: "3", features: ["12 screens", "UX review", "Priority support"] }
    ]
  },
  {
    id: "samir-p",
    name: "Samir P.",
    title: "Mechanical Technician",
    rating: 4.7,
    reviews: 121,
    location: "Mumbai, India",
    price: "$22/hr",
    tags: ["HVAC", "Maintenance", "Welding"],
    badge: "Reliable",
    category: "mechanical",
    about: "Mechanical technician with industrial maintenance and HVAC expertise.",
    skills: ["HVAC", "Welding", "Maintenance", "Diagnostics"],
    packages: [
      { name: "Basic", price: "$80", delivery: "2 days", revisions: "1", features: ["Inspection", "Quick fixes", "Checklist"] },
      { name: "Standard", price: "$190", delivery: "4 days", revisions: "2", features: ["Maintenance", "Parts swap", "Safety check"] },
      { name: "Premium", price: "$390", delivery: "6 days", revisions: "3", features: ["Full service", "HVAC tune", "Priority support"] }
    ]
  }
];

export const testimonials = [
  {
    quote: "We hired an electrician within hours and the work was flawless.",
    name: "Elena D.",
    role: "Facility Manager"
  },
  {
    quote: "Great mix of online and on-site talent. Saved us weeks.",
    name: "Chris A.",
    role: "Operations Lead"
  },
  {
    quote: "Simple, fast, and the quality is top tier.",
    name: "Fatima S.",
    role: "Startup Founder"
  }
];

export const faqs = [
  { q: "How do you verify talent?", a: "We review credentials, references, and completed projects before issuing verified badges." },
  { q: "Can I hire for on-site work?", a: "Yes. Filter by physical or hybrid services and choose local professionals." },
  { q: "How do payments work?", a: "Funds are held securely and released when the job is complete." },
  { q: "Can I post a request without selecting a talent?", a: "Yes. Post a request and receive offers from qualified pros." }
];

export const reviewsList = [
  { name: "Jordan P.", rating: 5, date: "Jan 2026", text: "Prompt, professional, and solved the issue fast." },
  { name: "Lana M.", rating: 4.8, date: "Dec 2025", text: "Clear communication and high-quality work." },
  { name: "Omar R.", rating: 4.9, date: "Nov 2025", text: "Great service and fair pricing. Would hire again." }
];
