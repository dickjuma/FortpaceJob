import React, { useMemo, useState } from "react";
import { Search, X, Send, MapPin, CheckCircle } from "lucide-react";

const categories = [
  { id: "all", name: "All categories" },
  { id: "web", name: "Web Development" },
  { id: "design", name: "Design" },
  { id: "marketing", name: "Marketing" },
  { id: "writing", name: "Writing" },
  { id: "video", name: "Video" }
];

const requests = [
  {
    id: 1,
    buyer: "TechFlow Solutions",
    title: "Full-stack React & Node.js Developer for SaaS Dashboard",
    description: "Need a clean dashboard with Stripe + PostgreSQL. Experience with Tailwind and Framer Motion preferred.",
    budget: "$1,200 - $1,800",
    budgetMin: 1200,
    budgetMax: 1800,
    offers: 12,
    date: "2 hours ago",
    tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
    category: "web",
    location: "Remote",
    verified: true,
    urgent: false,
    matchScore: 94
  },
  {
    id: 2,
    buyer: "Studio Orbit",
    title: "Logo & Brand Identity for Organic Coffee Brand",
    description: "Minimal, earthy aesthetic. Need logo, palette, and templates. Portfolio required.",
    budget: "$250 - $500",
    budgetMin: 250,
    budgetMax: 500,
    offers: 45,
    date: "5 hours ago",
    tags: ["Branding", "Logo", "Identity"],
    category: "design",
    location: "New York, USA",
    verified: true,
    urgent: true,
    matchScore: 88
  },
  {
    id: 3,
    buyer: "GrowthHive",
    title: "SEO-Optimized Blog Content for Tech Startup",
    description: "Need 10 long-form articles on AI/SaaS. SEO expertise required.",
    budget: "$500 - $750",
    budgetMin: 500,
    budgetMax: 750,
    offers: 23,
    date: "1 day ago",
    tags: ["SEO", "Content", "SaaS"],
    category: "writing",
    location: "Remote",
    verified: false,
    urgent: false,
    matchScore: 81
  }
];

export default function ViewRequests() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedRequests, setSavedRequests] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredRequests = useMemo(() => {
    let list = [...requests];

    if (activeFilter !== "all") {
      list = list.filter((req) => req.category === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((req) =>
        [req.title, req.description, req.buyer, ...(req.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    switch (sortBy) {
      case "match-high":
        list.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case "budget-high":
        list.sort((a, b) => b.budgetMax - a.budgetMax);
        break;
      case "budget-low":
        list.sort((a, b) => a.budgetMin - b.budgetMin);
        break;
      case "offers-low":
        list.sort((a, b) => a.offers - b.offers);
        break;
      default:
        break;
    }

    return list;
  }, [activeFilter, searchQuery, sortBy]);

  const toggleSave = (id) => {
    setSavedRequests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (selectedRequest) {
    return (
      <div className="min-h-screen bg-[#F8F4F1]">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <button
            className="text-sm text-[#6B5B50] hover:text-[#2E2322]"
            onClick={() => setSelectedRequest(null)}
          >
            Back to requests
          </button>
          <div className="bg-white border border-[#E7E1DE] rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#2E2322]">{selectedRequest.title}</h2>
              <p className="text-sm text-[#7A5A4C]">{selectedRequest.buyer}</p>
            </div>
            <textarea
              rows="5"
              placeholder="Write your proposal..."
              className="w-full border border-[#E7E1DE] rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9452F] focus:border-[#C9452F]"
            />
            <input
              type="text"
              placeholder="Your price (e.g. $900)"
              className="w-full border border-[#E7E1DE] rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9452F] focus:border-[#C9452F]"
            />
            <button
              className="px-4 py-2 bg-[#C9452F] text-white rounded-lg text-sm hover:bg-[#B53A27]"
              onClick={() => {
                setShowSuccess(true);
                setSelectedRequest(null);
                setTimeout(() => setShowSuccess(false), 3000);
              }}
            >
              Send proposal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4F1]">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-[#C9452F] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle size={18} />
            <div className="text-sm">Proposal sent successfully.</div>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-2 p-1 hover:bg-[#B53A27] rounded"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#2E2322]">Requests</h1>
          <p className="text-sm text-[#6B5B50]">Clean list of client requests ready for proposals.</p>
        </div>

        <div className="bg-white border border-[#E7E1DE] rounded-xl p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A38F85]" size={16} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-[#E7E1DE] rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9452F] focus:border-[#C9452F]"
            />
          </div>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="border border-[#E7E1DE] rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9452F] focus:border-[#C9452F]"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#E7E1DE] rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9452F] focus:border-[#C9452F]"
          >
            <option value="recent">Most Recent</option>
            <option value="match-high">Best Match</option>
            <option value="budget-high">Highest Budget</option>
            <option value="budget-low">Lowest Budget</option>
            <option value="offers-low">Least Competition</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div key={req.id} className="bg-white border border-[#E7E1DE] rounded-xl p-5 space-y-3">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2322]">{req.title}</h3>
                  <div className="text-sm text-[#7A5A4C] flex items-center gap-2">
                    {req.buyer}
                    <span>·</span>
                    <MapPin size={12} />
                    <span>{req.location}</span>
                    <span>·</span>
                    <span>{req.date}</span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-xs text-[#7A5A4C]">Budget</div>
                  <div className="text-lg font-semibold text-[#2E2322]">{req.budget}</div>
                </div>
              </div>

              <p className="text-sm text-[#6B5B50] line-clamp-2">{req.description}</p>

              <div className="flex flex-wrap gap-2">
                {req.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-[#F8F4F1] text-[#4A312F] text-xs rounded-lg border border-[#E7E1DE]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-xs text-[#7A5A4C] flex flex-wrap gap-3">
                  {req.verified && (
                    <span className="px-2 py-1 bg-white border border-[#F4C7A1] rounded-full text-[#B53A27]">
                      Verified
                    </span>
                  )}
                  {req.urgent && (
                    <span className="px-2 py-1 bg-[#FDECE7] border border-[#F4C7A1] rounded-full text-[#B53A27]">
                      Urgent
                    </span>
                  )}
                  <span>{req.offers} offers</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="px-4 py-2 bg-[#C9452F] text-white rounded-lg text-sm hover:bg-[#B53A27] flex items-center gap-2"
                  >
                    <Send size={14} />
                    Send offer
                  </button>
                  <button
                    onClick={() => toggleSave(req.id)}
                    className="px-4 py-2 border border-[#E7E1DE] rounded-lg text-sm text-[#4A312F] hover:bg-[#F8F4F1]"
                  >
                    {savedRequests.includes(req.id) ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-10 bg-white border border-[#E7E1DE] rounded-xl">
            <h3 className="text-lg font-semibold text-[#2E2322]">No requests found</h3>
            <p className="text-sm text-[#6B5B50] mt-2">
              {searchQuery ? `No results for "${searchQuery}".` : "Try adjusting your filters."}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 bg-[#F3E9E5] hover:bg-[#EFE7E2] text-[#4A312F] rounded-lg text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {filteredRequests.length > 0 && (
          <div className="text-xs text-[#7A5A4C]">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        )}
      </div>
    </div>
  );
}
