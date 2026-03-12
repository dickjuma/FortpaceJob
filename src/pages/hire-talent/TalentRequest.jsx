import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { talents, faqs, categories } from "./data";

const TalentRequest = () => {
  const [searchParams] = useSearchParams();
  const presetQuery = searchParams.get("q") || "";
  const presetType = searchParams.get("type") || "All services";
  const presetTalent = searchParams.get("talent") || "";
  const presetCategory = searchParams.get("category") || "";
  const presetPackage = searchParams.get("package") || "";

  const selectedTalent = useMemo(
    () => talents.find((item) => item.id === presetTalent),
    [presetTalent]
  );

  const [formData, setFormData] = useState({
    service: presetQuery,
    serviceType: presetType,
    location: "",
    budget: "",
    timeline: "",
    details: "",
    contactName: "",
    contactEmail: "",
    urgent: false
  });

  const categoryLabel = categories.find((item) => item.slug === presetCategory)?.title;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Talent request submitted", formData);
  };

  return (
    <div className="talent-page">
      <section className="request-hero">
        <div>
          <p className="eyebrow">Post a request</p>
          <h1>Tell us what you need and get matched fast</h1>
          <p className="subhead">
            Share scope, budget, and location. Forte connects you with vetted professionals.
          </p>
        </div>
        <div className="request-badges">
          <span>Guaranteed response within 24 hours</span>
          <span>Secure escrow payments</span>
          <span>Dedicated support</span>
        </div>
      </section>

      <section className="request-grid">
        <form className="request-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Service needed</label>
              <input
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="e.g., panel upgrade, UI redesign"
              />
            </div>
            <div>
              <label>Service type</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                <option>All services</option>
                <option>Physical on-site</option>
                <option>Fully online</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City or remote"
              />
            </div>
            <div>
              <label>Budget</label>
              <input
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="$2000 total or $40/hr"
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Timeline</label>
              <input
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="Start date or timeline"
              />
            </div>
            <div className="checkbox-field">
              <label>Urgent request</label>
              <div>
                <input
                  id="urgent"
                  name="urgent"
                  type="checkbox"
                  checked={formData.urgent}
                  onChange={handleChange}
                />
                <label htmlFor="urgent">I need a pro within 24 hours</label>
              </div>
            </div>
          </div>

          <div>
            <label>Project details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Outline the work, preferred tools, or access needs"
              rows="5"
            />
          </div>

          <div className="form-row">
            <div>
              <label>Contact name</label>
              <input
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Full name"
              />
            </div>
            <div>
              <label>Contact email</label>
              <input
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="you@company.com"
              />
            </div>
          </div>

          <button type="submit" className="cta-btn">Submit request</button>
        </form>

        <aside className="request-summary">
          <h3>Request summary</h3>
          <div className="summary-box">
            <p><strong>Selected talent:</strong> {selectedTalent ? selectedTalent.name : "Not selected"}</p>
            <p><strong>Category:</strong> {categoryLabel || "Any"}</p>
            <p><strong>Package:</strong> {presetPackage || "Flexible"}</p>
            <p><strong>Service type:</strong> {formData.serviceType}</p>
          </div>

          {selectedTalent && (
            <div className="summary-card">
              <div>
                <h4>{selectedTalent.name}</h4>
                <p>{selectedTalent.title}</p>
                <span>{selectedTalent.location}</span>
              </div>
              <div className="talent-tags">
                {selectedTalent.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <Link className="ghost" to={`/talent/${selectedTalent.id}`}>View profile</Link>
            </div>
          )}

          <div className="summary-help">
            <h4>Need help?</h4>
            <p>Our team can shortlist the best-fit pros based on your budget and timeline.</p>
            <Link className="ghost" to="/contact">Talk to support</Link>
          </div>
        </aside>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <h2>Frequently asked questions</h2>
          <p>Everything you need to know before posting.</p>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <div key={item.q} className="faq-card">
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TalentRequest;
