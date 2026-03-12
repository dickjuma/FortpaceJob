import React from "react";
import { Link, useParams } from "react-router-dom";
import { talents, reviewsList } from "./data";

const TalentProfile = () => {
  const { id } = useParams();
  const talent = talents.find((item) => item.id === id);

  if (!talent) {
    return (
      <div className="talent-page">
        <section className="talent-section">
          <div className="section-header">
            <h2>Talent not found</h2>
            <p>We could not locate that profile. Browse categories to find the right expert.</p>
          </div>
          <Link className="ghost" to="/talent">Back to Hire Talent</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="talent-page">
      <section className="profile-hero">
        <div className="profile-summary">
          <p className="eyebrow">Verified talent</p>
          <h1>{talent.name}</h1>
          <p className="profile-title">{talent.title}</p>
          <div className="profile-meta">
            <span>Rating {talent.rating}/5</span>
            <span>{talent.reviews} reviews</span>
            <span>{talent.location}</span>
          </div>
          <p className="profile-about">{talent.about}</p>
          <div className="talent-tags">
            {talent.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="profile-actions">
            <Link className="hire-btn" to={`/talent/request?talent=${talent.id}`}>Hire now</Link>
            <Link className="ghost" to="/talent/request">Post a request</Link>
          </div>
        </div>
        <div className="profile-card">
          <div className="profile-badge">
            <span className="badge badge-cta">{talent.badge}</span>
            <h3>Trusted, job-ready professional</h3>
          </div>
          <div className="profile-rate">
            <strong>{talent.price}</strong>
            <span>Average hourly rate</span>
          </div>
          <ul className="profile-highlights">
            <li>Background checks and credential verification</li>
            <li>Milestone payments and secure escrow</li>
            <li>Matched within 24 hours for urgent work</li>
          </ul>
          <Link className="cta-btn" to={`/talent/request?talent=${talent.id}`}>Start a project</Link>
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <h2>Skills and specialties</h2>
          <p>Focused experience that delivers measurable outcomes.</p>
        </div>
        <div className="skill-grid">
          {talent.skills.map((skill) => (
            <div key={skill} className="skill-card">
              <h4>{skill}</h4>
              <p>Proven track record in {skill.toLowerCase()} engagements.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <h2>Packages</h2>
          <p>Choose a plan based on scope, speed, and support.</p>
        </div>
        <div className="package-grid">
          {talent.packages.map((pack) => (
            <div key={pack.name} className="package-card">
              <div className="package-header">
                <h3>{pack.name}</h3>
                <strong>{pack.price}</strong>
              </div>
              <div className="package-meta">
                <span>{pack.delivery} delivery</span>
                <span>{pack.revisions} revision(s)</span>
              </div>
              <ul>
                {pack.features.map((feat) => (
                  <li key={feat}>{feat}</li>
                ))}
              </ul>
              <Link className="hire-btn" to={`/talent/request?talent=${talent.id}&package=${pack.name}`}>Select {pack.name}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="talent-section testimonials">
        <div className="section-header">
          <h2>Recent client feedback</h2>
          <p>What teams say after hiring through Forte.</p>
        </div>
        <div className="review-grid">
          {reviewsList.map((review) => (
            <div key={review.name} className="review-card">
              <p>"{review.text}"</p>
              <div>
                <strong>{review.name}</strong>
                <span>{review.date} - {review.rating}/5</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TalentProfile;
