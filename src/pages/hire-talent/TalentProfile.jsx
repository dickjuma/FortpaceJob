import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ShieldCheck, Clock3, BadgeCheck, Star, MapPin } from "lucide-react";
import { talentAPI } from "../../Services/talentAPI";

const TalentProfile = () => {
  const { id } = useParams();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTalent = async () => {
      try {
        setLoading(true);
        setError("");
        const result = String(id || "").match(/^\d+$/)
          ? await talentAPI.getTalentProfile(id)
          : await talentAPI.searchTalents({ q: id, limit: 1, sort: "relevance" });
        if (!active) return;
        setTalent(result?.user || result?.data?.[0] || null);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load freelancer profile.");
        setTalent(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTalent();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="talent-page">
        <section className="talent-section empty-state">
          <span className="eyebrow">Loading profile</span>
          <h2>Fetching freelancer details...</h2>
          <p>Please wait while we load the public profile and trust signals.</p>
        </section>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="talent-page">
        <section className="talent-section empty-state">
          <span className="eyebrow">Talent not found</span>
          <h2>We could not locate that profile.</h2>
          <p>Browse categories to find the right expert, or post a request and let matches come to you.</p>
          <div className="empty-state__actions">
            <Link className="cta-btn" to="/talent/request">
              Post a request
              <ArrowRight size={16} />
            </Link>
            <Link className="ghost" to="/talent">Back to Hire Talent</Link>
          </div>
        </section>
      </div>
    );
  }

  const skills = talent.primarySkills?.length
    ? talent.primarySkills
    : talent.skills?.length
      ? talent.skills
      : [];
  const packages = Array.isArray(talent.packages) ? talent.packages : [];
  const reviewItems = Array.isArray(talent.reviews) ? talent.reviews : [];
  const avgRating = talent.avgRating || talent.rating || 0;
  const totalReviews = Number.isFinite(talent.totalReviews)
    ? talent.totalReviews
    : typeof talent.reviews === "number"
      ? talent.reviews
      : Array.isArray(talent.reviews)
      ? talent.reviews.length
      : reviewItems.length || 0;
  const completedJobs = talent.completedJobs || talent.completedOrders || 0;
  const serviceSummary = talent.serviceSummary || talent.professionalTitle || talent.title || "Freelancer";
  const portfolioItems = Array.isArray(talent.portfolio) ? talent.portfolio : [];

  return (
    <div className="talent-page talent-page--profile">
      <section className="profile-hero">
        <div className="profile-summary">
          <span className="eyebrow">Verified talent</span>
          <h1>{talent.name || "Anonymous"}</h1>
          <p className="profile-title">{serviceSummary}</p>
          <div className="profile-meta">
            <span><Star size={14} /> {avgRating}/5</span>
            <span><BadgeCheck size={14} /> {totalReviews} reviews</span>
            <span><MapPin size={14} /> {talent.location || [talent.city, talent.country].filter(Boolean).join(", ") || "Remote"}</span>
          </div>
          <p className="profile-about">
            {talent.bio || talent.about || "This freelancer has not added a public bio yet."}
          </p>
          <div className="talent-tags">
            {skills.slice(0, 8).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="profile-actions">
            <Link className="cta-btn" to={`/talent/request?talent=${talent.id}`}>
              Hire now
              <ArrowRight size={16} />
            </Link>
            <Link className="ghost" to="/talent/request">Post a request</Link>
          </div>
          {error && <p className="text-link">{error}</p>}
        </div>

        <aside className="profile-card">
          <div className="profile-badge">
            <span className="badge badge-cta">{talent.level || talent.badge || "New"}</span>
            <h3>Trusted, job-ready professional</h3>
            <p>Screened for skills, communication, and delivery reliability.</p>
          </div>
          <div className="profile-rate">
            <strong>
              {talent.currency || "$"}
              {talent.hourlyRate || talent.price || 0}
            </strong>
            <span>Average hourly rate</span>
          </div>
          <ul className="profile-highlights">
            <li><ShieldCheck size={16} /> Background checks and credential verification</li>
            <li><Clock3 size={16} /> Milestone payments and secure escrow</li>
            <li><BadgeCheck size={16} /> {completedJobs || "0"} completed jobs</li>
          </ul>
          <Link className="cta-link cta-link--dark" to={`/talent/request?talent=${talent.id}`}>
            Start a project
            <ArrowRight size={16} />
          </Link>
        </aside>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Skills and specialties</span>
            <h2>Focused experience that delivers measurable outcomes.</h2>
          </div>
        </div>
        <div className="skill-grid">
          {skills.length > 0 ? skills.map((skill) => (
            <article key={skill} className="skill-card">
              <h4>{skill}</h4>
              <p>Proven track record in {skill.toLowerCase()} engagements.</p>
            </article>
          )) : (
            <article className="skill-card">
              <h4>No public skills yet</h4>
              <p>This freelancer has not published public specialties.</p>
            </article>
          )}
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Packages</span>
            <h2>Choose a plan based on scope, speed, and support.</h2>
          </div>
        </div>
        <div className="package-grid">
          {packages.length > 0 ? packages.map((pack) => (
            <article key={pack.name} className="package-card">
              <div className="package-header">
                <div>
                  <h3>{pack.name}</h3>
                  <p>{pack.deliveryTime || pack.delivery || "Flexible"} delivery</p>
                </div>
                <strong>
                  {pack.price
                    ? `${typeof pack.price === "number" ? `${talent.currency || "$"}${pack.price}` : pack.price}`
                    : "Custom"}
                </strong>
              </div>
              <div className="package-meta">
                <span>{pack.revisions || 0} revision(s)</span>
              </div>
              <ul>
                {(pack.features || []).map((feat) => (
                  <li key={feat}>{feat}</li>
                ))}
              </ul>
              <Link className="hire-btn" to={`/talent/request?talent=${talent.id}&package=${pack.name}`}>
                Select {pack.name}
              </Link>
            </article>
          )) : (
            <article className="package-card">
              <h3>Custom quote</h3>
              <p>This freelancer prefers to scope the work after the request is submitted.</p>
            </article>
          )}
        </div>
      </section>

      {portfolioItems.length > 0 && (
        <section className="talent-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">Portfolio</span>
              <h2>Recent work samples.</h2>
            </div>
          </div>
          <div className="category-grid">
            {portfolioItems.slice(0, 3).map((item) => (
              <article key={item} className="category-card">
                <span className="badge badge-online">Sample</span>
                <h3>Portfolio asset</h3>
                <p>{item}</p>
                <a className="category-cta" href={item} target="_blank" rel="noreferrer">
                  View asset <ArrowRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="talent-section testimonials">
        <div className="section-header">
          <div>
            <span className="eyebrow">Recent client feedback</span>
            <h2>What teams say after hiring through Forte.</h2>
          </div>
        </div>
        <div className="review-grid">
          {reviewItems.length > 0 ? reviewItems.map((review, index) => (
            <article key={review.id || index} className="review-card">
              <p>{review.comment || review.text || review.quote || "Positive engagement."}</p>
              <div>
                <strong>{review.reviewer?.name || review.name || "Client"}</strong>
                <span>
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date || "Recently"} - {review.rating || 5}/5
                </span>
              </div>
            </article>
          )) : (
            <article className="review-card">
              <p>No public reviews yet.</p>
            </article>
          )}
        </div>
      </section>
    </div>
  );
};

export default TalentProfile;
