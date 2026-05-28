import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Search,
  Star,
  X,
  GitCompare,
  StickyNote,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  ArrowUpDown,
  ShoppingCart,
  Briefcase,
  Users,
  Zap,
  Heart,
  Loader2,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_FREELANCERS = [
  {
    id: "f1",
    name: "Amara Osei",
    specialty: "UI/UX Designer",
    initials: "AO",
    color: "bg-violet-500",
    rate: 85,
    rating: 4.9,
    reviews: 142,
    trustScore: 96,
    availability: "Available",
    skills: ["Figma", "Prototyping", "Design Systems"],
    collection: "Design Team",
    addedAt: new Date("2024-04-01"),
  },
  {
    id: "f2",
    name: "Lucas Fernández",
    specialty: "Full-Stack Developer",
    initials: "LF",
    color: "bg-brand-500",
    rate: 110,
    rating: 4.8,
    reviews: 89,
    trustScore: 94,
    availability: "Busy",
    skills: ["React", "Node.js", "PostgreSQL"],
    collection: "Dev Squad",
    addedAt: new Date("2024-03-20"),
  },
  {
    id: "f3",
    name: "Priya Sharma",
    specialty: "Brand Strategist",
    initials: "PS",
    color: "bg-accent",
    rate: 95,
    rating: 5.0,
    reviews: 67,
    trustScore: 99,
    availability: "Available",
    skills: ["Branding", "Marketing", "Copywriting"],
    collection: "Design Team",
    addedAt: new Date("2024-03-15"),
  },
  {
    id: "f4",
    name: "Jin Park",
    specialty: "Mobile Developer",
    initials: "JP",
    color: "bg-success",
    rate: 120,
    rating: 4.7,
    reviews: 210,
    trustScore: 91,
    availability: "Available",
    skills: ["React Native", "Swift", "Kotlin"],
    collection: "Dev Squad",
    addedAt: new Date("2024-02-28"),
  },
  {
    id: "f5",
    name: "Sofia Müller",
    specialty: "Content Writer",
    initials: "SM",
    color: "bg-amber-500",
    rate: 55,
    rating: 4.6,
    reviews: 312,
    trustScore: 88,
    availability: "Available",
    skills: ["SEO Writing", "Blogging", "Research"],
    collection: "Quick Tasks",
    addedAt: new Date("2024-02-10"),
  },
  {
    id: "f6",
    name: "Kwame Asante",
    specialty: "Data Scientist",
    initials: "KA",
    color: "bg-red-500",
    rate: 130,
    rating: 4.9,
    reviews: 58,
    trustScore: 97,
    availability: "Busy",
    skills: ["Python", "ML", "TensorFlow"],
    collection: "Dev Squad",
    addedAt: new Date("2024-01-22"),
  },
];

const MOCK_GIGS = [
  {
    id: "g1",
    title: "I will design a stunning Figma UI kit for your web app",
    seller: "Amara Osei",
    sellerInitials: "AO",
    sellerColor: "bg-violet-500",
    price: 149,
    delivery: "3 days",
    rating: 4.9,
    reviews: 87,
    gradient: "from-violet-400 to-purple-600",
    collection: "Design Team",
    addedAt: new Date("2024-04-05"),
  },
  {
    id: "g2",
    title: "I will build a full-stack React & Node.js web application",
    seller: "Lucas Fernández",
    sellerInitials: "LF",
    sellerColor: "bg-brand-500",
    price: 499,
    delivery: "7 days",
    rating: 4.8,
    reviews: 43,
    gradient: "from-blue-400 to-cyan-600",
    collection: "Dev Squad",
    addedAt: new Date("2024-03-28"),
  },
  {
    id: "g3",
    title: "I will create a complete brand identity package",
    seller: "Priya Sharma",
    sellerInitials: "PS",
    sellerColor: "bg-accent",
    price: 299,
    delivery: "5 days",
    rating: 5.0,
    reviews: 34,
    gradient: "from-pink-400 to-rose-600",
    collection: "Design Team",
    addedAt: new Date("2024-03-18"),
  },
  {
    id: "g4",
    title: "I will develop your iOS and Android mobile app",
    seller: "Jin Park",
    sellerInitials: "JP",
    sellerColor: "bg-success",
    price: 899,
    delivery: "14 days",
    rating: 4.7,
    reviews: 61,
    gradient: "from-emerald-400 to-teal-600",
    collection: "Dev Squad",
    addedAt: new Date("2024-03-01"),
  },
  {
    id: "g5",
    title: "I will write 10 SEO-optimized blog posts for your website",
    seller: "Sofia Müller",
    sellerInitials: "SM",
    sellerColor: "bg-amber-500",
    price: 199,
    delivery: "5 days",
    rating: 4.6,
    reviews: 156,
    gradient: "from-amber-400 to-orange-600",
    collection: "Quick Tasks",
    addedAt: new Date("2024-02-14"),
  },
  {
    id: "g6",
    title: "I will build and deploy a machine learning model for your data",
    seller: "Kwame Asante",
    sellerInitials: "KA",
    sellerColor: "bg-red-500",
    price: 699,
    delivery: "10 days",
    rating: 4.9,
    reviews: 29,
    gradient: "from-red-400 to-rose-700",
    collection: "Dev Squad",
    addedAt: new Date("2024-01-30"),
  },
];

const COLLECTIONS = [
  { name: "All", icon: Heart },
  { name: "Design Team", icon: Users },
  { name: "Dev Squad", icon: Zap },
  { name: "Quick Tasks", icon: Clock },
];

const SORT_OPTIONS = [
  { value: "recently_added", label: "Recently Added" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "lowest_rate", label: "Lowest Rate" },
  { value: "available_now", label: "Available Now" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          }
        />
      ))}
      <span className="ml-1 text-xs text-gray-600 dark:text-gray-400 font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function TrustBar({ score }) {
  const color =
    score >= 95
      ? "bg-success"
      : score >= 85
      ? "bg-brand-500"
      : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 w-14 shrink-0">
        Trust {score}%
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function NoteArea({ freelancerId }) {
  const key = `forte_note_${freelancerId}`;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => localStorage.getItem(key) || "");

  const save = (val) => {
    setText(val);
    localStorage.setItem(key, val);
  };

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <StickyNote size={12} />
        {open ? "Hide note" : text ? "View note" : "Add note"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <textarea
              className="mt-2 w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-surface dark:bg-gray-800 p-2 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-700 dark:text-gray-300"
              rows={3}
              placeholder="Add a private note about this freelancer…"
              value={text}
              onChange={(e) => save(e.target.value)}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Saved locally
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FreelancerCard({ freelancer, onRemove, selected, onToggleCompare }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-3 relative group"
    >
      {/* Compare checkbox */}
      <div className="absolute top-3 left-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleCompare(freelancer.id)}
          className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
          title="Compare"
        />
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(freelancer.id)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
        title="Remove from favorites"
      >
        <X size={14} />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mt-2">
        <div
          className={`w-12 h-12 rounded-xl ${freelancer.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
        >
          {freelancer.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {freelancer.name}
            </span>
            <span
              className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                freelancer.availability === "Available"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-success"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}
            >
              {freelancer.availability}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {freelancer.specialty}
          </p>
        </div>
      </div>

      {/* Rate & rating */}
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-gray-900 dark:text-white">
          ${freelancer.rate}
          <span className="text-xs font-normal text-gray-400">/hr</span>
        </span>
        <StarRating rating={freelancer.rating} />
      </div>

      {/* Trust bar */}
      <TrustBar score={freelancer.trustScore} />

      {/* Skills */}
      <div className="flex flex-wrap gap-1">
        {freelancer.skills.map((s) => (
          <span
            key={s}
            className="text-xs px-2 py-0.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Note */}
      <NoteArea freelancerId={freelancer.id} />

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
          <Briefcase size={12} /> Hire Now
        </button>
        <button className="flex-1 border border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-xs font-semibold py-2 rounded-lg transition-colors">
          Invite
        </button>
      </div>
    </motion.div>
  );
}

function GigCard({ gig, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className={`h-32 bg-gradient-to-br ${gig.gradient} relative`}>
        <button
          onClick={() => onRemove(gig.id)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-900/80 p-1 rounded-lg text-gray-500 hover:text-red-500"
        >
          <X size={14} />
        </button>
        <div className="absolute bottom-2 left-2">
          <span className="text-xs text-white/90 font-medium bg-black/30 px-2 py-0.5 rounded-full">
            Delivery: {gig.delivery}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {/* Seller */}
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full ${gig.sellerColor} flex items-center justify-center text-white text-xs font-bold`}
          >
            {gig.sellerInitials}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {gig.seller}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
          {gig.title}
        </p>

        {/* Rating */}
        <StarRating rating={gig.rating} />
        <p className="text-xs text-gray-400 -mt-1">{gig.reviews} reviews</p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${gig.price}
          </span>
          <button className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <ShoppingCart size={12} /> Order Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="text-7xl mb-4 select-none">🔖</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No saved items yet
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
        Your favorites will appear here. Browse talent and services, then save
        the ones you love.
      </p>
      <button
        onClick={onClear}
        className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
      >
        <Search size={15} /> Browse Talent
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("freelancers");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState("All");
  const [sortBy, setSortBy] = useState("recently_added");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [freelancers, setFreelancers] = useState(MOCK_FREELANCERS);
  const [gigs, setGigs] = useState(MOCK_GIGS);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCompareBar, setShowCompareBar] = useState(false);
  const sortMenuRef = useRef(null);
  const tabIndicatorRef = useRef(null);

  // Close sort menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setShowCompareBar(selectedForCompare.length >= 2);
  }, [selectedForCompare]);

  const toggleCompare = useCallback((id) => {
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const removeFreelancer = useCallback((id) => {
    setFreelancers((prev) => prev.filter((f) => f.id !== id));
    setSelectedForCompare((prev) => prev.filter((x) => x !== id));
  }, []);

  const removeGig = useCallback((id) => {
    setGigs((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => setLoadingMore(false), 1500);
  };

  // Filter + sort freelancers
  const filteredFreelancers = freelancers
    .filter((f) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.specialty.toLowerCase().includes(q) ||
        f.skills.some((s) => s.toLowerCase().includes(q));
      const matchesCollection =
        activeCollection === "All" || f.collection === activeCollection;
      return matchesSearch && matchesCollection;
    })
    .sort((a, b) => {
      if (sortBy === "highest_rated") return b.rating - a.rating;
      if (sortBy === "lowest_rate") return a.rate - b.rate;
      if (sortBy === "available_now")
        return a.availability === "Available" ? -1 : 1;
      return b.addedAt - a.addedAt;
    });

  // Filter + sort gigs
  const filteredGigs = gigs
    .filter((g) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.seller.toLowerCase().includes(q);
      const matchesCollection =
        activeCollection === "All" || g.collection === activeCollection;
      return matchesSearch && matchesCollection;
    })
    .sort((a, b) => {
      if (sortBy === "highest_rated") return b.rating - a.rating;
      if (sortBy === "lowest_rate") return a.price - b.price;
      return b.addedAt - a.addedAt;
    });

  // Collection counts
  const collectionCounts = {
    freelancers: Object.fromEntries(
      COLLECTIONS.map((c) => [
        c.name,
        c.name === "All"
          ? freelancers.length
          : freelancers.filter((f) => f.collection === c.name).length,
      ])
    ),
    gigs: Object.fromEntries(
      COLLECTIONS.map((c) => [
        c.name,
        c.name === "All"
          ? gigs.length
          : gigs.filter((g) => g.collection === c.name).length,
      ])
    ),
  };

  const counts = activeTab === "freelancers" ? collectionCounts.freelancers : collectionCounts.gigs;

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 font-sans">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-brand-600 rounded-xl">
              <Bookmark size={20} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Saved Favorites
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-14">
            Your curated collection of top talent and services
          </p>
        </motion.div>

        {/* ── Tabs + Search Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6"
        >
          {/* Tabs */}
          <div className="relative flex bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-1 shadow-sm w-fit">
            {[
              { key: "freelancers", label: "Freelancers", count: freelancers.length },
              { key: "gigs", label: "Gigs", count: gigs.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedForCompare([]);
                }}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors z-10 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-brand-50 dark:bg-brand-900/20 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
                <span
                  className={`relative text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab.key
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "freelancers"
                  ? "Search by name or skill…"
                  : "Search gigs…"
              }
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -tranzinc-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative ml-auto" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu((o) => !o)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowUpDown size={14} />
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
              <ChevronDown
                size={14}
                className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg z-50 py-1 overflow-hidden"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-surface dark:hover:bg-gray-800"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Collections ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex items-center gap-2 mb-6 flex-wrap"
        >
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">
            Collections
          </span>
          {COLLECTIONS.map((col) => {
            const Icon = col.icon;
            const count = counts[col.name] ?? 0;
            const active = activeCollection === col.name;
            return (
              <button
                key={col.name}
                onClick={() => setActiveCollection(col.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600"
                }`}
              >
                <Icon size={13} />
                {col.name}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-600 ml-1 transition-colors">
            <Plus size={13} /> New Collection
          </button>
        </motion.div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {activeTab === "freelancers" && (
            <motion.div
              key="freelancers"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {filteredFreelancers.length === 0 ? (
                <div className="grid">
                  <EmptyState onClear={() => { setSearchQuery(""); setActiveCollection("All"); }} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence>
                    {filteredFreelancers.map((f) => (
                      <FreelancerCard
                        key={f.id}
                        freelancer={f}
                        onRemove={removeFreelancer}
                        selected={selectedForCompare.includes(f.id)}
                        onToggleCompare={toggleCompare}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "gigs" && (
            <motion.div
              key="gigs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {filteredGigs.length === 0 ? (
                <div className="grid">
                  <EmptyState onClear={() => { setSearchQuery(""); setActiveCollection("All"); }} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence>
                    {filteredGigs.map((g) => (
                      <GigCard key={g.id} gig={g} onRemove={removeGig} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Load More ── */}
        {((activeTab === "freelancers" && filteredFreelancers.length > 0) ||
          (activeTab === "gigs" && filteredGigs.length > 0)) && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:border-brand-400 hover:text-brand-600 transition-all disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Loading…
                </>
              ) : (
                <>
                  <Plus size={15} /> Load More
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Compare Floating Bar ── */}
      <AnimatePresence>
        {showCompareBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed bottom-6 left-1/2 -tranzinc-x-1/2 z-50 flex items-center gap-4 bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-2xl shadow-2xl border border-gray-700"
          >
            <GitCompare size={18} className="text-brand-400" />
            <span className="text-sm font-medium">
              Compare ({selectedForCompare.length}) selected
            </span>
            <button className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
              Compare Now
            </button>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
