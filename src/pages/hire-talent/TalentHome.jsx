import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShieldCheck, Sparkles, Briefcase, Star, ArrowRight } from "lucide-react";
import { talentAPI } from "../../Services/talentAPI";
import TalentCard from "../../Components/Hiretalent/TalentCard";
import { categories, testimonials, faqs } from "./data";

const statCards = [
  { value: "50k+", label: "Verified experts", icon: ShieldCheck },
  { value: "120+", label: "Service categories", icon: Briefcase },
  { value: "4.9/5", label: "Average rating", icon: Star },
];

const quickPicks = ["Electricians", "Designers", "Developers", "Plumbers", "Auto repair", "HVAC"];

const TalentHome = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [serviceType, setServiceType] = useState("All");
  const [featuredTalents, setFeaturedTalents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeaturedTalent = async () => {
      try {
        setLoading(true);
        const result = await talentAPI.searchTalents({ limit: 8, sort: "rating" });
        setFeaturedTalents(result?.data || []);
      } catch (error) {
        console.error("Failed to fetch talent:", error);
        setFeaturedTalents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTalent();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (serviceType && serviceType !== "All") params.set("serviceMode", serviceType);
    navigate(`/client-services/create-job?${params.toString()}`);
  };

  return (
    <div className="talent-page talent-page--home">
      <section className="talent-hero">
        <div className="talent-hero-copy">
          <span className="eyebrow">Hire talent with confidence</span>
          <h1>Find the right expert for on-site work, remote projects, and everything between.</h1>
          <p className="subhead">
            Forte brings verified professionals, transparent pricing, and a smoother way to move from search to shortlist.
          </p>

          <form className="talent-search" onSubmit={handleSearch}>
            <div className="search-field">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What service do you need?"
              />
            </div>
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
              <option>All</option>
              <option>Fully online</option>
              <option>Onsite</option>
              <option>Hybrid</option>
            </select>
            <button type="submit">Search talent</button>
          </form>

          <div className="hero-chips">
            {quickPicks.map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                onClick={() => navigate(`/client-services/create-job?q=${encodeURIComponent(item)}`)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="hero-stats">
            {statCards.map(({ value, label, icon: Icon }) => (
              <div key={label} className="stat-card">
                <Icon size={18} />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="talent-hero-panel">
          <div className="panel-eyebrow">
            <Sparkles size={16} />
            <span>Popular right now</span>
          </div>
          <h3>High-demand categories are ready to hire today.</h3>
          <div className="pill-grid">
            <span>Panel upgrades</span>
            <span>Brand systems</span>
            <span>HVAC repair</span>
            <span>Web build</span>
            <span>Solar install</span>
            <span>Auto diagnostics</span>
          </div>
          <div className="panel-footer">
            <p>Post a request and get matched in minutes.</p>
            <Link className="cta-link" to="/client-services/create-job">
              Start a request
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mini-metrics">
            <div>
              <strong>24h</strong>
              <span>average match time</span>
            </div>
            <div>
              <strong>Escrow</strong>
              <span>protected payments</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Browse by category</span>
            <h2>Start broad, then drill into the right specialty.</h2>
          </div>
          <Link className="text-link" to="/client-services/create-job">
            Post a request <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.slug} className="category-card" to={`/talent/categories/${cat.slug}`}>
              <div className="category-card__top">
                <span className={`badge ${cat.badge === "Physical" ? "badge-physical" : "badge-online"}`}>
                  {cat.badge}
                </span>
                <span className="category-count">{cat.count} pros</span>
              </div>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
              <span className="category-cta">
                View talent <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="talent-section talent-section--split">
        <div className="section-header">
          <div>
            <span className="eyebrow">Curated shortlist</span>
            <h2>Featured talent worth your attention.</h2>
          </div>
          <p>These profiles are surfaced by rating, verification, and marketplace activity.</p>
        </div>
        <div className="talent-grid talent-grid--tight">
          {loading ? (
            <div className="loading-message">Loading talent...</div>
          ) : featuredTalents.length === 0 ? (
            <div className="empty-state">
              <h3>No featured freelancers yet</h3>
              <p>Once freelancers publish active profiles, they will appear here from the backend.</p>
            </div>
          ) : (
            featuredTalents.slice(0, 6).map((talent) => <TalentCard key={talent._id || talent.id} talent={talent} />)
          )}
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">How it works</span>
            <h2>A cleaner path from request to hire.</h2>
          </div>
        </div>
        <div className="steps-grid">
          <article className="step-card">
            <span>01</span>
            <h3>Describe the work</h3>
            <p>Share the scope, budget, location, and timeline in a single request.</p>
          </article>
          <article className="step-card">
            <span>02</span>
            <h3>Review matches</h3>
            <p>Compare verified talent by skills, ratings, and service type.</p>
          </article>
          <article className="step-card">
            <span>03</span>
            <h3>Hire securely</h3>
            <p>Keep conversations, milestones, and payment protection in one place.</p>
          </article>
        </div>
      </section>

      <section className="talent-section testimonials">
        <div className="section-header">
          <div>
            <span className="eyebrow">Client stories</span>
            <h2>What people say after hiring through Forte.</h2>
          </div>
        </div>
        <div className="review-grid">
          {testimonials.map((review) => (
            <article key={review.name} className="review-card">
              <p>{review.quote}</p>
              <div>
                <strong>{review.name}</strong>
                <span>{review.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>Common questions, answered fast.</h2>
          </div>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <article key={item.q} className="faq-card">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="talent-cta">
        <div>
          <span className="eyebrow eyebrow--light">Ready when you are</span>
          <h2>Post your request and let qualified talent come to you.</h2>
          <p>Describe the work once, then compare the best-fit experts without the back and forth.</p>
        </div>
        <Link to="/client-services/create-job" className="cta-btn">
          Post a job
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
};

export default TalentHome;
