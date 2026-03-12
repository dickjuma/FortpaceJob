import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../../Services/api";
import { categories, talents, testimonials } from "./data";

const TalentHome = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [serviceType, setServiceType] = useState("All services");
  const [featuredTalents, setFeaturedTalents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeaturedTalent = async () => {
      try {
        setLoading(true);
        const result = await userAPI.searchTalent({ limit: 8, sort: "rating" });
        if (result.data && result.data.length > 0) {
          setFeaturedTalents(result.data);
        } else {
          setFeaturedTalents(talents);
        }
      } catch (error) {
        console.error("Failed to fetch talent:", error);
        setFeaturedTalents(talents);
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
    if (serviceType && serviceType !== "All services") params.set("serviceMode", serviceType);
    navigate(`/talent/request?${params.toString()}`);
  };

  return (
    <div className="talent-page">
      <section className="talent-hero">
        <div className="talent-hero-content">
          <p className="eyebrow">Hire talent you can trust</p>
          <h1>Find verified pros for physical and online services</h1>
          <p className="subhead">
            Book electricians, mechanics, designers, developers, and more. All in one marketplace.
          </p>
          <form className="talent-search" onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What service do you need?"
            />
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
              <option>All services</option>
              <option>Physical on-site</option>
              <option>Fully online</option>
              <option>Hybrid</option>
            </select>
            <button type="submit">Search</button>
          </form>
          <div className="hero-stats">
            <div>
              <h3>50k+</h3>
              <p>Verified experts</p>
            </div>
            <div>
              <h3>120+</h3>
              <p>Service categories</p>
            </div>
            <div>
              <h3>4.9/5</h3>
              <p>Average rating</p>
            </div>
          </div>
        </div>
        <div className="talent-hero-card">
          <h4>Popular right now</h4>
          <div className="pill-grid">
            <span>Panel upgrades</span>
            <span>Auto diagnostics</span>
            <span>HVAC repair</span>
            <span>Brand design</span>
            <span>Web build</span>
            <span>Solar install</span>
          </div>
          <div className="hero-card-footer">
            <p>Get matched in minutes.</p>
            <Link className="ghost" to="/talent/request">Post a request</Link>
          </div>
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <h2>Browse by category</h2>
          <p>Start with a category and filter down to the right expert.</p>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.slug} className="category-card">
              <span className={`badge ${cat.badge === "Physical" ? "badge-physical" : "badge-online"}`}>{cat.badge}</span>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
              <div className="category-meta">
                <span>{cat.count} pros</span>
                <Link className="link-btn" to={`/talent/categories/${cat.slug}`}>View talent</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="talent-section split">
        <div className="section-header">
          <h2>Filter and hire with confidence</h2>
          <p>Use detailed filters inspired by Fiverr, while keeping Forte's trust layer.</p>
        </div>
        <div className="filter-grid">
          <div className="filter-box">
            <h4>Service Type</h4>
            <div className="tag-row">
              <span>Physical on-site</span>
              <span>Hybrid</span>
              <span>Fully online</span>
            </div>
          </div>
          <div className="filter-box">
            <h4>Micro Sectors</h4>
            <div className="tag-row">
              <span>Wiring</span>
              <span>Engine diagnostics</span>
              <span>HVAC</span>
              <span>Solar install</span>
            </div>
          </div>
          <div className="filter-box">
            <h4>Location</h4>
            <div className="tag-row">
              <span>Nairobi</span>
              <span>London</span>
              <span>Remote</span>
              <span>New York</span>
            </div>
          </div>
          <div className="filter-box">
            <h4>Budget</h4>
            <div className="tag-row">
              <span>Under $25/hr</span>
              <span>$25-50/hr</span>
              <span>Project-based</span>
            </div>
          </div>
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <h2>Top talent near you</h2>
          <p>Curated profiles with ratings, verified badges, and specialties.</p>
        </div>
        <div className="talent-grid">
          {loading ? (
            <div className="loading-message">Loading talent...</div>
          ) : featuredTalents.length > 0 ? (
            featuredTalents.map((talent) => (
              <div key={talent._id || talent.id} className="talent-card">
                <div className="talent-header">
                  <div>
                    <h3>{talent.name}</h3>
                    <p>{talent.bio?.substring(0, 50) || talent.title}</p>
                  </div>
                  <span className="badge badge-cta">{talent.level}</span>
                </div>
                <div className="talent-meta">
                  <span>Rating {talent.avgRating || 0}/5</span>
                  <span>({talent.totalReviews || 0} reviews)</span>
                  <span>{talent.country || talent.location}</span>
                </div>
                <div className="talent-tags">
                  {(talent.skills || []).slice(0, 4).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="talent-footer">
                  <strong>{talent.currency || '$'}{talent.hourlyRate || 0}/hr</strong>
                  <div className="talent-actions">
                    <Link to={`/talent/${talent._id || talent.id}`} className="ghost">View profile</Link>
                    <Link to={`/talent/request?talent=${talent._id || talent.id}`} className="hire-btn">Hire now</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No talent found. Try a different search.</div>
          )}
        </div>
      </section>

      <section className="talent-section testimonials">
        <div className="section-header">
          <h2>Clients love Forte</h2>
          <p>Real stories from teams hiring across online and physical services.</p>
        </div>
        <div className="review-grid">
          {testimonials.map((review) => (
            <div key={review.name} className="review-card">
              <p>"{review.quote}"</p>
              <div>
                <strong>{review.name}</strong>
                <span>{review.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="talent-cta">
        <div>
          <h2>Post your request and get matched today</h2>
          <p>Describe the work, set your budget, and receive offers from verified talent.</p>
        </div>
        <Link to="/talent/request" className="cta-btn">Post a job</Link>
      </section>
    </div>
  );
};

export default TalentHome;
