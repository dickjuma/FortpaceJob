import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Filter, ShieldCheck, Star, MapPin } from "lucide-react";
import { categories } from "./data";
import TalentCard from "../../Components/Hiretalent/TalentCard";
import { talentAPI } from "../../Services/talentAPI";

const CategoryPage = () => {
  const { slug } = useParams();
  const category = categories.find((item) => item.slug === slug);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(Boolean(category));

  useEffect(() => {
    let active = true;

    const loadCategoryTalents = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await talentAPI.searchTalents({
          category: slug,
          limit: 12,
          sort: "relevance",
        });
        if (!active) return;
        setTalents(result?.data || []);
      } catch (error) {
        if (!active) return;
        setTalents([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCategoryTalents();

    return () => {
      active = false;
    };
  }, [category, slug]);

  if (!category) {
    return (
      <div className="talent-page">
        <section className="talent-section empty-state">
          <span className="eyebrow">Category not found</span>
          <h2>We could not locate that category.</h2>
          <p>Browse all talent instead, or post a request and let the platform match you.</p>
          <div className="empty-state__actions">
            <Link className="cta-btn" to="/talent">
              Back to Hire Talent
              <ArrowRight size={16} />
            </Link>
            <Link className="ghost" to="/talent/request">Post a request</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="talent-page talent-page--category">
      <section className="category-hero">
        <div className="category-hero__copy">
          <span className="eyebrow">{category.badge} services</span>
          <h1>{category.title}</h1>
          <p className="subhead">{category.desc}</p>
          <div className="category-meta-line">
            <span><ShieldCheck size={14} /> {category.count} verified pros</span>
            <span><Star size={14} /> 4.8/5 average rating</span>
            <span><MapPin size={14} /> Fast local and remote matching</span>
          </div>
        </div>
        <div className="category-actions">
          <Link className="cta-btn" to={`/talent/request?category=${category.slug}`}>
            Post a request
            <ArrowRight size={16} />
          </Link>
          <Link className="ghost" to="/talent">Browse all categories</Link>
        </div>
      </section>

      <section className="talent-section talent-section--split">
        <div className="section-header">
          <div>
            <span className="eyebrow">Filters</span>
            <h2>Shortlist the right experts faster.</h2>
          </div>
        </div>
        <div className="filter-grid">
          <div className="filter-box">
            <Filter size={18} />
            <h4>Service type</h4>
            <div className="tag-row">
              <span>Physical on-site</span>
              <span>Hybrid</span>
              <span>Fully online</span>
            </div>
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <h4>Budget</h4>
            <div className="tag-row">
              <span>Under $25/hr</span>
              <span>$25-50/hr</span>
              <span>Project-based</span>
            </div>
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <h4>Location</h4>
            <div className="tag-row">
              <span>Near me</span>
              <span>Remote</span>
              <span>International</span>
            </div>
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <h4>Trust signals</h4>
            <div className="tag-row">
              <span>Verified</span>
              <span>Top rated</span>
              <span>Fast response</span>
            </div>
          </div>
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Available experts</span>
            <h2>Profiles in this category.</h2>
          </div>
          <p>Review ratings, specialties, and fit before starting a conversation.</p>
        </div>
        {loading ? (
          <div className="loading-message">Loading talent...</div>
        ) : talents.length === 0 ? (
          <div className="empty-state">
            <h3>No profiles yet</h3>
            <p>No freelancers have published profiles in this category yet.</p>
            <Link className="cta-btn" to={`/talent/request?category=${category.slug}`}>
              Post a job
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="talent-grid talent-grid--tight">
            {talents.map((talent) => (
              <TalentCard key={talent.id || talent._id} talent={talent} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
